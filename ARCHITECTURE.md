# AOVDLE – Architecture

## 1. Mục tiêu kiến trúc

Tách dữ liệu lịch sử, Draft, rating/synergy, tournament simulation và giao diện. UI không tự tính luật game; simulation không sửa dữ liệu lịch sử.

## 2. Stack dự kiến

- Frontend: React + TypeScript.
- Styling: Tailwind CSS.
- Backend/database: Supabase + PostgreSQL.
- Storage: Supabase Storage hoặc nhà cung cấp khác, chỉ lưu ảnh được phép sử dụng.
- Hosting dự kiến: Vercel.
- Version control: Git + GitHub.

Đây là lựa chọn kiến trúc dự kiến, cần khảo sát repository hiện có trước khi áp dụng. Không thay stack hiện tại nếu chưa có đánh giá và phê duyệt.

## 3. Các module logic

### Data Foundation
Quản lý tournament, editions, teams, team seasons, players, player versions, roster, coaches, media, sources và verification.

### Draft Engine
- Lấy pool team-season hợp lệ.
- Rút ba lựa chọn.
- Quản lý ba reroll.
- Lấy roster theo đúng team-season.
- Kiểm tra vị trí và trùng Player Version.
- Thực hiện Coach Draft.

### Team Intelligence
- Player rating.
- Coach rating.
- Tính synergy từ evidence đã xác minh.
- Tính tổng sức mạnh theo cấu hình versioned.

### Tournament Engine
- Khởi tạo 16 đội.
- Swiss pairing và standings.
- Qualification/elimination.
- Playoffs Double Elimination.
- Match/game simulation.

### Game Interface
Hiển thị Draft, roster, Dream Team, coach, synergy reveal, standings, bracket, match center và Champion.

## 4. Luồng dữ liệu

1. Nguồn đáng tin cậy được ghi vào `data_sources`.
2. Dữ kiện được nhập vào các bảng lịch sử.
3. `verification_records` lưu trạng thái và bằng chứng.
4. Chỉ dữ liệu đạt điều kiện mới được đưa vào pool Draft/AI.
5. Draft lưu các candidate và pick.
6. Team Intelligence tính rating và synergy dựa trên snapshot dữ liệu.
7. Tournament Engine nhận snapshot đội hình, rating, luật và random seed.
8. Kết quả được lưu trong các bảng `simulation_*`, không cập nhật bảng lịch sử.

## 5. Database domain model

### Historical entities
- `players`: danh tính tuyển thủ.
- `teams`: danh tính tổ chức/đội.
- `tournaments`: giải đấu.
- `tournament_editions`: từng kỳ giải.
- `team_seasons`: đội hình/đội theo mùa hoặc giai đoạn.
- `player_versions`: phiên bản tuyển thủ gắn với team-season và thời gian.
- `roster_members`: thành viên roster, vị trí và khoảng thời gian.
- `tournament_entries`: đội tham dự từng kỳ giải.
- `tournament_roster_members`: roster đăng ký ở từng kỳ giải.

### Coach entities
- `coaches`: danh tính HLV.
- `coach_versions`: phiên bản HLV gắn với team-season và thời gian.
- `tournament_coach_entries`: HLV đăng ký theo kỳ giải.
- `coach_achievements`: thành tích đã xác minh.

### Sources and media
- `data_sources`: URL/tên nguồn, loại nguồn, ngày truy cập.
- `verification_records`: entity, field/fact, trạng thái, người kiểm tra, bằng chứng.
- `media_assets`: file/URL, chủ thể, mùa, nguồn, metadata.
- `media_permissions`: chủ sở hữu, giấy phép, phạm vi sử dụng, bằng chứng cấp quyền.

### Synergy
- `synergy_rules`: loại liên kết, điều kiện và hiệu ứng.
- `player_synergy_evidence`: hai Player Version, team-season, khoảng thời gian và nguồn.
- `coach_synergy_evidence`: Player Version, Coach Version, team-season, khoảng thời gian và nguồn.
- `synergy_effects`: cấu hình bonus theo phiên bản luật.

