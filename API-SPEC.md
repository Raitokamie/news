# API Specification — Impact Terminal (newsweb)

Frontend: Next.js 16 + React 19
Base URL: `https://api.ideatrade1.com` (หรือตามที่ backend กำหนด)

---

## Error Response Format

ทุก error ใช้ format เดียวกัน:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "status": 400
  }
}
```

| Field     | Type   | คำอธิบาย                           |
| --------- | ------ | ---------------------------------- |
| `code`    | string | Machine-readable error code (UPPER_SNAKE_CASE) |
| `message` | string | ข้อความอธิบาย error               |
| `status`  | number | HTTP status code (ซ้ำกับ header)  |

---

## 0. Enum Reference

ค่าที่เป็นไปได้ของแต่ละ field ใช้อ้างอิงทั้ง request และ response

### Category

| Value         | Label       | คำอธิบาย                                  |
| ------------- | ----------- | ----------------------------------------- |
| `markets`     | Markets     | ตลาดหุ้น, ดัชนี, IPO, M&A                |
| `economy`     | Economy     | GDP, เงินเฟ้อ, อัตราดอกเบี้ย, ธนาคารกลาง |
| `geopolitics` | Geopolitics | สงคราม, การทูต, sanctions, การค้าระหว่างประเทศ |
| `tech`        | Tech        | บริษัทเทค, software, hardware              |
| `ai`          | AI          | AI, LLM, automation, robotics             |
| `crypto`      | Crypto      | Bitcoin, Ethereum, DeFi, regulation        |
| `energy`      | Energy      | น้ำมัน, ก๊าซ, นิวเคลียร์, พลังงานทดแทน   |
| `commodities` | Commodities | ทองคำ, เงิน, เกษตร, โลหะ                 |
| `healthcare`  | Healthcare  | ยา, biotech, สาธารณสุข                    |
| `real-estate` | Real Estate | อสังหาริมทรัพย์, REITs, ที่อยู่อาศัย       |
| `climate`     | Climate     | Climate change, ESG, carbon                |
| `defense`     | Defense     | กลาโหม, อาวุธ, cybersecurity              |
| `banking`     | Banking     | ธนาคาร, fintech, ประกันภัย                |
| `automotive`  | Automotive  | รถยนต์, EV, ชิ้นส่วนยานยนต์               |
| `trade`       | Trade       | การค้าระหว่างประเทศ, tariff, FTA           |

### Region Tag

| Value    | Label  |
| -------- | ------ |
| `global` | Global |
| `us`     | US     |
| `eu`     | EU     |
| `asia`   | Asia   |
| `mena`   | MENA   |

### Country Code

ใช้ ISO 3166-1 alpha-2 เช่น `us`, `gb`, `de`, `jp`, `cn`, `th`, `kr`, `sg`, `no`, `be`, `dk`, `ie`, `nl` ฯลฯ

> **ห้ามใช้** `eu` เป็น country code — ให้ใช้ประเทศที่เป็นต้นทางข่าวจริง เช่น `be` (Belgium) สำหรับข่าว EU Commission, `de` สำหรับข่าว Germany

### Impact Level

| Value    | คำอธิบาย                         |
| -------- | -------------------------------- |
| `high`   | กระทบตลาดรุนแรง / ข่าวใหญ่      |
| `medium` | กระทบปานกลาง / ข่าวน่าสนใจ     |
| `low`    | กระทบเล็กน้อย / ข่าวทั่วไป      |

### Sentiment

| Value     | ใช้กับ NewsItem | ใช้กับ Ticker |
| --------- | --------------- | ------------- |
| `good`    | ข่าวเชิงบวก    | -             |
| `bad`     | ข่าวเชิงลบ     | -             |
| `neutral` | ข่าวกลาง       | -             |
| `up`      | -               | หุ้นเชิงบวก   |
| `down`    | -               | หุ้นเชิงลบ   |
| `flat`    | -               | หุ้นทรงตัว   |

### Ticker Sentiment Score

ค่า `-10` ถึง `+10` แสดงระดับ sentiment ของ ticker ในบริบทข่าวนั้น

---

## 1. Health

### 1.1 GET /health — ตรวจสอบสถานะ server

ใช้สำหรับ monitoring / uptime check — ไม่ต้อง auth

```
GET /health
```

**Response 200:**

```json
{
  "status": "ok",
  "timestamp": "2026-03-30T12:00:00.000Z"
}
```

**Response 503:** server ไม่พร้อม (database หรือ dependency ล้ม)

```json
{
  "status": "degraded",
  "timestamp": "2026-03-30T12:00:00.000Z"
}
```

---

## 2. Authentication

### 2.1 Login (OAuth Authorization Code Flow)

ใช้ Authorization Code flow มาตรฐาน — ไม่ส่ง token ผ่าน URL เพื่อป้องกัน token leak

**Step 1:** Frontend redirect user ไปหน้า login

```
กด Login → redirect ไป https://ideatrade1.com/authorize?response_type=code&client_id=newsweb&redirect_uri=https://newsweb.com/auth/callback
```

**Step 2:** Login สำเร็จ → redirect กลับพร้อม **authorization code** (ไม่ใช่ token)

```
https://newsweb.com/auth/callback?code=<AUTHORIZATION_CODE>
```

**Step 3:** Frontend ส่ง code ไปแลก token ผ่าน `POST /auth/token`

---

### 2.2 POST /auth/token — แลก authorization code เป็น token

```
POST /auth/token
Content-Type: application/json

