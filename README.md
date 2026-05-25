# 💌 Go on a Date?

A tiny web app for asking someone out — with style. You create a romantic invitation, share a link, and when they accept you get an email with all the details they chose.

---

## How it works

1. **You** enter your email and the date range you're available.
2. The app generates a shareable link — send it to your crush.
3. **They** open the link and see:
   - A "Would you like to go on a date with me?" prompt
   - A **Yes** button (and a **No** button that runs away from the cursor 🐭)
4. If they say yes, they pick a date, time, and food type.
5. **You** get an email: *"Someone said YES to your date! 🥂"*

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React + TypeScript + Vite + Tailwind CSS |
| Routing | React Router (hash-based, works on static hosts) |
| Backend | Node.js + Express |
| Email | [Resend](https://resend.com) |
| Deploy | GitHub Actions |

The invite data (email + date range) is encoded directly in the shareable URL — no database needed.

---

## Running locally

### Prerequisites

- Node.js 18+
- A [Resend](https://resend.com) API key

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```
PORT=3001
RESEND_API_KEY=re_your_key_here
EMAIL_FROM=Go on a Date <you@yourdomain.com>
```

```bash
node src/index.js
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `RESEND_API_KEY` | Yes | Resend API key for sending emails |
| `EMAIL_FROM` | No | Sender address (defaults to `onboarding@resend.dev`) |
| `PORT` | No | Backend port (defaults to `3001`) |

---

## Food options

Pizza 🍕 · Brazilian 🇧🇷 · Burgers 🍔 · Pasta 🍝 · Tacos 🌮 · Ramen 🍜

## Time slots

5:00 PM · 6:00 PM · 7:00 PM · 8:00 PM
