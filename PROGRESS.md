# AOVDLE – Project Progress

> Cập nhật theo trạng thái thực tế; không đánh dấu hoàn thành khi dữ liệu chưa được kiểm chứng.

## Trạng thái hiện tại

**Overall status: PLAYABLE WEB GAME MVP DEPLOYED & TESTED**

- Đã hoàn thành toàn bộ ứng dụng web AOVDLE chơi được 100% bằng React 19 + TypeScript + Vite + Tailwind CSS.
- Đã chuyển đổi và tích hợp đầy đủ 100% dữ liệu lịch sử từ `data/research/`:
  - 20 kỳ giải quốc tế độc lập Arena of Valor (AWC 2018–2021, AIC 2017–2025, APL 2020–2026).
  - 237 đội tuyển theo mùa giải (Team-Seasons).
  - 212 Head Coaches lịch sử kèm rating và kỳ giải.
  - 1,137 tuyển thủ theo mùa giải (Player Versions) kèm vị trí (DSL, Jungle, Mid, Farm, Support) và chỉ số Rating (75–98).
- Không thêm bất kỳ dữ liệu Honor of Kings (HOK), giải nữ hoặc giải 1v1 nào vào pool game.

---

## Các tính năng đã hoạt động (Verified & Tested)

### 1. Player Draft (5 Vị trí)
- [x] Mỗi lượt rút ngẫu nhiên 3 đội tuyển hợp lệ từ 237 team-seasons lịch sử.
- [x] Chọn 1 đội tuyển để mở danh sách Roster với đầy đủ tên, vị trí, rating và quốc gia.
- [x] Chọn 1 tuyển thủ đưa vào vị trí tương ứng (DSL, Jungle, Mid, Farm, Support).
- [x] Hệ thống Reroll tối đa 3 lần cho toàn phiên Draft (hiển thị `🔄 REROLL (3/3)` kèm đếm ngược).
- [x] Cơ chế kiểm tra trùng lặp: nghiêm cấm chọn trùng cùng một Player Version trong Dream Team.
- [x] Cho phép chọn nhiều tuyển thủ từ cùng một đội tuyển qua các lượt khác nhau.

### 2. Antaris Battlefield Map Draft View (Giao diện Bản đồ Chiến Trường)
- [x] Tích hợp bản đồ Chiến trường Antaris (Overhead Perspective từ ảnh tham khảo).
- [x] Ghim trực tiếp 5 vị trí tuyển thủ (Avatar Pin) theo đúng lane trên bản đồ:
  - **DSL (Caesar Lane / Tà Thần)**: Đường trên (Top).
  - **Jungle (Đi Rừng)**: Rừng trên / bùa xanh/đỏ.
  - **Mid (Đường Giữa)**: Giao điểm trung tâm.
  - **Farm (Đường Rồng / Xạ Thủ)**: Đường dưới (Bot).
  - **Support (Trợ Thủ)**: Khu vực hang rồng / roam.
- [x] Khi chưa chọn: slot hiển thị viền vàng nhấp nháy (pulsing) kèm icon vị trí.
- [x] Khi đã chọn: hiển thị khung tròn chân dung, huy hiệu đội tuyển ở góc trên, tên tuyển thủ, năm thi đấu và chỉ số rating.

### 3. Coach Draft (Head Coach)
- [x] Tự động kích hoạt khi người chơi hoàn thành đủ 5 tuyển thủ.
- [x] Rút ngẫu nhiên 3 Head Coach lịch sử kèm rating và câu lạc bộ từng dẫn dắt.
- [x] Hiển thị trước liên kết Synergy nếu HLV từng dẫn dắt bất kỳ tuyển thủ nào trong Dream Team.
- [x] Chọn 1 HLV trưởng để hoàn tất đội hình (không có lượt reroll riêng cho Coach Draft).

### 4. Dream Team Showcase (Giao diện Đội Hình Huyền Thoại)
- [x] Hiển thị 5 thẻ dọc tuyển thủ (theo bố cục GG WP / Worlds Champions tham khảo) kèm role icon, ảnh, tên, năm, đội tuyển và rating.
- [x] Thẻ Head Coach riêng biệt với chỉ số Tactics.
- [x] Bảng tổng kết sức mạnh:
  - `Điểm Tuyển Thủ Trung Bình`
  - `Coach Bonus` (+1.0 đến +5.0 điểm chiến thuật)
  - `Hidden Synergy Bonus` (+% và điểm cộng)
  - `Tổng Sức Mạnh Đội Hình`
- [x] Hiệu ứng pháo hoa ăn mừng (Confetti animation) khi hoàn tất đội hình.

