# AOVDLE – Design System

## 1. Định hướng hình ảnh

Phong cách esports fantasy: tối màu, tương phản cao, điểm nhấn vàng kim. Giao diện cần tạo cảm giác như một giải đấu chuyên nghiệp, không sao chép nguyên xi giao diện của website tham khảo.

## 2. Màu sắc đề xuất

| Token | Màu | Mục đích |
|---|---|---|
| `background` | `#071018` | Nền chính |
| `surface` | `#0D1923` | Card/panel |
| `surface-raised` | `#142330` | Panel nổi |
| `border` | `#354653` | Viền |
| `gold` | `#C9A45C` | Điểm nhấn, CTA quan trọng |
| `gold-muted` | `#80683D` | Viền/chi tiết phụ |
| `text-primary` | `#F2F0E9` | Nội dung chính |
| `text-secondary` | `#91A0AA` | Metadata |
| `success` | `#3EAD83` | Trạng thái hợp lệ |
| `danger` | `#D45B58` | Bị loại/lỗi |

Màu là design tokens đề xuất; có thể tinh chỉnh sau prototype.

## 3. Typography

- Heading: font condensed/strong phù hợp không khí esports.
- Body: sans-serif dễ đọc.
- Metadata: sans-serif gọn, có thể dùng uppercase và tracking nhẹ.
- Không dùng quá nhiều font; tối đa hai họ font chính.
- Ưu tiên font có hỗ trợ đầy đủ tiếng Việt.

Có thể đánh giá Oswald hoặc Barlow Condensed cho heading và Inter cho body; phải kiểm tra giấy phép font trước khi đóng gói.

## 4. Component principles

### Team Card
- Logo đội.
- Tên đội.
- Năm/mùa giải.
- Danh sách tuyển thủ có thể chọn.
- Thông tin giải đấu nguồn khi cần.

### Player Card
- Ảnh đúng Player Version/mùa.
- Tên tuyển thủ.
- Role.
- Team và season.
- Trạng thái selected/disabled.
- Không hiển thị ảnh placeholder như thể là ảnh chính thức.

### Coach Card
- Ảnh Head Coach.
- Tên.
- Đội và thời kỳ huấn luyện.
- Thành tích đã xác minh.

### Dream Team Slot
- Năm vị trí cố định.
- Slot trống có hướng dẫn.
- Khi đã chọn, hiển thị portrait và tên.
- Ngăn chọn role trùng.

### Synergy Reveal
- Ẩn trong giai đoạn Draft.
- Chỉ hiện khi hệ thống kích hoạt trong Simulation hoặc phần phân tích sau trận.
- Hiển thị loại liên kết và mô tả ngắn; không bịa lịch sử.

### Tournament UI
- Swiss standings.
- Lịch trận.
- Match card.
- Double Elimination bracket.
- Champion screen.

## 5. Layout

Desktop:
- Khu vực Draft và danh sách đội ở cột trái.
- Khu vực roster/preview ở cột phải.
- Dream Team luôn dễ quan sát.

Mobile:
- Chuyển thành layout một cột.
- Giữ slot Dream Team dễ truy cập.
- Card không được quá nhỏ để đọc tên và nhận diện ảnh.

## 6. Interaction

- Chọn card có trạng thái hover/focus/selected rõ ràng.
- Reroll phải hiển thị số lượt còn lại.
- Xác nhận pick trước khi chuyển bước nếu thao tác khó hoàn tác.
- Animation ngắn, không làm chậm gameplay.
- Tôn trọng `prefers-reduced-motion`.
- Có trạng thái loading, empty, error và disabled.

## 7. Accessibility

- Tương phản văn bản đủ đọc.
- Không dùng màu sắc làm tín hiệu duy nhất.
- Điều hướng được bằng bàn phím.
- Ảnh có alt text phù hợp.
- Nút có nhãn rõ ràng.
- Focus ring dễ nhận biết.

## 8. Asset policy

- Ưu tiên ảnh chính thức theo mùa.
- Ghi nguồn, chủ sở hữu và giấy phép cho từng asset.
- Không hotlink hoặc tải ảnh từ website khác để tái xuất bản nếu chưa được phép.
- Nếu chưa có quyền, dùng placeholder trung tính hoặc ảnh tự tạo không giả mạo chân dung tuyển thủ.
- Logo đội và giải đấu cũng cần kiểm tra quyền sử dụng.

## 9. Không làm

- Không sao chép nguyên bản logo, bố cục hoặc tài sản độc quyền của game tham khảo.
- Không dùng ảnh không rõ nguồn.
- Không dùng hiệu ứng gây khó đọc.
- Không tự tạo chân dung giả rồi gắn tên tuyển thủ thật.
