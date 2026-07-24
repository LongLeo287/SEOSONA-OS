# Phương Án Tự Động: AI-Powered Wireframe Generation via Stitch

## Mục tiêu

Xây dựng **Skill** hoàn chỉnh (`stitchSkill`) giúp AI tự động: đọc tài liệu mô tả → lên kế hoạch toàn bộ màn hình → xây dựng prompt chất lượng cao → **vẽ wireframe qua Stitch MCP hoặc script trực tiếp**.

---

## Hai Chế Độ Thực Thi

| | Mode A — Stitch MCP | Mode B — Direct API Script |
|---|---|---|
| **Cơ chế** | AI gọi MCP tools | Node.js gọi `stitch.googleapis.com` REST API |
| **Auth** | Google ADC | ✅ Tái sử dụng cùng ADC |
| **Ưu điểm** | AI review từng screen, linh hoạt sửa | Batch, retry, parallel, logging tự động |
| **Khi nào dùng** | < 10 screens, cần review | ≥ 10 screens, batch |

---

## Authentication

File `application_default_credentials.json` chứa: `client_id`, `client_secret`, `refresh_token`, `type: authorized_user`. Không thể tái sử dụng login Antigravity (scope khác). Skill bao gồm `setup_auth.ps1` chạy **1 lần duy nhất** — mở browser login Google → token tự refresh vĩnh viễn.

---

## Pipeline 8 Bước

> **Lưu ý:** Toàn bộ output nằm tại `stitchSkill/projects/<tên-project>/`

### Bước 1 — Đọc Tài Liệu & Thu Thập Tham Chiếu

**1a. Đọc & phân tích tài liệu mô tả:**
- AI đọc toàn bộ file mô tả (markdown, docx, txt…)
- Trích xuất: mục tiêu, user roles, features, data entities, business rules, thuật ngữ
- → Output: `projects/<name>/system_context.md`

**1b. Hỏi người dùng về reference materials:**

AI chủ động hỏi:

> *"Anh/chị có tài liệu tham chiếu nào không? Ví dụ:"*
> 1. 🖼️ **Screenshot / mockup** của ứng dụng tương tự muốn tham khảo
> 2. 🎨 **Style guide / brand guidelines** (logo, màu sắc, font chữ)
> 3. 🌐 **URL website/app** mà anh/chị thích phong cách
> 4. 📝 **Ghi chú về style** (ví dụ: "dark theme, corporate, minimal")
> 5. 📄 **Bất kỳ tài liệu nào khác** (wireframe cũ, Figma link, PDF…)

Nếu người dùng cung cấp:
- Screenshot → AI phân tích color palette, layout pattern, component style → inject vào design system
- URL → AI (hoặc browser tool) capture & phân tích visual style
- Brand guide → Extract colors, fonts, logo rules
- Text → Ghi nhận preferences

→ Output: `projects/<name>/style_references.md` (tổng hợp mọi reference)

### Bước 2 — Xác Định TOÀN BỘ Màn Hình (Screen Map)

**2a. AI đề xuất Users/Actors & Journeys:**

Dựa trên `system_context.md` + `style_references.md`, AI tư vấn:

```markdown
## Đề xuất Users/Actors

Từ tài liệu mô tả, tôi nhận diện các nhóm user sau:

| # | Actor | Mô tả | Tần suất sử dụng |
|---|---|---|---|
| 1 | Analyst | Người phân tích dữ liệu chính | Hàng ngày |
| 2 | Unit Manager | Quản lý cấp đơn vị | Hàng tuần |
| 3 | Executive | Lãnh đạo cấp cao | Hàng tháng |
| 4 | System Admin | Quản trị hệ thống | Khi cần |

## Đề xuất Journeys cho từng Actor

### Actor 1: Analyst
- ✅ Dashboard Analytics → Drill-down → Export
- ✅ Task Management → Task Detail → Annotations
- ✅ Report Comparison → Cross-period Analysis

### Actor 2: Unit Manager
- ✅ Team Overview → Member Performance → Alerts
- ...

> 💬 Anh/chị đồng ý với đề xuất trên không?
> Có thể: bổ sung actor, bỏ bớt journey, thêm screen cụ thể,
> hoặc comment bất kỳ điều chỉnh nào.
```

