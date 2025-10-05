# Hướng Dẫn Deploy Lên Render

## Tổng Quan

Ứng dụng này hỗ trợ deploy lên Render với **PostgreSQL tiêu chuẩn** hoặc **Neon Database**. Hệ thống tự động phát hiện loại database và sử dụng driver phù hợp.

## Các Bước Deploy

### 1. Tạo Database

#### Tùy Chọn A: Sử dụng Render PostgreSQL (Khuyến Nghị)

1. Vào [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → Chọn **"PostgreSQL"**
3. Điền thông tin:
   - **Name**: `presentation-db` (hoặc tên bạn muốn)
   - **Database**: `presentation`
   - **User**: `presentation_user`
   - Chọn **Free plan** hoặc plan phù hợp
4. Click **"Create Database"**
5. Sau khi tạo xong, copy **Internal Database URL** (bắt đầu bằng `postgresql://`)

#### Tùy Chọn B: Sử dụng Neon Database

1. Vào [Neon Console](https://console.neon.tech/)
2. Tạo project mới
3. Copy **Connection String** (sẽ chứa `.neon.tech` trong URL)

### 2. Deploy Web Service

1. Vào Render Dashboard
2. Click **"New +"** → Chọn **"Web Service"**
3. Kết nối repository GitHub của bạn
4. Điền thông tin:
   - **Name**: tên service của bạn
   - **Runtime**: `Node`
   - **Build Command**: 
     ```
     npm install && npm run build && npm run db:push
     ```
   - **Start Command**: 
     ```
     npm start
     ```

### 3. Cấu Hình Environment Variables

Trong phần **Environment** của service, thêm các biến sau:

```
NODE_ENV=production
DATABASE_URL=<paste-internal-database-url-từ-bước-1>
ACCESS_PASSWORD=<mật-khẩu-bảo-vệ-app-của-bạn>
SESSION_SECRET=<chuỗi-bí-mật-ngẫu-nhiên-dài-ít-nhất-32-ký-tự>
PORT=5000
```

**Lưu ý quan trọng:**
- `DATABASE_URL`: Paste URL từ database bạn tạo ở bước 1
- `ACCESS_PASSWORD`: Đặt mật khẩu để bảo vệ ứng dụng (ví dụ: `MySecurePassword123!`)
- `SESSION_SECRET`: Chuỗi bí mật ngẫu nhiên dài (ví dụ: `abc123xyz789-very-long-secret-key-minimum-32-chars`)

### 4. Deploy

1. Click **"Create Web Service"**
2. Render sẽ tự động build và deploy ứng dụng
3. Đợi vài phút cho quá trình deploy hoàn tất
4. Khi deploy xong, bạn sẽ thấy URL của ứng dụng (ví dụ: `https://your-app.onrender.com`)

### 5. Kiểm Tra

1. Mở URL của ứng dụng
2. Đăng nhập bằng mật khẩu bạn đã đặt trong `ACCESS_PASSWORD`
3. Kiểm tra xem ứng dụng hoạt động bình thường

## Khắc Phục Sự Cố

### Lỗi 503 Service Unavailable

Nếu gặp lỗi 503, kiểm tra:

1. **Logs**: Vào service → Click tab **"Logs"** để xem lỗi chi tiết
2. **Environment Variables**: Đảm bảo tất cả biến môi trường đã được cấu hình đúng
3. **Database Connection**: Kiểm tra `DATABASE_URL` có đúng không
4. **Build Command**: Đảm bảo build command chạy thành công

### Các Lỗi Thường Gặp

1. **"DATABASE_URL is required"**
   - Chưa cấu hình `DATABASE_URL` trong Environment Variables
   - Giải pháp: Thêm `DATABASE_URL` vào Environment Variables

2. **"Cannot connect to database"**
   - Database URL không đúng hoặc database chưa sẵn sàng
   - Giải pháp: Kiểm tra lại Database URL và đảm bảo database đã được tạo

3. **"Session error"**
   - Chưa có `SESSION_SECRET`
   - Giải pháp: Thêm `SESSION_SECRET` vào Environment Variables

## Cập Nhật Ứng Dụng

Khi bạn push code mới lên GitHub:
1. Render sẽ tự động detect thay đổi
2. Tự động build và deploy lại
3. Không cần làm gì thêm!

## Lưu Ý

- **Free plan** của Render sẽ tự động sleep sau 15 phút không hoạt động
- Lần đầu truy cập sau khi sleep sẽ mất ~30 giây để wake up
- Để tránh sleep, nên upgrade lên plan trả phí

## Chi Tiết Kỹ Thuật

### Hỗ Trợ Đa Database

Ứng dụng tự động phát hiện và sử dụng driver phù hợp:

- **Neon Database** (URL chứa `.neon.tech`): Sử dụng `neon-http` driver (tối ưu cho serverless)
- **PostgreSQL Tiêu Chuẩn** (Render, AWS RDS, v.v.): Sử dụng `node-postgres` driver

### Session Management

- **Development**: Sử dụng in-memory session store
- **Production (có DATABASE_URL)**: Sử dụng PostgreSQL session store (`connect-pg-simple`)

Điều này đảm bảo sessions được lưu trữ bền vững và hoạt động tốt với nhiều instances trên Render.
