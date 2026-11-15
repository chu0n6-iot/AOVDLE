# AOVDLE – Rules for AI / Codex

Tài liệu này là quy tắc bắt buộc khi AI/Codex làm việc trong repository.

## 1. Quy tắc làm việc

1. Đọc `README.md` và toàn bộ tài liệu trong `docs/` trước khi sửa code.
2. Khảo sát repository trước khi đề xuất thay đổi cấu trúc.
3. Chỉ thực hiện đúng nhiệm vụ được giao.
4. Chia thay đổi thành phần nhỏ, có thể kiểm tra và rollback.
5. Báo cáo file đã tạo/sửa, lệnh đã chạy, kết quả test và vấn đề còn lại.
6. Nếu yêu cầu mâu thuẫn với tài liệu, dừng và hỏi; không tự chọn một hướng.
7. Không tuyên bố hoàn thành nếu chưa kiểm tra kết quả thực tế.

## 2. Điều tuyệt đối không được làm

- Không tự ý viết code khi nhiệm vụ chỉ yêu cầu phân tích hoặc lập kế hoạch.
- Không tự ý xóa, đổi tên hoặc di chuyển file.
- Không ghi đè cấu hình, dependency hoặc công nghệ hiện có khi chưa được duyệt.
- Không đưa dữ liệu HOK, giải nữ hoặc 1v1 vào pool game.
- Không suy đoán tuyển thủ, roster, vị trí, HLV, thành tích hoặc quan hệ đồng đội.
- Không tự tạo URL, nguồn trích dẫn hoặc giấy phép ảnh.
- Không kích hoạt synergy nếu thiếu bằng chứng strict.
- Không ghi kết quả mô phỏng vào lịch sử esports thật.
- Không hardcode luật giải hoặc rating trong UI.
- Không đưa secret/API key vào Git.
- Không commit hoặc push nếu chưa được yêu cầu.

## 3. Quy tắc dữ liệu

- Mỗi dữ kiện lịch sử phải có nguồn và trạng thái xác minh.
- Phân biệt player identity với player version.
- Phân biệt team identity với team-season.
- Phân biệt roster lịch sử với roster đăng ký ở từng tournament edition.
- Dùng ngày hiệu lực để biểu diễn thời gian tham gia.
- Không gộp hai người chỉ vì trùng tên; cần định danh xác minh.
- Dữ liệu chưa rõ phải đánh dấu `unverified` hoặc để trống, không đoán.

## 4. Quy tắc ảnh và bản quyền

- Chỉ dùng ảnh được phép sử dụng trong sản phẩm.
- Lưu nguồn, chủ sở hữu, license và phạm vi cấp phép.
- Không mặc định ảnh công khai trên Liquipedia hoặc mạng xã hội là ảnh miễn phí.
- Không hotlink ảnh nếu chưa được phép.
- Khi chưa có ảnh hợp lệ, dùng placeholder trung tính.

## 5. Quy tắc Draft

- Đúng năm role slot: DSL, Jungle, Mid, Farm, Support.
- Tối đa ba reroll trong Player Draft.
- Không chọn trùng Player Version.
- Có thể chọn nhiều người từ một team.
- Coach Draft chỉ chọn một Head Coach.
- Coach Draft không có reroll riêng trong MVP.

## 6. Quy tắc Hidden Synergy

Player–Player chỉ hợp lệ khi:
- Cùng team-season/roster cụ thể.
- Thời gian tham gia giao nhau.
- Có nguồn xác minh roster.

Player–Coach chỉ hợp lệ khi:
- Coach là Head Coach trong giai đoạn đó.
- Cùng team-season.
- Thời gian làm việc giao nhau.
- Có bằng chứng xác minh.

Không suy luận synergy từ cùng tổ chức khác thời kỳ, cùng quốc gia, cùng giải hoặc quan hệ bạn bè.

## 7. Quy tắc Simulation

- Dùng cấu hình giải có version và nguồn xác minh.
- Lưu random seed nếu cần tái lập kết quả.
- Không để UI quyết định kết quả trận.
- Kiểm tra bracket và trạng thái đội sau mỗi vòng.
- Không đưa đội đã bị loại trở lại giải.
- Không sửa historical tables từ simulation.

## 8. Chất lượng code

- TypeScript strict nếu tương thích với repository.
- Tránh `any`; nếu bắt buộc phải giải thích.
- Tách business logic khỏi React components.
- Viết unit tests cho logic Draft, synergy, rating và tournament.
- Xử lý loading/error/empty state.
- Không thêm dependency nếu chưa chứng minh cần thiết.
- Không để lint, typecheck hoặc test lỗi mà không báo cáo.

## 9. Definition of Done

Một task chỉ hoàn thành khi:
- Đúng phạm vi.
- Không vi phạm tài liệu.
- Có test phù hợp hoặc giải thích vì sao chưa có.
- Các kiểm tra liên quan đã chạy.
- Không có thay đổi ngoài ý muốn.
- `PROGRESS.md` được cập nhật sau khi task thực sự hoàn thành.