{
  "grantType": "authorizationCode",
  "code": "<AUTHORIZATION_CODE>",
  "redirectUri": "https://newsweb.com/auth/callback"
}
```

**Response 200:**

```json
{
  "accessToken": "<ACCESS_TOKEN>",
  "refreshToken": "<REFRESH_TOKEN>"
}
```

**Response 400:** code ไม่ถูกต้องหรือหมดอายุ

```json
{
  "error": {
    "code": "INVALID_AUTHORIZATION_CODE",
    "message": "Authorization code is invalid or expired",
    "status": 400
  }
}
```

---

### 2.3 POST /auth/refresh — ขอ Access Token ใหม่

เมื่อ Access Token หมดอายุ (ได้ 401) → Frontend จะเรียก API นี้เพื่อขอ token ใหม่โดยไม่ต้อง login ใหม่

> **Refresh Token Rotation:** ทุกครั้งที่เรียก endpoint นี้สำเร็จ server จะ **invalidate token เก่าทันที** และออก refresh token ใหม่ — แต่ละ refresh token ใช้ได้ **ครั้งเดียวเท่านั้น (one-time use)** หากพบว่า token เก่าถูกนำมาใช้ซ้ำ ให้ถือว่า token ทั้งหมดของ session นั้นถูก compromise และ invalidate ทันที

```
POST /auth/refresh
Content-Type: application/json

{ "refreshToken": "<REFRESH_TOKEN>" }
```

**Response 200:**

```json
{
  "accessToken": "<NEW_ACCESS_TOKEN>",
  "refreshToken": "<NEW_REFRESH_TOKEN>"
}
```

**Response 401:** refresh token หมดอายุหรือถูกใช้ไปแล้ว → user ต้อง login ใหม่

```json
{
  "error": {
    "code": "REFRESH_TOKEN_EXPIRED",
    "message": "Refresh token expired or already used",
    "status": 401
  }
}
```

**Token Lifetime:**

| Token          | อายุ     | หน้าที่                    |
| -------------- | -------- | -------------------------- |
| Access Token   | 15 นาที  | ใช้เรียก API ทุก request   |
| Refresh Token  | 30 วัน   | ใช้ขอ Access Token ใหม่    |

---

### 2.4 POST /auth/logout — Logout

ลบ refresh token ฝั่ง server เพื่อป้องกันการใช้ token ต่อหลัง logout

```
POST /auth/logout
Authorization: Bearer <access_token>
```

**Response 200:**

```json
{ "success": true }
```

> Frontend จะลบ token ออกจาก storage + redirect ไปหน้า login

---

### 2.5 GET /auth/me — ดึงข้อมูล user ปัจจุบัน

```
GET /auth/me
Authorization: Bearer <access_token>
```

**Response 200:**

```json
{
  "id": "user_123",
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "https://...",
  "plan": "premium"
}
```

> `plan` มีค่าเป็น `"free"` หรือ `"premium"`

**Response 401:** token หมดอายุหรือไม่ถูกต้อง

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Unauthorized",
    "status": 401
  }
}
```

