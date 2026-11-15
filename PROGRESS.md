# AOVDLE – Project Progress

> Cập nhật theo trạng thái thực tế; không đánh dấu hoàn thành khi dữ liệu chưa được kiểm chứng.

## Trạng thái hiện tại

**Overall status: DESIGN / PRE-DEVELOPMENT — roster research and application implementation not complete**

- Repository đang có tài liệu Markdown và CSV nghiên cứu; không thấy application source, package manifest, build/test scripts hay database.
- Historical data CSV có dữ liệu một phần và mâu thuẫn; chưa nghiệm thu để dùng trong game pool.
- Không có ảnh người chơi được tải hoặc tích hợp.
- Chưa có build/test command để chạy trong repository hiện tại.

## Scope được cập nhật

Roster audit này bao quát các edition AoV nam quốc tế từ 2019 đến APL 2026, không chỉ APL 2026:

AWC 2019, AIC 2019, APL 2020, AIC 2020, AWC 2021, AIC 2021, AIC 2022, APL 2022, APL 2023, AIC 2023, APL 2024, AIC 2024, APL 2025, AIC 2025 và APL 2026.

Danh sách theo edition và coverage status được lưu trong `data/research/roster_coverage_2019_2026.csv`.

## Kết quả kiểm tra CSV hiện có

- Canonical `rosters.csv` có 50 dòng roster cho APL 2026, tất cả đều `partial`; không có dòng nào đạt đủ verified + role + nguồn đối chiếu để vào strict Draft pool.
- Canonical `players.csv` có 55 dòng APL 2026 (partial), nhưng chỉ 50 dòng có cặp roster tương ứng; 5 player-version records chưa khớp rosters.csv.
- `coaches.csv` có 14 dòng APL 2026, đều partial; không đủ điều kiện dùng Coach Draft verified-only.
- Roster addendum 2018/2019 chỉ có 23 dòng AWC 2018 (partial); không có roster rows AIC 2019 dù `players_addendum_2018_2019.csv` có các candidate AIC 2019. Vì vậy các player rows đó chưa thể coi là roster đã xác minh.
- Addenda hiện có chưa đồng nhất schema/IDs với các canonical CSV và cần được quarantine/đối soát trước khi dùng.
- Các summary kết quả tìm kiếm về AWC/AIC/APL nhiều năm có mâu thuẫn team/player, duplicate assignments, nhầm wildcard/qualifier, và không phân biệt đăng ký với thi đấu. Không sao chép các danh sách đó vào dữ liệu chính.
- Coverage hiện tại của 15 editions 2019–APL 2026: 0 editions có roster đủ chuẩn verified; 0 role rows verified đủ để khởi tạo game pool; 0 Head Coach rows verified.

## Việc đã hoàn thành trong lần cập nhật này

- [x] Kiểm kê tình trạng dữ liệu roster theo tất cả các edition từ AWC 2019 đến APL 2026.
- [x] Tạo `data/research/roster_coverage_2019_2026.csv` làm manifest theo giải, có nguồn Liquipedia/đối chiếu, trạng thái và vấn đề còn lại.
- [x] Cập nhật `TASKS.md` để ghi việc reconciliation dữ liệu và điều kiện trước khi xây web MVP.
- [x] Giữ nguyên các CSV lịch sử/addendum; không ghi đè hoặc gộp dữ liệu chưa xác minh.

## Chưa hoàn thành / blockers

- [ ] Thu thập đầy đủ từng participant team, registered roster và played lineup cho từng edition 2019–2026.
- [ ] Xác minh player identity, quốc gia, role, Head Coach, thời hạn roster và nguồn từng field.
- [ ] Chuẩn hóa schema/IDs và reconcile các player rows bị thiếu roster relation.
- [ ] Xác minh bằng chứng đồng thời roster + overlap trước khi tạo synergy evidence.
- [ ] Xây dựng web MVP (Draft, Coach Draft, Dream Team, Synergy, Tournament UI).
- [ ] Xác minh cấu hình APL 2026; chỉ các trường đã được nguồn xác nhận mới được hiển thị như luật.
- [ ] Chạy build/test; chưa có ứng dụng/scripts trong repo để thực hiện.

## Lưu ý về giải pháp

Không dùng dữ liệu thiếu nguồn hoặc role làm dữ liệu giả để “đủ” 15 đối thủ. Theo RULES.md, chỉ dữ liệu verified mới được phép vào Draft/AI. Khi roster verified chưa đủ, MVP cần thể hiện empty/insufficient-data state thay vì tự tạo tuyển thủ, coach, role hoặc synergy.

Không có ảnh nào được thêm. Không có thay đổi schema/database/kiến trúc. Không có code ứng dụng được thêm trong lần cập nhật này.

## Update log

| Ngày | Thay đổi |
|---|---|
| 2026-11-15 | Khởi tạo bộ tài liệu thiết kế. |
| 2026-11-15 | Ghi nhận dữ liệu AWC 2018/AIC 2019 là subset partial, chưa nghiệm thu. |
| 2026-11-15 | Rà soát coverage roster từ 2019 đến APL 2026; ghi rõ các bất nhất và tình trạng chưa đủ điều kiện cho MVP. |
