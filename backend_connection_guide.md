# Backend Connection Guide

This guide explains how to start the Student Assignment Tracker API, how to
configure CORS for different frontend environments, and how to connect a
frontend (including Google AI Studio apps) to the local backend.

---

## 1. Local Backend Setup

### Prerequisites

- Python 3.11 or later
- A virtual environment with dependencies installed

```powershell
# Create and activate virtual environment (first time only)
python -m venv .venv
.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

---

## 2. Start Command (port 8001)

```powershell
python -m uvicorn student_assignment_tracker_buggy:app --reload --host 127.0.0.1 --port 8001
```

The API will be available at: **`http://127.0.0.1:8001`**

To accept connections from other machines on the local network (e.g. a phone
or another computer), use `--host 0.0.0.0` instead of `--host 127.0.0.1`.

---

## 3. Swagger / Interactive Docs URL

```
http://127.0.0.1:8001/docs
```

ReDoc alternative:

```
http://127.0.0.1:8001/redoc
```

---

## 4. Health-Check URL

```
http://127.0.0.1:8001/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "Student Assignment Tracker API"
}
```

Use this URL to verify the backend is running before starting the frontend.

---

## 5. Google AI Studio Frontend Configuration

When building a frontend with Google AI Studio that calls this API:

1. Set the **API base URL** to `http://127.0.0.1:8001` (or whichever host/port
   you started the server on).
2. Use the `/health` endpoint as a connectivity check before making data calls.
3. All API responses use the `Content-Type: application/json` header — no
   special parsing is needed.

---

## 6. API Base URL Setting

| Environment | Base URL |
|-------------|----------|
| Local development (default) | `http://127.0.0.1:8001` |
| Local network (other devices) | `http://<your-machine-ip>:8001` |
| Public tunnel (ngrok / Cloudflare) | `https://<tunnel-subdomain>.ngrok.io` |
| Production deployment | `https://your-domain.com` |

In your frontend code, store this as a single configurable constant so you
can switch environments without touching multiple files.

---

## 7. Mock Mode vs Real API Mode

| Mode | How to use | When to use |
|------|-----------|-------------|
| **Real API** | Point the frontend at `http://127.0.0.1:8001` with the backend running | Local development, demos |
| **Mock mode** | Return hard-coded JSON in the frontend without calling the backend | UI-only work, offline demos, CI |

For a hackathon demo, keeping the real API running locally is the simplest
approach. Mock mode is useful if the backend is unavailable or you want to
show the UI independently.

---

## 8. CORS Configuration

### Default allowed origins (always on, no configuration needed)

| Origin | Typical use |
|--------|-------------|
| `http://localhost:3000` | React (Create React App / Next.js) |
| `http://localhost:5173` | Vite (React, Vue, Svelte) |
| `http://localhost:4173` | Vite preview mode |
| `http://localhost:8501` | Streamlit |

### Adding extra origins

Set the `ALLOWED_ORIGINS` environment variable before starting the server:

```powershell
# PowerShell
$env:ALLOWED_ORIGINS = "https://my-app.example.com,https://staging.example.com"
python -m uvicorn student_assignment_tracker_buggy:app --reload --host 127.0.0.1 --port 8001
```

Or use a `.env` file (copy `.env.example` to `.env` and edit):

```
ALLOWED_ORIGINS=https://my-app.example.com,https://staging.example.com
ALLOW_ALL_CORS=false
```

Then load it before starting (requires `python-dotenv` or manual export).

### Demo wildcard mode (local only)

```powershell
$env:ALLOW_ALL_CORS = "true"
python -m uvicorn student_assignment_tracker_buggy:app --reload --host 127.0.0.1 --port 8001
```

⚠️ **This disables origin checking entirely. See Security Note below.**

---

## 9. Why a Hosted Frontend Cannot Use 127.0.0.1 Directly

`127.0.0.1` (loopback) resolves to *your own machine*. When a frontend is
hosted on a remote server (e.g. Vercel, Netlify, Google AI Studio preview),
the browser making the request is on the user's computer, but `127.0.0.1`
points to **that user's machine**, not yours — so the request fails to reach
your local API server.

**Rule:** A hosted frontend can only reach your local backend via a publicly
reachable URL — either a real deployment or a tunnel (see Section 10).

---

## 10. Deployment or HTTPS Tunnel Options

### Option A — ngrok (quickest for demos)

```powershell
# Install ngrok, then:
ngrok http 8001
```

ngrok will print a public URL like `https://abc123.ngrok.io`. Use that as
the API base URL in your frontend and add it to `ALLOWED_ORIGINS`.

### Option B — Cloudflare Tunnel

```powershell
cloudflared tunnel --url http://127.0.0.1:8001
```

### Option C — Deploy to a cloud service

Deploy `student_assignment_tracker_buggy.py` to any platform that supports
Python (Railway, Render, Fly.io, etc.). Set environment variables for CORS
on the platform's dashboard instead of locally.

### Option D — VS Code / GitHub Codespaces port forwarding

If running inside a Codespace, forward port 8001 and use the forwarded URL.

---

## 11. Security Note — Do Not Use ALLOW_ALL_CORS=true in Production

`ALLOW_ALL_CORS=true` sets `allow_origins=["*"]`, which means **any website
on the internet can make cross-origin requests to your API**.

- Acceptable for: local demos, hackathon prototypes with no sensitive data.
- Never acceptable for: any API that handles real user data, authentication
  tokens, or personally identifiable information.

In production, always list only the exact origins your frontend is served from
in `ALLOWED_ORIGINS`, and keep `ALLOW_ALL_CORS=false` (the default).