**ใช้ในหน้า:** ทุกหน้า (Sidebar แสดงชื่อ + plan, กำหนดสิทธิ์)

---

## 3. News Feed (หน้า Dashboard `/`)

### 3.1 GET /news — ดึงข่าวทั้งหมด

```
GET /news?range=24h
```

ส่งข่าว 24 ชั่วโมงล่าสุดทั้งหมดมาครั้งเดียว Frontend จัดการ filter/sort/show more เอง ไม่มี pagination

**Query params:**

| Param    | Type   | Default | ค่าที่เป็นไปได้                     |
| -------- | ------ | ------- | ----------------------------------- |
| `ticker` | string | -       | เช่น `GOOGL` (filter เฉพาะ ticker) |

> Filter อื่นๆ (region, country, category, impact, sort) ทำฝั่ง Frontend ทั้งหมด

**Response 200:**

```json
{
  "data": [
    {
      "id": "1",
      "headline": "DOJ Closing Arguments Focus on Google's Default Search Deals",
      "body": "The landmark trial enters its final phase...",
      "sources": [{ "name": "REUTERS", "url": "https://...", "publishedAt": "2026-03-25T09:45:00Z" }],
      "publishedAt": "2026-03-25T10:00:00Z",
      "regionTag": "us",
      "countryCode": "us",
      "category": "tech",
      "impact": "high",
      "sentiment": "bad",
      "tickers": [
        {
          "symbol": "GOOGL",
          "name": "Alphabet Inc.",
          "sentiment": "down",
          "sentimentScore": -7
        }
      ],
      "narrativeGroupId": "ng-google-antitrust",
      "logoUrl": "https://cdn.example.com/logos/reuters.png",
      "imageUrl": "https://cdn.example.com/images/news-1.jpg"
    }
  ],
  "total": 150
}
```

**News field:**

| Field               | Type   | Required | คำอธิบาย                                                           |
| ------------------- | ------ | -------- | ------------------------------------------------------------------ |
| `id`                | string | Yes      | รหัสข่าว                                                           |
| `headline`          | string | Yes      | หัวข้อข่าว                                                         |
| `body`              | string | Yes      | เนื้อหาข่าว                                                        |
| `sources`           | array  | Yes      | แหล่งข่าว (ดูตาราง Sources field ด้านล่าง)                        |
| `publishedAt`       | string | Yes      | เวลาที่ระบบรวมข่าว (ISO 8601)                                      |
| `regionTag`         | string | Yes      | ภูมิภาค (ดู Enum Reference)                                        |
| `countryCode`       | string | Yes      | รหัสประเทศ ISO 3166-1 alpha-2                                      |
| `category`          | string | Yes      | หมวดหมู่ (ดู Enum Reference)                                       |
| `impact`            | string | Yes      | ระดับผลกระทบ: `high`, `medium`, `low`                              |
| `sentiment`         | string | Yes      | ความรู้สึกต่อข่าว: `good`, `bad`, `neutral`                        |
| `tickers`           | array  | Yes      | รายการหุ้นที่เกี่ยวข้อง                                            |
| `narrativeGroupId`  | string | No       | รหัสกลุ่มข่าวที่เกี่ยวข้องกัน                                      |
| `logoUrl`           | string | No       | Company/source logo URL (absolute URL to CDN/storage)              |
| `imageUrl`          | string | No       | Featured image URL (absolute URL to CDN/storage)                   |

**Sources field:**