**2b. Người dùng review & điều chỉnh:**
- Đồng ý → AI tiến hành
- Comment → AI cập nhật theo feedback, đề xuất lại
- Bổ sung → AI thêm vào
- Bỏ bớt → AI loại ra

**2c. Sau khi được duyệt, AI tạo screen map hoàn chỉnh:**

→ Output: `projects/<name>/screen_map.md` bao gồm:
- Danh sách tất cả screens (đánh số SXX)
- Phân nhóm theo journey đã duyệt
- Flow diagram (mermaid)
- Navigation mapping (screen nào link đến screen nào)

#### Thư viện Journey Tham Khảo cho AI

##### 1. Core Navigation & Entry
| Journey | Screens ví dụ |
|---|---|
| Authentication | Login, Register, Forgot Password, 2FA, SSO Redirect |
| Onboarding | Welcome, Setup Wizard, Profile Completion, Tour |
| Home / Landing | Dashboard Overview, News Feed, Activity Stream |

##### 2. Data Browsing & Management
| Journey | Screens ví dụ |
|---|---|
| List → Detail → Edit | Master List, Detail View, Edit Form, Delete Confirm |
| Search & Filter | Advanced Search, Saved Filters, Search Results |
| Data Import/Export | Upload Wizard, Column Mapping, Preview, Export |
| Bulk Operations | Multi-select, Bulk Edit, Bulk Delete, Progress |

##### 3. Analytics & Reporting
| Journey | Screens ví dụ |
|---|---|
| Dashboard Analytics | KPI Overview, Trends, Comparisons, Period Selector |
| Drill-down | Summary → Category → Individual Item |
| Report Builder | Template, Parameters, Preview, Schedule, Export |
| Data Visualization | Chart Builder, Map View, Heatmap, Pivot Table |
| Cross-period Analysis | Period Comparison, Delta, Trend Projection |

##### 4. Workflow & Process
| Journey | Screens ví dụ |
|---|---|
| Task Management | Kanban Board, Task Detail, Assignment, Tracking |
| Approval Workflow | Submit, Pending, Approve/Reject, History |
| Multi-step Process | Wizard, Progress Bar, Validation, Confirm |
| Alerts & Notifications | Alert Center, Detail, Severity, Acknowledge |
| Calendar & Scheduling | Calendar, Event Detail, Create, Recurring |

##### 5. Communication & Collaboration
| Journey | Screens ví dụ |
|---|---|
| Messaging | Inbox, Thread, Compose, Attachments |
| Comments | Thread, @Mention, Reply, Reactions |
| File Sharing | Browser, Upload, Preview, Version History |

##### 6. User & Account Management
| Journey | Screens ví dụ |
|---|---|
| Profile | View, Edit, Avatar, Preferences |
| Organization | Org List, Detail, Departments, Members |
| User Admin | User List, Detail, Role Assignment, Invite |
| Roles & Permissions | Role List, Permission Matrix, Custom Roles |

##### 7. System Administration
| Journey | Screens ví dụ |
|---|---|
| Settings | General, Theme, Integrations, API Keys |
| Configuration | Feature Toggles, Parameters, Email Templates |
| Audit & Logs | Audit Trail, System Logs, Filters |

##### 8. E-commerce & Transactions
| Journey | Screens ví dụ |
|---|---|
| Product Catalog | Browse, Grid/List, Detail, Compare |
| Cart & Checkout | Cart, Payment, Review, Confirmation |
| Order Management | Orders, Detail, Tracking, Returns |

##### 9. Content Management
| Journey | Screens ví dụ |
|---|---|
| Editing | WYSIWYG, Media Library, Version Control |
| Publishing | Draft → Review → Publish, Schedule |
| Templates | List, Editor, Variable Binding |

##### 10. Map & Location
| Journey | Screens ví dụ |
|---|---|
| Map View | Interactive Map, Markers, Detail Popup |
| Asset Tracking | Real-time Map, Detail, Route History |

