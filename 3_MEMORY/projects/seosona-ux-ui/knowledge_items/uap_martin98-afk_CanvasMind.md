# KI: martin98-afk/CanvasMind

## Overview
Repository with 1810 files across 447 directories. Primary language: Python (922 files).

## Tech Stack (from code)
- Python (922 files)
- Shell (2 files)
- **Total:** 1810 files, 447 directories
- **File types:** .py: 922, .md: 290, .json: 259, .svg: 158, .txt: 119, .png: 24, .qss: 11, .ds_store: 5

## Public API / Exports
- `enable_dpi_scale` from `main.py`
- `enable_opengl` from `main.py`
- `create_application` from `main.py`
- `load_localization` from `main.py`
- `post_build_cleanup` from `build.py`
- `generate_icons_qrc` from `generate_icon_qrc.py`
- `find_lrelease` from `translate.py`
- `compile` from `translate.py`
- `get_translator` from `translate.py`
- `find_pylupdate` from `update_translations.py`
- `main` from `update_translations.py`

## Dependencies

### Python Dependencies (from requirements.txt)
- `NodeGraphQt`
- `tiktoken`
- `PyQt5~=5.15.11`
- `loguru~=0.7.3`
- `numpy~=2.2.5`
- `requests~=2.32.4`
- `pandas~=3.0.0`
- `pydantic~=2.11.9`
- `psutil~=7.1.0`
- `pillow~=11.2.1`
- `PyQt-Fluent-Widgets`
- `Jinja2~=3.1.6`
- `colorama~=0.4.6`
- `packaging~=25.0`
- `PyYAML~=6.0.2`
- `openpyxl~=3.1.5`
- `tenacity~=9.1.2`
- `pyarrow~=22.0.0`
- `asteval~=1.0.6`
- `aiohttp~=3.13.1`

## Imports Detected in Source
- `PyInstaller`
- `app`
- `glob`
- `json`
- `os`
- `pathlib`
- `platform`
- `shutil`
- `site`
- `spyder`
- `subprocess`
- `sys`

## File Structure
```
  .DS_Store
  .gitignore
  LICENSE.txt
  README.md
  README_zh.md
  build.py
  generate_icon_qrc.py
  main.py
  requirements.txt
  translate.py
  update_translations.py
  .idea/
    .gitignore
  app/
    __init__.py
    main_window.py
    scan_components.py
    component_extensions/
      __init__.py
      0167394b-398a-4e6e-a6ba-9a5d8f3c9dd9/
        README.md
        __init__.py
        history.json
        manifest.json
        requirements.txt
        assets/
          init.md
      01777eeb-962c-495c-ba18-0650c8f6d5b6/
        README.md
        __init__.py
        history.json
        manifest.json
        requirements.txt
        assets/
          init.md
      0276c343-8a5d-46af-a9ad-8acc27cc167d/
        README.md
        __init__.py
        history.json
        manifest.json
        requirements.txt
        assets/
          init.md
      042b7ac3-d29a-4cdb-a166-2c59c810b91c/
        README.md
        __init__.py
        history.json
        manifest.json
        requirements.txt
        assets/
          init.md
      0aef64b4-0e57-4756-8d8a-10fcbf49724d/
        .DS_Store
        README.md
        __init__.py
        history.json
        manifest.json
        assets/
          init.md
      0f3ca001-5e1b-4e2c-9bd7-a763c3f89f93/
        README.md
        __init__.py
        history.json
        manifest.json
        assets/
          init.md
      10adbb2e-ab31-4fe2-9ea8-66809be1fe63/
        README.md
        __init__.py
        history.json
        manifest.json
        requirements.txt
        assets/
          init.md
      1209ec1a-a1b1-4a97-9785-fa0e244402d7/
        README.md
        __init__.py
        history.json
        manifest.json
        requirements.txt
        assets/
          init.md
      12283073-ca4e-4a62-be19-4b0e7f6bc6ca/
        README.md
        __init__.py
        history.json
        manifest.json
        requirements.txt
        assets/
          init.md
      1595a87a-6266-4855-b659-25b7c1cd3eb0/
        README.md
        __in
```

