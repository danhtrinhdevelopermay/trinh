import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";
import session from "express-session";
import { z } from "zod";
import connectPgSimple from "connect-pg-simple";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 503 Service Unavailable middleware - blocks all requests
app.use((_req, res) => {
  res.status(503).json({
    error: 'Service Unavailable',
    message: 'The server is temporarily unable to handle the request',
    timestamp: new Date().toISOString()
  });
});

// Generate a secure session secret
const sessionSecret = process.env.SESSION_SECRET || 'your-secure-session-secret-' + Math.random().toString(36);

// Configure session store based on environment
const sessionConfig: session.SessionOptions = {
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'strict'
  }
};

// Use PostgreSQL session store in production if DATABASE_URL is available
if (process.env.DATABASE_URL) {
  const PgSession = connectPgSimple(session);
  sessionConfig.store = new PgSession({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
  });
}

app.use(session(sessionConfig));

// Authentication middleware - applied globally to all API routes except auth
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  // Skip authentication for auth routes (Express strips /api prefix, so check originalUrl or path)
  if (req.originalUrl.startsWith('/api/auth/') || req.path.startsWith('/auth/')) {
    return next();
  }
  
  if ((req.session as any)?.authenticated) {
    next();
  } else {
    res.status(401).json({ error: 'Authentication required' });
  }
};

// Apply authentication to all API routes
app.use('/api', requireAuth);

// Password authentication routes
app.post('/api/auth/login', (req, res) => {
  try {
    const { password } = z.object({ password: z.string() }).parse(req.body);
    const correctPassword = process.env.ACCESS_PASSWORD;
    
    if (password === correctPassword) {
      // Regenerate session to prevent session fixation
      req.session.regenerate((err) => {
        if (err) {
          return res.status(500).json({ error: 'Session error' });
        }
        (req.session as any).authenticated = true;
        req.session.save((err) => {
          if (err) {
            return res.status(500).json({ error: 'Session save error' });
          }
          res.json({ success: true });
        });
      });
    } else {
      res.status(401).json({ error: 'Incorrect password' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid request' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  (req.session as any).authenticated = false;
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

app.get('/api/auth/status', (req, res) => {
  const authenticated = (req.session as any)?.authenticated || false;
  res.json({ authenticated });
});

// Remove the duplicate middleware definition as it's now moved above

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      
      // Only log response bodies in development to prevent sensitive data leakage in production
      if (process.env.NODE_ENV === 'development' && capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);
  
  // Initialize sample data for development only
  if (process.env.NODE_ENV === 'development' && 'initializeSampleData' in storage) {
    await (storage as any).initializeSampleData();
    log('Sample data initialized');
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Health check endpoint for monitoring and anti-spindown
  app.get('/health', (_req, res) => {
    res.status(200).json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  // Serve attached assets (images uploaded by user)
  app.use('/attached_assets', express.static('attached_assets'));

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
    
    // Anti-spindown: Self-ping in production to prevent Render from sleeping
    if (process.env.NODE_ENV === 'production') {
      const appUrl = process.env.RENDER_EXTERNAL_URL || process.env.APP_URL;
      
      if (appUrl) {
        // Check if fetch is available (Node 18+ has built-in fetch)
        if (typeof fetch === 'undefined') {
          log('Anti-spindown disabled: fetch not available (requires Node.js 18+)');
        } else {
          const interval = 14 * 60 * 1000; // 14 minutes (Render sleeps after 15 min)
          
          setInterval(async () => {
            try {
              const response = await fetch(`${appUrl}/health`);
              const data = await response.json();
              log(`Anti-spindown ping: ${response.status} - ${data.status} at ${data.timestamp}`);
            } catch (error) {
              log(`Anti-spindown ping failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
          }, interval);
          
          log(`Anti-spindown enabled: pinging ${appUrl}/health every 14 minutes`);
        }
      } else {
        log('Anti-spindown disabled: RENDER_EXTERNAL_URL or APP_URL not set');
      }
    }
  });
})();