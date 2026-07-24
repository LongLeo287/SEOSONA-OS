# System Flow - Thuế TNCN Vietnam Skill

> **Version:** 1.6.0 | **Cập nhật:** 07/04/2026

## Tổng Quan Hệ Thống

```mermaid
graph TB
    subgraph INPUT["📥 INPUT"]
        U["User hỏi về thuế TNCN"]
    end

    subgraph ROUTING["🔀 ROUTING - Xác định nhóm"]
        R1{"Loại câu hỏi?"}
        G1["Người làm công ăn lương"]
        G2["Freelancer / KOL"]
        G3["Người bán hàng online"]
        G4["Hộ kinh doanh"]
        MI{"Multi-Income?\nNhiều nguồn TN?"}
    end

    subgraph LOADING["📂 LOAD REFERENCE"]
        F1["tong-quan-thue.md"]
        F2["sop-quyet-toan.md"]
        F3["freelancer-guide.md"]
        F4["deadline-tracker.md"]
        F5["faq.md"]
        F6["vi-du-tinh-thue.md"]
    end

    subgraph GATE1["🔒 GATE 1: FRESHNESS CHECK"]
        CL["Đọc changelog.md"]
        EX{"Data > 6 tháng?"}
        WARN1["⚠️ CẢNH BÁO user: data có thể cũ"]
        PASS1["✅ Data còn mới"]
    end

    subgraph DRAFT["✍️ SOẠN CÂU TRẢ LỜI"]
        D["Tạo draft từ reference"]
    end

    subgraph GATE2["🔒 GATE 2: CROSS-VERIFY"]
        CV1{"Số liệu khớp reference?"}
        CV2{"Mâu thuẫn giữa files?"}
        FIX["🔄 Rà soát lại"]
        PASS2["✅ Đã verify"]
    end

    subgraph GATE3["🔒 GATE 3: SOURCE CITATION"]
        SC1["Ghi căn cứ pháp lý"]
        SC2["Ghi ngày cập nhật"]
        SC3["Kèm link gdt.gov.vn"]
        SC4["Kèm disclaimer"]
    end

    subgraph OUTPUT["📤 OUTPUT"]
        O["Câu trả lời + Disclaimer"]
    end

    U --> R1
    R1 --> G1
    R1 --> G2
    R1 --> G3
    R1 --> G4

    G1 --> MI
    G2 --> MI
    G3 --> MI
    G4 --> MI
    MI -->|"Đa nguồn"| F1 & F2 & F3
    MI -->|"1 nguồn"| F1
    MI -->|"1 nguồn"| F3
    G1 --> F2
    R1 -->|"deadline?"| F4
    R1 -->|"FAQ?"| F5
    R1 -->|"ví dụ?"| F6

    F1 & F2 & F3 & F4 & F5 & F6 --> CL
    CL --> EX
    EX -->|"CÓ"| WARN1
    EX -->|"KHÔNG"| PASS1
    WARN1 --> D
    PASS1 --> D

    D --> CV1
    CV1 -->|"KHÔNG"| FIX
    CV1 -->|"CÓ"| CV2
    CV2 -->|"CÓ"| FIX
    CV2 -->|"KHÔNG"| PASS2
    FIX --> D

    PASS2 --> SC1
    SC1 --> SC2
    SC2 --> SC3
    SC3 --> SC4
    SC4 --> O
```

## Chi Tiết Từng Bước

### Bước 1: Nhận câu hỏi & Routing

```mermaid
graph LR
    Q["User hỏi"] --> K{"Trigger keyword?"}
    K -->|"thuế suất, giảm trừ"| A["tong-quan-thue.md"]
    K -->|"quyết toán, eTax"| B["sop-quyet-toan.md"]
    K -->|"freelancer, KOL, online"| C["freelancer-guide.md"]
    K -->|"hạn nộp, deadline"| D["deadline-tracker.md"]
    K -->|"câu hỏi chung"| E["faq.md"]
    K -->|"tính thuế, ví dụ"| F["vi-du-tinh-thue.md"]
    K -->|"thay đổi, cập nhật"| G["changelog.md"]
```

### Bước 2: Xác định ngưỡng doanh thu (Decision Tree)

```mermaid
graph TD
    DT["Doanh thu/năm"] --> A{"\u2264 500 triệu?"}
    A -->|"CÓ"| A1["✅ Miễn thuế TNCN + GTGT"]

    A -->|"KHÔNG"| B{"100 - 200 triệu?"}
    B -->|"CÓ"| B1["💰 Nộp TNCN, miễn GTGT"]

    B -->|"KHÔNG"| C{"200 - 500 triệu?"}
    C -->|"CÓ"| C1["💰 Nộp cả TNCN + GTGT<br/>Thuế khoán"]

    C -->|"KHÔNG"| D{"500 triệu - 3 tỷ?"}
    D -->|"CÓ"| D1["📋 Chuyển kê khai<br/>Nộp theo quý"]

    D -->|"KHÔNG"| E1["📊 DT - CP<br/>Cần sổ sách kế toán"]

    style A1 fill:#22c55e,color:#fff
    style B1 fill:#f59e0b,color:#fff
    style C1 fill:#f59e0b,color:#fff
    style D1 fill:#ef4444,color:#fff
    style E1 fill:#ef4444,color:#fff
```

