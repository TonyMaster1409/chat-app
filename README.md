# ⚡ Real-Time Chat Application (2024 Edition)

A high-performance, real-time chat application built with **Spring Boot 3 (WebSocket & STOMP)**, **React 18 (TypeScript + Tailwind CSS)**, **Redis (Pub/Sub message broker)**, and **PostgreSQL** for persistent storage.

---

## 🏗️ Architecture Overview

```
                        ┌───────────────────────────────┐
                        │   React Frontend (Vite/TS)    │
                        └───────────────┬───────────────┘
                                        │ (STOMP over WebSocket)
                                        ▼
                        ┌───────────────────────────────┐
                        │   Spring Boot 3 API Server    │
                        └───────┬───────────────┬───────┘
                                │               │
          (PostgreSQL Persistence)              │ (Redis Pub/Sub scaling across nodes)
                                ▼               ▼
                        ┌───────────────┐ ┌───────────────┐
                        │  PostgreSQL   │ │  Redis Cache  │
                        └───────────────┘ └───────────────┘
```

### ✨ Key Features
- 🚀 **Real-time STOMP WebSockets**: Instant bidirectional message delivery with SockJS fallback.
- 🔴 **Redis Pub/Sub Scaling**: Broadcasts messages across multiple Spring Boot instances horizontally.
- 🐘 **PostgreSQL Storage**: Durable message history, channel subscriptions, and user management.
- 💬 **Multiple Channels & Custom Rooms**: Create and switch between public or team chat channels.
- 👤 **User Profiles & Avatars**: Dynamic avatar generation and online presence indicators.
- ⌨️ **Real-Time Typing Indicators**: Live notifications when users in a channel are composing messages.
- 🎨 **Modern Dark Aesthetic**: Responsive React UI styled with Tailwind CSS & Lucide Icons.

---

## 🛠️ Stack & Technologies

| Layer | Technology |
|---|---|
| **Backend Framework** | Spring Boot 3.2 (Java 21) |
| **Real-time Protocol** | Spring WebSocket (STOMP + SockJS) |
| **Pub/Sub Broker** | Redis 7 |
| **Database** | PostgreSQL 16 (H2 fallback for dev) |
| **Frontend Framework** | React 18 + Vite + TypeScript |
| **Styling & UI** | Tailwind CSS + Lucide React |
| **Containerization** | Docker & Docker Compose |

---

## 🚀 Quick Start Guide

### Option 1: Run via Docker Compose (Recommended)

To spin up PostgreSQL, Redis, and the Spring Boot Backend simultaneously:

```bash
docker-compose up --build
```

Then run the React frontend:

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

### Option 2: Run Standalone Local Development

#### 1. Backend (Spring Boot)
The backend features an automatic dev fallback to an in-memory **H2 Database** and direct STOMP fallback if Redis or PostgreSQL are not running locally.

```bash
cd backend
# Using Maven Wrapper or installed Maven
mvn spring-boot:run
```
*Backend runs at `http://localhost:8080`*

#### 2. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at `http://localhost:5173`*

---

## 🔌 API & STOMP Endpoints

### REST APIs
- `GET /api/rooms` - Retrieve list of active channels
- `POST /api/rooms` - Create a new channel
- `GET /api/rooms/{roomId}/history` - Load message history for a channel
- `POST /api/users/login` - Register/authenticate user session
- `GET /api/users/online` - Get current online users

### WebSocket Destinations
- Endpoint: `ws://localhost:8080/ws-chat`
- Subscribe: `/topic/room/{roomId}`
- Send Message: `/app/chat.sendMessage/{roomId}`
- Join Channel: `/app/chat.addUser/{roomId}`
- Typing Notification: `/app/chat.typing/{roomId}`

---

## 📁 Repository Structure

```
├── backend/                  # Spring Boot application
│   ├── src/main/java/        # Application source code
│   │   └── com/example/chat/
│   │       ├── config/       # WebSocket, Redis, CORS configs
│   │       ├── controller/   # WebSocket & REST controllers
│   │       ├── model/        # Entities (User, ChatMessage, ChatRoom)
│   │       ├── repository/   # JPA Repositories
│   │       └── service/      # Redis Publisher/Subscriber & Chat Logic
│   └── src/main/resources/   # YML configurations
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── components/       # ChatRoom, RoomList, OnlineUsers, etc.
│   │   ├── context/          # ChatContext state management
│   │   ├── services/         # WebSocket & REST API services
│   │   └── types/            # TypeScript interfaces
├── docker-compose.yml        # Docker orchestrator for PostgreSQL & Redis
└── README.md
```
