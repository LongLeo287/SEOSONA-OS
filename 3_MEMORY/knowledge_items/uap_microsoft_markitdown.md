# KI: microsoft/markitdown

## Overview
Repository with 77 files across 19 directories. Primary language: Python (52 files).

## Tech Stack (from code)
- Python (52 files)
- **Total:** 77 files, 19 directories
- **File types:** .py: 52, .md: 9, .toml: 4, .typed: 3, .dockerignore: 1, .gitattributes: 1, .gitignore: 1, .yaml: 1

## File Structure
```
  .dockerignore
  .gitattributes
  .gitignore
  .pre-commit-config.yaml
  CODE_OF_CONDUCT.md
  Dockerfile
  LICENSE
  README.md
  SECURITY.md
  SUPPORT.md
  .devcontainer/
    devcontainer.json
  packages/
    markitdown/
      README.md
      ThirdPartyNotices.md
      pyproject.toml
      src/
        markitdown/
          __about__.py
          __init__.py
          __main__.py
          _base_converter.py
          _exceptions.py
          _markitdown.py
          _stream_info.py
          _uri_utils.py
          py.typed
          converter_utils/
            __init__.py
            docx/
              __init__.py
              pre_process.py
              math/
                __init__.py
                latex_dict.py
                omml.py
          converters/
            __init__.py
            _audio_converter.py
            _bing_serp_converter.py
            _csv_converter.py
            _cu_converter.py
            _doc_intel_converter.py
            _docx_converter.py
            _epub_converter.py
            _exiftool.py
            _html_converter.py
            _image_converter.py
            _ipynb_converter.py
            _llm_caption.py
            _markdownify.py
            _outlook_msg_converter.py
            _pdf_converter.py
            _plain_text_converter.py
            _pptx_converter.py
            _rss_converter.py
            _transcribe_audio.py
            _wikipedia_converter.py
            _xlsx_converter.py
            _youtube_converter.py
            _zip_converter.py
    markitdown-mcp/
      Dockerfile
      README.md
      pyproject.toml
      src/
        markitdown_mcp/
          __about__.py
          __init__.py
          __main__.py
          py.typed
    markitdown-ocr/
      LICENSE
      README.md
      pyproject.toml
      src/
        markitdown_ocr/
          __about__.py
          __init__.py
          _docx_converter_with_ocr.py
          _ocr_service.py
          _pdf_converter_with_ocr.py
          _plugin.
```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-content` · **Function:** `srt` · **Fit:** 66/100 · **Auto-apply:** True
- **Evidence:** `transcript`, `caption`
- **All scores:** {'seosona-os': 61, 'seosona-video': 56, 'seosona-content': 66, 'seosona-ux-ui': 0, 'seosona-flow': 0}