### Bước 3-5: Verification Gate Flow

```mermaid
graph TD
    subgraph G1["🔒 GATE 1: FRESHNESS"]
        G1A["Đọc changelog.md"] --> G1B{"Expiry date<br/>đã qua?"}
        G1B -->|"CÓ"| G1C["❌ DỪNG<br/>Yêu cầu cập nhật skill"]
        G1B -->|"KHÔNG"| G1D{"Data > 6 tháng?"}
        G1D -->|"CÓ"| G1E["⚠️ Cảnh báo user"]
        G1D -->|"KHÔNG"| G1F["✅ PASS"]
    end

    subgraph G2["🔒 GATE 2: CROSS-VERIFY"]
        G2A["So sánh draft với reference"] --> G2B{"Số liệu<br/>khớp nhau?"}
        G2B -->|"KHÔNG"| G2C["🔄 Sửa lại draft"]
        G2B -->|"CÓ"| G2D{"Mâu thuẫn<br/>giữa files?"}
        G2D -->|"CÓ"| G2E["📝 Ghi rõ<br/>cho user biết"]
        G2D -->|"KHÔNG"| G2F["✅ PASS"]
    end

    subgraph G3["🔒 GATE 3: SOURCE CITATION"]
        G3A{"Có số liệu<br/>trong output?"}
        G3A -->|"CÓ"| G3B["Ghi: Theo Luật X, Điều Y"]
        G3A -->|"KHÔNG"| G3C["Ghi: Tham khảo tại gdt.gov.vn"]
        G3B --> G3D["+ Ngày cập nhật data"]
        G3C --> G3D
        G3D --> G3E["+ Disclaimer bắt buộc"]
        G3E --> G3F["✅ PASS - Xuất output"]
    end

    G1F & G1E --> G2A
    G2F & G2E --> G3A
```

### Anti-Hallucination Guard

```mermaid
graph LR
    subgraph RULES["🚫 8 ANTI-HALLUCINATION RULES"]
        R1["1. CẤM bịa số liệu thuế"]
        R2["2. CẤM khẳng định<br/>khi không chắc"]
        R3["3. CẤM suy luận<br/>quy định mới"]
        R4["4. CẤM trả lời<br/>ngoài scope"]
        R5["5. MỌI con số<br/>PHẢI kèm nguồn"]
        R6["6. CẤM tính nhẩm/gộp<br/>thuế lũy tiến"]
        R7["7. Multi-income<br/>load nhiều file"]
        R8["8. Hỏi ủy quyền<br/>trước khi SOP"]
    end

    subgraph FALLBACK["🛡️ FALLBACK khi không chắc"]
        F1["Tôi không chắc,<br/>vui lòng kiểm tra<br/>tại gdt.gov.vn"]
        F2["Quy định này<br/>chưa có trong skill,<br/>cần cập nhật"]
        F3["Skill này chỉ<br/>cover thuế TNCN"]
        F4["Tách từng bước,<br/>khuyên dùng Excel<br/>đối soát"]
    end

    R1 & R2 --> F1
    R3 --> F2
    R4 --> F3
    R6 --> F4
```

## Confidence Level Map

```mermaid
graph TB
    subgraph HIGH["🟢 HIGH - Trích dẫn trực tiếp"]
        H1["tong-quan-thue.md"]
        H2["sop-quyet-toan.md"]
        H3["freelancer-guide.md"]
        H4["deadline-tracker.md"]
        H5["changelog.md"]
        H6["sources.md"]
    end

    subgraph MEDIUM["🟡 MEDIUM - Cần cross-check"]
        M1["vi-du-tinh-thue.md"]
        M2["faq.md"]
    end

    subgraph SOURCES["📚 Nguồn gốc"]
        S1["gdt.gov.vn"]
        S2["chinhphu.vn"]
        S3["thuvienphapluat.vn"]
        S4["Kế toán Thiên Ưng"]
        S5["THTax, MISA"]
        S6["Tuổi Trẻ, VnExpress"]
    end

    H1 & H2 & H3 & H4 --> S1 & S2 & S3
    M1 & M2 --> S4 & S5 & S6
```

## Tóm Tắt Quy Trình

| Bước | Hành động | Gate | Nếu FAIL |
|------|----------|------|---------|
| 1 | Nhận câu hỏi, detect trigger | - | - |
| 2 | Routing -> nhóm đối tượng | - | - |
| 3 | Load reference file | - | - |
| 4 | Kiểm tra freshness | 🔒 Gate 1 | Cảnh báo hoặc DỪNG |
| 5 | Soạn câu trả lời | - | - |
| 6 | Cross-verify số liệu | 🔒 Gate 2 | Sửa lại hoặc ghi mâu thuẫn |
| 7 | Trích nguồn + disclaimer | 🔒 Gate 3 | KHÔNG được bỏ qua |
| 8 | Output cho user | - | - |
