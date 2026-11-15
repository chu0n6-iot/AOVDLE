# AOVDLE – Arena of Valor Draft & Simulation

> Build your Dream Team. Choose your Coach. Rewrite your history.

## 1. Giới thiệu

**AOVDLE** là web game Draft & Tournament Simulation lấy cảm hứng từ lịch sử thi đấu chuyên nghiệp của Arena of Valor (Liên Quân Mobile).

Người chơi xây dựng đội hình Dream Team từ các thế hệ tuyển thủ từng tham dự giải đấu quốc tế, lựa chọn một Head Coach và đưa đội hình tham gia giải đấu giả lập.

Điểm đặc biệt của AOVDLE:
- Tuyển thủ có phiên bản riêng theo từng mùa giải.
- Ảnh tuyển thủ theo đúng thời kỳ thi đấu.
- Có thể lựa chọn Head Coach.
- Hidden Synergy giữa những tuyển thủ từng thi đấu chung đội.
- Tournament Simulation dựa trên thể thức APL 2026.

## 2. Phạm vi dự án

### Bao gồm
- Arena of Valor (AoV).
- Các giải quốc tế AoV độc lập như AIC, APL, AWC.
- Tuyển thủ nam.
- Head Coach.
- Lịch sử đội tuyển và roster.
- Thành tích thi đấu quốc tế.

### Không bao gồm
- Honor of Kings (HOK).
- Giải đấu nữ.
- Giải đấu 1v1.
- Giải đấu kết hợp nhiều tựa game có nội dung HOK.

**Nguyên tắc:** Chỉ dữ liệu được xác minh là thuộc Arena of Valor mới được đưa vào game.

## 3. Gameplay

### 3.1. Player Draft

Mỗi lượt:
1. Hệ thống chọn ngẫu nhiên 3 đội tuyển từ lịch sử các giải quốc tế.
2. Người chơi chọn một đội.
3. Hệ thống hiển thị roster của đội theo mùa giải.
4. Người chơi chọn một tuyển thủ để đưa vào Dream Team.

Quy tắc:
- Có 3 lần Reroll mỗi phiên chơi.
- Hoàn thành 5 vị trí: DSL, Jungle, Mid, Farm, Support.
- Không được chọn trùng một Player Version.
- Có thể chọn nhiều tuyển thủ từ cùng một đội tuyển.
- Mỗi phiên bản tuyển thủ theo mùa được xem là một thực thể riêng.

### 3.2. Coach Draft

Sau khi hoàn thành 5 vị trí:

1. Hệ thống đưa ra 3 Head Coach ngẫu nhiên.
2. Người chơi lựa chọn một người.
3. Head Coach trở thành thành viên thứ sáu của Dream Team.

MVP chỉ hỗ trợ Head Coach chính thức. Assistant Coach chưa nằm trong pool lựa chọn.

### 3.3. Hidden Synergy

AOVDLE có hệ thống buff ẩn dựa trên lịch sử thi đấu thực tế.

Các liên kết:
- Player–Player: Hai tuyển thủ từng cùng roster.
- Player–Coach: Tuyển thủ từng được huấn luyện bởi Head Coach trong cùng giai đoạn.

Điều kiện:
- Phải xác minh được lịch sử chung.
- Phải có thời gian thi đấu giao nhau.
- Không tính hai người chỉ từng thuộc cùng tổ chức nhưng khác thời kỳ.
- Không tự tạo quan hệ dựa trên suy đoán.

Buff được kích hoạt tự động trong Simulation.

Tổng bonus synergy dự kiến giới hạn ở mức 5% trong giai đoạn thử nghiệm. Giá trị chính thức sẽ được điều chỉnh qua kiểm thử cân bằng.

## 4. Tournament Simulation

### Chuẩn thể thức

APL 2026 Main Event.

MVP bắt đầu trực tiếp từ Swiss Stage, chưa triển khai Wildcard.

### Swiss Stage
- 16 đội.
- 1 Dream Team và 15 đội AI.
- Tối đa 5 vòng.
- 3 trận thắng để đi tiếp.
- 3 trận thua bị loại.
- Trận thông thường Bo3.
- Trận quyết định Bo5.
- 8 đội vào Playoffs.

### Playoffs
- 8 đội.
- Double Elimination.
- Vòng đầu Bo5.
- Các vòng còn lại Bo7.
- Grand Final Bo7.

Các thông số và quy tắc xếp hạt giống phải được đối chiếu với tài liệu giải đấu trước khi triển khai chính thức.

## 5. Rating System

Sức mạnh Dream Team được tính từ:

- Player Rating.
- Coach Rating.
- Team Chemistry.
- Hidden Synergy.

Công thức tổng quát:

`Team Strength = Player Strength + Coach Bonus + Synergy Bonus`

Các trọng số phải được quản lý bằng cấu hình, không hardcode trong giao diện.

Mục tiêu là tạo ra một hệ thống trong đó đội hình có rating cao chưa chắc chắn chiến thắng.

## 6. Historical Data Foundation

Dữ liệu lịch sử là nền tảng quan trọng nhất của AOVDLE.

### Player Database
Lưu trữ:
- Player ID.
- Tên thi đấu.
- Bí danh.
- Quốc gia.
- Lịch sử thi đấu.

