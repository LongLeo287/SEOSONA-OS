# 🧩 2_KNOWLEDGE: The Skills Ecosystem

**[English]**  
`2_KNOWLEDGE` is the Dynamic Plugin Ecosystem of SEOSONA OS. Instead of hardcoding all capabilities into a single massive prompt, the OS dynamically loads specific domain skills (e.g., Frontend, SEO, Backend) based on the user's current task. This directory stores all knowledge, rules, and specialized capabilities.

**[Tiếng Việt]**  
`2_KNOWLEDGE` là Hệ sinh thái Plugin Động của SEOSONA OS. Thay vì nhồi nhét mọi thứ vào một câu lệnh (prompt) khổng lồ, hệ điều hành sẽ tự động tải các kỹ năng chuyên ngành (Frontend, SEO, DevOps) tùy theo ngữ cảnh công việc. Nơi đây lưu trữ toàn bộ kiến thức, quy trình chuẩn (SOP) và kỹ năng mở rộng.

---

## 📂 Structure / Cấu trúc

- 🗂️ **`frameworks/`**: The core plugin directory. Each sub-folder represents a domain (e.g., `frontend_engineering/`, `seo_marketing/`) and contains individual AI skills.
- 📋 **`MASTER_INDEX.md`**: The human-readable index mapping the entire knowledge base.
- 🤖 **`SKILLS_ROUTER.md`**: The auto-generated semantic index. The `context_engine` reads this file to route the current task to the appropriate skill.
- 📑 **`sops/`**: Standard Operating Procedures. Step-by-step guides for executing complex workflows (to prevent AI hallucinations).
- 🏗️ **`schemas/`**: JSON/YAML data structures and validation schemas.
- 🎨 **`output_styles/`**: Formatting rules and tone-of-voice directives.
- 📥 **`raw_data/`**: Unprocessed knowledge ingested from external sources (PDFs, Web, GitHub) waiting to be converted into formalized skills.

## 🚨 Core Rules / Quy tắc Cốt lõi

1. **The `SKILL.md` Standard:** Every skill inside `frameworks/` MUST have a `SKILL.md` file at its root with valid YAML Frontmatter (`name`, `description`, `keywords`). If it doesn't, the Knowledge Graph cannot index it.
2. **Dynamic Reading:** Agents should not brute-force read files here. Consult `SKILLS_ROUTER.md` first to find exactly which skill matches the task intent.
3. **Knowledge vs Logic:** This directory is strictly for storing knowledge, prompts, and context. Active Python/Node orchestrator logic must reside in `1_CORE/scripts/`.
