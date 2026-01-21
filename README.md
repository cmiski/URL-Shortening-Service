Project Goals:

1. Low Latency(redirects in <20ms)
2. High throughput
3. Horizontal scalability
4. Fault tolerant
5. Observable
6. Abuse resistant

Core Principles:

1.  Redirect path must be minimal
2.  Reads ≫ Writes (read-heavy system)
3.  Async everything except redirect
4.  Cache first, DB second
5.  Events, not blocking logic
6.  Fail gracefully

                   ┌──────────────┐
                   │   Clients     │
                   └──────┬───────┘
                          │
                  ┌───────▼────────┐
                  │  API Gateway    │
                  │ (Express API)   │
                  └───────┬────────┘
                          │
         ┌────────────────▼────────────────┐
         │       URL Service (Core)         │
         │----------------------------------│
         │  Redis (HOT PATH)                │
         │  MongoDB (SOURCE OF TRUTH)       │
         └───────────────┬─────────────────┘
                         │ (async events)
                         ▼
                    Kafka / Redpanda
         ┌───────────────┼────────────────┐
         ▼               ▼                ▼
        Analytics        Counters        Abuse Detection

URL CREATION FLOW (WRITE PATH)

Client
→ POST /api/v1/urls
→ Validate URL
→ Generate shortCode
→ Save to DB
→ Cache in Redis
→ Emit URL_CREATED event
← short URL

REDIRECT FLOW (READ HOT PATH)

Client
→ GET /:shortCode
→ Redis lookup (O(1))
→ DB fallback (rare)
→ 302 Redirect
→ Emit CLICK event (async)

ANALYTICS FLOW (ASYNC, EVENT-DRIVEN
CLICK event
→ Kafka topic
→ Consumer group
→ Batch aggregation
→ DB updates

Data Model:
{
"\_id": "ObjectId",
"shortCode": "xA91kQ",
"longUrl": "https://example.com",
"userId": "optional",
"createdAt": "timestamp",
"expiresAt": "timestamp | null",
"isActive": true,
"totalClicks": 0
}

indexes:
shortCode (UNIQUE)
expiresAt (TTL)
userId

Redis Cache (HOT DATA):
KEY: short:xA91kQ
VALUE: longUrl
TTL: optional

Kafka Topics:
Topic -> Purpose  
 url.created -> Audit / future features
url.clicked -> Analytics  
 url.expired -> Cleanup

Performance Strategy:
Area -> Strategy

                      Redirect -> Redis first, no DB writes
                      DB       -> Indexed reads
                      Events   -> Async, non-blocking
                      Writes   -> Batched
                      Caching  -> TTL + invalidation
                      Scaling  -> Stateless APIs

TESTING STRATEGY

    Unit tests (services)
    Integration tests (routes)
    Redirect behavior tests
    Kafka consumer tests

Redirect path must be minimal and synchronous — YES
Kafka must never block user requests — YES
Redis is the primary read path — YES
DB is source of truth — YES
Analytics is eventually consistent — YES