### Player Versions
Mỗi tuyển thủ có thể có nhiều phiên bản theo mùa và đội tuyển.

Ví dụ:
- Player A – Team X – 2022.
- Player A – Team Y – 2024.

Hai phiên bản được quản lý độc lập.

### Team Database
Lưu trữ:
- Team ID.
- Tên đội.
- Tên viết tắt.
- Khu vực.
- Lịch sử tham dự giải.

### Roster Database
Lưu trữ:
- Đội tuyển.
- Mùa giải.
- Tuyển thủ.
- Vị trí.
- Thời gian tham gia.
- Nguồn xác minh.

### Coach Database
Lưu trữ:
- Coach ID.
- Tên.
- Quốc gia.
- Đội tuyển từng dẫn dắt.
- Mùa giải.
- Thành tích.
- Rating.

### Media Database
Lưu trữ:
- Ảnh tuyển thủ.
- Ảnh huấn luyện viên.
- Phiên bản theo mùa.
- URL nguồn.
- Chủ sở hữu bản quyền.
- Giấy phép sử dụng.
- Trạng thái kiểm duyệt.

## 7. Database Architecture

Các nhóm bảng dự kiến:

| Nhóm | Bảng |
|---|---|
| Players | players, player_versions |
| Teams | teams, team_seasons |
| Tournaments | tournaments, tournament_editions, tournament_entries |
| Rosters | roster_members, tournament_roster_members |
| Coaches | coaches, coach_versions, coach_achievements |
| Media | media_assets, media_permissions |
| Sources | data_sources, verification_records |
| Synergy | synergy_rules, player_synergy_evidence, coach_synergy_evidence |
| Draft | draft_sessions, draft_rounds, draft_candidates, draft_picks |
| Ratings | player_ratings, coach_ratings |
| Simulation | simulation_sessions, simulation_teams, simulation_matches, simulation_games |
| Effects | simulation_synergy_activations |

Database sử dụng PostgreSQL với quan hệ và khóa ngoại rõ ràng.

## 8. Technology Stack

| Thành phần | Công nghệ dự kiến |
|---|---|
| Frontend | React |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Backend | Supabase |
| Database | PostgreSQL |
| Image Storage | Supabase Storage hoặc dịch vụ được cấp quyền |
| Hosting | Vercel |
| Version Control | Git + GitHub |

## 9. Architecture Modules

Dự án được chia thành 5 module chính:

1. **Data Foundation**
   - Historical Database.
   - Player & Coach Management.
   - Media Management.
   - Data Verification.

2. **Draft Engine**
   - Team Draft.
   - Player Selection.
   - Reroll.
   - Coach Draft.

3. **Team Intelligence**
   - Player Rating.
   - Coach Rating.
   - Team Chemistry.
   - Hidden Synergy.

4. **Tournament Engine**
   - Swiss Stage.
   - Playoffs.
   - Match Simulation.
   - Tournament Results.

5. **Game Interface**
   - Draft Screen.
   - Dream Team.
   - Match Center.
   - Tournament Bracket.
   - Champion Screen.

## 10. Development Roadmap

### Phase 1 – Repository & Data Foundation
- Khảo sát repository.
- Thiết kế database.
- Chuẩn hóa ID.
- Xây dựng nguồn dữ liệu lịch sử.

### Phase 2 – Historical Data Collection
- Thu thập đội tuyển.
- Thu thập tuyển thủ.
- Thu thập Head Coach.
- Xác minh roster.
- Thu thập và kiểm tra quyền sử dụng ảnh.

### Phase 3 – Draft Engine
- Player Draft.
- Reroll.
- Coach Draft.
- Dream Team Management.

### Phase 4 – Rating & Synergy
- Rating System.
- Coach Bonus.
- Hidden Synergy.
- Team Strength Calculation.

### Phase 5 – Tournament Engine
- Swiss Stage.
- Double Elimination.
- Match Simulation.
- Tournament Results.

### Phase 6 – Frontend & Release
- Hoàn thiện giao diện.
- Animation.
- Kiểm thử.
- Tối ưu.
- Phát hành MVP.

## 11. Development Principles

- Không tạo dữ liệu lịch sử bằng suy đoán.
- Không sử dụng ảnh khi chưa xác minh quyền sử dụng.
- Không ghi đè lịch sử tuyển thủ khi thay đổi đội.
- Không kích hoạt synergy nếu thiếu bằng chứng.
- Không trộn dữ liệu AoV và HOK.
- Không ghi kết quả giả lập vào lịch sử thi đấu thật.
- Tách biệt Data, Draft, Rating và Simulation.
- Mỗi giai đoạn phải được kiểm thử trước khi tiếp tục.

## 12. Current Project Status

**Status: DESIGN / PRE-DEVELOPMENT**

Các quyết định sản phẩm đã được thống nhất:

- [x] AoV International Scope.
- [x] Male Players Only.
- [x] Exclude HOK.
- [x] Player Draft – 5 Positions.
- [x] Coach Draft – Head Coach.
- [x] 3 Rerolls.
- [x] Strict Hidden Synergy.
- [x] APL 2026 Main Event Simulation.
- [x] Wildcard Deferred.

Chưa triển khai code ứng dụng.

**Next Step:** Repository Audit & Data Foundation Planning.

---

*AOVDLE – Build your Dream Team. Rewrite your history.*
