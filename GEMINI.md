# Hướng dẫn Phát triển Dự án Trợ lý ảo (GEMINI.md)

Đây là tài liệu cung cấp ngữ cảnh cho Gemini CLI và các nhà phát triển để tiếp tục phát triển dự án Trợ lý ảo.

## 1. Mục tiêu dự án

Xây dựng một Trợ lý ảo thông minh, có khả năng:
- Trả lời các câu hỏi dựa trên một cơ sở tri thức được cung cấp (RAG - Retrieval-Augmented Generation).
- Sử dụng các công cụ (function calling) để tương tác với API bên ngoài và lấy dữ liệu động.
- Cung cấp trải nghiệm người dùng chuyên nghiệp, có khả năng tùy chỉnh cao, tương tự như các nền tảng chat AI hàng đầu.

## 2. Công nghệ sử dụng

- **Frontend Framework:** React 19
- **UI Framework:** Ant Design 5.x
- **Ngôn ngữ:** TypeScript
- **AI Backend:** Google Gemini API (`@google/genai`)
- **Định dạng văn bản:** `react-markdown` để render Markdown và `react-syntax-highlighter` để tô sáng cú pháp code.
- **Styling:** CSS-in-JS thông qua Ant Design và các style nội dòng.
- **Môi trường:** Dự án được thiết lập để chạy trên một môi trường web hiện đại, sử dụng ES Modules và import maps, không cần bước build.

## 3. Kiến trúc Mã nguồn

Dự án được cấu trúc theo từng module chức năng để dễ quản lý và mở rộng:

- **`index.tsx`**: Điểm khởi đầu của ứng dụng React.
- **`App.tsx`**: Component cha, đóng vai trò là trung tâm điều phối, quản lý toàn bộ trạng thái của ứng dụng (phiên chat, cài đặt, trạng thái tải...).
- **`/components`**: Chứa các component React tái sử dụng, được xây dựng trên nền tảng Ant Design.
  - `ChatHeader.tsx`: Tiêu đề của ứng dụng.
  - `ChatSidebar.tsx`: Dashboard quản lý lịch sử các phiên chat.
  - `ChatMessageList.tsx`: Hiển thị danh sách các tin nhắn trong một cuộc trò chuyện.
  - `ChatMessage.tsx`: Hiển thị một tin nhắn đơn lẻ (của người dùng hoặc AI).
  - `ChatInput.tsx`: Khung nhập liệu và nút gửi tin nhắn.
  - `SuggestionChips.tsx`: Hiển thị các gợi ý câu hỏi tiếp theo.
  - `SettingsModal.tsx`: Cửa sổ cài đặt cho phép người dùng tùy chỉnh ứng dụng.
- **`/services`**: Chứa logic nghiệp vụ và tương tác với các dịch vụ bên ngoài.
  - `geminiService.ts`: Chịu trách nhiệm giao tiếp trực tiếp với Google Gemini API, bao gồm cả chế độ tiêu chuẩn (với function calling) và chế độ streaming.
  - `prompt.ts`: Tập trung toàn bộ logic xây dựng các system prompt động, dựa trên cài đặt của người dùng và cơ sở tri thức.
  - `tools.ts`: Định nghĩa các công cụ (function declarations) mà AI có thể sử dụng và logic thực thi của chúng (ví dụ: gọi API tra cứu địa chỉ).
- **`/types.ts`**: Định nghĩa các kiểu dữ liệu TypeScript được sử dụng chung trong toàn bộ ứng dụng.
- **`rag_data.md`**: Tệp văn bản chứa cơ sở tri thức tĩnh (RAG) cho AI.

## 4. Các tính năng chính đã triển khai

- **Quản lý Phiên chat:**
  - Tạo, xóa, chuyển đổi giữa nhiều cuộc trò chuyện.
  - Tự động lưu toàn bộ lịch sử chat vào `localStorage`.
  - Tự động tạo tiêu đề cho phiên chat mới bằng AI.
- **Tùy chỉnh Trải nghiệm:**
  - **Giao diện:** Sáng / Tối / Theo Hệ thống.
  - **Model AI:** Cho phép người dùng chọn model Gemini để sử dụng.
  - **Chế độ Phản hồi:**
    - **Tiêu chuẩn:** Hỗ trợ đầy đủ các tính năng phức tạp như function calling.
    - **Luồng (Stream):** Trả lời nhanh, hiển thị văn bản theo từng từ.
  - **Phong cách Chat:** Chuyên nghiệp / Sáng tạo / Kỹ thuật.
- **Tương tác Thông minh:**
  - **RAG:** Trả lời dựa trên tệp `rag_data.md`.
  - **Function Calling:** Tích hợp công cụ tra cứu địa chỉ qua API bên ngoài.
  - **Gợi ý động:** Sau mỗi câu trả lời, AI sẽ đưa ra các gợi ý phù hợp với ngữ cảnh.
- **Giao diện Hiện đại:**
  - Xây dựng hoàn toàn bằng Ant Design 5.x.
  - Hỗ trợ đầy đủ định dạng Markdown và tô sáng mã nguồn trong câu trả lời.

## 5. Hướng phát triển tiếp theo

- Mở rộng thêm các công cụ mới cho AI (ví dụ: tra cứu thời tiết, tìm kiếm tin tức).
- Cải thiện khả năng xử lý của chế độ streaming để hỗ trợ function calling.
- Nâng cấp giao diện để hiển thị các kết quả từ công cụ một cách trực quan hơn (ví dụ: hiển thị bản đồ, bảng biểu).
- Tối ưu hóa hiệu năng khi lịch sử chat trở nên rất lớn.
