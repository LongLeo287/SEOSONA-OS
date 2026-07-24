# Architecture Extract: MoneyPrinterTurbo

## Directory Structure
```text
MoneyPrinterTurbo/
    .dockerignore
    .gitignore
    .python-version
    cli.py
    config.example.toml
    docker-compose.gpu.yml
    docker-compose.release.yml
    docker-compose.yml
    Dockerfile
    Dockerfile.gpu
    LICENSE
    main.py
    pyproject.toml
    README-ar.md
    README-en.md
    README.md
    requirements.txt
    uv.lock
    webui.bat
    webui.sh
    .github/
        SECURITY.md
        ISSUE_TEMPLATE/
            bug_report.yml
            config.yml
            feature_request.yml
        workflows/
            docker-ghcr.yml
    app/
        asgi.py
        router.py
        __init__.py
        config/
            config.py
            __init__.py
        controllers/
            base.py
            ping.py
            manager/
                base_manager.py
                memory_manager.py
                redis_manager.py
            v1/
                base.py
                llm.py
                video.py
        models/
            const.py
            exception.py
            schema.py
            __init__.py
        services/
            llm.py
            material.py
            state.py
            subtitle.py
            task.py
            upload_post.py
            video.py
            voice.py
            __init__.py
            data/
                azure_voices.json
            utils/
                video_effects.py
        utils/
            file_security.py
            utils.py
    docs/
        MoneyPrinterTurbo.ipynb
        voice-list.txt
        sponsors/
    resource/
        fonts/
            Charm-Bold.ttf
            Charm-Regular.ttf
            MicrosoftYaHeiBold.ttc
            MicrosoftYaHeiNormal.ttc
            STHeitiLight.ttc
            STHeitiMedium.ttc
            UTM Kabel KT.ttf
        public/
            index.html
        songs/
    test/
        README.md
        __init__.py
        resources/
        services/
            test_cli.py
            test_llm.py
            test_material.py
            test_state.py
            test_subtitle.py
            test_subtitle_background_settings.py
            test_task.py
            test_video.py
            test_voice.py
            test_webui_i18n.py
            __init__.py
    webui/
        Main.py
        .streamlit/
            config.toml
        i18n/
            de.json
            en.json
            es.json
            pt.json
            ru.json
            tr.json
            vi.json
            zh.json
```

## Core Logic Samples

### `cli.py`
```
import argparse
import json
import re
from typing import Sequence

from loguru import logger

from app.models.schema import MaterialInfo, VideoParams
from app.services import task as tm
from app.utils import utils


def _positive_int(value: str) -> int:
    parsed = int(value)
    if parsed < 1:
        raise argparse.ArgumentTypeError(f"value must be >= 1, got {parsed}")
    return parsed


def _paragraph_count(value: str) -> int:
    parsed = int(value)
    if parsed < 1 or parsed > 10:
        raise argparse.ArgumentTypeError(
            f"paragraph-number must be between 1 and 10, got {parsed}"
        )
    return parsed


def _non_negative_float(value: str) -> float:
    parsed = float(value)
    if parsed < 0:
        raise argparse.ArgumentTypeError(f"value must be >= 0, got {parsed}")
    return parsed


def _percent_position(value: str) -> float:
    parsed = float(value)
    if parsed < 0 or parsed > 100:
        raise argparse.ArgumentTypeError(
            f"custom-position must be between 0 and 100, got {parsed}"
        )
    return parsed


def _hex_color(value: str) -> str:
    if not re.fullmatch(r"#[0-9a-fA-F]{6}", value):
        raise argparse.ArgumentTypeError(
            f"color must use #RRGGBB format, got {value!r}"
        )
    return value


_TRANSITION_MODE_VALUES = {
    "none": None,
    "shuffle": "Shuffle",
    "fade-in": "FadeIn",
    "fade-out": "FadeOut",
    "slide-in": "SlideIn",
    "slide-out": "SlideOut",
}


def _transition_mode(value: str) -> str | None:
    normalized = value.strip().lower()
    if normalized not in _TRANSITION_MODE_VALUES:
        allowed = ", ".join(_TRANSITION_MODE_VALUES)
        raise argparse.ArgumentTypeError(
            f"video-transition-mode must be one of: {allowed}"
        )
    return _TRANSITION_MODE_VALUES[normalized]


def _bgm_type(value: str) -> str:
    normalized = value.strip().lower()
    if normalized == "none":
        return ""
    if normalized in {"", "random", "custom"}:
        return normalized
    raise argparse.ArgumentTypeError("bgm-type must be one of: none, random, custom")


def parse_args(argv: Sequence[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="MoneyPrinterTurbo command line video generation"
    )
    parser.add_argument("--video-subject", required=True, help="video subject")
    parser.add_argument("--video-script", default="", help="custom script")
    parser.add_argument("--video-terms", default=None, help="comma-separated terms")
    parser.add_argument(
        "--video-language",
        default=None,
        help="script generation language code (default: auto detect)",
    )
    parser.add_argument(
        "--paragraph-number",
        type=_paragraph_count,
        default=None,
        help="script paragraph count, 1-10",
    )
    parser.add_argument(
        "--video-script-prompt",
        default=None,
        help="custom script requirements prompt",
    )
    parser.add_argument(
        "--custom-system-prompt",
        default=None,
        help="custom system prompt for script generation",
    )
    parser.add_argument(
        "--video-source",
        default="pexels",
        choices=["pexels", "pixabay", "coverr", "local"],
        help="video material source",
    )
    parser.add_argument(
        "--video-materials",
        default="",
        help="comma-separated local material paths",
    )
    parser.add_argument(
        "--stop-at",
        default="video",
        choices=["script", "terms", "audio", "subtitle", "materials", "video"],
        help="pipeline stop stage",
    )
    parser.add_argument(
        "--video-count", type=_positive_int, default=1, help="output video count (>=1)"
    )
    parser.add_argument("--video-aspect", default="9:16", help="video aspect ratio")
    parser.add_argument(
        "--video-concat-mode",
        choices=["random", "sequential"],
        default=None,
        help="video concatenation mode",
    )
    parser.add_argument(
        "--video-transition-mode",
        type=_transition_mode,
        default=None,
        metavar="{none,shuffle,fade-in,fade-out,slide-in,slide-out}",
        help="video transition mode",
    )
    parser.add_argument(
        "--video-clip-duration",
        type=_positive_int,
        default=None,
        help="maximum duration of each source clip in seconds",
    )
    parser.add_argument(
        "--match-materials-to-script",
        default=None,
        action=argparse.BooleanOptionalAction,
        help="match generated/search materials to script order",
    )
    parser.add_argument("--voice-name", default="", help="tts voice name")
    parser.add_argument(
        "--voice-volume",
        type=_non_negative_float,
        default=None,
        help="speech volume multiplier",
    )
    parser.add_argument(
        "--voice-rate",
        type=_non_negative_float,
        default=None,
        help="speech rate multiplier",
    )
    parser.add_argument(
        "--bgm-type",
        type=_bgm_type,
        default=None,
        metavar="{none,random,custom}",
        help="background music mode",
    )
    parser.add_argument("--bgm-file", default=None, help="custom background music file")
    parser.add_argument(
        "--bgm-volume",
        type=_non_negative_float,
        default=None,
        help="background music volume multiplier",
    )
    parser.add_argument(
        "--subtitle-enabled",
        default=True,
        action=argparse.BooleanOptionalAction,
        help="enable subtitles (default: enabled, use --no-subtitle-enabled to disable)",
    )
    parser.add_argument("--font-name", default=None, help="subtitle font file name")
    parser.add_argument(
        "--subtitle-position",
        choices=["top", "center", "bottom", "custom"],
        default=None,
        help="subtitle position",
    )
    parser.add_argument(
        "--custom-position",
        type=_percent_position,
        default=None,
        help="custom subtitle position as percent from top, 0-100",
    )
    parser.add_argument(
        "--text-fore-color",
        type=_hex_color,
        default=None,
        help="subtitle text color in #RRGGBB format",
    )
    parser.add_argument(
        "--font-size", type=_positive_int, default=None, help="subtitle font size"
    )
    parser.add_argument(
        "--stroke-color",
        type=_hex_color,
        default=None,
        help="subtitle outline color in #RRGGBB format",
    )
    parser.add_argument(
        "--stroke-width",
        type=_non_negative_float,
        default=None,
        help="subtitle outline width",
    )
    parser.add_argument(
        "--subtitle-background-enabled",
        default=None,
        action=argparse.BooleanOptionalAction,
        help="enable subtitle background",
    )
    parser.add_argument(
        "--subtitle-background-color",
        type=_hex_color,
        default=None,
        help="subtitle background color in #RRGGBB format",
    )
    parser.add_argument(
        "--rounded-subtitle-background",
        default=None,
        action=argparse.BooleanOptionalAction,
        help="enable rounded translucent subtitle background",
    )
    parser.add_argument("--task-id", default="", help="custom task id")
    args = parser.parse_args(argv)

    if args.video_source == "local" and not (args.video_materials or "").strip():
        parser.error("--video-materials is required when --video-source is local")

    if args.video_source == "local" and args.stop_at == "terms":
        parser.error(
            "--stop-at terms has no effect with --video-source local "
            "(search terms are not generated for local sources)"
        )

    return args


def build_video_params(args: argparse.Namespace) -> VideoParams:
    video_terms = args.video_terms
    if video_terms:
        video_terms = [term.strip() for term in video_terms.split(",") if term.strip()]

    video_materials = None
    materials_arg = args.video_materials or ""
    if materials_arg.strip():
        video_materials = [
            # Actual duration will be detected during video processing; use 0 as placeholder.
            MaterialInfo(provider="local", url=item.strip(), duration=0)
            for item in materials_arg.split(",")
            if item.strip()
        ]

    params_kwargs = {
        "video_subject": args.video_subject,
        "video_script": args.video_script,
        "video_terms": video_terms,
        "video_source": args.video_source,
        "video_materials": video_materials,
        "video_count": args.video_count,
        "video_aspect": args.video_aspect,
        "voice_name": args.voice_name,
        "subtitle_enabled": args.subtitle_enabled,
    }

    optional_arg_names = [
        "video_language",
        "paragraph_number",
        "video_script_prompt",
        "custom_system_prompt",
        "video_concat_mode",
        "video_transition_mode",
        "video_clip_duration",
        "match_materials_to_script",
        "voice_volume",
        "voice_rate",
        "bgm_type",
        "bgm_file",
        "bgm_volume",
        "font_name",
        "subtitle_position",
        "custom_position",
        "text_fore_color",

... [TRUNCATED] ...
```

