# KI: ringhyacinth/Star-Office-UI

## Overview
Package: star-office-ui

## Tech Stack (from code)
- Python (15 files)
- JavaScript (6 files)
- Rust (3 files)
- Shell (2 files)
- **Total:** 132 files, 21 directories
- **File types:** .png: 22, .webp: 20, .md: 18, .py: 15, .json: 14, .woff2: 7, .html: 6, .js: 6

## Public API / Exports
- `convert_to_webp` from `convert_to_webp.py`
- `main` from `convert_to_webp.py`
- `gif_to_spritesheet` from `gif_to_spritesheet.py`
- `load_local_state` from `office-agent-push.py`
- `save_local_state` from `office-agent-push.py`
- `normalize_state` from `office-agent-push.py`
- `main` from `repack_star_working.py`
- `resize_map` from `resize_map.py`
- `load_state` from `set_state.py`
- `save_state` from `set_state.py`
- `webp_to_spritesheet` from `webp_to_spritesheet.py`
- `main` from `webp_to_spritesheet.py`

## Imports Detected in Source
- `PIL`
- `datetime`
- `json`
- `math`
- `os`
- `sys`
- `time`

## File Structure
```
  .env.example
  .gitignore
  LICENSE
  README.en.md
  README.ja.md
  README.md
  SKILL.md
  agent-invite-template.txt
  asset-defaults.json
  asset-positions.json
  convert_to_webp.py
  gif_to_spritesheet.py
  healthcheck.sh
  join-keys.sample.json
  office-agent-push.py
  pyproject.toml
  repack_star_working.py
  resize_map.py
  runtime-config.sample.json
  set_state.py
  state.sample.json
  uv.lock
  webp_to_spritesheet.py
  assets/
    room-reference.png
    room-reference.webp
  backend/
    app.py
    memo_utils.py
    requirements.txt
    run.sh
    security_utils.py
    store_utils.py
  desktop-pet/
    README.md
    STATE_API.md
    package.json
    src/
      index.html
      ipix.ttf
      minimized.html
    src-tauri/
      Cargo.lock
      Cargo.toml
      build.rs
      tauri.conf.json
      capabilities/
        default.json
      gen/
        schemas/
          acl-manifests.json
          capabilities.json
          desktop-schema.json
          macOS-schema.json
      icons/
        128x128.png
        128x128@2x.png
        32x32.png
        64x64.png
        icon.icns
        icon.ico
        icon.png
        android/
          mipmap-anydpi-v26/
            ic_launcher.xml
          values/
            ic_launcher_background.xml
      src/
        lib.rs
        main.rs
  docs/
    CHANGELOG_2026-03.md
    FEATURES_NEW_2026-03-01.md
    OPEN_SOURCE_RELEASE_CHECKLIST.md
    PROJECT_MAINTENANCE_SOP.md
    PROJECT_SUMMARY_2026-03-01.md
    PR_DRAFT_2026-03-refresh.md
    PR_FILELIST_2026-03-refresh.md
    STAR_OFFICE_UI_OVERVIEW.md
    UPDATE_REPORT_2026-03-04_P0_P1.md
    UPDATE_REPORT_2026-03-05.md
    screenshots/
      office-preview-20260301.jpg
      readme-cover-1.jpg
      readme-cover-2.jpg
  electron-shell/
    README.md
    main.js
    package-lock.json
    package.json
    preload.js
    standalone-assets/
      game.js
      layout.js
  frontend/
    btn-back-home-sprite.png
    btn-broker-sprite.png
    btn-diy-sprite.png
    btn-move
```

## Key Source Excerpts
### convert_to_webp.py
```python
#!/usr/bin/env python3
"""
批量转换 PNG 资源为 WebP 格式
- 精灵图使用无损转换
- 背景图等使用有损转换（质量 85）
"""

import os
from PIL import Image

# 路径
FRONTEND_DIR = "/root/.openclaw/workspace/star-office-ui/frontend"
STATIC_DIR = os.path.join(FRONTEND_DIR, "")

# 文件分类配置
# 无损转换：精灵图、需要保持透明精度的
LOSSLESS_FILES = [
    "star-idle-spritesheet.png",
    "star-researching-spritesheet.png",
    "star-working-spritesheet.png",
    "sofa-busy-spritesheet.png",
    "plants-spritesheet.png",
    "posters-spritesheet.png",
    "coffee-machine-spritesheet.png",
    "serverroom-spritesheet.png"
]

# 有损转换：背景图等，质量 85
LOSSY_FILES = [
    "office_bg.png",
    "sofa-idle.png",
    "desk.png"
]


def convert_to_webp(input_path, output_path, lossless=True, quality=85):
    """转换单个文件为 WebP"""
    try:
        img = Image.open(input_path)
        
        # 保存为 WebP
        if lossless:
            img.save(output_path, 'WebP', lossless=True, method=6)
        else:
            img.save(output_path, 'WebP', quality=quality, method=6)
        
        # 计算文件大小
        orig_size = os.path.getsize(input_path)
        new_size = os.path.getsize(output_path)
        savings = (1 - new_size / orig_size) * 100
        
        print(f"✅ {os.path.basename(input_path)} -> {os.path.basename(output_path)}")
        print(f"   原大小: {orig_size/1024:.1f}KB -> 新大小: {new_size/1024:.1f}KB (-{savings:.1f}%)")
        
        return True
    except Exception as e:
        print(f"❌ {os.path.basename(input_path)} 转换失败: {e}")
        return False

```

