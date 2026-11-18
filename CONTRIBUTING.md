# Hướng dẫn Đóng góp Dữ liệu Sự kiện & Tuyển thủ (Contribution Guide)

Chào mừng bạn đến với dự án **AOVDLE**! Để bảo đảm tính xác thực và khách quan tuyệt đối cho kho dữ liệu esports lịch sử của Arena of Valor (Liên Quân Mobile), mọi đóng góp đều phải tuân thủ quy trình kiểm duyệt dưới đây.

---

## 1. Các hạng mục tiếp nhận đóng góp

Cộng đồng có thể gửi đề xuất bổ sung hoặc chỉnh sửa cho các nội dung sau:
- **Thông tin giải đấu lịch sử** (AWC, AIC, APL, v.v.).
- **Logo đội tuyển** (SVG hoặc PNG trong suốt chất lượng cao).
- **Ảnh chân dung tuyển thủ** (đúng theo từng mùa giải thi đấu).
- **Đính chính danh sách đội hình (Roster corrections)**: Tuyển thủ chính thức, dự bị, vị trí thi đấu thực tế.
- **Kết quả giải đấu**: Tỉ số các trận vòng bảng, vòng loại và Chung kết.
- **Thông tin Huấn luyện viên trưởng (Head Coach)** và thành tích quốc tế.

---

## 2. Thông tin bắt buộc khi gửi đóng góp

Mỗi đề xuất đóng góp cần cung cấp đầy đủ các trường thông tin sau:

| Trường thông tin | Mô tả | Ví dụ |
| :--- | :--- | :--- |
| **Năm & Giải đấu** *(Bắt buộc)* | Tên giải đấu quốc tế chính thức | `APL 2024`, `AIC 2022` |
| **Tên đội tuyển** *(Bắt buộc)* | Tên đội và tên viết tắt | `Saigon Phantom (SGP)` |
| **Tên tuyển thủ & Vị trí** *(Bắt buộc)* | Tên thi đấu và vị trí (DSL, Jungle, Mid, Farm, Support) | `Bang (Jungle)` |
| **URL Nguồn xác minh** *(Bắt buộc)* | Link dẫn chứng từ Liquipedia, thông báo Garena hoặc cổng thông tin chính thức | `https://liquipedia.net/arenaofvalor/...` |
| **URL Ảnh / Tài nguyên** *(Nếu có)* | Link ảnh chân dung hoặc logo hợp lệ bản quyền | `https://.../bang_apl2024.png` |
| **Trạng thái xác minh** | Tự đánh giá mức độ tin cậy (`verified`, `partial`, `unverified`) | `verified` |

---

## 3. Quy trình kiểm duyệt & Nguyên tắc

1. **Nguyên tắc cốt lõi:**
   - Không đưa dữ liệu dựa trên suy đoán hoặc phỏng đoán.
   - Chỉ chấp nhận giải đấu Arena of Valor (AoV) quốc tế độc lập. Không trộn lẫn với Honor of Kings (HOK).
   - Ảnh tuyển thủ và huấn luyện viên phải thuộc bản quyền được phép sử dụng hoặc nguồn công khai hợp pháp.
2. **Quy trình duyệt:**
   - Tạo **GitHub Issue** theo mẫu [Đóng góp sự kiện](../../issues/new?template=tournament_event_contribution.yml) hoặc gửi **Pull Request** trực tiếp vào thư mục `data/research/`.
   - Đội ngũ quản trị viên sẽ đối chiếu link nguồn xác minh.
   - Sau khi được xác minh (`verified`), dữ liệu sẽ được tích hợp chính thức vào file `historicalData.ts` trong phiên bản cập nhật tiếp theo.
