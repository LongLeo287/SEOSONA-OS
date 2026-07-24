# KI: zhouxiaoka/autoclip

## Overview
Repository with 498 files across 63 directories. Primary language: Python (162 files).

## Tech Stack (from code)
- Python (162 files)
- TypeScript (React) (62 files)
- TypeScript (23 files)
- Shell (12 files)
- Rust (6 files)
- **Total:** 498 files, 63 directories
- **File types:** .py: 162, .txt: 82, .tsx: 62, .md: 55, .png: 49, .ts: 23, .json: 15, .sh: 12

## Public API / Exports
- `clean_database` from `clean_database.py`
- `init_database` from `init_database.py`
- `install_package` from `install_llm_dependencies.py`
- `main` from `install_llm_dependencies.py`

## Dependencies
### Dependencies (from package.json)
- `@tauri-apps/cli`: ^2.0.0-rc.18

### Python Dependencies (from requirements.txt)
- `fastapi`
- `uvicorn[standard]`
- `sqlalchemy`
- `alembic`
- `celery[redis]`
- `redis`
- `pydantic`
- `pydantic-settings`
- `python-multipart`
- `websockets`
- `requests`
- `aiohttp`
- `aiofiles`
- `python-jose[cryptography]`
- `passlib[bcrypt]`
- `pytest`
- `pytest-cov`
- `pytest-mock`
- `cryptography`
- `qrcode[pil]`

## Imports Detected in Source
- `backend`
- `os`
- `pathlib`
- `sqlalchemy`
- `subprocess`
- `sys`

## File Structure
```
  .dockerignore
  .gitignore
  .taurignore
  BUILD_GUIDE.md
  CHANGELOG.md
  CLAUDE.md
  CONTRIBUTING.md
  DESIGN.md
  DOCKER.md
  Dockerfile
  Dockerfile.dev
  HANDOFF.md
  LICENSE
  README-EN.md
  README.md
  RELEASE_CHECKLIST.md
  RELEASE_NOTES.md
  ROADMAP.md
  SECURITY.md
  STARTUP_GUIDE.md
  check_whisper_status.sh
  clean_database.py
  docker-compose.dev.yml
  docker-compose.yml
  docker-dev-entrypoint.sh
  docker-entrypoint.sh
  docker-start.sh
  docker-status.sh
  docker-stop.sh
  env.example
  init_database.py
  install_llm_dependencies.py
  package-lock.json
  package.json
  quick_start.sh
  requirements.txt
  start_autoclip.sh
  status_autoclip.sh
  stop_autoclip.sh
  backend/
    __init__.py
    app_factory.py
    celery_app.py
    desktop_celery.py
    desktop_main.py
    dump.rdb
    execute_real_pipeline.py
    init_db.py
    main.py
    pytest.ini
    system_health_report.json
    api/
      __init__.py
      account_health.py
      upload_queue.py
      v1/
        __init__.py
        async_task_manager.py
        bilibili.py
        clips.py
        collections.py
        debug.py
        desktop.py
        enhanced_retry.py
        example_project.py
        files.py
        health.py
        offline.py
        pipeline_control.py
        processing.py
        progress.py
        projects.py
        settings.py
        simple_progress.py
        speech_recognition.py
        subtitle_editor.py
        tasks.py
        upload.py
        websocket.py
        youtube.py
        youtube_improved.py
    app/
      __init__.py
    core/
      __init__.py
      celery_app.py
      celery_app_fixed.py
      celery_minimal.py
      celery_simple_fixed.py
      config.py
      database.py
      dependencies.py
      desktop_config.py
      error_middleware.py
      error_middleware_v2.py
      llm_manager.py
      llm_providers.py
      path_utils.py
      shared_config.py
      unified_config.py
      unified_paths.py
      unified_storage.py
      websoc
```

## Key Source Excerpts
### clean_database.py
```python
#!/usr/bin/env python3
"""
清空数据库中的所有项目数据
"""
import sys
import os
from pathlib import Path

# 添加项目根目录到Python路径
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

from backend.core.database import get_db
from backend.models.project import Project
from backend.models.clip import Clip
from backend.models.collection import Collection
from backend.models.task import Task
from sqlalchemy.orm import Session

def clean_database():
    """清空数据库中的所有项目相关数据"""
    print("🧹 开始清理数据库...")
    
    # 获取数据库会话
    db = next(get_db())
    
    try:
        # 删除所有数据（按依赖关系顺序）
        print("删除任务数据...")
        deleted_tasks = db.query(Task).delete()
        print(f"✅ 删除了 {deleted_tasks} 个任务")
        
        print("删除合集数据...")
        deleted_collections = db.query(Collection).delete()
        print(f"✅ 删除了 {deleted_collections} 个合集")
        
        print("删除切片数据...")
        deleted_clips = db.query(Clip).delete()
        print(f"✅ 删除了 {deleted_clips} 个切片")
        
        print("删除项目数据...")
        deleted_projects = db.query(Project).delete()
        print(f"✅ 删除了 {deleted_projects} 个项目")
        
        # 提交事务
        db.commit()
        
        print("\n🎉 数据库清理完成!")
        print("现在数据库是干净的，没有任何项目数据")
        
    except Exception as e:
        print(f"❌ 清理数据库时发生错误: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    clean_database()

```