| Field         | Type   | Required | คำอธิบาย                                      |
| ------------- | ------ | -------- | --------------------------------------------- |
| `name`        | string | Yes      | ชื่อแหล่งข่าว เช่น `REUTERS`                 |
| `url`         | string | Yes      | URL ต้นฉบับ                                   |
| `publishedAt` | string | No       | เวลาที่แหล่งข่าวเผยแพร่ (ISO 8601) — ถ้ามี   |

> `publishedAt` ระดับ root คือเวลาที่ระบบรวมข่าว, `sources[].publishedAt` คือเวลาที่แหล่งข่าวแต่ละแหล่งเผยแพร่จริง (optional)

**ใช้ในหน้า:** Dashboard (`/`), Ticker Detail (`/ticker/[symbol]`)

---

## 4. Search

### Note: Search Overlay ทำงานอย่างไร

Frontend มี Search Overlay ที่ค้นหาได้ 2 tab:
- **Symbols tab** — ค้นหา ticker ด้วย symbol หรือชื่อบริษัท → คลิกแล้ว toggle เลือก/ไม่เลือก
- **News tab** — ค้นหาข่าวจากข้อมูลที่โหลดมาจาก `GET /news` แล้ว (client-side search) → คลิกแล้ว scroll ไปที่ข่าวนั้นบน Dashboard พร้อม highlight

> **ไม่มี `GET /search` endpoint** — News search ทำฝั่ง Frontend ทั้งหมด โดยใช้ข้อมูลจาก `GET /news` ที่โหลดมาแล้ว

---

### 4.1 GET /tickers/search — ค้นหา ticker สำหรับ autocomplete

ใช้ใน Search Overlay (Symbols tab) และ AddTickerModal เพื่อค้นหา ticker ที่จะเพิ่มเข้า watchlist หรือ sentiment monitor

```
GET /tickers/search?q=goo&limit=10
```

**Query params:**

| Param  | Type   | Default | ค่าที่เป็นไปได้              |
| ------ | ------ | ------- | ---------------------------- |
| `q`    | string | (required) | ค้นด้วย symbol หรือชื่อ  |
| `limit`| number | `10`    | จำนวนผลลัพธ์ (max 50)      |

**Response 200:**

```json
{
  "data": [
    { "symbol": "GOOGL", "name": "Alphabet Inc." },
    { "symbol": "GOOG", "name": "Alphabet Inc. (Class C)" }
  ]
}
```

**ใช้ในหน้า:** Watchlist (AddTickerModal), Stock Sentiment (AddTickerModal)

---

## 5. Watchlist News (PREMIUM)

### 5.1 GET /news/watchlist — ดึงข่าวของทุก ticker ใน watchlist

Backend ดึง watchlist ของ user แล้วส่งข่าวที่เกี่ยวข้องกลับมาทั้งหมดในครั้งเดียว ไม่ต้องเรียกทีละ ticker

```
GET /news/watchlist?range=24h
Authorization: Bearer <access_token>
```

**Query params:**

| Param      | Type   | Default | ค่าที่เป็นไปได้ |
| ---------- | ------ | ------- | --------------- |
| `range`    | string | `24h`   | `24h`, `7d`, `30d`, `all` |
| `category` | string | `all`   | `all`, `markets`, `economy`, `geopolitics`, `tech`, `ai`, `crypto`, `energy`, `commodities`, `healthcare`, `real-estate`, `climate`, `defense`, `banking`, `automotive`, `trade` |
| `page`     | number | `1`     | สำหรับ pagination |
| `limit`    | number | `50`    | จำนวนข่าวต่อ page |

**Response 200:**

