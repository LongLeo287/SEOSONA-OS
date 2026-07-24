# KI: opentoonz/opentoonz

## Overview
OpenToonz is an open-source 2D animation software. The codebase appears focused on image processing, vector graphics manipulation, and user interface elements for creating animated content.  It utilizes a modular plugin architecture to extend its functionality.

## Tech Stack (from code)
*   **C++:** Extensive use of `.cpp` and `.h` files throughout the repository indicates C++ as the primary language. For example: `plugins/blur/blur.cpp`.
*   **CMake:** The presence of numerous `CMakeLists.txt` files, such as in `plugins/blur/CMakeLists.txt`, signifies CMake as the build system.
*   **Qt:**  The `appveyor.yml` file explicitly references Qt and includes steps to download and configure it: `QT_PATH: "%APPVEYOR_BUILD_FOLDER%\\thirdparty\\qt\\5.15.2_wintab\\msvc2019_64"` and the subsequent commands for extraction and symbolic linking suggest Qt is a core UI framework.
*   **OpenCV:** The `appveyor.yml` file also indicates OpenCV is used: `OPENCV_VERSION: "4.13.0"`.

## Public API / Exports
Due to the sheer size of the codebase, identifying all public APIs would be impractical without further context or documentation. However, some examples can be gleaned from header files:

*   `plugins/utils/affine.hpp`: Contains class `Affine`, suggesting an affine transformation library.
*   `plugins/utils/interf_holder.hpp`: Defines a class `InterfaceHolder`, likely related to UI elements and interaction management.
*   `stuff/config/reslist.txt`:  This file, while not code itself, implies the existence of resources (likely images, fonts, etc.) that are accessed via some API within the application.

## Dependencies
The `appveyor.yml` file reveals several dependencies:

*   **Qt 5.15.2:** Downloaded and configured explicitly in the build process.
*   **OpenCV 4.13.0:**  Installed using Chocolatey during the build process.
*   **Boost 1.89.0:** Referenced by `BOOST_ROOT: "C:\\Libraries\\boost_1_89_0"`.
*   **tiff-4.0.3**: Included as part of third party libraries, and its configuration file is copied during the build process.

## Architecture Patterns
*   **Plugin Architecture:** The presence of `plugins/` directory with subdirectories like `blur`, `geom`, and `multiplugin`, each containing a `CMakeLists.txt` file, strongly suggests a plugin-based architecture allowing for extensibility.
*   **Configuration Files:**  The extensive use of configuration files in `stuff/config/` (e.g., `reslist.txt`, `brush.txt`) indicates that application behavior and resources are configurable through external files.

## Relevance to SEOSONA OS
*   **Image Processing Capabilities:** OpenToonz's reliance on OpenCV suggests it has robust image processing capabilities which could be leveraged for enhancing SEOSONA OS’s media handling features.
*   **Vector Graphics Support:** The codebase likely contains vector graphics manipulation routines that could be integrated into SEOSONA OS's drawing or design tools.
*   **UI Framework Integration:**  The use of Qt provides a well-established UI framework, potentially simplifying the development of graphical applications for SEOSONA OS.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `plugin`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
