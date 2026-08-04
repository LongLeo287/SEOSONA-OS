# KI: yakhyo/uniface

## Overview
Package: uniface

## Tech Stack (from code)
- Python (91 files)
- **Total:** 172 files, 28 directories
- **File types:** .py: 91, .md: 39, .jpg: 27, .png: 4, .html: 2, .gitignore: 1, .yaml: 1, .yml: 1

## File Structure
```
  .gitignore
  .pre-commit-config.yaml
  AGENTS.md
  CHANGELOG.md
  CLAUDE.md
  CONTRIBUTING.md
  LICENSE
  README.md
  mkdocs.yml
  pyproject.toml
  uv.lock
  assets/
    einstein.png
    scientists.png
    test.jpg
    demos/
      age_gender.jpg
      anonymization.jpg
      detection.jpg
      face_attributes.png
      gaze.jpg
      headpose.jpg
      landmarks.jpg
      landmarks_pipnet.jpg
      matting.jpg
      parsing.jpg
      segmentation.jpg
      src_friends.jpg
      src_man1.jpg
      src_man2.jpg
      src_man3.jpg
      src_meeting.jpg
      src_portrait1.jpg
      verification.jpg
    test_images/
      image0.jpg
      image1.jpg
      image2.jpg
      image3.jpg
      image4.jpg
      image5.jpg
      attributes/
        eyeglasses.jpg
        mask.jpg
        sunglasses.jpg
  docs/
    contributing.md
    datasets.md
    index.md
    installation.md
    license-attribution.md
    models.md
    notebooks.md
    quickstart.md
    assets/
      logo.png
      logo.webp
    concepts/
      coordinate-systems.md
      execution-providers.md
      inputs-outputs.md
      model-cache-offline.md
      overview.md
      thresholds-calibration.md
    modules/
      attributes.md
      detection.md
      gaze.md
      headpose.md
      landmarks.md
      matting.md
      parsing.md
      privacy.md
      quality.md
      recognition.md
      spoofing.md
      stores.md
      tracking.md
    overrides/
      home.html
      main.html
    recipes/
      anonymize-stream.md
      batch-processing.md
      custom-models.md
      face-search.md
      image-pipeline.md
      video-webcam.md
    stylesheets/
      extra.css
  tools/
    README.md
    _common.py
    analyze.py
    anonymize.py
    attribute.py
    batch_process.py
    detect.py
    download_model.py
    emotion.py
    facemesh.py
    facestate.py
    fairface.py
    faiss_search.py
    gaze.py
    headpose.py
    landmarks.py
    parse.py
    quality.py
    recognize.py
    search.py
    sha256_g
```

## Agent Configuration
### AGENTS.md
<!-- Cursor agent instructions — shared with CLAUDE.md -->
<!-- See CLAUDE.md for full project instructions for AI coding agents. -->

# AGENTS.md

Please read and follow all instructions in [CLAUDE.md](./CLAUDE.md).


### CLAUDE.md
# CLAUDE.md

Project instructions for AI coding agents.

## Project Overview

UniFace is a Python library for face detection, recognition, tracking, landmark analysis, face parsing, gaze estimation, age/gender detection. It uses ONNX Runtime for inference.

## Code Style

- Python 3.10+ with type hints
- Line length: 120
- Single quotes for strings, double quotes for docstrings
- Google-style docstrings
- Formatter/linter: Ruff (config in `pyproject.toml`)
- Run `ruff format .` and `ruff check . --fix` before committing

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/) with a **capitalized** description:

```
<type>: <Capitalized short description>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`

Examples:
- `feat: Add gaze estimation model`
- `fix: Correct bounding box scaling for non-square images`
- `ci: Add nbstripout pre-commit hook`
- `docs: Update installation instructions`
- `refactor: Unify attribute/detector base classes`

## Testing

```bash
pytest -v --tb=short
```

Tests live in `tests/`. Run the full suite before submitting changes.

## Pre-commit

Pre-commit hooks handle formatting, linting, security checks, and notebook output stripping. Always run:

```bash
pre-commit install
pre-commit run --all-files
```

## Project Structure

```
uniface/            # Main package
  detection/        # Face detection models (SCRFD, RetinaFace, YOLOv5, YOLOv8)
  recognition/      # Face re

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `reference` · **Fit:** 22/100 · **Auto-apply:** False
- **Evidence:** `keyword`
- **All scores:** {'seosona-os': 22, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 6, 'seosona-flow': 6}
