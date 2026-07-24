# KI: killkimno/MORT

## Overview
MORT is a program that extracts dialogs from the screen in real time using OCR and outputs a translations using DB or machine translation.

## Architecture & Tech Stack
- Could not detect automatically
- **Total files:** 131 files across 18 directories
- **File types:** .cs: 82, .resx: 23, .md: 5, .config: 5, .yml: 3, .csproj: 3, .ico: 3

## Core Capabilities
* Realtime translate
* OCR - TesseractOCR , Windows OCR, Google Cloud Vision OCR, Snipping Tool OCR, Easy OCR
* Machine translation - Naver Papago, Google Web, Google Sheet, ezTrans, DeepL
* Language Patch with using DB
* Multiple OCR areas
* Img adjust

## Documentation Sections
- MORT #
- Features ##
- System Requirement ##
- How to use ##
- Custom usage ##
- FAQ ##
- Develop the project
- Development environment ###
- Create a build and run environment ###
- Related Project ###
- ETC ##
- Development Plans Trello ###
- Discord ###

## Core Structure
```
  .gitignore
  CLAUDE.md
  LICENSE
  MORT.sln
  MORT_LOGO.png
  README.base.md
  README.en.md
  README.kr.md
  README.md
  dsd.txt
  .github/
    FUNDING.yml
    dependabot.yml
    workflows/
      dependency-bot-windows.yml
  CloudVision/
    Api.cs
    CloudVision.csproj
    GoogleOcrResult.cs
    app.config
    packages.config
  GSTrans/
    GSTrans.csproj
    Sheets.cs
    app.config
    packages.config
  MORT/
    ASD2.ico
    About.Designer.cs
    About.cs
    About.resx
    AdvencedOptionManager.cs
    BorderlessResizeForwarder.cs
    ColorGroup.cs
    ColorGroupForm.Designer.cs
    ColorGroupForm.cs
    ColorGroupForm.resx
    ColorInformation.Designer.cs
    ColorInformation.cs
    CustomLabel.Designer.cs
    CustomLabel.cs
    DonatePage.Designer.cs
    DonatePage.cs
    DonatePage.resx
    Form1.Designer.cs
    Form1.cs
    Form1.resx
    Form1Button.cs
    FormClipboardAssist.cs
    FormLocalize.cs
    FormOption.cs
    IMainFormContract.cs
    KeyInputLabel.Designer.cs
    KeyInputLabel.cs
    KeyInputLabel.resx
    Logo.Designer.cs
    Logo.cs
    Logo.resx
    MORT.csproj
    MORT.csproj.user
    Newtonsoft.Json.dll
    OcrAreaForm.Designer.cs
    OcrAreaForm.cs
    OcrAreaForm.resx
    Program.cs
    Rtt.Designer.cs
    Rtt.cs
    SearchOptionForm.Designer.cs
    SearchOptionForm.cs
    SearchOptionForm.resx
    SettingManager.cs
    Settings.cs
    TabControl.cs
    TabControl.resx
    TransForm.Designer.cs
    TransForm.cs
    TransFormLayer.Designer.cs
    TransFormLayer.cs
    TransFormLayer.resx
    TransFormOver.Designer.cs
    TransFormOver.cs
    TransFormOver.resx
    UIAdvencedOption.Designer.cs
    UIAdvencedOption.cs
    UIAdvencedOption.resx
    Util.cs
    app.config
    app.manifest
    icon.ico
    mainIcon.ico
    rtt.resx
    screenForm.Designer.cs
    screenForm.cs
    screenForm.resx
    transForm.resx
    AlphaDialog/
      AlphaColorDialog.cs
      AlphaColorPanel.cs
    ClipboardAssist/
      ClipboardMonitor.cs
    Color Picker/
      BinaryColorPickerForm.Designer.cs
      BinaryColorPickerForm.cs
      BinaryColorPickerForm.resx
      ColorPickerForm.Designer.cs
      ColorPickerForm.cs
      ColorPickerForm.resx
    ColorThief/
      CMap.cs
      ColorExtensions.cs
      ColorThief.cs
      Mmcq.cs
      Simd.cs
      VBox.cs
      VBoxComparer.cs
      VBoxCountComparer.cs
    CustomControl/
      CtHotKey.Designer.cs
      CtHotKey.cs
      CtHotKey.resx
      CtSettingHotKey.Designer.cs
      CtSettingHotKey.c
```