### init_database.py
```python
#!/usr/bin/env python3
"""
数据库初始化脚本
"""

import sys
from pathlib import Path

# 添加项目根目录到路径
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))
sys.path.insert(0, str(current_dir / "backend"))

# 设置工作目录
import os
os.chdir(current_dir)

def init_database():
    """初始化数据库"""
    print("🚀 开始初始化数据库...")
    
    try:
        # 导入所有模型确保表被创建
        from backend.models import Base, BilibiliAccount, UploadRecord
        from backend.core.database import init_database, create_tables
        
        print("✅ 所有模型导入成功")
        
        # 初始化数据库
        if init_database():
            print("✅ 数据库初始化成功")
        else:
            print("❌ 数据库初始化失败")
            return False
        
        # 创建表
        create_tables()
        print("✅ 数据库表创建成功")
        
        return True
        
    except Exception as e:
        print(f"❌ 数据库初始化失败: {e}")
        return False

if __name__ == "__main__":
    success = init_database()
    if success:
        print("\n🎉 数据库初始化完成！")
        print("现在可以启动系统了：")
        print("1. ./start_autoclip_with_upload.sh")
        print("2. 或者手动启动各个服务")
    else:
        print("\n❌ 数据库初始化失败，请检查错误信息")
        sys.exit(1)


```

### install_llm_dependencies.py
```python
#!/usr/bin/env python3
"""
安装多模型提供商依赖脚本
"""
import subprocess
import sys
import os

def install_package(package):
    """安装Python包"""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        print(f"✅ 成功安装 {package}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ 安装 {package} 失败: {e}")
        return False

def main():
    """主函数"""
    print("🚀 开始安装多模型提供商依赖...")
    
    # 需要安装的包
    packages = [
        "openai>=1.0.0",           # OpenAI
        "google-genai>=1.0.0",     # Google Gemini (统一版 GenAI SDK)
        "requests>=2.25.0",        # 硅基流动 (HTTP请求)
        "dashscope>=1.10.0",       # 阿里通义千问 (如果还没有安装)
    ]
    
    success_count = 0
    total_count = len(packages)
    
    for package in packages:
        if install_package(package):
            success_count += 1
    
    print(f"\n📊 安装结果: {success_count}/{total_count} 个包安装成功")
    
    if success_count == total_count:
        print("🎉 所有依赖安装完成！现在可以使用多模型提供商功能了。")
        print("\n📝 使用说明:")
        print("1. 启动系统: python backend/main.py")
        print("2. 访问设置页面配置API密钥")
        print("3. 选择您喜欢的AI模型提供商")
        print("4. 开始使用AI自动切片功能")
    else:
        print("⚠️  部分依赖安装失败，请检查网络连接或手动安装失败的包。")
        print("手动安装命令:")
        for package in packages:
            print(f"  pip install {package}")

if __name__ == "__main__":
    main()

```

## Agent Configuration
### CLAUDE.md
# AutoClip

## Design System
做任何视觉/UI 决策前，先读 `DESIGN.md`。所有配色、字体、间距、圆角、状态表达、按钮样式都以它为准。
未经明确同意不要偏离。代码审查时，发现不符合 `DESIGN.md` 的实现要标出来。

方向一句话：**克制专业 / Calm Premium（参考 Dia Browser）**——安静、留白多、近乎全单色、只用一个克制的蓝做强调。不要玩具撞色、彩色 chip、紫色渐变、霓虹、死黑。

## Roadmap
产品长期规划见 `ROADMAP.md`（账号 / 埋点 / 商业化分阶段）。当前阶段与现状见 `HANDOFF.md`。


## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-content` · **Function:** `srt` · **Fit:** 66/100 · **Auto-apply:** True
- **Evidence:** `srt`, `subtitle`
- **All scores:** {'seosona-os': 61, 'seosona-video': 56, 'seosona-content': 66, 'seosona-ux-ui': 0, 'seosona-flow': 28}