## Key Source Excerpts
### main.py
```python
# -*- coding: utf-8 -*-
from pathlib import Path
import platform

from app.utils.utils import resource_path


def enable_dpi_scale():
    """启用 DPI 缩放支持"""
    # enable dpi scale
    QApplication.setHighDpiScaleFactorRoundingPolicy(
        Qt.HighDpiScaleFactorRoundingPolicy.PassThrough
    )
    QApplication.setAttribute(Qt.AA_EnableHighDpiScaling)
    QApplication.setAttribute(Qt.AA_UseHighDpiPixmaps)


def enable_opengl():
    # macOS 下禁用部分 OpenGL 相关属性，避免输入法异常
    if platform.system() != "Darwin":
        QApplication.setAttribute(Qt.AA_DontCreateNativeWidgetSiblings)
        QApplication.setAttribute(Qt.AA_ShareOpenGLContexts)


def create_application():
    # 启用 DPI 缩放
    enable_dpi_scale()
    enable_opengl()
    # 创建应用
    # QtWebEngine 在 macOS 下通常不需要 --no-sandbox
    if platform.system() != "Darwin":
        sys.argv.append("--no-sandbox")

    app = QApplication(sys.argv)
    # 启用fusion样式
    app.setStyle("Fusion")
    tooltip_style = """
        QToolTip {
            color: white;
            background-color: black;
            border: none;
            padding: 2px;
            font-size: 12px;
        }
        """
    # 如果你已有全局样式，合并进去
    app.setStyleSheet(app.styleSheet() + tooltip_style)

    # Required for correct icon on GNOME/Wayland:
    if hasattr(app, "setDesktopFileName"):
        app.setDesktopFileName("CanvasMind")

    return app


def load_localization(app, language="en"):
    # 将 translator 绑定到 app 对象上，防止被垃圾回收
    app.translator = QTranslator()

```

### build.py
```python
# -*- coding: utf-8 -*-
import os
import shutil
import platform
from pathlib import Path

import PyInstaller.__main__
import spyder

# 1. 基础路径配置
base_dir = os.path.dirname(os.path.abspath(__file__))
env_dir = str(Path(os.path.dirname(spyder.__file__)).parent)
extra_modules = [
    "spyder",
    "fastapi",
    "watchdog",
    "uvicorn",
    "starlette",
    "pyecharts",
    "paho",
    "redis",
    "sqlalchemy",
    "psutil",
    "prettytable",
    "apscheduler",
    "tzlocal",
]
# 需要删除的冗余库列表
to_remove = [
    "scipy",
    "scipy.libs",
    "sphinx",
    "matplotlib",
    "torch",
    "tensorflow",
    "torchaudio",
    "sqlalchemy",
]
# 2. 图标选择 (跨平台)
icon_arg = None
if platform.system() == "Windows":
    icon_path = Path(base_dir) / "icons" / "logoico.ico"
    if icon_path.exists():
        icon_arg = f"--icon={icon_path}"
elif platform.system() == "Darwin":
    icon_path = Path(base_dir) / "icons" / "logoico.ico"
    if icon_path.exists():
        icon_arg = f"--icon={icon_path}"

# 3. 构造参数列表
params = [
    "main.py",
    "--onedir",
    "--windowed",
    "--name=CanvasMind",  # 直接指定名称，省去后期改名麻烦
    # 数据文件包含
    f"--add-data=app{os.pathsep}app",
    f"--add-data=resource{os.pathsep}resource",
    f"--add-data=examples{os.pathsep}examples",
    # 隐藏导入：合并基础依赖与动态搜寻到的插件
    "--hidden-import=jupyter_client.provisioning.local",
    "--hidden-import=ipykernel",
    "--copy-metadata=jupyter_client",
    # OpenCV on macOS needs bundled .dylibs (e.g., libpng)
    "--collect-binaries=cv
```

### generate_icon_qrc.py
```python
import os
from pathlib import Path
import json


def generate_icons_qrc(
        icons_dir="./icons",
        output_qrc="./icons/icons.qrc",
        output_map="app/utils/icon_name_map.py"
):
    extensions = {'.png', '.svg', '.ico', '.jpg', '.jpeg', '.gif'}
    icons_path = Path(icons_dir)

    if not icons_path.exists():
        print(f"⚠️ 图标目录不存在: {icons_path}")
        return

    # 收集图标：key=stem（无后缀名），value=完整文件名
    icon_map = {}
    for file in icons_path.iterdir():
        if file.is_file() and file.suffix.lower() in extensions:
            stem = file.stem
            # 如果有重名（如 copy.png 和 copy.svg），优先保留第一个（或按后缀优先级）
            if stem not in icon_map:
                icon_map[stem] = file.name

    # 生成 .qrc
    qrc_lines = [
        '<!DOCTYPE RCC>',
        '<RCC version="1.0">',
        '<qresource prefix="/icons">'
    ]
    for filename in sorted(icon_map.values()):
        qrc_lines.append(f'    <file>{filename}</file>')
    qrc_lines.extend(['  </qresource>', '</RCC>'])

    # 写入 .qrc
    qrc_path = Path(output_qrc)
    qrc_path.parent.mkdir(parents=True, exist_ok=True)
    with open(qrc_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(qrc_lines))

    # 生成 Python 映射文件：icon_name_map.py
    map_content = "# Auto-generated by generate_icons_qrc.py\n"
    map_content += "ICON_NAME_TO_FILE = "
    map_content += json.dumps(icon_map, indent=4, ensure_ascii=False)

    with open(output_map, 'w', encoding='utf-8') as f:
        f.write(map_content)

    
```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-ux-ui` · **Function:** `component` · **Fit:** 33/100 · **Auto-apply:** True
- **Evidence:** `component`
- **All scores:** {'seosona-os': 24, 'seosona-video': 0, 'seosona-content': 28, 'seosona-ux-ui': 33, 'seosona-flow': 0}
