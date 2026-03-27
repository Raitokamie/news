# API Specification — Impact Terminal (newsweb)

Frontend: Next.js 16 + React 19
Base URL: `https://api.ideatrade1.com` (หรือตามที่ backend กำหนด)

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

## 1. Authentication

### 1.1 Login (OAuth Redirect)

Frontend จะ redirect user ไปหน้า login ของ ideatrade1

```
กด Login → redirect ไป https://ideatrade1.com/login?redirect_uri=https://newsweb.com/auth/callback
```

เมื่อ login สำเร็จ → redirect กลับมาที่:

```
https://newsweb.com/auth/callback?access_token=<ACCESS_TOKEN>&refresh_token=<REFRESH_TOKEN>
```

**สิ่งที่ backend ต้องทำ:**

- รับ `redirect_uri` parameter ตอน login
- Login สำเร็จ → redirect กลับไปที่ `redirect_uri` พร้อม `access_token` + `refresh_token`
- Token ควรเป็น JWT ที่มีข้อมูล user อยู่ข้างใน

---

### 1.2 POST /auth/refresh — ขอ Access Token ใหม่

เมื่อ Access Token หมดอายุ (ได้ 401) → Frontend จะเรียก API นี้เพื่อขอ token ใหม่โดยไม่ต้อง login ใหม่

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

**Response 401:** refresh token หมดอายุ → user ต้อง login ใหม่

```json
{ "error": "Refresh token expired" }
```

**Token Lifetime:**

| Token          | อายุ     | หน้าที่                    |
| -------------- | -------- | -------------------------- |
| Access Token   | 15 นาที  | ใช้เรียก API ทุก request   |
| Refresh Token  | 30 วัน   | ใช้ขอ Access Token ใหม่    |

---

### 1.3 GET /auth/me — ดึงข้อมูล user ปัจจุบัน

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
{ "error": "Unauthorized" }
```

**ใช้ในหน้า:** ทุกหน้า (Sidebar แสดงชื่อ + plan, กำหนดสิทธิ์)

---

## 2. News Feed (หน้า Dashboard `/`)

### 2.1 GET /news — ดึงข่าวทั้งหมด

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
      "sources": [{ "name": "REUTERS", "url": "https://..." }],
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
      "logoUrl": null
    }
  ],
  "total": 150
}
```

**ใช้ในหน้า:** Dashboard (`/`), Ticker Detail (`/ticker/[symbol]`)

---

## 3. Search

### Note: Search Overlay ทำงานอย่างไร

Frontend มี Search Overlay ที่ค้นหาได้ 2 tab:
- **Symbols tab** — ค้นหา ticker ด้วย symbol หรือชื่อบริษัท → คลิกแล้ว toggle เลือก/ไม่เลือก
- **News tab** — ค้นหาข่าวจากข้อมูลที่โหลดมาจาก `GET /news` แล้ว (client-side search) → คลิกแล้ว scroll ไปที่ข่าวนั้นบน Dashboard พร้อม highlight

> **ไม่มี `GET /search` endpoint** — News search ทำฝั่ง Frontend ทั้งหมด โดยใช้ข้อมูลจาก `GET /news` ที่โหลดมาแล้ว

---

### 3.1 GET /tickers/search — ค้นหา ticker สำหรับ autocomplete

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

## 4. Watchlist News (PREMIUM)

### 4.1 GET /news/watchlist — ดึงข่าวของทุก ticker ใน watchlist

Backend ดึง watchlist ของ user แล้วส่งข่าวที่เกี่ยวข้องกลับมาทั้งหมดในครั้งเดียว ไม่ต้องเรียกทีละ ticker

```
GET /news/watchlist?range=24h
Authorization: Bearer <access_token>
```

**Query params:**

| Param    | Type   | Default | ค่าที่เป็นไปได้ |
| -------- | ------ | ------- | --------------- |
| `range`  | string | `24h`   | `24h`, `7d`, `30d`, `all` |
| `page`   | number | `1`     | สำหรับ pagination |
| `limit`  | number | `50`    | จำนวนข่าวต่อ page |

