# KI: tanviet12/chat-quality-agent

## Overview
This project appears to be a platform for evaluating and improving the quality of chat interactions, likely across various messaging channels. It includes backend services for managing agents, conversations, costs, and integrations with different chat platforms like Facebook Messenger and Zalo OA. The frontend is built using Vue.js and interacts with the backend API.

## Tech Stack (from code)
- **Go:**  The primary backend language, evidenced by `backend/main.go` (`package main`) and numerous `.go` files throughout the `backend/` directory.
- **Vue.js:** The frontend framework, indicated by the presence of `.vue` files in the `frontend/` directory and the `frontend/package.json` file which includes dependencies like `@vitejs/plugin-vue`.
- **Node.js / npm:** Used for frontend development, as shown by `frontend/package.json` and build scripts within the Dockerfile.
- **MySQL:** The database system used, specified in `docker-compose.yml` (`image: mysql:8.0`) and configuration files like `.env.example`.
- **Nginx:** Used as a reverse proxy and SSL termination server, configured by `docker/nginx.conf` and the Dockerfile.

## Public API / Exports
Due to the limited scope of analysis (source code only), identifying all public APIs is difficult. However, based on file names and structure:
- **API Endpoints:** The `api/router.go` file suggests RESTful endpoints are defined within the `handlers/` directory (e.g., `activity_logs.go`, `users.go`).  The presence of `handlers/*.go` files strongly implies API endpoint implementations.
- **Channel Adapters:** Files like `channels/facebook/facebook.go` and `channels/zalo_oa/zalo_oa.go` suggest public interfaces or functions for interacting with specific chat channels.

## Dependencies
Based on the available code:
- **Backend (Go):** The `backend/go.mod` file lists dependencies including `github.com/gorilla/mux`, `gorm.io/gorm`, and database drivers.
- **Frontend (Node.js):**  The `frontend/package.json` file includes Vue.js, Vite, Axios, and other common web development libraries.

## Architecture Patterns
- **Microservices:** The project is structured into distinct services like "app", "db", and "nginx" in the `docker-compose.yml`, suggesting a microservice architecture.
- **Layered Architecture (Backend):**  The backend code exhibits a layered structure with directories for `main.go` (entry point), `api/router.go` (API routing), `handlers/*.go` (request handling), `db/*.go` (database interaction), and `engine/*.go` (core logic).
- **Adapter Pattern:** The `channels/` directory demonstrates the adapter pattern, providing abstractions for different chat platforms.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:
- **Chatbot Integration:**  The platform’s ability to integrate with various messaging channels (Facebook Messenger, Zalo OA) can be leveraged to build chatbot integrations within SEOSONA OS. The adapter pattern makes adding new channels relatively straightforward.
- **Quality Assurance Framework:** The quality assessment and agent management features could be adapted to monitor and improve the performance of SEOSONA OS's own conversational AI agents or other automated communication systems.
- **Backend Infrastructure:**  The Go backend, database setup (MySQL), and Nginx configuration provide a solid foundation that can be reused or extended for other SEOSONA OS services requiring similar functionality.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 66/100 · **Auto-apply:** False
- **Evidence:** `agent`, `mcp`, `router`
- **All scores:** {'seosona-os': 66, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 0}
