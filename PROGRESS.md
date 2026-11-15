# AOVDLE – Project Progress

> Cập nhật theo trạng thái thực tế; không đánh dấu hoàn thành khi dữ liệu chưa được kiểm chứng.

## Trạng thái hiện tại

**Overall status: DESIGN / PRE-DEVELOPMENT — historical data collection in progress**

- Product direction: đã thống nhất trong tài liệu thiết kế.
- Application code/database: chưa triển khai theo trạng thái đã biết.
- Historical data: đã có bản khảo sát ban đầu; chưa nghiệm thu đầy đủ.
- Media permissions: chưa xác minh; không tải hoặc sử dụng ảnh.

## Historical data research

- [x] Tạo dữ liệu khảo sát ban đầu cho giải, đội và roster AIC 2017/APL 2026.
- [x] Liệt kê trang nguồn Liquipedia và một số nguồn đối chiếu trong `data/research/sources.md`.
- [ ] Thu thập roster đầy đủ cho các edition AWC 2018 đến AIC 2025 được yêu cầu.
- [ ] Xác minh từng dòng roster đăng ký và phân biệt với người thực sự thi đấu.
- [ ] Xác minh role DSL/Jungle/Mid/Farm/Support theo nguồn; không suy luận vị trí.
- [ ] Xác minh Head Coach theo từng đội/edition.
- [ ] Đối chiếu tên/nickname/quốc gia từng tuyển thủ khi có nguồn đáng tin.
- [ ] Rà soát CSV hiện có về định dạng, khóa ID, trạng thái và tính nhất quán trước khi dùng làm dữ liệu ứng dụng.

## Trạng thái lần cập nhật này

Đã rà soát các nguồn tìm kiếm cho các edition AWC 2018, AIC 2018, AWC 2019, AIC 2019, APL 2020, AIC 2020, AWC 2021, AIC 2021, AIC 2022, APL 2022, APL 2023, AIC 2023, APL 2024, AIC 2024, APL 2025 và AIC 2025. Nhiều bản tóm tắt có mâu thuẫn về đội, người chơi và việc đăng ký/thi đấu. Vì vậy, không nhập các tên chưa kiểm tra được vào roster chuẩn chỉ dựa trên search snippet.

Không tuyên bố các edition này đã có roster hoàn chỉnh. `sources.md` ghi URL Liquipedia và nguồn đối chiếu, cùng lưu ý về chất lượng chứng cứ.

## Rủi ro / vấn đề còn lại

1. Một số nguồn cộng đồng hoặc bản tóm tắt thứ cấp có thể gộp roster khu vực/qualifier với Main Event.
2. Thông tin người thi đấu thực tế không đồng nghĩa với danh sách đăng ký; cần căn cứ match sheet/game log.
3. Vai trò thi đấu và Head Coach thường không có trong trang giải hoặc thay đổi theo trận.
4. Quốc tịch, tên thật và nickname cần được xác minh riêng; không suy đoán từ khu vực/đội.
5. AIC 2026 được ghi trong catalog trước đó với trạng thái held dù ngày dự kiến là tháng 12/2026; cần sửa status thành planned/ongoing theo ngày truy cập trước khi nghiệm thu catalog.
6. Bản push trước đó đặt nội dung nguồn vào `PROGRESS.md` thay vì `data/research/sources.md`; lần cập nhật này khôi phục `PROGRESS.md` theo đúng mục đích và tạo `sources.md` đúng đường dẫn.

## Nguyên tắc tiếp tục

Chỉ thêm từng edition sau khi có roster nguồn cụ thể. Mỗi player version phải gắn với tournament + team riêng; role/country/coach để trống nếu thiếu bằng chứng. Dữ liệu chưa đủ bằng chứng được đánh dấu `partial` hoặc `unverified`, không sử dụng như dữ liệu đã nghiệm thu.

## Update log

| Ngày | Thay đổi |
|---|---|
| 2026-11-15 | Khôi phục progress log; tạo sources.md đúng đường dẫn; ghi nhận kết quả và giới hạn xác minh roster cho các edition được yêu cầu. |