**Response 200:**

```json
{
  "data": [
    {
      "id": "3",
      "headline": "Nvidia Accelerates Data Center Dominance...",
      "body": "$NVDA begins mass shipments of GB200 Blackwell GPUs...",
      "sources": [{ "name": "REUTERS", "url": "https://..." }],
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
      "logoUrl": null
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
{ "error": "Premium required" }
```

**ใช้ในหน้า:** Watchlist (`/watchlist`) — Activity Feed section

---

## 5. Live Update (Widget ที่แสดงข่าวด่วน)

### 5.1 GET /live-update — ข่าวด่วนล่าสุด

```
GET /live-update
```

**Response 200:**

```json
{
  "headline": "The Federal Reserve keeps interest rates unchanged at 3.50% - 3.75%",
  "shortHeadline": "Fed holds rates at 3.50%-3.75% after FOMC meeting.",
  "publishedAt": "2026-03-25T10:00:00Z"
}
```

**ใช้ในหน้า:** ทุกหน้า (Sidebar widget)

---

## 6. Ticker Analysis (หน้า Stock Sentiment + Market Trends)

### 6.1 GET /tickers/analysis — ดึงข้อมูลวิเคราะห์ ticker

```
GET /tickers/analysis?range=24h
```

**Query params:**

| Param    | Type   | Default          | ค่าที่เป็นไปได้                                          |
| -------- | ------ | ---------------- | -------------------------------------------------------- |
| `range`  | string | `24h`            | `24h`, `7d`                                              |

> Filter (top_positive, top_negative, most_mention) ทำฝั่ง Frontend — แต่ละ filter มี default sort ในตัว

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

### 6.2 GET /tickers/:symbol/outlook — AI Outlook ของ ticker

```
GET /tickers/NVDA/outlook
```

**Response 200:**

```json
{
  "symbol": "NVDA",
  "outlook": "NVIDIA's data center dominance continues to accelerate..."
}
```

**ใช้ในหน้า:** Stock Sentiment Detail (`/stock-sentiment/[symbol]`), Ticker Detail (`/ticker/[symbol]`)

---

## 7. Sentiment Monitor (หน้า Stock Sentiment)

จัดการรายการ ticker ที่ user ต้องการ monitor sentiment (แยกจาก Watchlist)

### 7.1 GET /sentiment/tickers — ดึงรายการ ticker ที่ monitor อยู่

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

### 7.2 POST /sentiment/tickers — เพิ่ม ticker เข้า monitor list

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

### 7.3 DELETE /sentiment/tickers/:symbol — ลบ ticker ออกจาก monitor list

```
DELETE /sentiment/tickers/MSFT
Authorization: Bearer <access_token>
```

**Response 200:**

```json
{ "success": true, "tickers": ["NVDA", "GOOGL", "TSLA", "AAPL"] }
```

---

## 8. Watchlist Management (PREMIUM)

### 8.1 GET /watchlist — ดึง watchlist ของ user

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
{ "error": "Premium required" }
```

---

### 8.2 POST /watchlist — เพิ่ม ticker เข้า watchlist

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
{ "error": "Watchlist limit reached (max 50)" }
```

---

### 8.3 DELETE /watchlist/:symbol — ลบ ticker ออกจาก watchlist

```
DELETE /watchlist/MSFT
Authorization: Bearer <access_token>
```

**Response 200:**

```json
{ "success": true, "tickers": ["NVDA", "TSLA", "AAPL", "GOOGL"] }
```

---

## 9. Telegram Notifications (PREMIUM)

### 9.1 POST /telegram/connect — เชื่อมต่อ Telegram

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

### 9.2 POST /telegram/disconnect — ยกเลิกการเชื่อมต่อ

```
POST /telegram/disconnect
Authorization: Bearer <access_token>
```

**Response 200:**