### 5. Strict Hidden Synergy Engine
- [x] Tuân thủ nghiêm ngặt strict mode:
  - **Player–Player**: 2 tuyển thủ cùng chung `team_id` và `tournament_id` trong cùng kỳ giải quốc tế.
  - **Player–Coach**: Tuyển thủ và Head Coach cùng chung `team_id` và `tournament_id`.
- [x] Cấm tuyệt đối suy luận synergy từ cùng tổ chức khác thời kỳ.
- [x] Tổng buff synergy được giới hạn trần ở mức **5.0%** theo đúng PRD.

### 6. APL 2026 Tournament Simulation
- [x] **16 đội tham gia**: 1 Dream Team của người chơi + 15 đội AI đối thủ được tạo từ các đội tuyển huyền thoại (Bacon Time, Buriram United, Flash Wolves, Talon, Saigon Phantom, Team Flash, ONE Team, BanMei, FULL SENSE, eArena, Deep Cross, Bikertopia, V Gaming, HKA, Kagendra).
- [x] **Swiss Stage**:
  - Mô phỏng từ vòng 1 đến vòng 5.
  - Thắng 3 trận đủ điều kiện vào Playoffs (Qualified).
  - Thua 3 trận bị loại khỏi giải (Eliminated).
  - Trận thường thi đấu Bo3, trận quyết định thi đấu Bo5.
  - Bảng xếp hạng cập nhật trực tiếp sau mỗi vòng kèm hiệu số ván thắng/thua.
- [x] **Playoffs Double Elimination**:
  - 8 đội vượt qua vòng Thụy Sĩ thi đấu nhánh thắng / nhánh thua.
  - Tứ kết nhánh thắng Bo5.
  - Bán kết nhánh thắng, Chung kết nhánh thắng, Bán kết nhánh thua, Chung kết nhánh thua Bo7.
  - Trận Chung kết Tổng (Grand Final) Bo7 giữa Nhà vô địch nhánh thắng và Nhà vô địch nhánh thua.
- [x] **Champion Screen**:
  - Màn hình vinh danh đội vô địch với cúp vàng APL 2026, hiệu ứng ăn mừng pháo hoa, vinh danh MVP và hiển thị toàn bộ 5 tuyển thủ + HLV vô địch.
  - Nút "Chơi Lại Phiên Mới" (Play Again) để bắt đầu lại phiên Draft bất kỳ lúc nào.

---

## Media & Asset Management

- [x] Thư mục tài nguyên:
  - `public/assets/maps/aov_antaris_map.png`: Bản đồ Chiến trường Antaris góc nhìn từ trên cao.
  - `public/assets/placeholders/`: Bộ 8 file SVG vector chuẩn eSports tối màu viền vàng:
    - `role-dsl.svg` (Kiếm Caesar)
    - `role-jungle.svg` (Vuốt đi rừng)
    - `role-mid.svg` (Ngọc phép thuật)
    - `role-farm.svg` (Cung tiễn & hồng tâm)
    - `role-support.svg` (Khiên hộ vệ)
    - `team-logo.svg` (Khiên huy hiệu eSports AOV)
    - `player-portrait.svg` (Chân dung game thủ đeo tai nghe)
    - `coach-portrait.svg` (Chân dung HLV mặc vest đeo kính)
- [x] Hệ thống `src/data/mediaManifest.ts` quản lý metadata bản quyền:
  - `asset_id`, `entity_type`, `entity_id`, `tournament_id`, `year`, `image_url`, `source_url`, `source_name`, `license_type`, `copyright_owner`, `permission_status`, `verification_status`.
  - Mọi hình ảnh chưa có giấy phép thương mại chính thức được đánh dấu rõ ràng là `pending_permission` hoặc sử dụng SVG placeholder trung tính, không hotlink trái phép.

---

## Kết quả kiểm thử & Build

1. **Vitest Unit Tests**:
   - `src/engine/__tests__/synergy.test.ts`: **3/3 passed** (Player-player cùng team-season, loại trừ khác team-season, giới hạn trần 5.0%).
   - `src/engine/__tests__/tournament.test.ts`: **4/4 passed** (Khởi tạo 15 AI teams, Swiss 16 đội, 8 đội vào Playoffs, Double Elimination đến Champion).
   - `src/engine/__tests__/draft.test.ts`: **6/6 passed** (Khởi tạo 3 đội, 3 rerolls, chặn trùng tuyển thủ, chuyển sang Coach Draft khi đủ 5 vị trí).
   - **Tổng cộng: 13/13 tests passed 100%!**

2. **TypeScript Compilation**:
   - `npx tsc --noEmit`: **0 lỗi** (Strict typecheck thành công).

3. **Vite Production Build**:
   - `npm run build`: **Thành công 100% trong 6.61s**.
   - Output bundle tại thư mục `dist/`.
