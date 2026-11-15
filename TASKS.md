# AOVDLE – Development Tasks

## Quy tắc

- Thực hiện tuần tự, một task tại một thời điểm.
- Không bắt đầu task tiếp theo khi task trước chưa nghiệm thu.
- Không viết code trong các task chỉ yêu cầu audit/thiết kế.
- Cập nhật `PROGRESS.md` sau khi có kết quả thực tế.

## Phase 0 – Project audit

### TASK-001: Repository audit
- Đọc README và tài liệu dự án.
- Kiểm tra stack, cấu trúc thư mục, package scripts, database và trạng thái Git.
- Không sửa hoặc tạo file.
- Đầu ra: báo cáo hiện trạng, rủi ro và đề xuất.

**Acceptance:** báo cáo dựa trên repository thực tế; không giả định stack hoặc database chưa tồn tại.

### TASK-002: Architecture reconciliation
- So sánh repository với `ARCHITECTURE.md`.
- Liệt kê điểm phù hợp, thiếu và xung đột.
- Đề xuất thay đổi tối thiểu.

**Acceptance:** có phương án được duyệt trước khi sửa cấu trúc.

## Phase 1 – Data Foundation

### TASK-003: Final relational schema
- Chốt entity, primary key, foreign key, unique/check constraints.
- Chốt quy ước thời gian và trạng thái verification.
- Chưa nhập dữ liệu thật.

**Acceptance:** schema hỗ trợ player versions, team seasons, roster theo giải, coach versions, media rights và strict synergy evidence.

### TASK-004: Database migrations
- Tạo migration theo schema đã duyệt.
- Không tự thêm dữ liệu chưa xác minh.

**Acceptance:** migration chạy được ở môi trường phát triển và có hướng rollback.

### TASK-005: Data verification workflow
- Quy định trạng thái pending, verified, rejected.
- Quy định nguồn và bằng chứng tối thiểu.

**Acceptance:** dữ liệu chưa verified không lọt vào pool Draft/AI.

## Phase 2 – Historical data

### TASK-006: Tournament catalog
- Lập danh sách giải AoV quốc tế độc lập.
- Loại HOK, giải nữ, 1v1 và nội dung liên tựa game không tách được.
- Xác minh từng edition.

**Acceptance:** mỗi giải có game title, nguồn và trạng thái xác minh.

### TASK-007: Teams and team seasons
- Chuẩn hóa tên đội, alias, khu vực và thời kỳ.

**Acceptance:** không tạo bản ghi trùng do khác cách viết tên.

### TASK-008: Player versions and rosters
- Thu thập tuyển thủ, role, team-season, khoảng thời gian.
- Ghi roster đăng ký theo từng kỳ giải.

**Acceptance:** mỗi bản ghi có nguồn; không suy đoán vị trí hoặc thời gian.

### TASK-009: Head Coach history
- Thu thập Head Coach theo team-season và kỳ giải.

**Acceptance:** phân biệt Head Coach với Assistant Coach; có bằng chứng.

### TASK-010: Media rights
- Kiểm tra ảnh tuyển thủ, HLV, logo.
- Ghi ch�� sở hữu và giấy phép.

**Acceptance:** chỉ asset có quyền phù hợp mới được xuất bản.

### TASK-011: Strict synergy evidence
- Tạo liên kết Player–Player và Player–Coach từ roster/time overlap đã xác minh.

**Acceptance:** kiểm thử được trường hợp cùng tổ chức nhưng khác thời kỳ không tạo synergy.

## Phase 3 – Draft

### TASK-012: Player Draft domain logic
- Rút ba team-season.
- Chọn player version và role.
- Giới hạn ba reroll.

**Acceptance:** không trùng Player Version; đủ năm role; test các trường hợp pool thiếu.

### TASK-013: Coach Draft domain logic
- Rút ba Head Coach.
- Chọn một coach.
- Không có reroll riêng.

**Acceptance:** chỉ Head Coach đủ điều kiện xuất hiện.

### TASK-014: Draft UI
- Team cards, roster cards, role slots, reroll counter và coach selection.

**Acceptance:** responsive và mọi trạng thái được thể hiện rõ.

## Phase 4 – Team Intelligence

### TASK-015: Rating model
- Định nghĩa rating scale, data inputs và versioned configuration.

**Acceptance:** công thức có test, không hardcode trong UI.

### TASK-016: Synergy engine
- Tính buff từ evidence hợp lệ.
- Áp dụng cap cấu hình.

**Acceptance:** không kích hoạt từ dữ liệu unverified; có test boundary.

### TASK-017: Team strength snapshot
- Tính sức mạnh Dream Team và lưu snapshot cho simulation.

**Acceptance:** kết quả có thể tái lập theo rating config version.

## Phase 5 – Tournament

### TASK-018: Verify APL 2026 rules
- Xác minh Swiss pairing, seeding, tiebreaker, match format và bracket từ nguồn chính thức.
- Lưu nguồn và ngày kiểm tra.

**Acceptance:** có tournament config được duyệt; mọi điểm chưa rõ được đánh dấu.

### TASK-019: AI teams
- Tạo 15 đối thủ AI từ dữ liệu lịch sử đủ điều kiện.

**Acceptance:** mỗi AI team đủ roster/role và có nguồn.

### TASK-020: Swiss engine
- Pairing, standings, 3-win qualification, 3-loss elimination theo config.

**Acceptance:** không rematch nếu luật cấm; dừng đúng điều kiện; test nhiều seed.

### TASK-021: Double Elimination engine
- Tạo nhánh thắng/nhánh thua và xử lý loại.

**Acceptance:** bracket hợp lệ, không đội nào bị loại hai lần hoặc quay lại sai nhánh.

### TASK-022: Match simulation
- Mô phỏng từng game theo rating và format.
- Lưu seed, config và kết quả.

**Acceptance:** series dừng đúng số game cần thiết và kết quả có thể tái lập.

## Phase 6 – Release

### TASK-023: Tournament UI
- Swiss table, schedule, match center, bracket và champion screen.

### TASK-024: End-to-end testing
- Kiểm thử từ bắt đầu Draft đến Champion.

### TASK-025: MVP release
- Kiểm tra bảo mật, quyền ảnh, lỗi và deployment.

## Deferred

- Wildcard.
- Multiplayer.
- User accounts/cloud save.
- Online leaderboard.
- Assistant Coach.
- Full hero ban/pick simulation.
- Women's competitions, 1v1 và HOK.

## Research follow-up

### TASK-026: Reconcile historical research data
- Đối chiếu CSV hiện có từ 2019 trở đi với event-specific Liquipedia pages.
- Đưa dữ liệu partial/unverified vào trạng thái quarantine; không cho vào game pool.
- Sửa quan hệ ID / roster / player rows và phát hiện duplicate hoặc missing references.

**Acceptance:** coverage manifest phản ánh từng edition; không ghi nhận full verification nếu chưa có chứng cứ trường-by-trường.

### TASK-027: Build playable web MVP
- Chưa bắt đầu: repo hiện tại không có application source, package manager manifest, scripts hay test setup.
- Thực hiện sau khi stack/runtime được duyệt hoặc được cung cấp trong workspace có thể kiểm tra.

**Acceptance:** build/test chạy thực tế, dữ liệu dùng theo nguồn hiện có, không có mock historical players.