### `main.py`
```
import uvicorn
from loguru import logger

from app.config import config

if __name__ == "__main__":
    logger.info(
        "start server, docs: http://127.0.0.1:" + str(config.listen_port) + "/docs"
    )
    uvicorn.run(
        app="app.asgi:app",
        host=config.listen_host,
        port=config.listen_port,
        reload=config.reload_debug,
        log_level="warning",
    )
```

### `README-ar.md`
```
<div align="center">
<h1 align="center">MoneyPrinterTurbo 💸</h1>

<p align="center">
  <a href="https://github.com/harry0703/MoneyPrinterTurbo/stargazers"><img src="https://img.shields.io/github/stars/harry0703/MoneyPrinterTurbo.svg?style=for-the-badge" alt="Stargazers"></a>
  <a href="https://github.com/harry0703/MoneyPrinterTurbo/issues"><img src="https://img.shields.io/github/issues/harry0703/MoneyPrinterTurbo.svg?style=for-the-badge" alt="Issues"></a>
  <a href="https://github.com/harry0703/MoneyPrinterTurbo/network/members"><img src="https://img.shields.io/github/forks/harry0703/MoneyPrinterTurbo.svg?style=for-the-badge" alt="Forks"></a>
  <a href="https://github.com/harry0703/MoneyPrinterTurbo/blob/main/LICENSE"><img src="https://img.shields.io/github/license/harry0703/MoneyPrinterTurbo.svg?style=for-the-badge" alt="License"></a>
</p>

<h3>العربية | <a href="README-en.md">English</a> | <a href="README.md">简体中文</a></h3>

<div align="center">
  <a href="https://trendshift.io/repositories/8731" target="_blank"><img src="https://trendshift.io/api/badge/repositories/8731" alt="harry0703%2FMoneyPrinterTurbo | Trendshift" style="width: 250px; height: 55px;" width="250" height="55"/></a>
</div>

ما عليك سوى تقديم <b>موضوع</b> أو <b>كلمة مفتاحية</b> للفيديو، وسيقوم التطبيق تلقائياً بتوليد نص الفيديو،
ومواد الفيديو، والترجمة، وموسيقى الخلفية، ثم تركيبها في فيديو قصير عالي الدقة.

### واجهة الويب (WebUI)

![](docs/webui-en.jpg)

### واجهة الـ API

![](docs/api.jpg)

</div>

## المميزات 🎯

- [x] بنية **MVC** كاملة، وكود **واضح التنظيم** وسهل الصيانة، يدعم كلاً من `API` و`واجهة الويب`
- [x] يدعم **توليد نص الفيديو بالذكاء الاصطناعي**، إضافةً إلى **النص المخصّص**
- [x] يدعم أحجام **فيديو عالي الدقة** متنوعة
    - [x] عمودي 9:16، `1080x1920`
    - [x] أفقي 16:9، `1920x1080`
- [x] يدعم **توليد الفيديو دفعةً واحدة**، فيمكن إنشاء عدة فيديوهات معاً ثم اختيار الأفضل
- [x] يدعم ضبط **مدة مقاطع الفيديو**، مما يسهّل التحكم في تكرار تبديل المواد
- [x] يدعم نص الفيديو بكل من **الصينية** و**الإنجليزية**
- [x] يدعم **تركيب أصوات متعددة**، مع **معاينة فورية** للنتيجة
- [x] يدعم **توليد الترجمة**، مع إمكانية ضبط `الخط` و`الموضع` و`اللون` و`الحجم`، كما يدعم `تحديد إطار الترجمة`
- [x] يدعم **موسيقى الخلفية**، إما عشوائية أو ملفات موسيقى محدّدة، مع إمكانية ضبط `مستوى صوت موسيقى الخلفية`
- [x] مصادر مواد الفيديو **عالية الدقة** و**خالية من حقوق الملكية**، كما يمكنك استخدام **موادك المحلية** الخاصة
- [x] يدعم التكامل مع نماذج متعددة مثل **OpenAI** و**Moonshot** و**Azure** و**gpt4free** و**one-api** و**Qwen** و**Google Gemini** و**Ollama** و**DeepSeek** و**MiniMax** و**ERNIE** و**Pollinations** و**ModelScope** وغيرها

## عروض فيديو توضيحية 📺

### عمودي 9:16

<table>
<thead>
<tr>
<th align="center"><g-emoji class="g-emoji" alias="arrow_forward">▶️</g-emoji> كيف تضيف المتعة إلى حياتك </th>
<th align="center"><g-emoji class="g-emoji" alias="arrow_forward">▶️</g-emoji> ما معنى الحياة</th>
</tr>
</thead>
<tbody>
<tr>
<td align="center"><video src="https://github.com/harry0703/MoneyPrinterTurbo/assets/4928832/a84d33d5-27a2-4aba-8fd0-9fb2bd91c6a6"></video></td>
<td align="center"><video src="https://github.com/harry0703/MoneyPrinterTurbo/assets/4928832/112c9564-d52b-4472-99ad-970b75f66476"></video></td>
</tr>
</tbody>
</table>

### أفقي 16:9

<table>
<thead>
<tr>
<th align="center"><g-emoji class="g-emoji" alias="arrow_forward">▶️</g-emoji> ما معنى الحياة</th>
<th align="center"><g-emoji class="g-emoji" alias="arrow_forward">▶️</g-emoji> لماذا تمارس الرياضة</th>
</tr>
</thead>
<tbody>
<tr>
<td align="center"><video src="https://github.com/harry0703/MoneyPrinterTurbo/assets/4928832/346ebb15-c55f-47a9-a653-114f08bb8073"></video></td>
<td align="center"><video src="https://github.com/harry0703/MoneyPrinterTurbo/assets/4928832/271f2fae-8283-44a0-8aa0-0ed8f9a6fa87"></video></td>
</tr>
</tbody>
</table>

## متطلبات النظام 📦

- المنصّات المُوصى بها: Windows 10+ أو macOS 11+ أو توزيعة Linux رئيسية
- وجود كرت رسومات (GPU) ليس ضرورياً، لكنه مُستحسَن إن أردت نسخاً صوتياً محلياً أسرع، أو معالجة فيديو أسرع، أو توليداً دفعياً أكثر سلاسة

| العنصر | الحد الأدنى | المُوصى به | الأمثل |
| --- | --- | --- | --- |
| المعالج (CPU) | 4 أنوية | 6 إلى 8 أنوية | 8+ أنوية |
| الذاكرة (RAM) | 4 GB | 8 GB | 16+ GB |
| كرت الرسومات (GPU) | غير مطلوب | 4+ GB VRAM | 8+ GB VRAM |

- إذا كنت تعتمد أساساً على نماذج LLM السحابية، وخدمات TTS السحابية، ومصادر المواد عبر الإنترنت، فإن المعالج والذاكرة أهم من كرت الرسومات
- إذا كنت تستخدم `faster-whisper` أو التوليد الدفعي أو المعالجة المحلية الثقيلة، فسيحسّن كرت الرسومات الإنتاجية بشكل ملحوظ

## البدء السريع 🚀

### المسارات المُوصى بها

- مستخدمو Windows: استخدم الحزمة الجاهزة بنقرة واحدة أولاً للتجربة المحلية الأسرع
- مستخدمو MacOS / Linux: استخدم `uv sync --frozen` كمسار الإعداد المحلي الأساسي
- إذا أردت بيئة تشغيل أكثر عزلاً: استخدم النشر عبر Docker

### التشغيل في Google Colab
تريد تجربة MoneyPrinterTurbo دون إعداد بيئة محلية؟ شغّله مباشرةً في Google Colab!

[![Open in Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/harry0703/MoneyPrinterTurbo/blob/main/docs/MoneyPrinterTurbo.ipynb)


### Windows

الحزمة القابلة للتنزيل ما زالت بناء `v1.2.6` القديم المُجمّع. بعد التنزيل، شغّل `update.bat` أولاً لتحديثه إلى أحدث كود.

Google Drive (v1.2.6): https://drive.google.com/file/d/1HsbzfT7XunkrCrHw5ncUjFX8XX4zAuUh/view?usp=sharing

بعد التنزيل، يُنصح بالنقر المزدوج على `update.bat` أولاً للتحديث إلى **أحدث كود**، ثم النقر المزدوج على `start.bat` للتشغيل

بعد التشغيل، سيُفتح المتصفح تلقائياً (إن فُتح فارغاً، يُنصح باستخدام **Chrome** أو **Edge**)

### الأنظمة الأخرى

لم تُنشأ حزم تشغيل بنقرة واحدة بعد. راجع قسم **التثبيت والنشر** أدناه. يُنصح باستخدام **docker** للنشر لأنه أكثر سهولة.

## التثبيت والنشر 📥

### المتطلبات المُسبقة

#### ① استنساخ المشروع

```shell
git clone https://github.com/harry0703/MoneyPrinterTurbo.git
```

#### ② تعديل ملف الإعدادات

- انسخ ملف `config.example.toml` وأعد تسميته إلى `config.toml`
- اتبع التعليمات داخل ملف `config.toml` لضبط `pexels_api_keys` و`llm_provider`، وبحسب مزوّد خدمة الـ llm_provider، اضبط مفتاح الـ API المقابل

### النشر عبر Docker 🐳

#### ① تشغيل حاوية Docker

إذا لم تكن قد ثبّت Docker، فثبّته أولاً https://www.docker.com/products/docker-desktop/
إذا كنت تستخدم نظام Windows، فراجع وثائق Microsoft:

1. https://learn.microsoft.com/en-us/windows/wsl/install
2. https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-containers

```shell
cd MoneyPrinterTurbo
docker-compose up
```

> ملاحظة: أحدث إصدار من docker يثبّت docker compose تلقائياً على هيئة إضافة (plug-in)، ويتغيّر أمر التشغيل إلى `docker compose up`

#### ② الوصول إلى واجهة الويب

افتح متصفحك وزر http://127.0.0.1:8501

#### ③ الوصول إلى واجهة الـ API

افتح متصفحك وزر http://0.0.0.0:8080/docs أو http://0.0.0.0:8080/redoc

### النشر اليدوي 📦

#### ① إنشاء بيئة Python افتراضية

يُنصح باستخدام [uv](https://docs.astral.sh/uv/) لإدارة بيئة Python والاعتماديات، مع Python `3.11` كبيئة تشغيل افتراضية.

```shell
git clone https://github.com/harry0703/MoneyPrinterTurbo.git
cd MoneyPrinterTurbo
uv python install 3.11
uv sync --frozen
```

إذا كنت لا تستخدم `uv` بعد، فما زال بإمكانك استخدام `venv + pip`.

```shell
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