```json
{
  "data": [
    {
      "id": "3",
      "headline": "Nvidia Accelerates Data Center Dominance...",
      "body": "$NVDA begins mass shipments of GB200 Blackwell GPUs...",
      "sources": [{ "name": "REUTERS", "url": "https://...", "publishedAt": "2026-03-25T09:40:00Z" }],
      "publishedAt": "2026-03-25T09:48:00Z",
      "regionTag": "us",
      "countryCode": "us",
      "category": "tech",
      "impact": "high",
      "sentiment": "good",
      "tickers": [
        { "symbol": "NVDA", "name": "NVIDIA Corporation", "sentiment": "up", "sentimentScore": 9 }
      ],
      "narrativeGroupId": "ng-tech-earnings",
      "logoUrl": "https://cdn.example.com/logos/nvidia.png",
      "imageUrl": "https://cdn.example.com/images/news-3.jpg"
    }
  ],
  "total": 85,
  "page": 1,
  "limit": 50
}
```

> Response format เหมือน `/news` ทุกประการ แต่ filter เฉพาะ ticker ที่อยู่ใน watchlist ของ user

**Response 403:** user เป็น free plan

```json
{
  "error": {
    "code": "PREMIUM_REQUIRED",
    "message": "Premium required",
    "status": 403
  }
}
```

**ใช้ในหน้า:** Watchlist (`/watchlist`) — Activity Feed section

---

## 6. Live Update (Widget ที่แสดงข่าวด่วน)

### 6.1 GET /live-update — SSE stream ข่าวด่วน

ใช้ **Server-Sent Events (SSE)** — server push ข้อมูลมาฝ่ายเดียวเมื่อมีข่าวใหม่ connection เปิดค้างไว้ตลอด

```
GET /live-update
Accept: text/event-stream
Cache-Control: no-cache
```

**Response:** `Content-Type: text/event-stream`

```
id: evt-001
event: breaking
data: {"headline":"The Federal Reserve keeps interest rates unchanged at 3.50% - 3.75%","shortHeadline":"Fed holds rates at 3.50%-3.75% after FOMC meeting.","publishedAt":"2026-03-25T10:00:00Z"}

id: evt-002
event: breaking
data: {"headline":"Nvidia surges 5% after earnings beat","shortHeadline":"NVDA beats Q1 estimates.","publishedAt":"2026-03-25T10:15:00Z"}
```

**Event fields:**

| Field           | Type   | คำอธิบาย                                      |
| --------------- | ------ | --------------------------------------------- |
| `id`            | string | Event ID สำหรับ reconnect (`Last-Event-ID`)    |
| `event`         | string | ประเภท event — ตอนนี้มีแค่ `breaking`          |
| `data`          | JSON   | ข้อมูลข่าว (ดูตารางด้านล่าง)                  |

**Data object:**

| Field           | Type   | คำอธิบาย                        |
| --------------- | ------ | ------------------------------- |
| `headline`      | string | หัวข้อข่าวเต็ม                  |
| `shortHeadline` | string | หัวข้อย่อสำหรับ banner          |
| `publishedAt`   | string | เวลาที่เผยแพร่ (ISO 8601)       |

**Reconnection:**
- Browser จะ reconnect อัตโนมัติเมื่อ connection หลุด
- ส่ง `Last-Event-ID` header มาเพื่อให้ server ส่งข่าวที่ยังไม่ได้รับต่อ
- Server ควรตั้ง `retry: 3000` (ms) ใน stream

**ใช้ในหน้า:** ทุกหน้า (Sidebar widget)

---

## 7. Ticker Analysis (หน้า Stock Sentiment + Market Trends)

### 7.1 GET /tickers/analysis — ดึงข้อมูลวิเคราะห์ ticker

```
GET /tickers/analysis?range=24h
```

**Query params:**

| Param    | Type   | Default          | ค่าที่เป็นไปได้                                          |
| -------- | ------ | ---------------- | -------------------------------------------------------- |
| `range`  | string | `24h`            | `24h`, `7d`, `30d`, `all`                                |

> Filter (topPositive, topNegative, mostMention) ทำฝั่ง Frontend — แต่ละ filter มี default sort ในตัว

**Response 200:**

```json
{
  "data": [
    {
      "symbol": "GOOGL",
      "name": "Alphabet Inc.",
      "impactLevel": "high",
      "sentiment": "up",
      "mentionCount": 25,
      "sentimentHistorical": {
        "positive": 16,
        "neutral": 4,
        "negative": 5
      },
      "score": 2.0
    }
  ]
}
```

