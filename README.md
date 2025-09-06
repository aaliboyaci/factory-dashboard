# factory-dashboard — Real-Time Production Monitoring (React + Node.js)

showcase fabrika izleme dashboard’u. 2 hol (Hall-A, Hall-B), her birinde 3 makine. Üstte fabrika KPI’ları, altta seçili hol detayları (kart + tablo + grafik). Gerçek zamanlı görünüm için WebSocket, yoksa 10 sn polling fallback.

## What / Why
- **What:** React + Vite + Zustand + Recharts + TanStack Table + Tailwind + Node/Express + ws + zod.
- **Why:** Üretim izleme senaryosunu modern, okunabilir ve modüler bir mimari ile demonstrasyon.

## Teknolojiler
Frontend: React, Vite, Zustand, React Router, Recharts, TanStack Table, TailwindCSS, dayjs
Backend: Node.js, Express, ws, zod, cors, helmet, pino
Genel: ESLint + Prettier, Docker, (opsiyonel) Vitest + RTL

## Mimari
- **Backend katmanları:** routes → controllers → services → utils (zod ile DTO doğrulama).
- **WS:** `/ws` kanalında `telemetry` yayını, `subscribe` ile hall filtresi.
- **Frontend:** Zustand store; `useFactoryStore` global state. Bileşenler: `KpiCard`, `HallSelector`, `MachineCard`, `MachineTable`, `TrendMiniChart`, `AlarmList`, `StatusPill`, `LastUpdateBadge`.

> Basit Diyagram
> Frontend (React) ⇄ REST `/api/*` (summary/halls/machines/events)
> Frontend (WS Client) ⇄ WS `/ws` (telemetry broadcast)
> Backend (DataService) — random walk mock + zod doğrulama

## Hızlı Başlatma

### 1) NPM ile
```bash
# Root
cp .env.example .env

# Backend
cd backend
npm i
npm run dev   # http://localhost:4000  (WS: /ws)

# Ayrı terminalde Frontend
cd ../frontend
npm i
npm run dev   # http://localhost:5173
