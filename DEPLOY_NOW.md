# 🚀 DEPLOY YOUR APP IN 5 MINUTES

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   OPD CLAIM ADJUDICATION SYSTEM                            │
│   Status: ✅ READY FOR DEPLOYMENT                          │
│   Code: ✅ Pushed to GitHub                                │
│   Config: ✅ Deployment files created                      │
│                                                             │
│   Repository: CanItBeCoded63/PLUM_ASSIGNMENT              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 DEPLOY NOW - TWO OPTIONS

### 🔷 Option A: Render.com (Recommended)

**Step 1:** Go to https://render.com
- Click "Get Started for Free"
- Sign up with GitHub

**Step 2:** Create Web Service
- Click "New +" button
- Choose "Web Service"
- Select repo: **CanItBeCoded63/PLUM_ASSIGNMENT**

**Step 3:** Configure (copy these exactly)

```yaml
Name: opd-claim-system
Runtime: Node
Root Directory: (leave empty OR type "opd-claim-system")

Build Command:
npm install && cd frontend && npm install && npm run build && cd ../backend && npm install && npm run build

Start Command:
node backend/dist/server.js
```

**Step 4:** Add Environment Variables

```bash
NODE_ENV = production
PORT = 10000  
CORS_ORIGIN = *
OPENAI_API_KEY = sk-your-key-here  # ⚠️ REQUIRED!
```

**Step 5:** Click "Create Web Service"

⏱️ Wait 5-10 minutes → ✅ Your app is live!

---

### 🔷 Option B: Railway.app (Easier!)

**Step 1:** Go to https://railway.app
- Sign in with GitHub

**Step 2:** Deploy
- Click "New Project"
- "Deploy from GitHub repo"
- Select: **CanItBeCoded63/PLUM_ASSIGNMENT**

**Step 3:** Add Variables
- Go to "Variables" tab
- Add: `OPENAI_API_KEY = sk-your-key-here`
- Add: `NODE_ENV = production`

✅ Done! Railway auto-configures everything else!

---

## ⚠️ YOU MUST HAVE: OpenAI API Key

Get your API key here:
👉 https://platform.openai.com/api-keys

**Format:** Starts with `sk-`
**Cost:** Pay-as-you-go (usually $0.01-0.05 per claim)

---

## 🧪 Test Your Deployed App

Once live, test it:

1. Open your app URL (shown in dashboard)
2. Click "Submit New Claim"
3. Fill in:
   - Member ID: `M001`
   - Name: `John Doe`
   - Date: Today
   - Amount: `5000`
4. Upload any image/PDF
5. Click "Submit Claim"
6. See AI adjudication! 🎉

---

## 📊 Your Live URLs

After deployment, you'll get:

**Render:**
```
https://opd-claim-system.onrender.com
or
https://opd-claim-system-xxxx.onrender.com
```

**Railway:**
```
https://opd-claim-system.up.railway.app
```

Share this URL with anyone - it's public!

---

## 🎉 That's It!

```
┌──────────────────────────────────────────────┐
│  Your app will be deployed and accessible    │
│  to anyone with the URL!                     │
│                                              │
│  Features included:                          │
│  ✅ AI Document Processing                   │
│  ✅ Intelligent Claim Adjudication           │
│  ✅ Member Dashboard                         │
│  ✅ Appeals Workflow                         │
│  ✅ Admin Panel                              │
│  ✅ Real-time Analytics                      │
└──────────────────────────────────────────────┘
```

**Questions?** Check `DEPLOYMENT_INSTRUCTIONS.md` for detailed guide!

**Good luck! 🚀**