ملاحظات:
- أصبح `pyproject.toml` هو ملف الاعتماديات الأساسي.
- يُثبّت `uv.lock` البيئة المُحدّدة، لذا يُنصح بـ `uv sync --frozen` افتراضياً.
- يُحتفظ بـ `requirements.txt` فقط للتثبيت القديم المعتمد على `pip`.

#### ② تثبيت ImageMagick

###### Windows:

- نزّل من https://imagemagick.org/script/download.php واختر نسخة Windows، وتأكد من اختيار نسخة **المكتبة الساكنة (static library)**، مثل ImageMagick-7.1.1-32-Q16-x64-**static**.exe
- ثبّت ImageMagick الذي نزّلته، **ولا تغيّر مسار التثبيت**
- عدّل ملف الإعدادات `config.toml`، واضبط `imagemagick_path` على مسار التثبيت الفعلي لديك

###### MacOS:

```shell
brew install imagemagick
```

###### Ubuntu

```shell
sudo apt-get install imagemagick
```

###### CentOS

```shell
sudo yum install ImageMagick
```

#### ③ تشغيل واجهة الويب 🌐

لاحظ أنك بحاجة لتنفيذ الأوامر التالية في `المجلد الجذر` لمشروع MoneyPrinterTurbo

###### Windows

```shell
uv run streamlit run ./webui/Main.py --browser.gatherUsageStats=False --server.showEmailPrompt=False
```

إذا كنت قد فعّلت البيئة الافتراضية يدوياً، فما زال بإمكانك تشغيل:

```bat
webui.bat
```

###### MacOS أو Linux

```shell
uv run streamlit run ./webui/Main.py --browser.gatherUsageStats=False --server.showEmailPrompt=False
```

إذا كنت قد فعّلت البيئة الافتراضية يدوياً، فما زال بإمكانك تشغيل:

```shell
sh webui.sh
```

بعد التشغيل، سيُفتح المتصفح تلقائياً

#### ④ تشغيل خدمة الـ API 🚀

```shell
uv run python main.py
```

إذا كنت قد فعّلت البيئة الافتراضية يدوياً، فما زال بإمكانك تشغيل:

```shell
python main.py
```

## شكر خاص 🙏

نظراً لأن **نشر** و**استخدام** هذا المشروع يمثّل عتبةً معينة لبعض المستخدمين المبتدئين، نودّ أن نتقدّم بشكر خاص إلى

**RecCloud (منصة خدمات وسائط متعددة مدعومة بالذكاء الاصطناعي)** لتقديمها خدمة `AI Video Generator` مجانية مبنية على هذا
المشروع. فهي تتيح الاستخدام عبر الإنترنت دون نشر، وهو أمر مريح للغاية.

- النسخة الصينية: https://reccloud.cn
- النسخة الإنجليزية: https://reccloud.com

![](docs/reccloud.com.jpg)

## شكراً للرعاية 🙏

شكراً لـ Picwish https://picwish.com على دعمها ورعايتها لهذا المشروع، مما يتيح التحديث والصيانة المستمرّين.

تركّز Picwish على **مجال معالجة الصور**، وتوفّر مجموعة غنية من **أدوات معالجة الصور** التي تبسّط العمليات المعقّدة إلى حدٍّ بعيد، فتجعل معالجة الصور أسهل حقاً.

![picwish.jpg](docs/picwish.com.jpg)

بعد التشغيل، يمكنك عرض `وثائق الـ API` على http://127.0.0.1:8080/docs واختبار الواجهة مباشرةً عبر الإنترنت
لتجربة سريعة.

## تركيب الصوت 🗣

يمكن عرض قائمة بجميع الأصوات المدعومة هنا: [قائمة الأصوات](./docs/voice-list.txt)

2024-04-16 v1.1.2 أُضيفت 9 أصوات تركيب صوتي جديدة من Azure تتطلب ضبط مفتاح API. هذه الأصوات تبدو أكثر واقعية.

## توليد الترجمة 📜

حالياً، هناك طريقتان لتوليد الترجمة:

- **edge**: سرعة توليد أعلى، وأداء أفضل، ولا متطلبات خاصة لمواصفات الحاسوب، لكن الجودة قد تكون غير مستقرة
- **whisper**: سرعة توليد أبطأ، وأداء أضعف، ومتطلبات خاصة لمواصفات الحاسوب، لكن الجودة أكثر موثوقية

يمكنك التبديل بينهما بتعديل `subtitle_provider` في ملف الإعدادات `config.toml`

يُنصح باستخدام وضع `edge`، والتبديل إلى وضع `whisper` إذا كانت جودة الترجمة المُولّدة غير مُرضية.

> ملاحظة:
>
> 1. في وضع whisper، تحتاج إلى تنزيل ملف نموذج من HuggingFace بحجم نحو 3GB، فتأكد من اتصال إنترنت جيد

... [TRUNCATED] ...
```

### `README-en.md`
```
<div align="center">
<h1 align="center">MoneyPrinterTurbo 💸</h1>