**ใช้ในหน้า:** Stock Sentiment (`/stock-sentiment`), Market Trends (`/market-trends`)

---

### 7.2 GET /tickers/:symbol/outlook — AI-generated market outlook

Returns AI-generated analysis of the ticker's market position based on recent news.

**Request:**

```
GET /tickers/NVDA/outlook
```

**Response 200:**

```json
{
  "symbol": "NVDA",
  "outlook": "NVIDIA's data center dominance continues to accelerate with the Blackwell architecture launch. Recent supply constraints reflect surging AI infrastructure demand rather than production issues. The company's pricing power remains strong with data center revenue growing 217% YoY. Key risks include potential export restrictions to China and increasing competition from custom AI chips. Near-term sentiment remains bullish but valuation concerns persist at current multiples.",
  "generatedAt": "2026-03-25T10:15:00Z",
  "confidenceScore": 0.85
}
```

**Response 404:** Symbol not found or insufficient data

```json
{
  "error": {
    "code": "TICKER_NOT_FOUND",
    "message": "Ticker not found or insufficient data for analysis",
    "status": 404
  }
}
```

**Outlook field:**

| Field             | Type   | Required | Description                                            |
| ----------------- | ------ | -------- | ------------------------------------------------------ |
| `symbol`          | string | Yes      | Ticker symbol                                          |
| `outlook`         | string | Yes      | AI-generated analysis (100-300 words, plain text)      |
| `generatedAt`     | string | Yes      | ISO 8601 timestamp of when analysis was generated      |
| `confidenceScore` | number | Yes      | 0.0-1.0 confidence in analysis quality                 |


**ใช้ในหน้า:** Stock Sentiment Detail (`/stock-sentiment/[symbol]`), Ticker Detail (`/ticker/[symbol]`)

---

## 8. Sentiment Monitor (หน้า Stock Sentiment)

จัดการรายการ ticker ที่ user ต้องการ monitor sentiment (แยกจาก Watchlist)

### 8.1 GET /sentiment/tickers — ดึงรายการ ticker ที่ monitor อยู่

```
GET /sentiment/tickers
Authorization: Bearer <access_token>
```

**Response 200:**

```json
{
  "tickers": ["NVDA", "GOOGL", "TSLA", "AAPL"]
}
```

> ถ้า user ยังไม่เคยตั้งค่า → return `{ "tickers": [] }` (หน้าเปล่า ให้ user เลือกเอง เพื่อไม่ให้ซ้ำกับหน้า Market Trends)

**Response 401:** ไม่ได้ login → return `{ "tickers": [] }` ฝั่ง frontend แสดง empty state

---

### 8.2 POST /sentiment/tickers — เพิ่ม ticker เข้า monitor list

```
POST /sentiment/tickers
Authorization: Bearer <access_token>
Content-Type: application/json

{ "symbol": "MSFT" }
```

**Response 200:**

```json
{ "success": true, "tickers": ["NVDA", "GOOGL", "TSLA", "AAPL", "MSFT"] }
```

---

### 8.3 DELETE /sentiment/tickers/:symbol — ลบ ticker ออกจาก monitor list

```
DELETE /sentiment/tickers/MSFT
Authorization: Bearer <access_token>
```

**Response 200:**

```json
{ "success": true, "tickers": ["NVDA", "GOOGL", "TSLA", "AAPL"] }
```

---

## 9. Watchlist Management (PREMIUM)

### 9.1 GET /watchlist — ดึง watchlist ของ user

```
GET /watchlist
Authorization: Bearer <access_token>
```

**Response 200:**

```json
{
  "tickers": ["NVDA", "TSLA", "AAPL", "GOOGL"]
}
```

**Response 403:** user เป็น free plan

```json
{
  "error": {
    "code": "PREMIUM_REQUIRED",
    "message": "Premium required",
    "status": 403
  }
}
```

---

### 9.2 POST /watchlist — เพิ่ม ticker เข้า watchlist