##### 11. Monitoring & Operations
| Journey | Screens ví dụ |
|---|---|
| System Monitoring | Status, Health, Uptime, Performance |
| Incidents | List, Triage, Escalation, Post-mortem |

##### 12. Edge Cases & System States
| Journey | Screens ví dụ |
|---|---|
| Empty States | First-time, No Results, No Access |
| Error States | 404, 500, Offline, Session Expired |
| Help & Support | Help Center, FAQ, Contact, Feedback |

### Bước 3 — Xây Dựng Design System Spec

→ Output: `projects/<name>/DESIGN.md`

Kết hợp `system_context.md` + `style_references.md` (từ Bước 1b) để tạo:
- App Identity, Color Palette, Typography
- **Navigation Structure** (FIXED cho mọi screen)
- Layout Grid, Component Patterns

### Bước 4 — Xây Dựng Prompt Chi Tiết Cho Từng Screen

→ Output: `projects/<name>/prompts/SXX_screen_name.md`

Mỗi prompt gồm **3 phần bắt buộc**:

```
┌─────────────────────────────────────────────┐
│  PART 1: DESIGN SYSTEM (copy từ bước 3)     │
│  → Đảm bảo color, font, nav nhất quán      │
├─────────────────────────────────────────────┤
│  PART 2: SCREEN MAP CONTEXT                 │
│  → Tóm tắt tất cả screens + vị trí hiện tại│
│  → "Đây là screen 3/12: Alerts Console"     │
│  → Sidebar phải highlight đúng menu item    │
├─────────────────────────────────────────────┤
│  PART 3: SCREEN CONTENT                     │
│  → Layout chi tiết cho screen này           │
│  → Data mẫu (nhất quán cross-screen)        │
│  → Sections, interactions, states           │
└─────────────────────────────────────────────┘
```

### Bước 5 — Chọn Project Stitch & Chế Độ Vẽ

**5a.** Gọi `list_projects` → hiển thị danh sách → **hỏi user chọn** project hoặc tạo mới.

**5b.** Hỏi user chọn **chế độ vẽ**:
- **Interactive**: AI vẽ → trình bày → chờ feedback → sửa → tiếp
- **Auto-feed**: AI tự vẽ toàn bộ → user review cuối

### Bước 6 — Vẽ Screens Theo Thứ Tự Journey

Thực thi theo mode đã chọn (Interactive / Auto-feed / Script batch).

### Bước 7 — Review & Chỉnh Sửa

Review tổng thể → sửa (`edit_screens`) → tạo variant nếu cần.

### Bước 8 — Export & Báo Cáo

→ Output: `projects/<name>/wireframe_report.md`

---

## File Structure

```
stitchSkill/
├── SKILL.md                          # Hướng dẫn chính (8 bước)
├── implementation_plan.md            # Plan này
├── templates/
│   ├── system_context_template.md
│   ├── screen_map_template.md
│   ├── design_system_template.md     # Bước 3 — DESIGN.md 9-section spec
│   ├── screen_prompt_template.md
│   └── generation_log_template.md
├── scripts/
│   ├── setup_auth.ps1                # One-time ADC login
│   ├── setup_project.js              # Create/list projects
│   └── batch_generate.js             # Batch generation
├── examples/
│   ├── tasklens_design_system.md
│   └── tasklens_screen_prompts.md
└── projects/                         # [RUNTIME] Per-project output
    └── <project-name>/
        ├── system_context.md         # From Step 1a
        ├── style_references.md       # From Step 1b
        ├── screen_map.md             # From Step 2
        ├── DESIGN.md                 # From Step 3
        ├── prompts/                  # From Step 4
        │   ├── S01_dashboard.md
        │   ├── S02_task_list.md
        │   └── ...
        ├── generation_log.md         # From Step 6
        └── wireframe_report.md       # From Step 8
```

---

## Verification Plan

### Automated
1. `setup_auth.ps1` → verify ADC credentials
2. `node scripts/setup_project.js --dry-run` → verify API
3. `node scripts/batch_generate.js --dry-run` → verify prompts

### Manual
1. Full pipeline dry-run
2. So sánh output với Stitch results
3. Đánh giá consistency, data linkage, visual coherence
