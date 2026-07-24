# KI: FunnyWolf/agentic-soc-platform

## Overview
**Agentic SOC Platform** is an open-source security operations platform built on Agentic AI — free your security team from alert fatigue and focus on real threats.

## Architecture & Tech Stack
- Python
- **Total files:** 111 files across 37 directories
- **File types:** .py: 67, .md: 10, .png: 10, .json: 6, .jsx: 5, .yaml: 3, .toml: 2

## Documentation Sections
- Alert Aggregation, 99% Noise Reduction
- AI-Powered Investigation, Seconds Not Hours
- One-Click Automation
- Unified Multi-SIEM Access
- Automated Threat Intelligence Enrichment
- Deep Code Agent Integration
- Knowledge Accumulation, Smarter Over Time
- Open Source, Private Deployment, Pure Python
- Official Website
- 404Starlink

## Core Structure
```
  .gitignore
  AGENTS.md
  LICENSE
  README.md
  README_ZH.md
  manage.py
  pyproject.toml
  uv.lock
  ASP/
    __init__.py
    asgi.py
    settings.py
    urls.py
    wsgi.py
  Core/
    __init__.py
    apps.py
    bootstrap.py
    models.py
    serializers.py
    views.py
  DATA/
    MODULES/
      Cloud-01-AWS-IAM-Privilege-Escalation-via-AttachUserPolicy/
        raw_alert_1.json
        raw_alert_2.json
      EDR-01-HOST-Vssadmin-Delete-Shadows/
        raw_alert_1.json
        raw_alert_2.json
      Mail-01-User-Report-Phishing-Mail/
        mock_alert.py
        raw_alert_1.json
        raw_alert_2.json
    PLUGINS/
      SIEM/
        siem-aws-cloudtrail.yaml
        siem-host-events.yaml
        siem-network-traffic.yaml
    SYSTEM/
      ANALYSIS/
        KnowledgeKeywords.md
        KnowledgeKeywords_EN.md
        System.md
        System_EN.md
      KNOWLEDGE_EXTRACTION/
        System.md
        System_EN.md
  Docker/
    DB/
      db.sqlite3
    IMG/
      img.png
      img_1.png
      img_2.png
      img_3.png
      img_4.png
      img_5.png
      img_6.png
      img_7.png
      img_8.png
      logo.png
    Log/
      .gitkeep
    Ollama/
      ollama_nginx
    PostgreSQL/
      docker-compose.yml
    RedisStack/
      docker-compose.yml
    SIRP/
      SIRP.mdy
      components/
        chat.jsx
        investigation_report_ai.jsx
        investigation_report_ai_dark.jsx
        json.jsx
        json_dark.jsx
        readme.md
    Uvicorn/
      uvicorn.toml
  Lib/
    __init__.py
    analysis.py
    api.py
    baseapi.py
    basemodule.py
    baseplaybook.py
    baseview.py
    configs.py
    customexception.py
    dbfield.py
    log.py
    moduleengine.py
    monitor.py
    playbookloader.py
    threadmodulemanager.py
    xcache.py
  MODULES/
    Cloud-01-AWS-IAM-Privilege-Escalation-via-AttachUserPolicy.py
    EDR-01-HOST-Vssadmin-Delete-Shadows.py
    Mail-01-User-Report-Phishing-Mail.py
    __init__.py
  PLAYBOOKS/
    Investigation.py
    Knowledge_Extraction.py
    Threat_Intelligence_Enrichment.py
    __init__.py
  PLUGINS/
    __init__.py
    AlienVaultOTX/
      CONFIG.example.py
      __init__.py
      alienvaultotx.py
    CMDB/
      __init__.py
      tools.py
    ELK/
      CONFIG.example.py
      __init__.py
      client.py
      index_action.py
    Forwarder/
      __init__.py
      main.py
      models.py
      requirements.txt
    LLM/
      CONFIG.example.py
      __init__.py
      llmapi.py
    MCP/
      __init__.py
    
```

## Agent Configuration

--- AGENTS.md ---
- python 可以使用 .venv/Script/python.exe

项目架构:
├── ASP/                  # Django 项目配置
│   ├── settings.py       # 全局配置
│   ├── urls.py           # 路由定义
│   ├── wsgi.py           # WSGI 入口
│   └── asgi.py           # ASGI 入口
├── Core/                 # Django 应用: 用户认证
│   ├── bootstrap.py      # 启动初始化
│   ├── models.py         # 数据模型
│   ├── views.py          # 视图
│   └── Handle/           # 认证处理器
│       ├── baseauth.py   # 基础认证
│       ├── currentuser.py # 当前用户
│       └── user.py       # 用户管理
├── Lib/                  # 核心框架库
│   ├── basemodule.py     # Module 基类, 包含 Correlation 关联逻辑
│   ├── baseplaybook.py   # Playbook 基类, 继承 BaseAPI
│   ├── baseapi.py        # API 抽象基类, 提供模块名获取等通用方法
│   ├── baseview.py       # DRF ViewSet 基类, 封装 CRUD 操作
│   ├── moduleengine.py   # Module 执行引擎, 负责加载与运行 Module
│   ├── playbookloader.py # Playbook 加载器, 动态发现与加载 Playbook 类
│   ├── threadmodulemanager.py # 线程管理器, 管理 Module/Playbook 线程生命周期
│   ├── configs.py        # 全局配置常量 (Redis consumer group 等)
│   ├── log.py            # 日志配置
│   ├── monitor.py        # MainMonitor, 监听 Playbook 任务完成事件
│   ├── analysis.py       # 分析数据模型 (AffectedAsset, AttackChainStep 等)
│   ├── api.py            # 工具函数 (时间戳转换等)
│   ├── customexception.py # 自定义异常 (LLMModuleException 等) 及异常处理器
│   └── xcache.py         # Xcache 缓存封装 (SIRP 字段/Token 缓存)
├── MODULES/              # 安全检测模块 (告警消费与聚合)
│   ├── Cloud-01-AWS-IAM-Privilege-Escalation-via-AttachUserPolicy.py
│   ├── EDR-01-HOST-Vssadmin-Delete-Shadows.py
│   └── Mail-01-User-Report-Phishing-Mail.py
├── PLAYBOOKS/            # 调查剧本 (一键执行)
│   ├── Investigation.py  # 案件调查
│   ├── Knowledge_Extraction.py # 知识提取
│   └── Threat_Intelligence_Enrichment.py # 威胁情报补充
├── PLUGINS/              # 集成插件
│   ├── AlienVaultOTX/    # AlienVault OTX 威胁情报
│   │   └── alienvaultotx.py
│   ├── CMDB/             # CMDB 资产管理
│   │   └── tools.py
│   ├── ELK/              # Elasticsearch 集成
│   │   ├── client.py     # ES 客户端
│   │   └── index_action.py # 索引操作
│   ├── Forwarder/      


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
