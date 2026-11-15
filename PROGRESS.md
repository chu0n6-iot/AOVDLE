# AOVDLE – Project Progress

> Cập nhật theo trạng thái thực tế; không đánh dấu hoàn thành khi dữ liệu chưa được kiểm chứng.

## Trạng thái hiện tại

**Overall status: DESIGN / PRE-DEVELOPMENT — historical data collection in progress**

- Product direction: đã thống nhất trong tài liệu thiết kế.
- Application code/database: chưa triển khai theo trạng thái đã biết.
- Historical data: có bản khảo sát ban đầu và roster addendum một phần; chưa nghiệm thu đầy đủ.
- Media permissions: chưa xác minh; không tải hoặc sử dụng ảnh.

## Historical data research

- [x] Tạo dữ liệu khảo sát ban đầu cho giải, đội và roster AIC 2017/APL 2026.
- [x] Bổ sung roster subset cho AWC 2018 và AIC 2019; trạng thái `partial`, không phải dữ liệu hoàn chỉnh/đã nghiệm thu.
- [x] Lưu Liquipedia URLs và nguồn cross-check trong `data/research/sources.md`.
- [ ] Thu thập roster đầy đủ cho các edition còn lại trong yêu cầu AWC 2018–AIC 2025.
- [ ] Xác minh từng dòng roster đăng ký và phân biệt với người thực sự thi đấu.
- [ ] Xác minh role DSL/Jungle/Mid/Farm/Support theo nguồn; không suy luận vị trí.
- [ ] Xác minh Head Coach theo từng đội/edition.
- [ ] Đối chiếu tên/nickname/quốc gia từng tuyển thủ khi có nguồn đáng tin.
- [ ] Rà soát CSV hiện có về định dạng, khóa ID, trạng thái và tính nhất quán trước khi dùng làm dữ liệu ứng dụng.

## Kết quả cập nhật roster

- AWC 2018: 8 team rows và 46 player/roster rows đưa vào file addendum; partial, cần kiểm tra trực tiếp từng dòng theo nguồn event.
- AIC 2019: 8 team rows đã được liệt kê; danh sách player subset cần hoàn thiện trong bước tiếp theo; partial.
- AIC 2018 và AWC 2019: tạm chưa nhập roster vì các bản tóm tắt tìm kiếm bất nhất về đội dự giải và người chơi. Cần xác minh trực tiếp Liquipedia theo từng stage trước khi nhập.
- Còn lại theo yêu cầu: APL 2020, AIC 2020, AWC 2021, AIC 2021, AIC 2022, APL 2022, APL 2023, AIC 2023, APL 2024, AIC 2024, APL 2025, AIC 2025.

## Rủi ro / vấn đề còn lại

1. Bản tóm tắt tìm kiếm không phải bằng chứng đủ m���nh cho mọi dòng; các file addendum được giữ partial.
2. Thông tin người thi đấu thực tế không đồng nghĩa với danh sách đăng ký; cần match sheet/game log.
3. Vai trò thi đấu và Head Coach thường không có trong trang giải hoặc thay đổi theo trận.
4. Quốc tịch, tên thật và nickname cần được xác minh riêng; không suy đoán từ khu vực/đội.
5. AIC 2026 từng được ghi trạng thái held dù ngày dự kiến là tháng 12/2026; cần sửa status theo ngày kiểm tra trước khi nghiệm thu catalog.
6. Rà soát thêm cấu trúc CSV cũ trước khi hợp nhất addendum; lần này dùng tên addendum để không ghi đè lịch sử dữ liệu hiện có.

## Nguyên tắc tiếp tục

Chỉ thêm từng edition sau khi có roster nguồn cụ thể. Mỗi player version phải gắn với tournament + team riêng; role/country/coach để trống nếu thiếu bằng chứng. Dữ liệu chưa đủ bằng chứng được đánh dấu `partial` hoặc `unverified`, không sử dụng như dữ liệu đã nghiệm thu.

## Update log

| Ngày | Thay đổi |
|---|---|
| 2026-11-15 | Ghi nhận kết quả xác minh ban đầu; tạo sources.md đúng đường dẫn. |
| 2026-11-15 | Thêm roster addendum partial cho AWC 2018 và AIC 2019; ghi rõ AIC 2018/AWC 2019 đang giữ pending do nguồn mâu thuẫn. |
