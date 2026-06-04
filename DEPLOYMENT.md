# 🚀 Deployment Guide

This guide describes how to deploy the **OPD Claim Adjudication System** to cloud hosting platforms. The repository is pre-configured for automated builds and deployment using modern hosting providers like **Railway**, **Render**, or any other framework.

---

## 🛠️ Pre-configured Files

We have added root-level configuration files to allow zero-config deployment:
1. **`package.json` (Root)**: Orchestrates installing and building both the frontend and backend in sequence, then starting the production server.
2. **`nixpacks.toml`**: Configures the build pipeline (specifically installs `nodejs_20` and the system-level `tesseract` package for OCR support).

---

## 🚂 Option 1: Deploy to Railway (Recommended)

Railway is the fastest and easiest way to deploy this full-stack application.

### Step 1: Push Code to GitHub
Ensure all your project code is committed and pushed to a GitHub repository:
```bash
git init
git add .
git commit -m "feat: complete OPD system with appeals & admin panel"
# Create a repository on GitHub, then link and push:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 2: Create a Railway Project
1. Log in to [Railway.app](https://railway.app/).
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select your repository.
4. Click **Deploy Now**.

### Step 3: Add Environment Variables
In your Railway dashboard, navigate to the **Variables** tab of your service and add:
- `OPENROUTER_API_KEY`: Your OpenRouter API Key (e.g. `sk-or-v3-...`)
- `NODE_ENV`: `production`

Railway will automatically detect the root `package.json` and build the application using the pre-configured `nixpacks.toml` setup. Once built, it will assign a public domain name for you.

---

## ☁️ Option 2: Deploy to Render

Render is another excellent, free-tier-friendly option for deploying Node.js web services.

### Step 1: Create a Web Service
1. Log in to [Render.com](https://render.com/).
2. Click **New** -> **Web Service**.
3. Connect your GitHub repository.

### Step 2: Configure Build & Start Commands
Fill in the following details in the Web Service settings:
- **Runtime**: `Node`
- **Build Command**: `cd frontend && npm install && npm run build && cd ../backend && npm install && npm run build`
- **Start Command**: `node backend/dist/server.js`

### Step 3: Add Environment Variables
Add the following key-value pairs in the **Environment** section:
- `OPENROUTER_API_KEY`: Your OpenRouter API Key
- `NODE_ENV`: `production`

Render will compile the frontend Vite app and run the backend Express server under a single unified URL.

---

## 🐳 Option 3: Deploy with Docker

If you prefer self-hosting or deploying to a cloud container platform (like AWS ECS or Fly.io), you can containerize the app. Here is a simple `Dockerfile` setup for the root of the project:

```dockerfile
# Build Phase
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN cd frontend && npm install && npm run build
RUN cd backend && npm install && npm run build

# Production Phase
FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache tesseract-ocr
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/package*.json ./backend/
COPY --from=builder /app/frontend/dist ./frontend/dist
RUN cd backend && npm install --only=production
EXPOSE 3000
CMD ["node", "backend/dist/server.js"]
```
