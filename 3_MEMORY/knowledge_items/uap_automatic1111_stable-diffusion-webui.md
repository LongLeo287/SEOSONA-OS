# KI: automatic1111/stable-diffusion-webui

## Overview
A web interface for Stable Diffusion, implemented using Gradio library.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- Python
-   Python deps: GitPython, Pillow, accelerate, blendmodes, clean-fid, diskcache, einops, facexlib, fastapi, gradio, inflection, jsonmerge, kornia, lark, numpy
- **Total files:** 117 files across 32 directories
- **File types:** .py: 41, .js: 24, .html: 11, .yaml: 10, .txt: 7, .yml: 4, .md: 3
- **Dev dependencies:** eslint

## Core Capabilities
[Detailed feature showcase with images](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Features):
- Original txt2img and img2img modes
- One click install and run script (but you still must install python and git)
- Outpainting
- Inpainting
- Color Sketch
- Prompt Matrix
- Stable Diffusion Upscale
- Attention, specify parts of text that the model should pay more attention to
    - a man in a `((tuxedo))` - will pay more attention to tuxedo
    - a man in a `(tuxedo:1.21)` - alternative syntax
    - select text and press `Ctrl+Up` or `Ctrl+Down` (or `Command+Up` or `Command+Down` if you're on a MacOS) to automatically adjust attention to selected text (code contributed by anonymous user)
- Loopback, run img2img processing multiple times
- X/Y/Z plot, a way to draw a 3 dimensional plot of images with different parameters
- Textual Inversion
    - have as many embeddings as you want and use any names you like for them
    - use multiple embeddings with different numbers of vectors per token
    - works with half precision floating point numbers
    - train embeddings on 8GB (also reports of 6GB working)
- Extras tab with:
    - GFPGAN, neural network that fixes faces
    - CodeFormer, face restoration tool as an alternative to GFPGAN
    - RealESRGAN, neural network upscaler
    - ESRGAN, neural network upscaler with a lot of third party models
    - SwinIR and Swin2SR ([see here](https://github.com/AUTOMATIC1111/stable-diffusion-webui/pull/2092)), neural network upscalers
    - LDSR, Latent diffusion super resolution upscaling
- Resizing aspect ratio options
- Sampling method selection
    - Adjust sampler eta values (noise multiplier)
    - More advanced noise setting options
- Interrupt processing at any time
- 4GB video card support (also reports of 2GB working)
- Correct seeds for batches
- Live prompt token length validation
- Generation parameters
     - parameters you used to generate images are saved with that image
     - in PNG chunks for PNG, 

## Documentation Sections
- Stable Diffusion web UI
- Features
- Installation and Running
- Installation on Windows 10/11 with NVidia-GPUs using release package
- Automatic Installation on Windows
- Automatic Installation on Linux
- Debian-based:
- Red Hat-based:
- openSUSE-based:
- Arch-based:
- Ubuntu 24.04
- Manjaro/Arch
- Only for 3.11
- Then set up env variable in launch script
- or in webui-user.sh
- Installation on Apple Silicon
- Contributing
- Documentation
- Credits

## Available Commands
- `npm run lint` -- eslint .
- `npm run fix` -- eslint --fix .

## Core Structure
```
  .eslintignore
  .eslintrc.js
  .git-blame-ignore-revs
  .gitignore
  .pylintrc
  CHANGELOG.md
  CITATION.cff
  CODEOWNERS
  LICENSE.txt
  README.md
  _typos.toml
  environment-wsl2.yaml
  launch.py
  package.json
  pyproject.toml
  requirements-test.txt
  requirements.txt
  requirements_npu.txt
  requirements_versions.txt
  screenshot.png
  script.js
  style.css
  webui-macos-env.sh
  webui-user.bat
  webui-user.sh
  webui.bat
  webui.py
  webui.sh
  .github/
    pull_request_template.md
    ISSUE_TEMPLATE/
      bug_report.yml
      config.yml
      feature_request.yml
    workflows/
      on_pull_request.yaml
      run_tests.yaml
      warns_merge_master.yml
  configs/
    alt-diffusion-inference.yaml
    alt-diffusion-m18-inference.yaml
    instruct-pix2pix.yaml
    sd3-inference.yaml
    sd_xl_inpaint.yaml
    v1-inference.yaml
    v1-inpainting-inference.yaml
  embeddings/
    Place Textual Inversion embeddings here.txt
  extensions/
    put extensions here.txt
  extensions-builtin/
    LDSR/
      ldsr_model_arch.py
      preload.py
      sd_hijack_autoencoder.py
      sd_hijack_ddpm_v1.py
      vqvae_quantize.py
      scripts/
        ldsr_model.py
    Lora/
      extra_networks_lora.py
      lora.py
      lora_logger.py
      lora_patches.py
      lyco_helpers.py
      network.py
      network_full.py
      network_glora.py
      network_hada.py
      network_ia3.py
      network_lokr.py
      network_lora.py
      network_norm.py
      network_oft.py
      networks.py
      preload.py
      ui_edit_user_metadata.py
      ui_extra_networks_lora.py
      scripts/
        lora_script.py
    ScuNET/
      preload.py
      scripts/
        scunet_model.py
    SwinIR/
      preload.py
      scripts/
        swinir_model.py
    canvas-zoom-and-pan/
      style.css
      javascript/
        zoom.js
      scripts/
        hotkey_config.py
    extra-options-section/
      scripts/
        extra_options_section.py
    hypertile/
      hypertile.py
      scripts/
        hypertile_script.py
    mobile/
      javascript/
        mobile.js
    postprocessing-for-training/
      scripts/
        postprocessing_autosized_crop.py
        postprocessing_caption.py
        postprocessing_create_flipped_copies.py
        postprocessing_focal_crop.py
        postprocessing_split_oversized.py
    prompt-bracket-checker/
      javascript/
        prompt-bracket-checker.js
    soft-inpainting/
      scripts/
        soft_inpainting.py
  html/
    card-no-preview.png
  
```

## Quick Start
```bash
sudo apt install wget git python3 python3-venv libgl1 libglib2.0-0
sudo dnf install wget git python3 gperftools-libs libglvnd-glx
sudo zypper install wget git python3 libtcmalloc4 libglvnd
sudo pacman -S wget git python3
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt update
sudo apt install python3.11
sudo pacman -S yay
yay -S python311 # do not confuse with python3.11 package
export python_cmd="python3.11"
```

## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