<p align="center">
  <a href="https://github.com/harry0703/MoneyPrinterTurbo/stargazers"><img src="https://img.shields.io/github/stars/harry0703/MoneyPrinterTurbo.svg?style=for-the-badge" alt="Stargazers"></a>
  <a href="https://github.com/harry0703/MoneyPrinterTurbo/issues"><img src="https://img.shields.io/github/issues/harry0703/MoneyPrinterTurbo.svg?style=for-the-badge" alt="Issues"></a>
  <a href="https://github.com/harry0703/MoneyPrinterTurbo/network/members"><img src="https://img.shields.io/github/forks/harry0703/MoneyPrinterTurbo.svg?style=for-the-badge" alt="Forks"></a>
  <a href="https://github.com/harry0703/MoneyPrinterTurbo/blob/main/LICENSE"><img src="https://img.shields.io/github/license/harry0703/MoneyPrinterTurbo.svg?style=for-the-badge" alt="License"></a>
</p>

<h3>English | <a href="README.md">简体中文</a> | <a href="README-ar.md">العربية</a></h3>

<div align="center">
  <a href="https://trendshift.io/repositories/8731" target="_blank"><img src="https://trendshift.io/api/badge/repositories/8731" alt="harry0703%2FMoneyPrinterTurbo | Trendshift" style="width: 250px; height: 55px;" width="250" height="55"/></a>
</div>

Simply provide a <b>topic</b> or <b>keyword</b> for a video, and it will automatically generate the video copy, video
materials, video subtitles, and video background music before synthesizing a high-definition short video.

### WebUI

![](docs/webui-en.jpg)

### API Interface

![](docs/api.jpg)

</div>

## Special Thanks 🙏

<table align="center">
  <tr>
    <td align="center" width="160">
      <a href="https://aihubmix.com/?aff=CEve"><strong>AIHubMix</strong></a>
    </td>
    <td align="left">
      <sub>Thanks to <a href="https://aihubmix.com/?aff=CEve">AIHubMix</a> for sponsoring this project. AIHubMix deeply adapts to OpenAI, Claude, Gemini, DeepSeek, Zhipu, Qwen, and other leading models, providing one-stop access to GPT-5.5, deepseek-v4-flash, and 700+ models including free options with production-grade stability.</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="160">
      <a href="https://www.byteplus.com/en/product/modelark?utm_campaign=hw&utm_content=MoneyPrinterTurbo&utm_medium=devrel_tool_web&utm_source=OWO&utm_term=MoneyPrinterTurbo"><img src="docs/sponsors/byteplus-logo.svg" alt="BytePlus" height="25"></a><br>
      <a href="https://www.byteplus.com/en/product/modelark?utm_campaign=hw&utm_content=MoneyPrinterTurbo&utm_medium=devrel_tool_web&utm_source=OWO&utm_term=MoneyPrinterTurbo"><strong>BytePlus ModelArk</strong></a>
    </td>
    <td align="left">
      <sub>Thanks to Dola Seed for sponsoring this project! <a href="https://www.byteplus.com/en/product/modelark?utm_campaign=hw&utm_content=MoneyPrinterTurbo&utm_medium=devrel_tool_web&utm_source=OWO&utm_term=MoneyPrinterTurbo">Dola Seed 2.0</a> is a full-modal general large model independently developed by ByteDance for the global market. Built on a unified multimodal architecture, it supports joint understanding and generation of text, images, audio, and video. It natively enables agent collaboration, with strong reasoning, long-task execution, tool integration, and coding capabilities. Register via this link to get 500,000 tokens of free inference quota per model.</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="160">
      <a href="https://reccloud.com"><img src="docs/sponsors/reccloud-logo.svg" alt="RecCloud" height="36"></a><br>
      <a href="https://reccloud.com"><strong>RecCloud</strong></a>
    </td>
    <td align="left">
      <sub>Due to the <strong>deployment</strong> and <strong>usage</strong> of this project, there is a certain threshold for some beginner users. We would like to express our special thanks to <a href="https://reccloud.com">RecCloud (AI-Powered Multimedia Service Platform)</a> for providing a free <code>AI Video Generator</code> service based on this project. It allows for online use without deployment, which is very convenient. Chinese version: <a href="https://reccloud.cn">https://reccloud.cn</a>, English version: <a href="https://reccloud.com">https://reccloud.com</a></sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="160">
      <a href="https://picwish.com"><img src="docs/sponsors/picwish-logo.svg" alt="Picwish" height="36"></a><br>
      <a href="https://picwish.com"><strong>Picwish</strong></a>
    </td>
    <td align="left">
      <sub>Thanks to <a href="https://picwish.com">Picwish</a> for supporting and sponsoring this project, enabling continuous updates and maintenance. Picwish focuses on the <strong>image processing field</strong>, providing a rich set of <strong>image processing tools</strong> that extremely simplify complex operations, truly making image processing easier.</sub>
    </td>
  </tr>
</table>

## Features 🎯

- [x] Complete **MVC architecture**, **clearly structured** code, easy to maintain, supports both `API`
      and `Web interface`
- [x] Supports **AI-generated** video copy, as well as **customized copy**
- [x] Supports various **high-definition video** sizes
  - [x] Portrait 9:16, `1080x1920`
  - [x] Landscape 16:9, `1920x1080`
- [x] Supports **batch video generation**, allowing the creation of multiple videos at once, then selecting the most
      satisfactory one
- [x] Supports setting the **duration of video clips**, facilitating adjustments to material switching frequency
- [x] Supports video copy in both **Chinese** and **English**
- [x] Supports **multiple voice** synthesis, with **real-time preview** of effects
- [x] Supports **subtitle generation**, with adjustable `font`, `position`, `color`, `size`, and also
      supports `subtitle outlining`
