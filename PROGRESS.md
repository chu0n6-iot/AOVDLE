# AOVDLE – Project Progress

> Cập nhật tài liệu này theo trạng thái thực tế của repository. Không đánh dấu hoàn thành chỉ dựa trên kế hoạch.

## Trạng thái hiện tại

**Overall status: DESIGN / PRE-DEVELOPMENT**

- Product direction: đã thống nhất trong thiết kế.
- Architecture: bản đề xuất, chờ repository audit.
- Database: chưa xác nhận đã triển khai.
- Application code: chưa xác nhận đã triển khai.
- Historical data: chưa có bộ dữ liệu được nghiệm thu.
- Media permissions: chưa có thư viện ảnh được cấp quyền nghiệm thu.
- Draft/Simulation: chưa triển khai.

## Quyết định đã chốt

- Chỉ Arena of Valor nam, giải quốc tế độc lập.
- Loại HOK, giải nữ và 1v1.
- Player Draft: năm vị trí.
- Player Draft có ba reroll.
- Coach Draft: chỉ Head Coach, chọn một trong ba lựa chọn.
- Hidden Synergy strict, yêu cầu cùng roster/team-season và thời gian giao nhau có bằng chứng.
- Simulation: APL 2026 Main Event.
- MVP bắt đầu từ Swiss Stage 16 đội; Wildcard để giai đoạn sau.
- Playoffs: tám đội, Double Elimination.

## Việc đã hoàn thành trong giai đoạn thiết kế

- [x] Xác định concept Draft & Simulation.
- [x] Chốt phạm vi dữ liệu AoV.
- [x] Chốt Player Draft và Coach Draft.
- [x] Chốt strict Hidden Synergy.
- [x] Chốt hướng mô phỏng APL 2026 Main Event.
- [x] Lập danh sách tài liệu nền tảng cần có.

## Chưa hoàn thành

- [ ] Repository audit.
- [ ] Đối chiếu stack với repository thực tế.
- [ ] Chốt relational schema.
- [ ] Xác minh chi tiết thể thức APL 2026 bằng nguồn chính thức.
- [ ] Xây dựng catalog giải đấu đã xác minh.
- [ ] Thu thập roster lịch sử.
- [ ] Thu thập Head Coach history.
- [ ] Xác minh quyền sử dụng media.
- [ ] Tạo synergy evidence.
- [ ] Triển khai Draft Engine.
- [ ] Triển khai Rating/Synergy Engine.
- [ ] Triển khai Tournament Engine.
- [ ] Kiểm thử end-to-end.

## Issues / Risks

1. Cần xác minh chính xác Swiss pairing, seeding, tiebreaker và format theo từng vòng của APL 2026.
2. Việc MVP bỏ Wildcard nhưng vẫn dùng 16 đội Swiss là rút gọn gameplay; cần ghi rõ trong UI/tài liệu, không tuyên bố mô phỏng đầy đủ vòng loại.
3. Dữ liệu Liquipedia cần được đối chiếu khi thiếu hoặc có mâu thuẫn.
4. Ảnh công khai không đồng nghĩa có quyền tái sử dụng.
5. Dữ liệu roster và Head Coach có thể thiếu mốc thời gian đủ chính xác để xác lập synergy strict.

## Next task

**TASK-001 – Repository audit**

Đọc repository hiện tại, xác định stack, cấu trúc, scripts, database và trạng thái Git. Chỉ báo cáo; không sửa hoặc tạo file.

## Update log

| Ngày | Thay đổi |
|---|---|
| 2026-11-15 | Khởi tạo bộ tài liệu thiết kế. Chưa có task triển khai code nào được nghiệm thu. |