```
POST /watchlist
Authorization: Bearer <access_token>
Content-Type: application/json

{ "symbol": "MSFT" }
```

**Response 200:**

```json
{ "success": true, "tickers": ["NVDA", "TSLA", "AAPL", "GOOGL", "MSFT"] }
```

**Response 400:** watchlist เต็ม (สูงสุด 50 ตัว)

```json
{
  "error": {
    "code": "WATCHLIST_LIMIT_REACHED",
    "message": "Watchlist limit reached (max 50)",
    "status": 400
  }
}
```

---

### 9.3 DELETE /watchlist/:symbol — ลบ ticker ออกจาก watchlist

```
DELETE /watchlist/MSFT
Authorization: Bearer <access_token>
```

**Response 200:**

```json
{ "success": true, "tickers": ["NVDA", "TSLA", "AAPL", "GOOGL"] }
```

---

## 10. Telegram Notifications (PREMIUM)

### 10.1 POST /telegram/connect — เชื่อมต่อ Telegram

```
POST /telegram/connect
Authorization: Bearer <access_token>
```

**Response 200:**

```json
{
  "connected": true,
  "botUrl": "https://t.me/ImpactTerminalBot?start=<user_token>"
}
```

---

### 10.2 POST /telegram/disconnect — ยกเลิกการเชื่อมต่อ

```
POST /telegram/disconnect
Authorization: Bearer <access_token>
```

**Response 200:**

```json
{ "connected": false }
```

---

### 10.3 GET /telegram/status — สถานะการแจ้งเตือน

```
GET /telegram/status
Authorization: Bearer <access_token>
```

**Response 200:**

```json
{
  "connected": true,
  "notifications": [
    {
      "symbol": "NVDA",
      "status": "SENT",
      "timestamp": "2026-03-25T10:00:00Z"
    },
    {
      "symbol": "TSLA",
      "status": "FAILED",
      "timestamp": "2026-03-25T09:55:00Z"
    }
  ]
}
```

| status       | ความหมาย       |
| ------------ | -------------- |
| `SENT`       | ส่งสำเร็จ      |
| `FAILED`     | ส่งไม่สำเร็จ   |
| `PROCESSING` | กำลังส่ง       |

---

### 10.4 Telegram Message Format — ข้อความที่ Bot ส่งให้ user

**Trigger:** Backend ส่งข้อความเมื่อมีข่าว `impact = "high"` ที่กล่าวถึง ticker ใน **watchlist** ของ user

**Format (Telegram Markdown):**

```
🚨 *High Impact Alert — $NVDA*

📰 NVIDIA Blackwell chips face supply constraints amid surging AI demand

Impact: 🔴 HIGH
Sentiment: 📉 Negative (-7/10)
Source: REUTERS

🔗 [Read more](https://newsweb.com/ticker/nvda)
```

**Fields ที่ใช้สร้างข้อความ:**

| Field | มาจาก | ตัวอย่าง |
|-------|--------|----------|
| Symbol | `news.tickers[].symbol` (ตัวที่ match watchlist) | `NVDA` |
| Headline | `news.headline` | `NVIDIA Blackwell chips...` |
| Impact | `news.impact` | `high` → 🔴 HIGH |
| Sentiment + Score | `news.tickers[].sentiment` + `sentimentScore` | 📉 Negative (-7/10) |
| Source | `news.sources[0].name` | `REUTERS` |
| Link | URL ไปหน้า ticker detail | `https://newsweb.com/ticker/nvda` |

**หมายเหตุ:**
- ส่งแค่ข่าว **high impact** เท่านั้น เพื่อไม่ให้ spam user
- ถ้าข่าวเดียวกล่าวถึงหลาย ticker ใน watchlist → ส่ง 1 ข้อความ แต่ใส่ทุก symbol ที่ match
- Backend ควรทำ deduplication — ข่าวเดียวกัน ห้ามส่งซ้ำ

---

## 11. Security Requirements