```json
{ "connected": false }
```

---

### 9.3 GET /telegram/status — สถานะการแจ้งเตือน

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

### 9.4 Telegram Message Format — ข้อความที่ Bot ส่งให้ user

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

## 10. Security Requirements

### 10.1 Token Strategy (Access + Refresh)
- **Access Token** อายุ 15 นาที — ใช้เรียก API ทุก request
- **Refresh Token** อายุ 30 วัน — ใช้ขอ Access Token ใหม่
- เมื่อ Access Token หมดอายุ (401) → Frontend เรียก `POST /auth/refresh` อัตโนมัติ
- เมื่อ Refresh Token หมดอายุ → user ต้อง login ใหม่
- แนะนำเก็บ token เป็น **httpOnly cookie** เพื่อป้องกัน XSS

### 10.2 CORS
- ตั้งค่า `Access-Control-Allow-Origin` ให้รับ request จาก domain ของ newsweb เท่านั้น
- ห้ามใช้ `*` ใน production

### 10.3 Rate Limiting
- จำกัดจำนวน request ต่อ IP/user (เช่น 100 req/นาที)
- ป้องกัน spam และ DDoS

### 10.4 Authorization (สิทธิ์)
- API ที่ต้อง Premium (`/watchlist`, `/telegram`, `/news/watchlist`) → backend ต้องเช็ค plan ทุก request
- ห้ามเชื่อ frontend อย่างเดียว เพราะ user สามารถเรียก API ตรงได้
- ถ้า free user เรียก premium API → ตอบ `403 { "error": "Premium required" }`

### 10.5 OAuth Callback
- `redirect_uri` ต้อง whitelist เฉพาะ domain ของ newsweb
- ห้ามรับ redirect ไป URL อื่นที่ไม่ได้ลงทะเบียนไว้

---

## สรุป API ทั้งหมด (19 endpoints)

| #  | Method | Endpoint                     | Auth | Plan    | ใช้ในหน้า                         |
| -- | ------ | ---------------------------- | ---- | ------- | --------------------------------- |
| 1  | -      | OAuth redirect               | -    | -       | Login                             |
| 2  | POST   | `/auth/refresh`              | No   | Any     | ทุกหน้า (auto refresh)            |
| 3  | GET    | `/auth/me`                   | Yes  | Any     | ทุกหน้า                           |
| 4  | GET    | `/news`                      | No   | Free    | Dashboard, Ticker Detail, Search Overlay (News tab) |
| 5  | GET    | `/news/watchlist`            | Yes  | Premium | Watchlist (Activity Feed)         |
| 6  | GET    | `/tickers/search`            | No   | Free    | Search Overlay (Symbols tab), AddTickerModal |
| 7  | GET    | `/live-update`               | No   | Free    | ทุกหน้า (widget)                  |
| 8  | GET    | `/tickers/analysis`          | No   | Free    | Stock Sentiment, Market Trends    |
| 9  | GET    | `/tickers/:symbol/outlook`   | No   | Free    | Sentiment Detail, Ticker Detail   |
| 10 | GET    | `/sentiment/tickers`         | Yes  | Free    | Stock Sentiment                   |
| 11 | POST   | `/sentiment/tickers`         | Yes  | Free    | Stock Sentiment                   |
| 12 | DELETE | `/sentiment/tickers/:symbol` | Yes  | Free    | Stock Sentiment                   |
| 13 | GET    | `/watchlist`                 | Yes  | Premium | Watchlist                         |
| 14 | POST   | `/watchlist`                 | Yes  | Premium | Watchlist                         |
| 15 | DELETE | `/watchlist/:symbol`         | Yes  | Premium | Watchlist                         |
| 16 | POST   | `/telegram/connect`          | Yes  | Premium | Watchlist                         |
| 17 | POST   | `/telegram/disconnect`       | Yes  | Premium | Watchlist                         |
| 18 | GET    | `/telegram/status`           | Yes  | Premium | Watchlist                         |
