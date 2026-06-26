# Đề tài

**XÂY DỰNG HỆ THỐNG LUYỆN TẬP VÀ ĐÁNH GIÁ KIẾN THỨC BẰNG HÌNH THỨC TRẮC NGHIỆM**

## Cấu trúc thư mục

* **app/main**: Frontend của hệ thống, được xây dựng bằng **React + Vite**.
* **server**: Backend của hệ thống, được xây dựng bằng **Node.js + Express**, chịu trách nhiệm xử lý nghiệp vụ và cung cấp API.
* **MongoDB**: Hệ quản trị cơ sở dữ liệu dùng để lưu trữ dữ liệu của hệ thống.

## Yêu cầu môi trường

* Node.js (khuyến nghị phiên bản 18 trở lên)
* MongoDB hoặc MongoDB Atlas

## Hướng dẫn cài đặt

### 1. Chạy Backend

Mở Terminal và di chuyển đến thư mục `server`:

```bash
cd server
```

### Bước 1: Tạo file `.env`

Tạo file `.env` trong thư mục `server` và cấu hình:

```env
PORT=

MONGODB_URI=

JWT_SECRET=

EMAIL_USER=

EMAIL_PASS=

API_KEY=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

### Giải thích các biến môi trường

* `MONGODB_URI`: Chuỗi kết nối đến MongoDB.
* `JWT_SECRET`: Chuỗi bí mật dùng để tạo và xác thực JWT.
* `EMAIL_USER`, `EMAIL_PASS`: Tài khoản Gmail và App Password dùng để gửi email.
* `API_KEY`: API Key của Google Gemini dùng cho chức năng chatbot.
* `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Thông tin cấu hình Cloudinary dùng để lưu trữ hình ảnh.

> **Lưu ý:** Các thông tin trên là thông tin bảo mật nên không được đưa lên GitHub. Người dùng cần tự tạo file `.env` và cung cấp các giá trị phù hợp trước khi chạy hệ thống.

### Bước 2: Cài đặt thư viện

```bash
npm install
```

### Bước 3: Khởi động Backend

```bash
npm start
```

---

## 2. Chạy Frontend

Mở một Terminal mới và di chuyển đến thư mục `app/main`:

```bash
cd app/main
```

### Bước 1: Cài đặt thư viện

```bash
npm install
```

### Bước 2: Khởi động ứng dụng

```bash
npm run dev
```

Sau khi chạy thành công, truy cập:

```
http://localhost:5173/student/home
```
