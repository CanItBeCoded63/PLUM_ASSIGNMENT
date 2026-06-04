# 🚀 Deploy to Render - Step by Step Guide

This guide will help you deploy the OPD Claim Adjudication System to Render.com (FREE tier).

## ✅ Prerequisites

1. GitHub account (already have: https://github.com/CanItBeCoded63/PLUM_ASSIGNMENT)
2. Render.com account (free) - Sign up at https://render.com
3. OpenAI API key

## 📝 Deployment Steps

### Step 1: Prepare Your Repository

Make sure all code is pushed to GitHub:

```bash
cd opd-claim-system
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### Step 2: Create Render Account

1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with your GitHub account (recommended for easy integration)

### Step 3: Create New Web Service

1. From Render Dashboard, click **"New +"** button
2. Select **"Web Service"**
3. Connect your GitHub account if you haven't already
4. Select your repository: **CanItBeCoded63/PLUM_ASSIGNMENT**
5. Click **"Connect"**

### Step 4: Configure Web Service

Fill in the following settings:

**Basic Settings:**
- **Name:** `opd-claim-system` (or any name you prefer)
- **Region:** Select closest to your users
- **Branch:** `main`
- **Root Directory:** `opd-claim-system` (if repo has multiple projects)
- **Runtime:** `Node`

**Build & Deploy:**
- **Build Command:**
  ```bash
  npm install && cd frontend && npm install && npm run build && cd ../backend && npm install && npm run build
  ```

- **Start Command:**
  ```bash
  node backend/dist/server.js
  ```

**Instance Type:**
- Select **"Free"** (includes 750 hours/month free)

### Step 5: Add Environment Variables

Click on **"Advanced"** or go to **"Environment"** tab and add:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Required |
| `PORT` | `10000` | Render default port |
| `CORS_ORIGIN` | `*` | Allow all origins (or specify your domain) |
| `OPENAI_API_KEY` | `sk-...` | **Your OpenAI API key** (keep secret!) |

⚠️ **IMPORTANT:** You MUST add your OpenAI API key for the application to work!

### Step 6: Deploy!

1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Build frontend and backend
   - Start the server
3. Watch the deployment logs in real-time
4. Deployment takes ~5-10 minutes

### Step 7: Access Your Application

Once deployment completes:
- Your app will be live at: `https://opd-claim-system.onrender.com` (or your chosen name)
- The URL will be shown in the Render dashboard
- Test the health check: `https://your-app.onrender.com/health`

## 🎉 Success!

Your application is now deployed and publicly accessible!

## 📋 Post-Deployment Checklist

- [ ] Test the health endpoint: `/health`
- [ ] Upload a test claim with documents
- [ ] Verify claims list page works
- [ ] Check member dashboard
- [ ] Test admin panel
- [ ] Verify appeals workflow

## 🔧 Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Verify all dependencies are in package.json files
- Ensure Node version >= 18

### App Crashes
- Check logs: Dashboard → Logs tab
- Verify OPENAI_API_KEY is set correctly
- Check for missing environment variables

### API Errors
- Verify OpenAI API key has credits
- Check CORS_ORIGIN setting
- Review backend logs

### OCR Not Working
If Tesseract OCR fails:
1. Go to Settings → Native Environment
2. Add: `apt-get install -y tesseract-ocr`

## 🔄 Automatic Deployments

Render automatically redeploys when you push to the `main` branch:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Render will detect the push and redeploy automatically!

## 💰 Cost Information

**Free Tier Includes:**
- 750 hours/month (enough for 1 service running 24/7)
- 512 MB RAM
- Auto-sleep after 15 minutes of inactivity
- First request after sleep may take ~30 seconds (cold start)

**To Upgrade:**
- Paid plans start at $7/month
- No auto-sleep
- More RAM and resources

## 🔗 Alternative Deployment Options

If you prefer other platforms:
- **Railway.app** - Similar to Render, very easy
- **Vercel** - Great for frontend, requires serverless backend
- **Heroku** - Classic choice but costs more
- **Fly.io** - Good for Docker deployments
- **AWS/GCP/Azure** - Enterprise options

## 📚 Resources

- [Render Documentation](https://render.com/docs)
- [Node.js on Render](https://render.com/docs/deploy-node-express-app)
- [Environment Variables](https://render.com/docs/environment-variables)

---

**Need help?** Check the Render logs or create an issue on GitHub!