### 11.1 Token Strategy (Access + Refresh)
- **Access Token** อายุ 15 นาที — ใช้เรียก API ทุก request
- **Refresh Token** อายุ 30 วัน — ใช้ขอ Access Token ใหม่ (one-time use, rotation ทุกครั้ง)
- เมื่อ Access Token หมดอายุ (401) → Frontend เรียก `POST /auth/refresh` อัตโนมัติ
- เมื่อ Refresh Token หมดอายุหรือถูกใช้ซ้ำ → user ต้อง login ใหม่
- แนะนำเก็บ token เป็น **httpOnly cookie** เพื่อป้องกัน XSS

### 11.2 CORS
- ตั้งค่า `Access-Control-Allow-Origin` ให้รับ request จาก domain ของ newsweb เท่านั้น
- ห้ามใช้ `*` ใน production

### 11.3 Rate Limiting
- จำกัดจำนวน request ต่อ IP/user (เช่น 100 req/นาที)
- ป้องกัน spam และ DDoS

### 11.4 Authorization (สิทธิ์)
- API ที่ต้อง Premium (`/watchlist`, `/telegram`, `/news/watchlist`) → backend ต้องเช็ค plan ทุก request
- ห้ามเชื่อ frontend อย่างเดียว เพราะ user สามารถเรียก API ตรงได้
- ถ้า free user เรียก premium API → ตอบ `403` ด้วย structured error format

### 11.5 OAuth Callback
- `redirect_uri` ต้อง whitelist เฉพาะ domain ของ newsweb
- ห้ามรับ redirect ไป URL อื่นที่ไม่ได้ลงทะเบียนไว้

---

## สรุป API ทั้งหมด (22 endpoints)

| #  | Method | Endpoint                     | Auth | Plan    | ใช้ในหน้า                         |
| -- | ------ | ---------------------------- | ---- | ------- | --------------------------------- |
| 1  | GET    | `/health`                    | No   | Any     | Monitoring                        |
| 2  | -      | OAuth redirect (Auth Code)   | -    | -       | Login                             |
| 3  | POST   | `/auth/token`                | No   | Any     | Login callback (แลก code → token) |
| 4  | POST   | `/auth/refresh`              | No   | Any     | ทุกหน้า (auto refresh)            |
| 5  | POST   | `/auth/logout`               | Yes  | Any     | Logout                            |
| 6  | GET    | `/auth/me`                   | Yes  | Any     | ทุกหน้า                           |
| 7  | GET    | `/news`                      | No   | Free    | Dashboard, Ticker Detail, Search Overlay (News tab) |
| 8  | GET    | `/news/watchlist`            | Yes  | Premium | Watchlist (Activity Feed)         |
| 9  | GET    | `/tickers/search`            | No   | Free    | Search Overlay (Symbols tab), AddTickerModal |
| 10 | SSE    | `/live-update`               | No   | Free    | ทุกหน้า (widget)                  |
| 11 | GET    | `/tickers/analysis`          | No   | Free    | Stock Sentiment, Market Trends    |
| 12 | GET    | `/tickers/:symbol/outlook`   | No   | Free    | Sentiment Detail, Ticker Detail   |
| 13 | GET    | `/sentiment/tickers`         | Yes  | Free    | Stock Sentiment                   |
| 14 | POST   | `/sentiment/tickers`         | Yes  | Free    | Stock Sentiment                   |
| 15 | DELETE | `/sentiment/tickers/:symbol` | Yes  | Free    | Stock Sentiment                   |
| 16 | GET    | `/watchlist`                 | Yes  | Premium | Watchlist                         |
| 17 | POST   | `/watchlist`                 | Yes  | Premium | Watchlist                         |
| 18 | DELETE | `/watchlist/:symbol`         | Yes  | Premium | Watchlist                         |
| 19 | POST   | `/telegram/connect`          | Yes  | Premium | Watchlist                         |
| 20 | POST   | `/telegram/disconnect`       | Yes  | Premium | Watchlist                         |
| 21 | GET    | `/telegram/status`           | Yes  | Premium | Watchlist                         |