### gif_to_spritesheet.py
```python
#!/usr/bin/env python3
"""Convert GIF animation to sprite sheet for Phaser"""

from PIL import Image
import os

def gif_to_spritesheet(gif_path, output_path, target_height=64):
    # Open the GIF
    gif = Image.open(gif_path)
    
    # Get all frames
    frames = []
    try:
        while True:
            frame = gif.copy().convert('RGBA')
            # Calculate scale to fit target_height
            original_width, original_height = frame.size
            if original_height != target_height:
                scale = target_height / original_height
                target_width = int(original_width * scale)
                frame = frame.resize((target_width, target_height), Image.Resampling.NEAREST)
            frames.append(frame)
            gif.seek(gif.tell() + 1)
    except EOFError:
        pass
    
    if not frames:
        raise ValueError("No frames found in GIF")
    
    # Calculate sprite sheet dimensions
    frame_width, frame_height = frames[0].size
    num_frames = len(frames)
    
    # Arrange frames in a single row for simplicity
    sheet_width = frame_width * num_frames
    sheet_height = frame_height
    
    # Create sprite sheet
    spritesheet = Image.new('RGBA', (sheet_width, sheet_height), (0, 0, 0, 0))
    
    # Paste each frame
    for i, frame in enumerate(frames):
        x = i * frame_width
        y = 0
        spritesheet.paste(frame, (x, y))
    
    # Save sprite sheet
    spritesheet.save(output_path)
    
    print(f"Sprite sheet crea
```

### office-agent-push.py
```python
#!/usr/bin/env python3
"""
海辛办公室 - Agent 状态主动推送脚本

用法：
1. 填入下面的 JOIN_KEY（你从海辛那里拿到的一次性 join key）
2. 填入 AGENT_NAME（你想要在办公室里显示的名字）
3. 运行：python office-agent-push.py
4. 脚本会自动先 join（首次运行），然后每 30s 向海辛办公室推送一次你的当前状态
"""

import json
import os
import time
import sys
from datetime import datetime

# === 你需要填入的信息 ===
JOIN_KEY = ""   # 必填：你的一次性 join key
AGENT_NAME = "" # 必填：你在办公室里的名字
OFFICE_URL = "https://office.hyacinth.im"  # 海辛办公室地址（一般不用改）

# === 推送配置 ===
PUSH_INTERVAL_SECONDS = 15  # 每隔多少秒推送一次（更实时）
STATUS_ENDPOINT = "/status"
JOIN_ENDPOINT = "/join-agent"
PUSH_ENDPOINT = "/agent-push"

# 自动状态守护：当本地状态文件不存在或长期不更新时，自动回 idle，避免“假工作中”
STALE_STATE_TTL_SECONDS = int(os.environ.get("OFFICE_STALE_STATE_TTL", "600"))

# 本地状态存储（记住上次 join 拿到的 agentId）
STATE_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "office-agent-state.json")

# 优先读取本机 OpenClaw 工作区的状态文件（更贴合 AGENTS.md 的工作流）
# 支持自动发现，减少对方手动配置成本，且避免硬编码绝对路径：
# - 优先使用环境变量 OPENCLAW_HOME / OPENCLAW_WORKSPACE_DIR
# - 其次使用当前用户 HOME/.openclaw
# - 再回落到当前工作目录与脚本所在目录
OPENCLAW_HOME = os.environ.get("OPENCLAW_HOME") or os.path.join(os.path.expanduser("~"), ".openclaw")
OPENCLAW_WORKSPACE_DIR = os.environ.get("OPENCLAW_WORKSPACE_DIR") or os.path.join(OPENCLAW_HOME, "workspace")

DEFAULT_STATE_CANDIDATES = [
    os.path.join(OPENCLAW_WORKSPACE_DIR, "star-office-ui", "state.json"),
    os.path.join(OPENCLAW_WORKSPACE_DIR, "state.json"),
    "/root/.openclaw/workspace/Star-Office-UI/state.json",  # 当前仓库（大小写精确）
    "/root/.openclaw/workspace/st
```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `skill.md`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 22, 'seosona-flow': 0}
