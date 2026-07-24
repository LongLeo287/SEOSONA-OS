# 🎭 4_AGENTS: The Agent Roster

**[English]**  
`4_AGENTS` acts as the human resources department for SEOSONA OS. Instead of using a monolithic AI, SEOSONA shifts into specialized personas (sub-agents) like a Frontend Engineer, an SEO Specialist, or a System Architect. This directory manages those definitions.

**[Tiếng Việt]**  
`4_AGENTS` hoạt động như phòng nhân sự của SEOSONA OS. Thay vì dùng một nhân cách AI khổng lồ duy nhất, SEOSONA sẽ chuyển hóa thành các chuyên gia chuyên biệt (Sub-personas) như Kỹ sư Frontend, Chuyên gia SEO, hoặc Kiến trúc sư Hệ thống. Thư mục này quản lý định nghĩa của các nhân sự đó.

---

## 📂 Structure / Cấu trúc

- 📋 **`ROSTER.md`**: The master list of all available sub-agents and personas currently available in the OS.
- 🤖 **`personas/`**: (If present) Dedicated definition files outlining the specific traits, instructions, and constraints of individual agents.
- 🔗 **`skills/`**: A mapping of which agent is authorized to use which skills from `2_KNOWLEDGE`.

## 🚨 Core Rules / Quy tắc Cốt lõi

1. **Role Playing:** When an agent is invoked via the Context Engine, it must strictly adhere to the boundaries of its assigned persona. A Frontend Engineer agent should not attempt to restructure Python core logic.
2. **Dynamic Generation:** If a new operational domain emerges, the system can autonomously generate and define a new agent profile here.
3. **Collaboration:** Multi-agent workflows (orchestrated by `1_CORE`) use this directory to understand the capabilities and limitations of the team.
