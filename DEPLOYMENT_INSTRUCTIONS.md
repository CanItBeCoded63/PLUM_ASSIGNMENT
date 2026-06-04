# 🎯 QUICK START: Deploy Your Application Now!

Your code is ready and pushed to GitHub! Follow these simple steps to deploy.

---

## 🚀 DEPLOY TO RENDER (5 Minutes Setup)

### Step 1: Create Render Account
1. Go to **https://render.com**
2. Click **"Get Started for Free"**
3. Sign up with your **GitHub account** (easiest method)

### Step 2: Create Web Service
1. From Render Dashboard, click the blue **"New +"** button (top right)
2. Select **"Web Service"**
3. If asked, authorize Render to access your GitHub
4. Find and select: **CanItBeCoded63/PLUM_ASSIGNMENT**
5. Click **"Connect"**

### Step 3: Configure Service

Render will show a configuration form. Fill it in:

#### Basic Information:
- **Name:** `opd-claim-system` (or any name you like)
- **Region:** Choose closest to you (e.g., Oregon USA, Frankfurt)
- **Branch:** `main`
- **Root Directory:** Leave empty OR type `opd-claim-system`
- **Runtime:** `Node`

#### Build Settings:
- **Build Command:**
```bash
npm install && cd frontend && npm install && npm run build && cd ../backend && npm install && npm run build
```

- **Start Command:**
```bash
node backend/dist/server.js
```

#### Instance Type:
- Select: **"Free"** ($0/month - 750 hours included)

### Step 4: Add Environment Variables

Scroll down to **"Environment Variables"** section and click **"Add Environment Variable"**

Add these 4 variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `CORS_ORIGIN` | `*` |
| `OPENAI_API_KEY` | Your OpenAI API Key (starts with sk-...) |

⚠️ **CRITICAL:** You MUST add your OpenAI API key or the app won't work!

### Step 5: Deploy!
1. Click the big blue **"Create Web Service"** button at the bottom
2. Render will start building your app
3. Watch the logs - it takes about 5-10 minutes
4. Wait for: ✅ **"Your service is live"**

### Step 6: Access Your App
Once deployed, you'll see:
- **URL:** `https://opd-claim-system-xxxx.onrender.com`
- Click the URL to open your live application!

---

## 🧪 Test Your Deployed App

1. Open your app URL
2. Click **"Submit New Claim"**
3. Fill in test data:
   - Member ID: `M001`
   - Member Name: `John Doe`
   - Treatment Date: Today's date
   - Claim Amount: `5000`
4. Upload a test document (any image or PDF)
5. Click **"Submit Claim"**
6. See the AI adjudication result!

---

## ⚡ Alternative: Deploy to Railway (Even Easier!)

If Render doesn't work, try Railway:

### Railway Setup (3 Minutes)
1. Go to **https://railway.app**
2. Sign in with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select **CanItBeCoded63/PLUM_ASSIGNMENT**
5. Railway auto-detects the config!
6. Go to **Variables** tab and add:
   - `OPENAI_API_KEY`: your API key
   - `NODE_ENV`: `production`
7. Done! Railway gives you a URL

---

## 📱 Share Your Deployed App

Once deployed, share your public URL:
- **Format:** `https://your-app-name.onrender.com` or `https://your-app.up.railway.app`
- **Access:** Anyone with the link can use it
- **No login required:** It's completely public

---

## 🔧 Common Issues & Fixes

### "Build Failed"
- **Solution:** Check you selected **Node** as runtime, not Static Site
- Verify root directory is correct (leave empty if entire repo is the app)

### "App Crashes on Start"
- **Solution:** Check you added the `OPENAI_API_KEY` environment variable
- Verify the key is valid and has credits

### "503 Service Unavailable"
- **Solution:** Free tier apps sleep after 15 min of inactivity
- First request takes ~30 seconds to "wake up"
- Subsequent requests are instant

### "AI Extraction Fails"
- **Solution:** Check OpenAI API key has credits
- Log in to https://platform.openai.com/usage to verify

---

## 💡 Pro Tips

1. **Free Tier Sleep:** Render free apps sleep after 15 minutes. First request wakes it up (takes ~30 sec)
2. **Keep Alive:** Use a service like UptimeRobot to ping your app every 5 minutes to keep it awake
3. **Logs:** View logs in Render dashboard → Logs tab to debug issues
4. **Redeploy:** Push to GitHub and Render auto-redeploys!

---

## 🎉 You're Done!

Your OPD Claim Adjudication System is now:
- ✅ Deployed and public
- ✅ Processing claims with AI
- ✅ Accessible to anyone with the URL
- ✅ Auto-deploys on git push

**Next Steps:**
- Test all features (claims, appeals, admin panel)
- Share the URL with others
- Monitor usage in Render dashboard
- Add custom domain (optional, requires paid plan)

---

**Questions?** Check logs in Render dashboard or review DEPLOY_TO_RENDER.md for detailed troubleshooting.