### Draft and simulation
- `draft_sessions`, `draft_rounds`, `draft_candidates`, `draft_picks`.
- `player_ratings`, `coach_ratings`, `rating_configs`.
- `simulation_sessions`, `simulation_teams`, `simulation_matches`, `simulation_games`.
- `simulation_synergy_activations`.

## 6. Khóa và ràng buộc quan trọng

- Mọi bảng dùng primary key ổn định, ưu tiên UUID.
- Foreign key bảo đảm quan hệ lịch sử.
- `player_versions` phải tham chiếu một `team_season` cụ thể; nếu một tuyển thủ đổi đội, tạo version/assignment mới, không ghi đè lịch sử.
- `roster_members` có unique constraint phù hợp để tránh cùng một player version bị thêm trùng vào cùng roster.
- `draft_picks` có unique constraint cho cùng Player Version trong một draft session.
- Mỗi Dream Team phải có đúng năm role slot khác nhau và một Head Coach.
- Synergy chỉ được tạo từ evidence đã xác minh.
- Khoảng thời gian dùng dạng `[start_date, end_date)` hoặc quy ước nhất quán; không cho khoảng thời gian rỗng/âm.
- `simulation_*` không có quyền ghi vào bảng historical.
- Pool chỉ lấy dữ liệu có trạng thái verified và đủ điều kiện phạm vi.

## 7. Strict Synergy validation

Player–Player:
1. Hai Player Version có cùng `team_season_id`.
2. Khoảng thời gian thi đấu giao nhau.
3. Có roster evidence được xác minh.
4. `synergy_rule` đang bật.

Player–Coach:
1. Player Version và Coach Version có cùng `team_season_id`.
2. Khoảng thời gian làm việc giao nhau.
3. Vai trò của Coach Version là Head Coach.
4. Có evidence đã xác minh.

Không suy ra quan hệ từ tên tổ chức hoặc cùng năm đơn thuần.

## 8. Tournament configuration

Không hardcode thể thức vào UI. Tạo cấu hình theo edition, tối thiểu gồm:
- Số đội.
- Số Swiss rounds tối đa.
- Điều kiện thắng/thua để qualify/eliminate.
- Swiss pairing constraints.
- Tiebreaker.
- Số đội vào playoffs.
- Bracket type.
- Match format theo từng round.
- Quy tắc Grand Final.
- Phiên bản nguồn và trạng thái xác minh.

APL 2026 Main Event là mục tiêu cấu hình. Các thông số chi tiết, pairing, seeding, tiebreaker và luật trận phải được kiểm chứng từ nguồn chính thức trước khi đóng băng cấu hình. MVP bỏ Wildcard và đưa 16 đội trực tiếp vào Swiss; đây là rút gọn đầu vào của game, không phải tái hiện toàn bộ vòng loại thực tế.

## 9. Cấu trúc thư mục mục tiêu

```text
/
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── DESIGN.md
│   ├── RULES.md
│   ├── TASKS.md
│   └── PROGRESS.md
├── src/
│   ├── data/
│   ├── draft/
│   ├── coach/
│   ├── synergy/
│   ├── rating/
│   ├── tournament/
│   └── components/
├── database/
│   ├── migrations/
│   └── seed/
├── public/
│   └── assets/
└── README.md
```

Đây là cấu trúc mục tiêu tham khảo. Phải khảo sát repository trước khi tạo hoặc di chuyển thư mục.

## 10. Quyết định chưa khóa

- Phiên bản framework và dependency thực tế sau repository audit.
- Supabase project/environment và chính sách bảo mật.
- Chi tiết APL 2026 pairing, seeding, tiebreaker, match formats.
- Cách chọn 15 AI teams và xử lý thiếu dữ liệu.
- Công thức rating và trọng số chính thức.
- Nhà cung cấp ảnh và giấy phép cụ thể.