## Quick Start
```bash
code, name
(ex : it, Italian)
POST Rule
name - string
text - string - ocr string
target - string - translation result language code
source - string - ocr language code
ex
{
"name" : "test",
```

## Agent Configuration

--- CLAUDE.md ---
# MORT 프로젝트 작업 규약

## 프로젝트 성격
MORT는 2013년부터 이어진 장기 유지보수 프로젝트로, **옛날 방식과 현재 방식이 한 코드베이스 안에 혼재**되어 있다. 사용자 설정 파일 호환성, 기존 사용자층 보호, 점진적 리팩터링 중인 상태이기 때문에 한 번에 정리할 수 없다.

## 작업 원칙

### 1. 통일하려 들지 말 것
- 작업 요청 범위를 벗어나서 "낡았으니 정리하자"는 식의 리팩터링 금지
- 사용자가 명시적으로 요청할 때만 패턴을 통일한다
- 버그 픽스/기능 추가는 **주변 코드 스타일을 그대로 따른다**
- Newtonsoft.Json과 System.Text.Json이 같이 쓰여도, RestSharp와 HttpClient가 같이 쓰여도 통일하지 말 것

### 2. 싱글톤과 DI 공존
- `OcrManager.Instace`, `FormManager.Instace`, `TransManager._instance` 같은 싱글톤과 `Program.ServiceContainer`, `ConfigureServices`의 DI는 **공존하는 게 정상**
- 새 매니저/서비스를 만들 땐 DI 우선
- 기존 매니저를 호출할 땐 싱글톤 접근(`Instace`)을 자연스럽게 써도 된다
- `TransManager`처럼 DI로 등록되어 있지만 `_instance`도 같이 유지하는 하이브리드 패턴도 OK

### 3. 호환성 묶인 구조 보존 (절대 변경 금지)
- `SettingManager.TransType` enum 순서 (`google_url`, `db`, `papago_web`, `naver`, `google`, `deepl`, `deeplApi`, `gemini`, `ezTrans`, `customApi`)
- `SettingManager.OcrType` enum 순서 (`Tesseract=0`, `Window=1`, `OneOcr=2`, `Google=3`, `EasyOcr=4`)
- `SettingManager.Skin` enum 순서 (`dark`, `layer`, `over`)
- `@KEY ` 프리픽스 기반 텍스트 키-값 설정 포맷
- 직렬화 키 이름
- 코드 주석에도 "앞 소문자 바꾸면 안 됨 -> 기존 버전과 호환성"이라고 명시되어 있음

### 4. 거대 파일은 그대로 둠
점진적 분리 중인 상태로, 손대지 않는다:
- `Form1.cs` (3441줄)
- `SettingManager.cs` (1930줄)
- `UIAdvencedOption.cs` (1190줄)
- `TransManager.cs` (1246줄)
- `FormManager.cs` (1152줄)
- `AdvencedOptionManager.cs` (740줄)

요청받은 작업 범위 외엔 분리/리팩터링하지 않는다.

### 5. 새 기능 추가 위치
최근 커밋 흐름을 따른다:
- 비즈니스 로직 → `Service/` (e.g. `Service/Gemini/`, `Service/CustomApi/`)
- 데이터 모델 → `Model/` (record 타입 선호)
- DI 등록 → `Program.ConfigureServices`
- 번역 API → `TransAPI/`
- OCR API → `OcrApi/`

## 프로젝트 구조 요약

### 솔루션 (5개 프로젝트)
1. **MORT** — 메인 WinForms 앱 (.NET 9, x64)
2. **CloudVision** — Google Cloud Vision OCR 래퍼
3. **GSTrans** — Google Sheets 번역기
4. **PipeClient** — EzTrans 연동용 IPC
5. **Updater** — 업데이트 모듈 (AnyCPU)

### 핵심 디렉토리
- **진입점**: `Program.cs` → DI 구성 → `Form1`
- **Manager**: `OcrManager`(싱글톤), `TransManager`(DI+싱글톤 하이브리드), `FormManager`(싱글톤), `OCRDataManager`
- **Service**: `Service/G


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
