# SHORTsee | High-Performance URL Shortener

**SHORTsee** is a production-grade URL shortening service designed for speed, reliability, and usability. It features a blazing-fast backend (Redis + MongoDB + Kafka) and a polished, "Cyberpunk Minimal" React frontend.

![Frontend Preview](https://via.placeholder.com/800x400?text=SHORTsee+Frontend+Preview)

---

## Features

### Frontend (v3.3)
- **Modern UI**: "Cyberpunk Minimal" aesthetic with glassmorphism and ambient effects.
- **Theming**: robust Dark/Light mode switcher with persistent preferences.
- **Smart UX**: 
  - Auto-generated **QR Codes** for every link.
  - **Local History** to track your shortened URLs.
  - **One-click Copy** and Share functionality.
- **Performance**: Built with Vite + React for instant loads.

### Backend Performance Strategy
- **Low Latency**: Redirects in <20ms using Redis (Hot Path).
- **Architecture**:
  - **Write Path**: Async processing with Kafka/Redpanda.
  - **Read Path**: Cache-first (Redis) -> DB (MongoDB) fallback.
  - **Scalability**: Stateless API design.
- **Reliability**: Race-condition proof ID generation (Base62).

---

## Tech Stack

- **Frontend**: React, Vite, Vanilla CSS (Variables), Phosphor Icons (SVG).
- **Backend**: Node.js, Express, Zod (Validation).
- **Data**: MongoDB (Source of Truth), Redis (Cache), Redpanda/Kafka (Events).
- **Infrastructure**: Docker Compose.

---

## Architecture

### Core Principles
1. **Redirect path must be minimal** & synchronous.
2. **Reads ≫ Writes**: Optimized for read-heavy traffic.
3. **Async everything** except the redirect.
4. **Cache first, DB second**.

### Data Flow

```mermaid
graph TD
    Client[Client] -->|POST /shorten| API[API Gateway]
    Client -->|GET /:code| Redis{Redis Cache}
    
    subgraph "Write Path"
    API -->|Validate| Zod
    API -->|Persist| Mongo[(MongoDB)]
    API -->|Cache| Redis
    API -->|Event| Kafka[Kafka/Redpanda]
    end
    
    subgraph "Read Path"
    Redis -->|Hit| Client
    Redis -->|Miss| Mongo
    Mongo -->|Return| Redis
    end
    
    subgraph "Async Analytics"
    Kafka --> consumer[Click Consumer]
    consumer --> AnalyticsDB[(Analytics DB)]
    end
```

---

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js (v18+)

### 1. Start Infrastructure
Start MongoDB, Redis, and Redpanda containers:
```bash
docker-compose up -d
```

### 2. Start Backend
Install dependencies and start the API server:
```bash
# In the root directory
npm install
npm run dev
```
*Server runs on `http://localhost:3000`*

### 3. Start Frontend
Install dependencies and start the Vite dev server:
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/shorten` | Shorten a URL. Body: `{ "longUrl": "..." }` |
| `GET` | `/api/stats/:code` | Get metadata (clicks, date) for a short code. |
| `GET` | `/:code` | Redirect to the original URL. |
| `GET` | `/health` | Server health check. |

---

## Testing Strategy
- **Unit Tests**: Service logic isolated tests.
- **Integration Tests**: API route testing.
- **Load Testing**: Redis/Kafka throughput validation.

---

**Created by [cmiski](https://github.com/cmiski)**
