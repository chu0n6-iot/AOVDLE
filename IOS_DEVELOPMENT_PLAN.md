# Kế hoạch Phát triển iOS (AOVDLE iOS Roadmap)

> **Trạng thái:** DỰ KIẾN / CHƯA TRIỂN KHAI (PLANNED - NOT IMPLEMENTED)  
> **Phiên bản hiện tại:** Web Application (React + Vite + TypeScript)

Tài liệu này phác thảo định hướng phát triển phiên bản native dành cho hệ điều hành iOS của AOVDLE.

---

## 1. Mục tiêu dự án iOS
- Mang trải nghiệm Draft & Tournament Simulation của Arena of Valor (Liên Quân Mobile) lên nền tảng di động iOS với giao diện tối ưu cảm ứng và hiệu năng mượt mà.
- Hỗ trợ offline simulation và lưu trữ phiên bản đội hình trên iCloud.

## 2. Công nghệ dự kiến
- **Ngôn ngữ:** Swift 6.0 / SwiftUI
- **Kiến trúc:** MVVM + Clean Architecture
- **Rendering:** Metal / SceneKit cho bản đồ chiến trường Antaris 3D
- **Database cục bộ:** SwiftData / SQLite lưu trữ lịch sử AIC, APL, AWC 2017–2026
- **Asset Management:** On-Demand Resources (ODR) cho kho ảnh chân dung tuyển thủ và logo đội tuyển độ phân giải cao

## 3. Lộ trình phát triển (Phases)
1. **Giai đoạn 1 (Q3/2026):** Porting Game Logic & Simulation Engine từ TypeScript sang Swift Package (`AOVDLEEngine`).
2. **Giai đoạn 2 (Q4/2026):** Xây dựng giao diện Draft 5 vị trí & Coach Selection bằng SwiftUI.
3. **Giai đoạn 3 (Q1/2027):** Tích hợp Tournament Simulation (APL Swiss Stage & Double Elimination) và hiệu ứng âm thanh/haptics.
4. **Giai đoạn 4 (Q2/2027):** TestFlight Beta và phát hành trên App Store.

---
*Mọi thông tin chi tiết sẽ được cập nhật khi dự án chính thức bước vào giai đoạn triển khai native iOS.*
