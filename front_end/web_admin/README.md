# **React Admin Dashboard**

## **Giới thiệu**

Dự án **React Admin Dashboard** là một ứng dụng quản lý dữ liệu cho app học tiếng Anh. Ứng dụng này cung cấp các chức năng chính như quản lý từ vựng, bài tập, và các tài nguyên học tập khác. Dự án được xây dựng bằng các công nghệ hiện đại như React, TypeScript, Ant Design, TanStack Query, Axios, React Router và Tailwind CSS.

---

## **Công nghệ sử dụng**

- **React 18**: Thư viện JavaScript để xây dựng giao diện người dùng.
- **TypeScript**: Ngôn ngữ lập trình giúp tăng tính ổn định và dễ bảo trì.
- **Ant Design**: Thư viện UI components để xây dựng giao diện đẹp và chuyên nghiệp.
- **TanStack Query (React Query)**: Quản lý data fetching và caching.
- **Axios**: Thư viện để thực hiện các yêu cầu HTTP.
- **React Router**: Quản lý routing trong ứng dụng.
- **Tailwind CSS**: Framework CSS để thiết kế giao diện nhanh chóng và linh hoạt.

---

## **Cấu trúc dự án**

src/
├── api/ # Thư mục chứa các hàm gọi API
├── components/ # Các component UI tái sử dụng
├── pages/ # Các trang chính của admin dashboard
├── hooks/ # Custom hooks (nếu cần)
├── layouts/ # Layout chung (header, sidebar, footer)
├── types/ # Các kiểu dữ liệu TypeScript
├── utils/ # Các hàm tiện ích
├── App.tsx # Main App component
└── main.tsx # Entry point

---

## **Các màn hình chính**

1. **Quản lý từ vựng**:

   - Thêm từ vựng (bao gồm từ, nghĩa, phát âm, ví dụ, hình ảnh, v.v.).
   - Xem, sửa, xóa từ vựng.

2. **Quản lý bài tập**:

   - Thêm bài tập (câu hỏi, đáp án, loại bài tập: trắc nghiệm, điền từ, v.v.).
   - Xem, sửa, xóa bài tập.

3. **Dashboard**:
   - Hiển thị thống kê nhanh về số lượng từ vựng, bài tập, và người dùng hoạt động.

---

## **Cấu trúc Layout**

Ứng dụng sử dụng một layout chung bao gồm:

- **Sidebar**: Thanh điều hướng bên trái, chứa các liên kết đến các trang chính.
- **Header**: Thanh header phía trên, hiển thị tiêu đề và thông tin người dùng.
- **Content**: Phần nội dung chính, hiển thị các trang tương ứng.

## **Tích hợp API**

Dự án sử dụng JSONPlaceholder làm fake API để mô phỏng các yêu cầu HTTP. Các endpoint chính bao gồm:

- **Từ vựng**: https://jsonplaceholder.typicode.com/posts
- **Bài tập**: https://jsonplaceholder.typicode.com/posts
