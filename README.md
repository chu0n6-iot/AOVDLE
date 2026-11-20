# AOVDLE – Arena of Valor Draft & Simulation

> Build your Dream Team. Choose your Coach. Rewrite your history.

🎮 **Chơi bản Web Online:** [https://chu0n6-iot.github.io/AOVDLE/](https://chu0n6-iot.github.io/AOVDLE/)  
📱 **Tài liệu Kế hoạch iOS:** [IOS_DEVELOPMENT_PLAN.md](file:///c:/Users/letro/AOVDLE/IOS_DEVELOPMENT_PLAN.md)  
🤝 **Hướng dẫn Đóng góp Sự kiện:** [CONTRIBUTING.md](file:///c:/Users/letro/AOVDLE/CONTRIBUTING.md)  
📂 **Kho Dữ liệu Giải đấu:** [src/data/](file:///c:/Users/letro/AOVDLE/src/data/)

---

## 1. Giới thiệu

**AOVDLE** là web game Draft & Tournament Simulation lấy cảm hứng từ lịch sử thi đấu thể thao điện tử Arena of Valor (Liên Quân Mobile) đỉnh cao qua các kỳ AWC, AIC và APL.

🎲 **Cảm hứng:** AOVDLE gửi lời cảm ơn đến [LoLdle](https://loldle.net/) và [Wordle](https://www.nytimes.com/games/wordle/index.html) — hai tựa game truyền cảm hứng cho tinh thần đoán, thử lại và chinh phục mỗi phiên chơi.

Người chơi xây dựng đội hình Dream Team từ các thế hệ tuyển thủ từng tham dự giải đấu quốc tế, lựa chọn một Head Coach chiến lược và đưa đội hình tham gia giải đấu giả lập quốc tế APL 2026.

### Điểm đặc biệt của AOVDLE:
- **Tuyển thủ theo từng mùa giải lịch sử:** Mỗi tuyển thủ sở hữu ảnh thi đấu thực tế, chỉ số sức mạnh theo năm đỉnh cao và thông số vai trò chi tiết.
- **Head Coach & Chiến thuật:** Tuyển chọn HLV trưởng với các trường phái chiến thuật riêng biệt (Kiểm soát mục tiêu, Snowball đầu trận, Giao tranh tổng cuối trận...).
- **Hidden Synergy:** Kích hoạt hệ số buff ẩn khi tái hợp những đồng đội hoặc thầy trò từng cùng chung màu áo lịch sử.
- **Realistic Esports Simulation:** Mô phỏng từng ván đấu (Match-by-match) với timeline thời gian thực (First Blood, Rồng ánh sáng, Tà thần Caesar, Lật kèo, Quét sạch, Phá vỡ Nhà chính).
- **Hệ thống FMVP giải đấu:** Vinh danh Tuyển thủ xuất sắc nhất giải đấu dựa trên số lần MVP ván, KDA toàn giải, tỷ lệ tham gia hạ gục (KP%) và phong độ đỉnh cao.
- **Thiết kế Responsive Fullscreen (100dvh):** Tối ưu hóa trải nghiệm trên Desktop/Laptop ngang và Điện thoại di động (Dọc & Ngang), loại bỏ thanh cuộn trang toàn cục phiền toái.

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

### 3.4. Hướng dẫn nhanh cho người mới

1. **Bắt đầu Draft:** Mỗi lượt chọn một trong ba đội được rút ra, sau đó chọn tuyển thủ cho vị trí đang thiếu.
2. **Hoàn thiện đội hình:** Lấp đủ 5 vị trí DSL, Jungle, Mid, Farm và Support. Bạn có tối đa 3 lần Reroll trong Player Draft.
3. **Chọn HLV:** Sau 5 tuyển thủ, chọn 1 trong 3 Head Coach được đưa ra.
4. **Vào giải:** Đưa Dream Team vào Swiss Stage 16 đội. Thắng 3 trận để đi tiếp, thua 3 trận sẽ bị loại.
5. **Theo dõi trận đấu:** Mở từng trận ở Swiss hoặc Playoffs để xem từng BO, từng ván, timeline sự kiện và MVP.
6. **Chơi lại:** Nhấn **Chơi lại** bất cứ lúc nào để tạo ngay một phiên Draft mới.

**GL HF!** Hãy thử nhiều cách kết hợp tuyển thủ, tận hưởng diễn biến trận đấu và viết lại lịch sử theo cách của bạn.

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

## 12. Current Project Status & Deployment

**Status: v2.1.0 — BIG UPDATE: REALISTIC ESPORTS SIMULATION & RESPONSIVE FULLSCREEN**

- [x] AoV International Historical Data (AWC, AIC, APL).
- [x] Male Players & Head Coaches from Saigon Phantom, Team Flash, Talon, Bacon Time, Buriram United, Flash Wolves, ONE Team, MAD Team, Bikertopia...
- [x] Interactive Battlefield Map (Antaris) & 5-position Player Draft.
- [x] Head Coach Draft & Tactical Identity Buffs.
- [x] Strict Historical Hidden Synergy Engine.
- [x] Dynamic Player Form (Excellent, Strong, Stable, Inconsistent, Poor).
- [x] Match-by-Match Realistic Simulation Engine with Timeline Events & Live Scoreboard.
- [x] Full APL 2026 Tournament Format: Swiss Stage (16 teams) -> Double Elimination Playoffs (8 teams).
- [x] Tournament FMVP Award Selection & Trophy Celebration.
- [x] Responsive Fullscreen (100dvh) without awkward outer page scrolling across Desktop, Mobile Portrait & Mobile Landscape.
- [x] GitHub Pages SPA Routing (`404.html`), `.nojekyll`, and automated dual deployment workflow.

### Hướng dẫn Kích hoạt GitHub Pages trên Repository

Để đưa website lên online tại `https://chu0n6-iot.github.io/AOVDLE/`, thực hiện các bước sau trên GitHub:

1. Mở trang quản trị kho chứa trên trình duyệt: **GitHub Repository -> Settings**.
2. Tại thanh điều hướng bên trái, chọn tab **Pages** (thuộc mục *Code and automation*).
3. Tại phần **Build and deployment -> Source**, bạn có thể chọn một trong hai phương thức:
   - **Phương thức 1 (Khuyên dùng - GitHub Actions):** Chọn `GitHub Actions`. Khi push code mới lên nhánh `main`, quy trình `.github/workflows/deploy.yml` sẽ tự động đóng gói và xuất bản.
   - **Phương thức 2 (Deploy from a branch):** Chọn `Deploy from a branch`, chọn nhánh `gh-pages` và thư mục `/ (root)`, sau đó nhấn **Save**.
4. Chờ 1–2 phút cho GitHub xuất bản. Website sẽ chính thức hoạt động tại:  
   👉 **`https://chu0n6-iot.github.io/AOVDLE/`**

---

   ## 13. Cảm hứng & lời cảm ơn

   AOVDLE được xây dựng với tinh thần khám phá và chơi lại nhiều lần. Xin shout-out đến:

   - [LoLdle](https://loldle.net/) — cảm hứng cho trải nghiệm thử thách kiến thức game và cảm giác muốn đoán thêm một lượt.
   - [Wordle](https://www.nytimes.com/games/wordle/index.html) — cảm hứng cho vòng lặp đơn giản, dễ bắt đầu nhưng khuyến khích quay lại.

   Đây là những nguồn cảm hứng về tinh thần trải nghiệm; AOVDLE có gameplay, dữ liệu lịch sử và mô phỏng giải đấu riêng.

*AOVDLE – Build your Dream Team. Rewrite your history.*
