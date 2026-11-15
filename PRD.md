# AOVDLE – Product Requirements Document

> Build your Dream Team. Choose your Coach. Rewrite esports history.

## 1. Tổng quan

AOVDLE là web game Draft & Tournament Simulation lấy cảm hứng từ lịch sử thi đấu chuyên nghiệp của Arena of Valor (Liên Quân Mobile). Người chơi chọn năm tuyển thủ từ các đội hình lịch sử, chọn một Head Coach, sau đó thi đấu trong giải đấu giả lập.

## 2. Mục tiêu sản phẩm

- Tạo trải nghiệm xây dựng Dream Team từ nhiều thế hệ tuyển thủ AoV.
- Tôn trọng lịch sử: mỗi tuyển thủ gắn với đội, mùa và roster cụ thể.
- Tạo chiều sâu chiến thuật bằng Coach Draft và Hidden Synergy.
- Cho phép người chơi theo dõi hành trình từ Draft đến chức vô địch.
- Tách biệt hoàn toàn dữ liệu esports lịch sử và kết quả mô phỏng.

## 3. Đối tượng người dùng

- Người hâm mộ Arena of Valor/esports Liên Quân.
- Người quan tâm lịch sử đội tuyển, tuyển thủ và huấn luyện viên.
- Người thích fantasy draft, quản lý đội hình và mô phỏng giải đấu.

## 4. Phạm vi dữ liệu

### Bao gồm
- Giải đấu quốc tế độc lập của Arena of Valor, ví dụ AIC, APL, AWC và các giải khác sau khi xác minh.
- Tuyển thủ nam.
- Head Coach.
- Đội tuyển, roster, mùa giải, thành tích và ảnh có quyền sử dụng.

### Loại trừ
- Honor of Kings (HOK).
- Giải đấu nữ.
- Giải 1v1.
- Giải đấu kết hợp nhiều tựa game nếu dữ liệu không thể tách riêng phần AoV.
- Dữ liệu không xác minh được game title hoặc tư cách tham dự.

**Lưu ý:** Liquipedia có thể tổ chức trang AoV trong wiki mang tên Honor of Kings. Phải phân loại theo tựa game thực tế của giải, không phân loại chỉ theo tên wiki.

## 5. Gameplay requirements

### 5.1 Player Draft
1. Hệ thống rút ngẫu nhiên ba team-season hợp lệ, không trùng nhau trong cùng lượt.
2. Người chơi chọn một đội.
3. Hiển thị các tuyển thủ thuộc roster của đội ở mùa/kỳ giải tương ứng.
4. Người chơi chọn một tuyển thủ phù hợp một trong năm vị trí.
5. Lặp lại đến khi đủ năm vị trí.

Năm vị trí:
- DSL / Caesar Lane
- Jungle
- Mid
- Farm Lane
- Support

Quy tắc:
- Tối đa ba lần reroll cho toàn phiên Draft tuyển thủ.
- Không được chọn trùng cùng một Player Version.
- Có thể chọn nhiều tuyển thủ từ cùng một đội.
- Một tuyển thủ ở các mùa/đội khác nhau là các Player Version riêng.
- Không cho chọn phiên bản không có roster evidence hợp lệ.

### 5.2 Coach Draft
- Chỉ diễn ra sau khi hoàn thành năm vị trí.
- Rút ba Head Coach hợp lệ.
- Người chơi chọn một Head Coach.
- MVP không có reroll riêng cho Coach Draft.
- Assistant Coach không thuộc pool MVP.

### 5.3 Hidden Synergy – strict
Các liên kết MVP:
- Player–Player: hai Player Version cùng thuộc một roster/team-season và có thời gian thi đấu giao nhau.
- Player–Coach: Head Coach và Player Version cùng làm việc trong một team-season, có thời gian giao nhau và có bằng chứng.

Không kích hoạt synergy chỉ vì hai người từng thuộc cùng tổ chức ở hai thời kỳ khác nhau. Chỉ dữ liệu đã xác minh mới được dùng. Bonus ban đầu tối đa +5% là tham số cân bằng thử nghiệm, không phải dữ kiện lịch sử.

### 5.4 Simulation
- Một Dream Team và 15 đối thủ AI tạo thành 16 đội Swiss.
- MVP bắt đầu trực tiếp tại Swiss Stage; không mô phỏng Wildcard.
- Tám đội vượt qua Swiss vào Playoffs.
- Playoffs sử dụng Double Elimination.
- Cấu hình Bo3/Bo5/Bo7 phải lấy từ cấu hình giải đã được xác minh và lưu riêng, không hardcode rải rác trong ứng dụng.

## 6. MVP scope

### Bắt buộc
- Historical Data Foundation.
- Player Draft và ba reroll.
- Coach Draft với Head Coach.
- Rating cơ bản.
- Strict Hidden Synergy.
- Tạo 15 đối thủ AI đủ dữ liệu.
- Swiss Stage 16 đội.
- Playoffs 8 đội, Double Elimination.
- Match/game result và màn hình Champion.

### Chưa làm
- Wildcard.
- Multiplayer.
- Tài khoản người chơi và đồng bộ cloud.
- Leaderboard online.
- Thanh toán/cửa hàng.
- Hệ thống ban/pick tướng đầy đủ.
- Assistant Coach.
- Giải nữ, 1v1 hoặc HOK.

## 7. Yêu cầu phi chức năng

- Dữ liệu có nguồn, trạng thái xác minh và lịch sử chỉnh sửa.
- Không hiển thị ảnh chưa có quyền sử dụng.
- Có thể cập nhật rating mà không sửa logic giao diện.
- Kết quả simulation có thể tái lập khi lưu random seed và cấu hình.
- Game logic có unit test cho Draft, synergy, Swiss và bracket.
- Responsive cho desktop và mobile.

## 8. Tiêu chí nghiệm thu MVP

- Draft luôn hoàn thành đúng năm vị trí và một Head Coach.
- Reroll không vượt quá ba lần.
- Không có Player Version trùng trong Dream Team.
- Chỉ dữ liệu đủ điều kiện mới xuất hiện trong pool.
- Synergy không kích hoạt nếu thiếu bằng chứng hoặc thời gian giao nhau.
- Swiss dừng đội ở mốc ba thắng hoặc ba thua theo cấu hình.
- Playoffs không tạo trận sai nhánh hoặc đưa đội đã bị loại trở lại.
- Simulation không ghi ngược vào dữ liệu lịch sử.

## 9. Rủi ro và phụ thuộc

- Thiếu roster lịch sử hoặc ngày hiệu lực roster.
- Ảnh tuyển thủ/HLV không có quyền tái sử dụng.
- Thiếu dữ liệu Head Coach theo thời kỳ.
- Thể thức APL 2026 và quy tắc xếp hạt giống cần xác minh bằng nguồn chính thức.
- Một số đội lịch sử không đủ năm tuyển thủ/HLV để tạo đối thủ AI hợp lệ.

## 10. Trạng thái

**Design / Pre-development.** Đây là đặc tả sản phẩm. Chưa có xác nhận rằng các tính năng đã được lập trình hoặc triển khai.
