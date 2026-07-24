# KI: tmseidel/ai-git-bot

## Overview
This project, `ai-git-bot`, is a self-hostable gateway application designed to connect Git platforms (like GitHub, GitLab, and Bitbucket) with AI providers. It facilitates automated code review and other agentic workflows using large language models (LLMs). The application's configuration allows for customization of tools and integration with various LLM backends.

## Tech Stack (from code)
- **Java:**  The primary language is Java, evidenced by the `.java` file extensions (312 files) and the `pom.xml` build file. (`src/m/.../*.java`, `pom.xml`)
- **Spring Boot:** The project uses Spring Boot for its web framework and application management, as indicated in the `pom.xml` file: `<groupId>org.springframework.boot</groupId>` and inheritance from `spring-boot-starter-parent`. (`pom.xml`)
- **Maven:** Maven is used as the build system, confirmed by the presence of `pom.xml`. (`pom.xml`)
- **PostgreSQL:** The application uses PostgreSQL for its database, specified in the `docker-compose.yml` file: `image: postgres:17-alpine` and environment variables related to database connection. (`docker-compose.yml`)
- **Node.js:** Node.js is used within the Dockerfile build process, likely for tooling or testing purposes.  (`Dockerfile`)

## Public API / Exports
Due to the lack of readily available compiled code (only source), identifying explicit public APIs/endpoints is difficult. However, based on the `docker-compose.yml` file and Spring Boot configuration, it appears that the application exposes an HTTP endpoint at port 8080:  `- "8080:8080"`. The presence of environment variables like `APP_PUBLIC_URL` suggests a configurable public URL for accessing the API. (`docker-compose.yml`)

## Dependencies
Based on the `pom.xml` file, key dependencies include:
- `org.springframework.boot:spring-boot-starter-web`: For web application development. (`pom.xml`)
- `org.springframework.boot:spring-boot-starter-actuator`:  For monitoring and management features. (`pom.xml`)
- `org.springframework.boot:spring-boot-starter-validation`: For request validation. (`pom.xml`)

## Architecture Patterns
- **Layered Architecture:** The Java code structure (visible through file names in the directory tree) suggests a layered architecture, with distinct modules for different functionalities.  (e.g., `src/m/.../*.java`)
- **Configuration-Driven:** The application's behavior is heavily influenced by environment variables and configuration files (like `docker-compose.yml`), indicating a design that prioritizes flexibility and customization. (`docker-compose.yml`)

## Relevance to SEOSONA OS
The ai-git-bot project could benefit SEOSONA OS in the following ways:
- **Automated Code Review Integration:** The bot's ability to automate code review processes can be integrated into SEOSONA OS development workflows, improving code quality and reducing manual effort.
- **LLM Orchestration:**  The application’s design for orchestrating LLMs could serve as a model or component for integrating AI capabilities into other SEOSONA OS services.
- **Customizable Agentic Workflows:** The configurable nature of the bot's agentic workflows allows for adaptation to specific SEOSONA OS needs and integration with existing tools.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 89/100 · **Auto-apply:** False
- **Evidence:** `agent`, `workflow`, `mcp`, `router`
- **All scores:** {'seosona-os': 89, 'seosona-video': 22, 'seosona-content': 0, 'seosona-ux-ui': 22, 'seosona-flow': 28}