- [x] Supports **background music**, either random or specified music files, with adjustable `background music volume`
- [x] Video material sources are **high-definition** and **royalty-free**, and you can also use your own **local materials**
- [x] Supports multiple stock video providers: **Pexels**, **Pixabay**, and **Coverr** (free HD/4K stock videos, subject to [Coverr license terms](https://coverr.co/license); mostly 16:9 landscape; register at [coverr.co/developers](https://coverr.co/developers?ctx=header_navigation), Demo tier 50 requests/hour)
- [x] Supports integration with various models such as **OpenAI**, **AIHubMix**, **AIML API**, **Moonshot**, **Azure**, **gpt4free**, **one-api**, **Qwen**, **Google Gemini**, **Ollama**, **DeepSeek**, **MiniMax**, **ERNIE**, **Pollinations**, **ModelScope** and more

## Video Demos 📺

### Portrait 9:16

<table>
<thead>
<tr>
<th align="center"><g-emoji class="g-emoji" alias="arrow_forward">▶️</g-emoji> How to Add Fun to Your Life </th>
<th align="center"><g-emoji class="g-emoji" alias="arrow_forward">▶️</g-emoji> What is the Meaning of Life</th>
</tr>
</thead>
<tbody>
<tr>
<td align="center"><video src="https://github.com/harry0703/MoneyPrinterTurbo/assets/4928832/a84d33d5-27a2-4aba-8fd0-9fb2bd91c6a6"></video></td>
<td align="center"><video src="https://github.com/harry0703/MoneyPrinterTurbo/assets/4928832/112c9564-d52b-4472-99ad-970b75f66476"></video></td>
</tr>
</tbody>
</table>

### Landscape 16:9

<table>
<thead>
<tr>
<th align="center"><g-emoji class="g-emoji" alias="arrow_forward">▶️</g-emoji> What is the Meaning of Life</th>
<th align="center"><g-emoji class="g-emoji" alias="arrow_forward">▶️</g-emoji> Why Exercise</th>
</tr>
</thead>
<tbody>
<tr>
<td align="center"><video src="https://github.com/harry0703/MoneyPrinterTurbo/assets/4928832/346ebb15-c55f-47a9-a653-114f08bb8073"></video></td>
<td align="center"><video src="https://github.com/harry0703/MoneyPrinterTurbo/assets/4928832/271f2fae-8283-44a0-8aa0-0ed8f9a6fa87"></video></td>
</tr>
</tbody>
</table>

## System Requirements 📦

- Recommended platforms: Windows 10+, macOS 11+, or a mainstream Linux distribution
- A GPU is not required, but it is recommended if you want faster local transcription, faster video processing, or smoother batch generation

| Item | Minimum      | Recommended  | Optimal    |
| ---- | ------------ | ------------ | ---------- |
| CPU  | 4 cores      | 6 to 8 cores | 8+ cores   |
| RAM  | 4 GB         | 8 GB         | 16+ GB     |
| GPU  | Not required | 4+ GB VRAM   | 8+ GB VRAM |

- If you mainly rely on cloud LLMs, cloud TTS, and online material sources, CPU and RAM matter more than GPU
- If you use `faster-whisper`, batch generation, or heavier local processing, a GPU will improve throughput noticeably

## Quick Start 🚀

### Recommended Paths

- Windows users: use the one-click package first for the fastest local trial
- MacOS / Linux users: use `uv sync --frozen` for the primary local setup path
- If you want a more isolated runtime: use Docker deployment

### Run in Google Colab

Want to try MoneyPrinterTurbo without setting up a local environment? Run it directly in Google Colab!

[![Open in Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/harry0703/MoneyPrinterTurbo/blob/main/docs/MoneyPrinterTurbo.ipynb)

### Windows

Download the latest Windows one-click package from GitHub Releases, then extract it directly.

- GitHub Release: https://github.com/harry0703/MoneyPrinterTurbo/releases/latest

After downloading, it is recommended to **double-click** `update.bat` first to update to the **latest code**, then double-click `start.bat` to launch

After launching, the browser will open automatically (if it opens blank, it is recommended to use **Chrome** or **Edge**)

### Other Systems

One-click startup packages have not been created yet. See the **Installation & Deployment** section below. It is recommended to use **docker** for deployment, which is more convenient.

## Installation & Deployment 📥

### Prerequisites

#### ① Clone the Project

```shell
git clone https://github.com/harry0703/MoneyPrinterTurbo.git
```

#### ② Modify the Configuration File

- Copy the `config.example.toml` file and rename it to `config.toml`
- Follow the instructions in the `config.toml` file to configure `pexels_api_keys` and `llm_provider`, and according to
  the llm_provider's service provider, set up the corresponding API Key
- To use the recommended multi-model provider, you can set `llm_provider` to `aihubmix` and enter the corresponding API key.

### Docker Deployment 🐳

#### ① Launch the Docker Container

If you haven't installed Docker, please install it first https://www.docker.com/products/docker-desktop/
If you are using a Windows system, please refer to Microsoft's documentation:

1. https://learn.microsoft.com/en-us/windows/wsl/install
2. https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-containers

```shell
cd MoneyPrinterTurbo
docker compose -f docker-compose.release.yml up
```

> The recommended default is `docker-compose.release.yml`, which pulls the prebuilt image from GitHub Container Registry: `ghcr.io/harry0703/moneyprinterturbo:latest`.
> If you need to build the image locally, you can still run `docker compose up`.
> Before the first start, make sure `config.toml` exists in the project root. You can copy it from `config.example.toml`.

#### ② Access the Web Interface

Open your browser and visit http://127.0.0.1:8501

#### ③ Access the API Interface

Open your browser and visit http://127.0.0.1:8080/docs or http://127.0.0.1:8080/redoc

### Manual Deployment 📦

#### ① Create a Python Virtual Environment

It is recommended to use [uv](https://docs.astral.sh/uv/) to manage the Python environment and dependencies, with Python `3.11` as the default runtime.

```shell
git clone https://github.com/harry0703/MoneyPrinterTurbo.git
cd MoneyPrinterTurbo
uv python install 3.11
uv sync --frozen
```

If you are not using `uv` yet, you can still use `venv + pip`.

```shell
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Notes:

- `pyproject.toml` is now the primary dependency manifest.
- `uv.lock` pins the resolved environment, so `uv sync --frozen` is recommended by default.
- `requirements.txt` is kept only for legacy `pip`-based installation.

#### ② Launch the Web Interface 🌐

Note that you need to execute the following commands in the `root directory` of the MoneyPrinterTurbo project

###### Windows

```powershell
.\webui.bat
```

You can also run `webui.bat` in CMD.
`webui.bat` prefers the project `.venv` or bundled Python from the portable package. If no project Python is found but `uv` is installed, it automatically falls back to `uv run streamlit`.
To allow other devices on your LAN to access the WebUI, run `set MPT_WEBUI_HOST=0.0.0.0` before running `webui.bat`.

###### MacOS or Linux

```shell
uv run streamlit run ./webui/Main.py --browser.gatherUsageStats=False --server.showEmailPrompt=False
```

If you have already activated the virtual environment manually, you can still run:

```shell
sh webui.sh
```

After launching, the browser will open automatically

#### ③ Launch the API Service 🚀

```shell
uv run python main.py
```

If you have already activated the virtual environment manually, you can still run:

```shell
python main.py
```

#### ④ Pure CLI Mode (No Browser) ⌨️

If you cannot use a browser or port forwarding, you can generate videos directly from the command line:

```shell
uv run python cli.py --video-subject "The Role of Money"
```

You can also provide local materials and control the stop stage:

```shell
uv run python cli.py \
  --video-subject "The Role of Money" \
  --video-source local \
  --video-materials "1.mp4,2.mp4" \
  --stop-at video
```

## Voice Synthesis 🗣

A list of all supported voices can be viewed here: [Voice List](./docs/voice-list.txt)


... [TRUNCATED] ...
```

### `README.md`
```
<div align="center">
<h1 align="center">MoneyPrinterTurbo 💸</h1>

<p align="center">
  <a href="https://github.com/harry0703/MoneyPrinterTurbo/stargazers"><img src="https://img.shields.io/github/stars/harry0703/MoneyPrinterTurbo.svg?style=for-the-badge" alt="Stargazers"></a>
  <a href="https://github.com/harry0703/MoneyPrinterTurbo/issues"><img src="https://img.shields.io/github/issues/harry0703/MoneyPrinterTurbo.svg?style=for-the-badge" alt="Issues"></a>
  <a href="https://github.com/harry0703/MoneyPrinterTurbo/network/members"><img src="https://img.shields.io/github/forks/harry0703/MoneyPrinterTurbo.svg?style=for-the-badge" alt="Forks"></a>
  <a href="https://github.com/harry0703/MoneyPrinterTurbo/blob/main/LICENSE"><img src="https://img.shields.io/github/license/harry0703/MoneyPrinterTurbo.svg?style=for-the-badge" alt="License"></a>
</p>
<br>
<h3>简体中文 | <a href="README-en.md">English</a> | <a href="README-ar.md">العربية</a></h3>
<div align="center">
  <a href="https://trendshift.io/repositories/8731" target="_blank"><img src="https://trendshift.io/api/badge/repositories/8731" alt="harry0703%2FMoneyPrinterTurbo | Trendshift" style="width: 250px; height: 55px;" width="250" height="55"/></a>
</div>

<br>
只需提供一个视频 <b>主题</b> 或 <b>关键词</b> ，就可以全自动生成视频文案、视频素材、视频字幕、视频背景音乐，然后合成一个高清的短视频。
<br>

<h4>Web界面</h4>

![](docs/webui.jpg)

<h4>API界面</h4>

![](docs/api.jpg)

</div>

## 特别感谢 🙏

<table align="center">
  <tr>
    <td align="center" width="160">
      <a href="https://aihubmix.com/?aff=CEve"><strong>AIHubMix</strong></a>
    </td>
    <td align="left">
      <sub>感谢 <a href="https://aihubmix.com/?aff=CEve">AIHubMix</a> 对本项目的赞助。AIHubMix 深度适配 OpenAI、Claude、Gemini、DeepSeek、智谱、千问等全球顶级最新模型，一站式快速接入 GPT-5.5、deepseek-v4-flash 等 700+ 模型（含多个免费模型），提供企业级生产稳定性保障。</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="160">
      <a href="https://www.volcengine.com/activity/codingplan?utm_campaign=hw&utm_content=hw&utm_medium=devrel_tool_web&utm_source=OWO&utm_term=MoneyPrinterTurbo"><img src="docs/sponsors/volcengine-logo.svg" alt="火山引擎" height="32"></a><br>
      <a href="https://ai.volcengine.com/activity/agentplan?utm_campaign=hw&utm_content=hw&utm_medium=devrel_tool_web&utm_source=OWO&utm_term=MoneyPrinterTurbo"><strong>方舟 Agent Plan</strong></a>
    </td>
    <td align="left">
      <sub>感谢 <a href="https://ai.volcengine.com/activity/agentplan?utm_campaign=hw&utm_content=hw&utm_medium=devrel_tool_web&utm_source=OWO&utm_term=MoneyPrinterTurbo">方舟 Agent Plan</a> 对本项目的赞助。模型自由，工具不限，最新支持 MiniMax-M3 与 GLM-5.1，受邀下单叠加 9.5 折！集合主流优秀国产编程模型，多生态兼容，无缝融入您的工具链，依托字节资源保障和工程能力，更大容量，更快、更稳、更丝滑！</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="160">
      <a href="https://reccloud.cn"><img src="docs/sponsors/reccloud-logo.svg" alt="录咖" height="36"></a><br>
      <a href="https://reccloud.cn"><strong>录咖 AI</strong></a>
    </td>
    <td align="left">
      <sub>由于该项目的 <strong>部署</strong> 和 <strong>使用</strong>，对于一些小白用户来说，还是 <strong>有一定的门槛</strong>，在此特别感谢 <a href="https://reccloud.cn">录咖（AI智能 多媒体服务平台）</a> 网站基于该项目，提供的免费 <code>AI视频生成器</code> 服务，可以不用部署，直接在线使用，非常方便。中文版：<a href="https://reccloud.cn">https://reccloud.cn</a>，英文版：<a href="https://reccloud.com">https://reccloud.com</a></sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="160">
      <a href="https://picwish.cn"><img src="docs/sponsors/picwish-logo.svg" alt="佐糖" height="36"></a><br>
      <a href="https://picwish.cn"><strong>佐糖</strong></a>
    </td>
    <td align="left">
      <sub>感谢 <a href="https://picwish.cn">佐糖</a> 对该项目的支持和赞助，使得该项目能够持续的更新和维护。佐糖专注于<strong>图像处理领域</strong>，提供丰富的<strong>图像处理工具</strong>，将复杂操作极致简化，真正实现让图像处理更简单。</sub>
    </td>
  </tr>
</table>

## 功能特性 🎯

- [x] 完整的 **MVC架构**，代码 **结构清晰**，易于维护，支持 `API` 和 `Web界面`
- [x] 支持视频文案 **AI自动生成**，也可以**自定义文案**
- [x] 支持多种 **高清视频** 尺寸
  - [x] 竖屏 9:16，`1080x1920`
  - [x] 横屏 16:9，`1920x1080`
- [x] 支持 **批量视频生成**，可以一次生成多个视频，然后选择一个最满意的
- [x] 支持 **视频片段时长** 设置，方便调节素材切换频率
- [x] 支持 **中文** 和 **英文** 视频文案
- [x] 支持 **多种语音** 合成，可 **实时试听** 效果
- [x] 支持 **字幕生成**，可以调整 `字体`、`位置`、`颜色`、`大小`，同时支持`字幕描边`设置
- [x] 支持 **背景音乐**，随机或者指定音乐文件，可设置`背景音乐音量`
- [x] 视频素材来源 **高清**，而且 **无版权**，也可以使用自己的 **本地素材**
- [x] 支持多种素材源:**Pexels**、**Pixabay**、**Coverr**(免费高清/4K 素材库,使用须遵守 [Coverr 许可条款](https://coverr.co/license),以 16:9 横屏为主;在 [coverr.co/developers](https://coverr.co/developers?ctx=header_navigation) 注册即可,Demo 套餐 50 次/小时)
- [x] 支持 **OpenAI**、**AIHubMix**、**AIML API**、**Moonshot**、**Azure**、**gpt4free**、**one-api**、**通义千问**、**Google Gemini**、**Ollama**、**DeepSeek**、**MiniMax**、 **文心一言**, **Pollinations**、**ModelScope** 等多种模型接入

## 视频演示 📺

### 竖屏 9:16

<table>
<thead>
<tr>
<th align="center"><g-emoji class="g-emoji" alias="arrow_forward">▶️</g-emoji> 《如何增加生活的乐趣》</th>
<th align="center"><g-emoji class="g-emoji" alias="arrow_forward">▶️</g-emoji> 《金钱的作用》<br>更真实的合成声音</th>
<th align="center"><g-emoji class="g-emoji" alias="arrow_forward">▶️</g-emoji> 《生命的意义是什么》</th>
</tr>
</thead>
<tbody>
<tr>
<td align="center"><video src="https://github.com/harry0703/MoneyPrinterTurbo/assets/4928832/a84d33d5-27a2-4aba-8fd0-9fb2bd91c6a6"></video></td>
<td align="center"><video src="https://github.com/harry0703/MoneyPrinterTurbo/assets/4928832/af2f3b0b-002e-49fe-b161-18ba91c055e8"></video></td>
<td align="center"><video src="https://github.com/harry0703/MoneyPrinterTurbo/assets/4928832/112c9564-d52b-4472-99ad-970b75f66476"></video></td>
</tr>
</tbody>
</table>

### 横屏 16:9

<table>
<thead>
<tr>
<th align="center"><g-emoji class="g-emoji" alias="arrow_forward">▶️</g-emoji>《生命的意义是什么》</th>
<th align="center"><g-emoji class="g-emoji" alias="arrow_forward">▶️</g-emoji>《为什么要运动》</th>
</tr>
</thead>
<tbody>
<tr>
<td align="center"><video src="https://github.com/harry0703/MoneyPrinterTurbo/assets/4928832/346ebb15-c55f-47a9-a653-114f08bb8073"></video></td>
<td align="center"><video src="https://github.com/harry0703/MoneyPrinterTurbo/assets/4928832/271f2fae-8283-44a0-8aa0-0ed8f9a6fa87"></video></td>
</tr>
</tbody>
</table>

## 配置要求 📦

- 建议系统：Windows 10 或 MacOS 11.0 以上，或主流 Linux 发行版
- GPU 不是必需项，但如果你希望本地转录、更快的视频处理或更顺畅的批量生成体验，建议使用带显存的独立显卡

| 项目 | 最低配置 | 推荐配置        | 理想配置        |
| ---- | -------- | --------------- | --------------- |
| CPU  | 4 核     | 6 到 8 核       | 8 核及以上      |
| RAM  | 4 GB     | 8 GB            | 16 GB 及以上    |
| GPU  | 非必须   | 4 GB 显存及以上 | 8 GB 显存及以上 |

- 如果你主要依赖云端 LLM、云端 TTS 和在线素材源，CPU 与内存比 GPU 更重要
- 如果你启用 `faster-whisper`、批量生成或更重的本地处理链路，GPU 会明显提升速度

## 快速开始 🚀

### 推荐使用方式

- Windows 用户：优先使用一键启动包，适合快速体验
- MacOS / Linux 用户：优先使用 `uv sync --frozen` 进行本地部署
- 想要隔离运行环境：优先使用 Docker 部署

### 在 Google Colab 中运行

免去本地环境配置，点击直接在 Google Colab 中快速体验 MoneyPrinterTurbo

[![Open in Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/harry0703/MoneyPrinterTurbo/blob/main/docs/MoneyPrinterTurbo.ipynb)

### Windows一键启动包

下载一键启动包，解压直接使用（路径不要有 **中文**、**特殊字符**、**空格**）

- GitHub Release: https://github.com/harry0703/MoneyPrinterTurbo/releases/latest

下载后，建议先**双击执行** `update.bat` 更新到**最新代码**，然后双击 `start.bat` 启动

启动后，会自动打开浏览器（如果打开是空白，建议换成 **Chrome** 或者 **Edge** 打开）

## 安装部署 📥

### 前提条件

- 尽量不要使用 **中文路径**，避免出现一些无法预料的问题
- 请确保你的 **网络** 是正常的，VPN需要打开`全局流量`模式

#### ① 克隆代码

```shell
git clone https://github.com/harry0703/MoneyPrinterTurbo.git
```

#### ② 修改配置文件（可选，建议启动后也可以在 WebUI 里面配置）

- 将 `config.example.toml` 文件复制一份，命名为 `config.toml`
- 按照 `config.toml` 文件中的说明，配置好 `pexels_api_keys` 和 `llm_provider`，并根据 llm_provider 对应的服务商，配置相关的
  API Key
- 如果希望使用推荐的大模型平台，也可以将 `llm_provider` 设置为 `aihubmix`，并填写对应的 API Key。

### Docker部署 🐳

#### ① 启动Docker

如果未安装 Docker，请先安装 https://www.docker.com/products/docker-desktop/

如果是Windows系统，请参考微软的文档：

1. https://learn.microsoft.com/zh-cn/windows/wsl/install
2. https://learn.microsoft.com/zh-cn/windows/wsl/tutorials/wsl-containers

```shell
cd MoneyPrinterTurbo
docker compose -f docker-compose.release.yml up
```

> 默认推荐使用 `docker-compose.release.yml`，它会直接拉取 GitHub Container Registry 上的预构建镜像：`ghcr.io/harry0703/moneyprinterturbo:latest`。
> 如果你需要本地重新构建镜像，可以继续使用 `docker compose up`。
> 注意：首次启动前请确保项目根目录下存在 `config.toml`，可以从 `config.example.toml` 复制一份。

#### ② 访问Web界面

打开浏览器，访问 http://127.0.0.1:8501

#### ③ 访问API文档

打开浏览器，访问 http://127.0.0.1:8080/docs 或者 http://127.0.0.1:8080/redoc

### 手动部署 📦

> 视频教程

- 完整的使用演示：https://v.douyin.com/iFhnwsKY/
- 如何在Windows上部署：https://v.douyin.com/iFyjoW3M

#### ① 创建虚拟环境

推荐使用 [uv](https://docs.astral.sh/uv/) 管理 Python 环境和依赖，默认使用 Python `3.11`

```shell
git clone https://github.com/harry0703/MoneyPrinterTurbo.git
cd MoneyPrinterTurbo
uv python install 3.11
uv sync --frozen
```

如果你暂时不使用 `uv`，也可以继续使用 `venv + pip`

```shell
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

说明：

- `pyproject.toml` 是主依赖定义文件
- `uv.lock` 是锁文件，建议默认执行 `uv sync --frozen`
- `requirements.txt` 仅保留给旧的 `pip` 安装方式兼容使用

#### ② 启动Web界面 🌐

注意需要到 MoneyPrinterTurbo 项目 `根目录` 下执行以下命令

###### Windows

```powershell
.\webui.bat
```

在 CMD 中也可以执行 `webui.bat`。
`webui.bat` 会优先使用项目 `.venv` 或一键包内置 Python；如果没有找到项目 Python，但已安装 `uv`，会自动切换为 `uv run streamlit`。
如需允许局域网内其他设备访问 WebUI，可以先执行 `set MPT_WEBUI_HOST=0.0.0.0`，再运行 `webui.bat`。

###### MacOS or Linux

```shell
uv run streamlit run ./webui/Main.py --browser.gatherUsageStats=False --server.showEmailPrompt=False
```

如果你已经手动激活了虚拟环境，也可以直接执行：

```shell
sh webui.sh
```

启动后，会自动打开浏览器（如果打开是空白，建议换成 **Chrome** 或者 **Edge** 打开）

#### ③ 启动API服务 🚀

```shell
uv run python main.py
```

如果你已经手动激活了虚拟环境，也可以直接执行：

```shell
python main.py
```

#### ④ 纯命令行方式（无浏览器）⌨️

如果你无法使用浏览器或端口转发，可以直接在命令行生成视频：

```shell
uv run python cli.py --video-subject "金钱的作用"
```

也可以指定本地素材并仅运行到某个阶段：

```shell
uv run python cli.py \
  --video-subject "金钱的作用" \
  --video-source local \
  --video-materials "1.mp4,2.mp4" \
  --stop-at video
```


... [TRUNCATED] ...
```

### `.github\SECURITY.md`
```
# Security Policy

## Supported Versions

Security fixes are applied on a best-effort basis to the latest `main` branch and the most recent published release line.

## Reporting a Vulnerability

Please do **not** disclose suspected vulnerabilities in public GitHub issues.

Preferred process:

1. Use GitHub private vulnerability reporting for this repository if it is available in the repository security settings.
2. If private reporting is not available, open a minimal public issue that only requests a private contact channel and does **not** include vulnerability details, proof-of-concept code, payloads, or sensitive file paths.
3. Wait for a maintainer response before sharing any technical details publicly.

When reporting a vulnerability privately, include:

- affected commit, tag, or release version
- attack surface or vulnerable endpoint
- impact summary
- reproduction conditions
- suggested remediation, if available

## Disclosure Expectations

- Please give maintainers reasonable time to investigate and prepare a fix before public disclosure.
- Once a fix is available, coordinated public disclosure is welcome.
```

### `app\asgi.py`
```
"""Application implementation - ASGI."""

import os

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from loguru import logger

from app.config import config
from app.models.exception import HttpException
from app.router import root_api_router
from app.utils import utils


def exception_handler(request: Request, e: HttpException):
    return JSONResponse(
        status_code=e.status_code,
        content=utils.get_response(e.status_code, e.data, e.message),
    )


def validation_exception_handler(request: Request, e: RequestValidationError):
    return JSONResponse(
        status_code=400,
        content=utils.get_response(
            status=400, data=e.errors(), message="field required"
        ),
    )


def get_application() -> FastAPI:
    """Initialize FastAPI application.

    Returns:
       FastAPI: Application object instance.

    """
    instance = FastAPI(
        title=config.project_name,
        description=config.project_description,
        version=config.project_version,
        debug=False,
    )
    instance.include_router(root_api_router)
    instance.add_exception_handler(HttpException, exception_handler)
    instance.add_exception_handler(RequestValidationError, validation_exception_handler)
    return instance


app = get_application()

# Configures the CORS middleware for the FastAPI app
cors_allowed_origins_str = os.getenv("CORS_ALLOWED_ORIGINS", "")
origins = cors_allowed_origins_str.split(",") if cors_allowed_origins_str else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

task_dir = utils.task_dir()
app.mount(
    "/tasks", StaticFiles(directory=task_dir, html=True, follow_symlink=True), name=""
)

public_dir = utils.public_dir()
app.mount("/", StaticFiles(directory=public_dir, html=True), name="")


@app.on_event("shutdown")
def shutdown_event():
    logger.info("shutdown event")


@app.on_event("startup")
def startup_event():
    logger.info("startup event")
```

### `app\router.py`
```
"""Application configuration - root APIRouter.

Defines all FastAPI application endpoints.

Resources:
    1. https://fastapi.tiangolo.com/tutorial/bigger-applications

"""

from fastapi import APIRouter

from app.controllers.v1 import llm, video

root_api_router = APIRouter()
# v1
root_api_router.include_router(video.router)
root_api_router.include_router(llm.router)
```

### `app\__init__.py`
```
```

### `app\config\config.py`
```
import os
import shutil
import socket

import toml
from loguru import logger

root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.realpath(__file__))))
config_file = f"{root_dir}/config.toml"
_CONTAINER_CGROUP_MARKERS = ("docker", "containerd", "kubepods", "libpod", "podman")
_DOCKER_HOST_GATEWAY_NAME = "host.docker.internal"


def is_running_in_container(
    dockerenv_path: str = "/.dockerenv",
    containerenv_path: str = "/run/.containerenv",
    cgroup_path: str = "/proc/1/cgroup",
) -> bool:
    """
    判断当前进程是否运行在容器内。

    这个判断主要用于 Ollama 默认地址选择：
    - 普通本机运行时，`localhost` 指向用户机器本身；
    - Docker 容器内，`localhost` 指向容器自己，访问宿主机 Ollama
      通常需要使用 `host.docker.internal`。

    不能只判断 `/proc/1/cgroup` 是否存在，因为普通 Linux 也会有这个文件。
    这里只在检测到明确的容器标记时返回 True，避免误伤非 Docker Linux 用户。
    参数保留为可注入路径，便于单元测试覆盖不同运行环境。
    """
    if os.path.isfile(dockerenv_path) or os.path.isfile(containerenv_path):
        return True

    try:
        with open(cgroup_path, mode="r", encoding="utf-8") as fp:
            cgroup_content = fp.read().lower()
    except OSError:
        return False

    return any(marker in cgroup_content for marker in _CONTAINER_CGROUP_MARKERS)


def _can_resolve_hostname(hostname: str) -> bool:
    try:
        socket.gethostbyname(hostname)
    except OSError:
        return False
    return True


def _decode_linux_route_gateway(hex_gateway: str) -> str:
    # /proc/net/route 里的 Gateway 是 16 进制小端序，例如 010011AC 表示
    # 172.17.0.1。这里单独解析，是为了在原生 Linux Docker 没有
    # host.docker.internal DNS 记录时，还能尝试访问容器默认网关上的宿主机。
    if len(hex_gateway) != 8:
        raise ValueError("invalid gateway length")

    octets = [
        str(int(hex_gateway[index : index + 2], 16))
        for index in range(6, -1, -2)
    ]
    return ".".join(octets)


def get_container_default_gateway_ip(route_path: str = "/proc/net/route") -> str:
    """
    读取 Linux 容器里的默认网关 IP。

    Docker Desktop 通常提供 `host.docker.internal`，但原生 Linux Docker
    默认不一定提供这个 DNS 名称。默认网关通常可以作为访问宿主机服务的
    兜底地址；如果用户的 Ollama 只监听 127.0.0.1，则仍需要用户让
    Ollama 监听宿主机网卡或手动配置 `ollama_base_url`。
    """
    try:
        with open(route_path, mode="r", encoding="utf-8") as fp:
            route_lines = fp.readlines()
    except OSError:
        return ""

    for line in route_lines[1:]:
        fields = line.strip().split()
        if len(fields) < 3:
            continue

        destination = fields[1]
        gateway = fields[2]
        if destination != "00000000" or gateway == "00000000":
            continue

        try:
            return _decode_linux_route_gateway(gateway)
        except ValueError:
            logger.warning(f"invalid container gateway route entry: {line.strip()}")
            return ""

    return ""


def get_default_ollama_base_url() -> str:
    """
    返回 Ollama 的默认 OpenAI-compatible base_url。

    用户显式配置 `ollama_base_url` 时不会走这里；这里只处理“未配置时的
    最佳默认值”。容器内默认指向宿主机，普通本机运行默认指向 localhost。
    """
    if not is_running_in_container():
        return "http://localhost:11434/v1"

    if _can_resolve_hostname(_DOCKER_HOST_GATEWAY_NAME):
        return f"http://{_DOCKER_HOST_GATEWAY_NAME}:11434/v1"

    gateway_ip = get_container_default_gateway_ip()
    if gateway_ip:
        logger.info(
            "host.docker.internal is not resolvable, fallback to container "
            f"default gateway for Ollama: {gateway_ip}"
        )
        return f"http://{gateway_ip}:11434/v1"

    logger.warning(
        "failed to resolve host.docker.internal and container default gateway; "
        "fallback to host.docker.internal for Ollama"
    )
    return f"http://{_DOCKER_HOST_GATEWAY_NAME}:11434/v1"


def load_config():
    # fix: IsADirectoryError: [Errno 21] Is a directory: '/MoneyPrinterTurbo/config.toml'
    if os.path.isdir(config_file):
        shutil.rmtree(config_file)

    if not os.path.isfile(config_file):
        example_file = f"{root_dir}/config.example.toml"
        if os.path.isfile(example_file):
            shutil.copyfile(example_file, config_file)
            logger.info("copy config.example.toml to config.toml")

    logger.info(f"load config from file: {config_file}")

    try:
        _config_ = toml.load(config_file)
    except Exception as e:
        logger.warning(f"load config failed: {str(e)}, try to load as utf-8-sig")
        with open(config_file, mode="r", encoding="utf-8-sig") as fp:
            _cfg_content = fp.read()
            _config_ = toml.loads(_cfg_content)
    return _config_


def save_config():
    with open(config_file, "w", encoding="utf-8") as f:
        _cfg["app"] = app
        _cfg["azure"] = azure
        _cfg["siliconflow"] = siliconflow
        _cfg["ui"] = ui
        f.write(toml.dumps(_cfg))


_cfg = load_config()
app = _cfg.get("app", {})
whisper = _cfg.get("whisper", {})
proxy = _cfg.get("proxy", {})
azure = _cfg.get("azure", {})
siliconflow = _cfg.get("siliconflow", {})
ui = _cfg.get(
    "ui",
    {
        "hide_log": False,
    },
)

hostname = socket.gethostname()

log_level = _cfg.get("log_level", "DEBUG")
listen_host = _cfg.get("listen_host", "0.0.0.0")
listen_port = _cfg.get("listen_port", 8080)
project_name = _cfg.get("project_name", "MoneyPrinterTurbo")
project_description = _cfg.get(
    "project_description",
    "<a href='https://github.com/harry0703/MoneyPrinterTurbo'>https://github.com/harry0703/MoneyPrinterTurbo</a>"
    "<br><small>Supported by <a href='https://aihubmix.com/?aff=CEve'>AIHubMix</a></small>",
)
project_version = _cfg.get("project_version", "1.3.0")
reload_debug = False

app["redis_host"] = os.getenv(
    "MPT_APP_REDIS_HOST",
    os.getenv("REDIS_HOST", app.get("redis_host", "localhost")),
)

imagemagick_path = app.get("imagemagick_path", "")
if imagemagick_path and os.path.isfile(imagemagick_path):
    os.environ["IMAGEMAGICK_BINARY"] = imagemagick_path

ffmpeg_path = app.get("ffmpeg_path", "")
if ffmpeg_path and os.path.isfile(ffmpeg_path):
    os.environ["IMAGEIO_FFMPEG_EXE"] = ffmpeg_path

logger.info(f"{project_name} v{project_version}")
```

### `app\config\__init__.py`
```
import os
import sys

from loguru import logger

from app.config import config
from app.utils import utils


def __init_logger():
    # _log_file = utils.storage_dir("logs/server.log")
    _lvl = config.log_level
    root_dir = os.path.dirname(
        os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
    )

    def format_record(record):
        # 获取日志记录中的文件全路径
        file_path = record["file"].path
        # 将绝对路径转换为相对于项目根目录的路径
        relative_path = os.path.relpath(file_path, root_dir)
        # 更新记录中的文件路径
        record["file"].path = f"./{relative_path}"
        # 返回修改后的格式字符串
        # 您可以根据需要调整这里的格式
        _format = (
            "<green>{time:%Y-%m-%d %H:%M:%S}</> | "
            + "<level>{level}</> | "
            + '"{file.path}:{line}":<blue> {function}</> '
            + "- <level>{message}</>"
            + "\n"
        )
        return _format

    logger.remove()

    logger.add(
        sys.stdout,
        level=_lvl,
        format=format_record,
        colorize=True,
    )

    # logger.add(
    #     _log_file,
    #     level=_lvl,
    #     format=format_record,
    #     rotation="00:00",
    #     retention="3 days",
    #     backtrace=True,
    #     diagnose=True,
    #     enqueue=True,
    # )


__init_logger()
```

### `app\controllers\base.py`
```
from uuid import uuid4

from fastapi import Request

from app.config import config
from app.models.exception import HttpException


def get_task_id(request: Request):
    task_id = request.headers.get("x-task-id")
    if not task_id:
        task_id = uuid4()
    return str(task_id)


def get_api_key(request: Request):
    api_key = request.headers.get("x-api-key")
    return api_key


def verify_token(request: Request):
    token = get_api_key(request)
    if token != config.app.get("api_key", ""):
        request_id = get_task_id(request)
        request_url = request.url
        user_agent = request.headers.get("user-agent")
        raise HttpException(
            task_id=request_id,
            status_code=401,
            message=f"invalid token: {request_url}, {user_agent}",
        )
```

### `app\controllers\ping.py`
```
from fastapi import APIRouter, Request

router = APIRouter()


@router.get(
    "/ping",
    tags=["Health Check"],
    description="检查服务可用性",
    response_description="pong",
)
def ping(request: Request) -> str:
    return "pong"
```

### `app\controllers\manager\base_manager.py`
```
import threading
from typing import Any, Callable, Dict

from loguru import logger


class TaskQueueFullError(ValueError):
    pass


class TaskManager:
    def __init__(self, max_concurrent_tasks: int, max_queued_tasks: int = 100):
        self.max_concurrent_tasks = max_concurrent_tasks
        self.max_queued_tasks = max_queued_tasks
        self.current_tasks = 0
        self.lock = threading.Lock()
        self.queue = self.create_queue()

    def create_queue(self):
        raise NotImplementedError()

    def add_task(self, func: Callable, *args: Any, **kwargs: Any):
        with self.lock:
            if self.current_tasks < self.max_concurrent_tasks:
                logger.info(
                    f"add task: {func.__name__}, current_tasks: {self.current_tasks}"
                )
                self.execute_task(func, *args, **kwargs)
            else:
                queue_size = self.queue_size()
                # 并发数已满时才进入排队。队列必须有上限，否则匿名接口可以持续
                # 堆积任务对象和请求参数，最终造成内存耗尽或第三方 API 成本失控。
                if queue_size >= self.max_queued_tasks:
                    logger.warning(
                        f"reject task: {func.__name__}, queue_size: {queue_size}, "
                        f"max_queued_tasks: {self.max_queued_tasks}"
                    )
                    raise TaskQueueFullError("task queue is full, please try again later")

                logger.info(
                    f"enqueue task: {func.__name__}, current_tasks: {self.current_tasks}, "
                    f"queue_size: {queue_size}"
                )
                self.enqueue({"func": func, "args": args, "kwargs": kwargs})

    def execute_task(self, func: Callable, *args: Any, **kwargs: Any):
        thread = threading.Thread(
            target=self.run_task, args=(func, *args), kwargs=kwargs
        )
        thread.start()

    def run_task(self, func: Callable, *args: Any, **kwargs: Any):
        try:
            with self.lock:
                self.current_tasks += 1
            func(*args, **kwargs)  # call the function here, passing *args and **kwargs.
        finally:
            self.task_done()

    def check_queue(self):
        with self.lock:
            if (
                self.current_tasks < self.max_concurrent_tasks
                and not self.is_queue_empty()
            ):
                task_info = self.dequeue()
                func = task_info["func"]
                args = task_info.get("args", ())
                kwargs = task_info.get("kwargs", {})
                self.execute_task(func, *args, **kwargs)

    def task_done(self):
        with self.lock:
            self.current_tasks -= 1
        self.check_queue()

    def enqueue(self, task: Dict):
        raise NotImplementedError()

    def dequeue(self):
        raise NotImplementedError()

    def is_queue_empty(self):
        raise NotImplementedError()

    def queue_size(self):
        raise NotImplementedError()
```

### `app\controllers\manager\memory_manager.py`
```
from queue import Queue
from typing import Dict

from app.controllers.manager.base_manager import TaskManager


class InMemoryTaskManager(TaskManager):
    def create_queue(self):
        return Queue(maxsize=self.max_queued_tasks)

    def enqueue(self, task: Dict):
        self.queue.put(task)

    def dequeue(self):
        return self.queue.get()

    def is_queue_empty(self):
        return self.queue.empty()

    def queue_size(self):
        return self.queue.qsize()
```
