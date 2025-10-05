import { 
  type User, 
  type InsertUser, 
  type Presentation, 
  type InsertPresentation,
  type Slide, 
  type InsertSlide,
  users,
  presentations, 
  slides
} from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Presentation operations
  getPresentation(id: string): Promise<Presentation | undefined>;
  getPresentationsByUserId(userId: string): Promise<Presentation[]>;
  createPresentation(presentation: InsertPresentation): Promise<Presentation>;
  updatePresentation(id: string, updates: Partial<InsertPresentation>): Promise<Presentation | undefined>;
  deletePresentation(id: string): Promise<boolean>;
  
  // Slide operations
  getSlidesByPresentationId(presentationId: string): Promise<Slide[]>;
  getSlide(id: string): Promise<Slide | undefined>;
  createSlide(slide: InsertSlide): Promise<Slide>;
  updateSlide(id: string, updates: Partial<InsertSlide>): Promise<Slide | undefined>;
  deleteSlide(id: string): Promise<boolean>;
  reorderSlides(presentationId: string, slideOrders: { id: string; order: number }[]): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private presentations: Map<string, Presentation>;
  private slides: Map<string, Slide>;

  constructor() {
    this.users = new Map();
    this.presentations = new Map();
    this.slides = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }
  
  private async initializeSampleData() {
    // Create a sample presentation with Vietnamese slides
    const sampleUserId = 'sample-user';
    const samplePresentationId = 'sample-presentation';
    
    // Create sample user
    const sampleUser: User = {
      id: sampleUserId,
      username: 'demo',
      password: 'demo123'
    };
    this.users.set(sampleUserId, sampleUser);
    
    // Create sample presentation
    const samplePresentation: Presentation = {
      id: samplePresentationId,
      title: 'Vượt Lên Số Phận',
      description: 'Bài thuyết trình về cách con người có thể vượt lên số phận của chính mình',
      userId: sampleUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.presentations.set(samplePresentationId, samplePresentation);
    
    // Create sample slides với nội dung đầy đủ và cải thiện từ bài thuyết trình
    const sampleSlides = [
      {
        id: '1',
        presentationId: samplePresentationId,
        order: 1,
        type: 'title',
        title: 'Vượt Lên Số Phận',
        content: JSON.stringify({
          type: 'title_with_image',
          text: 'Làm thế nào để con người vượt lên số phận của chính mình trong cuộc sống',
          subtitle: 'Hành trình từ khó khăn đến thành công',
          image: '/stock_images/gentle_inspiring_ins_dc4fa5e2.jpg'
        }),
        background: 'educational-gradient-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        presentationId: samplePresentationId,
        order: 2,
        type: 'content',
        title: 'Số Phận Là Gì?',
        content: JSON.stringify({
          type: 'content_with_image',
          items: [
            '🏠 Những điều kiện ban đầu ta được sinh ra',
            '👨‍👩‍👧‍👦 Hoàn cảnh gia đình và xã hội',
            '🧬 Khả năng và hạn chế tự nhiên',
            '🌪️ Những sự kiện ngoài tầm kiểm soát',
            '💭 Nhưng số phận không phải là bản án cuối cùng!'
          ],
          image: '/stock_images/educational_success__583087f4.jpg'
        }),
        background: 'educational-gradient-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        presentationId: samplePresentationId,
        order: 3,
        type: 'content',
        title: 'Những Yếu Tố Để Vượt Lên Số Phận',
        content: JSON.stringify({
          type: 'content_with_image',
          items: [
            '💪 Ý chí và nghị lực kiên cường',
            '📚 Tri thức và học tập không ngừng',
            '🎯 Khát vọng và mục tiêu rõ ràng',
            '🔄 Khả năng thích ứng và thay đổi',
            '🤝 Sự hỗ trợ từ cộng đồng'
          ],
          image: '/stock_images/educational_success__450426a4.jpg'
        }),
        background: 'educational-gradient-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4',
        presentationId: samplePresentationId,
        order: 4,
        type: 'content',
        title: 'Tấm Gương Nguyễn Ngọc Ký',
        content: JSON.stringify({
          type: 'story_with_image',
          story: [
            '✍️ Sinh năm 1947 tại Quảng Bình, bị liệt cả hai tay từ nhỏ',
            '🎓 Tự học viết bằng chân, trở thành giáo viên',
            '📖 Viết hơn 30 cuốn sách, truyện thiếu nhi nổi tiếng',
            '🏆 Nhận nhiều giải thưởng văn học danh giá',
            '💝 Câu nói nổi tiếng: "Tôi viết bằng chân nhưng từ trái tim"',
            '🌟 Chứng minh rằng nghị lực có thể thắng mọi khó khăn'
          ],
          image: '/attached_assets/photo-1664414672918-16644146732841701402327_1759638546232.jpg'
        }),
        background: 'educational-gradient-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '5',
        presentationId: samplePresentationId,
        order: 5,
        type: 'quote',
        title: 'Nguyễn Ngọc Ký',
        content: JSON.stringify({
          type: 'quote_with_image',
          text: 'Tôi viết bằng chân nhưng từ trái tim. Khuyết tật không làm khuyết tâm hồn',
          author: 'Thầy Nguyễn Ngọc Ký - Nhà văn, Nhà giáo',
          image: '/attached_assets/images_1759638546339.webp'
        }),
        background: 'educational-gradient-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6',
        presentationId: samplePresentationId,
        order: 6,
        type: 'content',
        title: 'Tư Duy Tích Cực - Chìa Khóa Thành Công',
        content: JSON.stringify({
          type: 'content_with_image',
          items: [
            '🔄 Thay đổi cách nhìn nhận về hoàn cảnh khó khăn',
            '🎯 Tập trung vào những gì có thể kiểm soát được',
            '⚡ Biến thử thách thành cơ hội học hỏi',
            '📈 Học hỏi từ thất bại để trở nên mạnh mẽ hơn',
            '🌟 Tin tưởng vào khả năng vô hạn của bản thân'
          ],
          image: '/stock_images/educational_success__450426a4.jpg'
        }),
        background: 'educational-gradient-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '7',
        presentationId: samplePresentationId,
        order: 7,
        type: 'content',
        title: 'Hành Động Cụ Thể Để Thay Đổi',
        content: JSON.stringify({
          type: 'content_with_image',
          items: [
            '🎯 Đặt mục tiêu SMART (cụ thể, đo lường được)',
            '📝 Lập kế hoạch chi tiết và thực hiện kiên trì',
            '📚 Không ngừng học hỏi và nâng cao kỹ năng',
            '🤝 Xây dựng mạng lưới quan hệ tích cực',
            '🏃‍♂️ Hành động ngay hôm nay, đừng trì hoãn'
          ],
          image: '/stock_images/gentle_inspiring_ins_dc4fa5e2.jpg'
        }),
        background: 'educational-gradient-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '8',
        presentationId: samplePresentationId,
        order: 8,
        type: 'content',
        title: 'Bài Học Rút Ra',
        content: JSON.stringify({
          type: 'conclusion_with_image',
          items: [
            '💪 Không bao giờ đầu hàng trước khó khăn',
            '📖 Luôn học hỏi và rèn luyện bản thân mỗi ngày',
            '🌟 Tin vào giá trị và khát vọng sống của chính mình',
            '🔥 Biến số phận thành động lực để tỏa sáng',
            '🎯 Mỗi người đều có thể viết nên câu chuyện thành công riêng'
          ],
          image: '/stock_images/educational_success__4203c133.jpg'
        }),
        background: 'educational-gradient-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '9',
        presentationId: samplePresentationId,
        order: 9,
        type: 'quote',
        title: 'Thông điệp cuối cùng',
        content: 'Số phận không định đoạt tất cả, chính bản lĩnh và nghị lực con người mới quyết định cuộc đời mình. Hãy tin rằng bạn có thể vượt lên mọi khó khăn!',
        background: 'bg-gradient-to-br from-primary via-primary/90 to-primary/80',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
    
    sampleSlides.forEach(slide => {
      this.slides.set(slide.id, slide as Slide);
    });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Presentation operations
  async getPresentation(id: string): Promise<Presentation | undefined> {
    return this.presentations.get(id);
  }

  async getPresentationsByUserId(userId: string): Promise<Presentation[]> {
    return Array.from(this.presentations.values()).filter(
      (presentation) => presentation.userId === userId
    );
  }

  async createPresentation(insertPresentation: InsertPresentation): Promise<Presentation> {
    const id = randomUUID();
    const now = new Date();
    const presentation: Presentation = {
      ...insertPresentation,
      description: insertPresentation.description ?? null,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.presentations.set(id, presentation);
    return presentation;
  }

  async updatePresentation(id: string, updates: Partial<InsertPresentation>): Promise<Presentation | undefined> {
    const presentation = this.presentations.get(id);
    if (!presentation) return undefined;
    
    const updated: Presentation = {
      ...presentation,
      ...updates,
      updatedAt: new Date(),
    };
    this.presentations.set(id, updated);
    return updated;
  }

  async deletePresentation(id: string): Promise<boolean> {
    // Also delete all slides belonging to this presentation
    const slides = await this.getSlidesByPresentationId(id);
    slides.forEach(slide => this.slides.delete(slide.id));
    
    return this.presentations.delete(id);
  }

  // Slide operations
  async getSlidesByPresentationId(presentationId: string): Promise<Slide[]> {
    return Array.from(this.slides.values())
      .filter(slide => slide.presentationId === presentationId)
      .sort((a, b) => a.order - b.order);
  }

  async getSlide(id: string): Promise<Slide | undefined> {
    return this.slides.get(id);
  }

  async createSlide(insertSlide: InsertSlide): Promise<Slide> {
    const id = randomUUID();
    const now = new Date();
    const slide: Slide = {
      ...insertSlide,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.slides.set(id, slide);
    return slide;
  }

  async updateSlide(id: string, updates: Partial<InsertSlide>): Promise<Slide | undefined> {
    const slide = this.slides.get(id);
    if (!slide) return undefined;
    
    const updated: Slide = {
      ...slide,
      ...updates,
      updatedAt: new Date(),
    };
    this.slides.set(id, updated);
    return updated;
  }

  async deleteSlide(id: string): Promise<boolean> {
    return this.slides.delete(id);
  }

  async reorderSlides(presentationId: string, slideOrders: { id: string; order: number }[]): Promise<void> {
    for (const { id, order } of slideOrders) {
      const slide = this.slides.get(id);
      if (slide && slide.presentationId === presentationId) {
        const updated = { ...slide, order, updatedAt: new Date() };
        this.slides.set(id, updated);
      }
    }
  }
}

// Database storage implementation using Drizzle and PostgreSQL
export class DBStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is required");
    }
    const sql = neon(process.env.DATABASE_URL);
    this.db = drizzle(sql);
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Hash password before storing
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(insertUser.password, saltRounds);
    
    const result = await this.db.insert(users).values({
      ...insertUser,
      password: hashedPassword
    }).returning();
    
    return result[0];
  }

  // Presentation operations
  async getPresentation(id: string): Promise<Presentation | undefined> {
    const result = await this.db.select().from(presentations).where(eq(presentations.id, id));
    return result[0];
  }

  async getPresentationsByUserId(userId: string): Promise<Presentation[]> {
    const result = await this.db.select().from(presentations).where(eq(presentations.userId, userId));
    return result;
  }

  async createPresentation(insertPresentation: InsertPresentation): Promise<Presentation> {
    const result = await this.db.insert(presentations).values(insertPresentation).returning();
    return result[0];
  }

  async updatePresentation(id: string, updates: Partial<InsertPresentation>): Promise<Presentation | undefined> {
    const result = await this.db
      .update(presentations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(presentations.id, id))
      .returning();
    return result[0];
  }

  async deletePresentation(id: string): Promise<boolean> {
    // First delete all slides belonging to this presentation
    await this.db.delete(slides).where(eq(slides.presentationId, id));
    
    // Then delete the presentation and check if it existed
    const result = await this.db.delete(presentations).where(eq(presentations.id, id)).returning({ id: presentations.id });
    return result.length > 0;
  }

  // Slide operations
  async getSlidesByPresentationId(presentationId: string): Promise<Slide[]> {
    const result = await this.db
      .select()
      .from(slides)
      .where(eq(slides.presentationId, presentationId))
      .orderBy(slides.order);
    return result;
  }

  async getSlide(id: string): Promise<Slide | undefined> {
    const result = await this.db.select().from(slides).where(eq(slides.id, id));
    return result[0];
  }

  async createSlide(insertSlide: InsertSlide): Promise<Slide> {
    const result = await this.db.insert(slides).values(insertSlide).returning();
    return result[0];
  }

  async updateSlide(id: string, updates: Partial<InsertSlide>): Promise<Slide | undefined> {
    const result = await this.db
      .update(slides)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(slides.id, id))
      .returning();
    return result[0];
  }

  async deleteSlide(id: string): Promise<boolean> {
    const result = await this.db.delete(slides).where(eq(slides.id, id)).returning({ id: slides.id });
    return result.length > 0;
  }

  async reorderSlides(presentationId: string, slideOrders: { id: string; order: number }[]): Promise<void> {
    // Update slides one by one - if transaction fails with neon-http, this ensures each update still works
    // TODO: Consider using a websocket driver or batch update for better atomicity if needed
    const updates: Promise<any>[] = [];
    
    for (const { id, order } of slideOrders) {
      const updatePromise = this.db
        .update(slides)
        .set({ order, updatedAt: new Date() })
        .where(and(eq(slides.id, id), eq(slides.presentationId, presentationId)));
      updates.push(updatePromise);
    }
    
    // Execute all updates concurrently
    await Promise.all(updates);
  }

  // Initialize with sample data for development
  async initializeSampleData(): Promise<void> {
    // Check if sample data already exists
    const existingUser = await this.getUserByUsername('demo');
    if (existingUser) {
      return; // Sample data already exists
    }

    // Create sample user with hashed password
    const hashedPassword = await bcrypt.hash('demo123', 12);
    const sampleUser = await this.db.insert(users).values({
      id: 'sample-user',
      username: 'demo',
      password: hashedPassword
    }).returning();

    // Create sample presentation with specific ID
    const samplePresentation = await this.db.insert(presentations).values({
      id: 'sample-presentation',
      title: 'Vượt Lên Số Phận',
      description: 'Bài thuyết trình về cách con người có thể vượt lên số phận của chính mình',
      userId: sampleUser[0].id
    }).returning();

    // Create sample slides với nội dung đầy đủ và cải thiện, bao gồm thầy Nguyễn Ngọc Ký
    const sampleSlidesData = [
      {
        id: '1',
        presentationId: samplePresentation[0].id,
        order: 1,
        type: 'title',
        title: 'Vượt Lên Số Phận',
        content: JSON.stringify({
          type: 'title_with_image',
          text: 'Làm thế nào để con người vượt lên số phận của chính mình trong cuộc sống',
          subtitle: 'Hành trình từ khó khăn đến thành công',
          image: '/stock_images/gentle_inspiring_ins_dc4fa5e2.jpg'
        }),
        background: 'educational-gradient-1'
      },
      {
        id: '2',
        presentationId: samplePresentation[0].id,
        order: 2,
        type: 'content',
        title: 'Số Phận Là Gì?',
        content: JSON.stringify({
          type: 'content_with_image',
          items: [
            '🏠 Những điều kiện ban đầu ta được sinh ra',
            '👨‍👩‍👧‍👦 Hoàn cảnh gia đình và xã hội',
            '🧬 Khả năng và hạn chế tự nhiên',
            '🌪️ Những sự kiện ngoài tầm kiểm soát',
            '💭 Nhưng số phận không phải là bản án cuối cùng!'
          ],
          image: '/stock_images/educational_success__583087f4.jpg'
        }),
        background: 'educational-gradient-1'
      },
      {
        id: '3',
        presentationId: samplePresentation[0].id,
        order: 3,
        type: 'content',
        title: 'Những Yếu Tố Để Vượt Lên Số Phận',
        content: JSON.stringify({
          type: 'content_with_image',
          items: [
            '💪 Ý chí và nghị lực kiên cường',
            '📚 Tri thức và học tập không ngừng',
            '🎯 Khát vọng và mục tiêu rõ ràng',
            '🔄 Khả năng thích ứng và thay đổi',
            '🤝 Sự hỗ trợ từ cộng đồng'
          ],
          image: '/stock_images/educational_success__450426a4.jpg'
        }),
        background: 'educational-gradient-1'
      },
      {
        id: '4',
        presentationId: samplePresentation[0].id,
        order: 4,
        type: 'content',
        title: 'Tấm Gương Nguyễn Ngọc Ký',
        content: JSON.stringify({
          type: 'story_with_image',
          story: [
            '✍️ Sinh năm 1947 tại Quảng Bình, bị liệt cả hai tay từ nhỏ',
            '🎓 Tự học viết bằng chân, trở thành giáo viên',
            '📖 Viết hơn 30 cuốn sách, truyện thiếu nhi nổi tiếng',
            '🏆 Nhận nhiều giải thưởng văn học danh giá',
            '💝 Câu nói nổi tiếng: "Tôi viết bằng chân nhưng từ trái tim"',
            '🌟 Chứng minh rằng nghị lực có thể thắng mọi khó khăn'
          ],
          image: '/attached_assets/photo-1664414672918-16644146732841701402327_1759638546232.jpg'
        }),
        background: 'educational-gradient-1'
      },
      {
        id: '5',
        presentationId: samplePresentation[0].id,
        order: 5,
        type: 'quote',
        title: 'Nguyễn Ngọc Ký',
        content: JSON.stringify({
          type: 'quote_with_image',
          text: 'Tôi viết bằng chân nhưng từ trái tim. Khuyết tật không làm khuyết tâm hồn',
          author: 'Thầy Nguyễn Ngọc Ký - Nhà văn, Nhà giáo',
          image: '/attached_assets/images_1759638546339.webp'
        }),
        background: 'educational-gradient-1'
      },
      {
        id: '6',
        presentationId: samplePresentation[0].id,
        order: 6,
        type: 'content',
        title: 'Tư Duy Tích Cực - Chìa Khóa Thành Công',
        content: JSON.stringify({
          type: 'content_with_image',
          items: [
            '🔄 Thay đổi cách nhìn nhận về hoàn cảnh khó khăn',
            '🎯 Tập trung vào những gì có thể kiểm soát được',
            '⚡ Biến thử thách thành cơ hội học hỏi',
            '📈 Học hỏi từ thất bại để trở nên mạnh mẽ hơn',
            '🌟 Tin tưởng vào khả năng vô hạn của bản thân'
          ],
          image: '/stock_images/educational_success__450426a4.jpg'
        }),
        background: 'educational-gradient-1'
      },
      {
        id: '7',
        presentationId: samplePresentation[0].id,
        order: 7,
        type: 'content',
        title: 'Hành Động Cụ Thể Để Thay Đổi',
        content: JSON.stringify({
          type: 'content_with_image',
          items: [
            '🎯 Đặt mục tiêu SMART (cụ thể, đo lường được)',
            '📝 Lập kế hoạch chi tiết và thực hiện kiên trì',
            '📚 Không ngừng học hỏi và nâng cao kỹ năng',
            '🤝 Xây dựng mạng lưới quan hệ tích cực',
            '🏃‍♂️ Hành động ngay hôm nay, đừng trì hoãn'
          ],
          image: '/stock_images/gentle_inspiring_ins_dc4fa5e2.jpg'
        }),
        background: 'educational-gradient-1'
      },
      {
        id: '8',
        presentationId: samplePresentation[0].id,
        order: 8,
        type: 'content',
        title: 'Bài Học Rút Ra',
        content: JSON.stringify({
          type: 'conclusion_with_image',
          items: [
            '💪 Không bao giờ đầu hàng trước khó khăn',
            '📖 Luôn học hỏi và rèn luyện bản thân mỗi ngày',
            '🌟 Tin vào giá trị và khát vọng sống của chính mình',
            '🔥 Biến số phận thành động lực để tỏa sáng',
            '🎯 Mỗi người đều có thể viết nên câu chuyện thành công riêng'
          ],
          image: '/stock_images/educational_success__4203c133.jpg'
        }),
        background: 'educational-gradient-1'
      },
      {
        id: '9',
        presentationId: samplePresentation[0].id,
        order: 9,
        type: 'quote',
        title: 'Thông điệp cuối cùng',
        content: 'Số phận không định đoạt tất cả, chính bản lĩnh và nghị lực con người mới quyết định cuộc đời mình. Hãy tin rằng bạn có thể vượt lên mọi khó khăn!',
        background: 'bg-gradient-to-br from-primary via-primary/90 to-primary/80'
      }
    ];

    for (const slideData of sampleSlidesData) {
      await this.db.insert(slides).values(slideData);
    }
  }
}

// Use MemStorage for in-memory storage (no database required)
export const storage = new MemStorage();
