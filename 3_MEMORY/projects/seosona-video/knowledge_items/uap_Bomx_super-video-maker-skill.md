# KI: Bomx/super-video-maker-skill

## Overview
This project, "super-video-maker-skill," appears to be an agent skill package designed for end-to-end AI video production. It leverages various tools and services (Heygen, Replicate, OpenAI, ElevenLabs) to automate video creation workflows, potentially involving avatar generation, voice synthesis, and video rendering. The project includes recipes and templates for different video types like explainers, ads, and repurposing longform content.

## Tech Stack (from code)
- **JavaScript/TypeScript:**  The presence of `.tsx` and `.ts` files within the `remotion-template/src` directory, along with a `package.json` file indicating a Node.js project, confirms the use of JavaScript/TypeScript. (`remotion-template/src/CaptionedTalkingHead.tsx`, `remotion-template/remotion.config.ts`)
- **Python:** The existence of numerous `.py` files in the `tools/` directory and scripts defined within `package.json` (e.g., `"recipes:list": "python3 tools/video_recipes.py list"`) indicates Python is a core language for tooling and recipe execution. (`tools/video_recipes.py`, `package.json`)
- **Remotion:** The `remotion-template/` directory, along with the script `"remotion:studio"` and `"remotion:render"` in `package.json`, suggests the use of Remotion for video creation.  (`package.json`, `remotion-template/build_caption_props.py`)
- **Hyperframes:** The `hyperframes-template/` directory, along with scripts like `"hyperframes:preview"` and `"hyperframes:render"` in `package.json`, indicates the use of Hyperframes for video composition and rendering. (`package.json`, `hyperframes-template/README.md`)
- **Node Package Manager (npm):** The presence of a `package.json` file confirms the project uses npm as its package manager. (`package.json`)

## Public API / Exports
Due to the limited scope of analysis, identifying public APIs or exported functions is difficult. However, based on the files present:

- **Remotion Components:**  The `CaptionedTalkingHead.tsx` file within the `remotion-template/src` directory suggests a custom Remotion component named "CaptionedTalkingHead" is being developed and likely exported for use in Remotion projects. (`remotion-template/src/CaptionedTalkingHead.tsx`)
- **Recipe Functions:** The `tools/video_recipes.py` file, referenced by scripts in `package.json`, implies the existence of functions within that module responsible for executing video creation recipes.  (`package.json`, `tools/video_recipes.py`)

## Dependencies
- **JavaScript/Node.js (from package.json):**  (Partial list - full list would require parsing package.json)
    - npm
- **Python (from requirements.txt):**
    - requests
    - python-dotenv
    - openai
    - replicate
    - ffmpeg-python
    - Pillow
    - boto3
    - mysql-connector-python
    - playwright

## Architecture Patterns
- **Recipe-Based Workflow:** The project utilizes a recipe system, as evidenced by the `recipes/` directory and scripts in `package.json`. This suggests a modular approach to video creation where different video types are defined as recipes with specific steps. (`package.json`, `recipes/*`)
- **Templating:**  The presence of `remotion-template/` and `hyperframes-template/` directories indicates the use of templating for video creation, allowing for reusable components and layouts. (`remotion-template/README.md`, `hyperframes-template/README.md`)
- **Configuration Driven:** The `.env.example` file suggests that configuration values (API keys, AWS credentials) are externalized, enabling flexibility and environment-specific settings.  (`.env.example`)

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **Automated Video Generation:** The recipe-based workflow and integration with AI services (OpenAI, Replicate, Heygen) can be leveraged to automate video creation tasks within SEOSONA OS. This would reduce manual effort and improve efficiency.
- **Customizable Video Templates:**  The Remotion and Hyperframes templates provide a foundation for creating custom video assets tailored to specific SEOSONA OS use cases.
- **Integration with AI Agents:** The "agent skill package" nature of the project suggests it's designed to be integrated into an agent framework, which aligns well with SEOSONA OS’s focus on intelligent automation.  The Python tooling could be adapted for integration within a larger orchestration system.

## UAP Routing (auto-classified)
- **System:** `seosona-video` · **Function:** `video-render` · **Fit:** 88/100 · **Auto-apply:** True
- **Evidence:** `ffmpeg`, `remotion`, `render`, `hyperframe`
- **All scores:** {'seosona-os': 34, 'seosona-video': 88, 'seosona-content': 22, 'seosona-ux-ui': 22, 'seosona-flow': 6}
