# KI: django-wiki/django-wiki

## Overview
This project implements a wiki system built on top of the Django framework. It provides functionality for creating, editing, and organizing wiki pages using Markdown syntax. The project appears to be in a production-stable state with extensive localization support.

## Tech Stack (from code)
- **Language:** Python - evident from numerous `.py` files throughout the repository (e.g., `src/wiki/__init__.py`).
- **Framework:** Django - confirmed by the presence of Django project structure and imports like `django.conf` in `src/wiki/conf/settings.py`.
- **Build System:** Hatch - specified in `pyproject.toml`: `build-backend = "hatchling.build"`.
- **Markdown Processing:** Markdown library is used for rendering wiki content, as indicated by the dependency on `Markdown>=3.4,<3.10` in `pyproject.toml` and directory structure `src/wiki/core/markdown`.

## Public API / Exports
Due to the sheer size of the codebase, a comprehensive list is impractical. However, based on file names and common Django patterns, some likely exported components include:

- **Models:** Defined within `src/wiki/models.py` (file not provided but inferred from directory structure). These models represent wiki pages, revisions, etc.
- **Forms:**  Defined in `src/wiki/forms.py` and `src/wiki/forms_account_handling.py`. These forms handle user input for creating and editing wiki content.
- **Views (URLs):** Defined in `src/wiki/urls.py`, which likely maps URL patterns to view functions or class-based views within the `src/wiki` application.
- **Admin Interface:**  Defined in `src/wiki/admin.py`. This provides an administrative interface for managing wiki content and users.

## Dependencies
Based on `pyproject.toml`:
- Django (>=4.0,<5.3)
- bleach (>=6,<7)
- Pillow
- django-nyt (>=1.4.2,<1.5)
- django-mptt (>=0.13,<0.17)
- django-sekizai (>=0.10)
- sorl-thumbnail (>=12.8,<13)
- Markdown (>=3.4,<3.10)

## Architecture Patterns
- **Django Application Structure:** The project follows the standard Django application structure with `models`, `views`, `forms`, and `admin` modules within the `src/wiki` directory.
- **Configuration Management:**  Settings are centralized in `src/wiki/conf/settings.py`.
- **Localization:** Extensive localization support is evident from the numerous locale directories (`locale/pt`, `locale/zh_Hans`, etc.) containing `.mo` files, indicating a focus on internationalization.
- **Plugin Architecture**: The presence of `src/wiki/core/plugins/base.py`, `src/wiki/core/plugins/__init__.py`, and `src/wiki/core/plugins/loader.py` suggests a plugin architecture for extending the wiki's functionality.

## Relevance to SEOSONA OS
- **Content Management:** The Django-Wiki project could be adapted as a content management system (CMS) within SEOSONA OS, providing a structured way to manage documentation, tutorials, or other informational resources.
- **Markdown Support:**  The built-in Markdown support would allow users to easily create and edit content using a simple markup language.
- **Plugin Extensibility:** The plugin architecture allows for customization and integration with other SEOSONA OS components. For example, plugins could be developed to integrate the wiki with user authentication systems or data sources within the operating system.
- **Localization**:  The existing localization infrastructure would simplify adapting the wiki to different languages used within SEOSONA OS environments.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `plugin`
- **All scores:** {'seosona-os': 41, 'seosona-video': 22, 'seosona-content': 33, 'seosona-ux-ui': 0, 'seosona-flow': 0}
