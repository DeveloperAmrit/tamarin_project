# AWS App Runner Deployment Guide

## 📋 Prerequisites

1. AWS Account
2. GitHub repository with your code
3. AWS CLI installed (optional)

## 🚀 Deployment Steps

### Option 1: Deploy from GitHub (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for AWS App Runner deployment"
   git push origin main
   ```

2. **Go to AWS Console**
   - Navigate to AWS App Runner service
   - Click "Create service"

3. **Configure Source**
   - Source: "Source code repository"
   - Connect to GitHub (authorize AWS)
   - Select your repository: `tamarin_project`
   - Branch: `main`
   - Source directory: `/backend`

4. **Configure Build**
   - Runtime: Python 3
   - Build command: `pip install -r requirements.txt`
   - Start command: `python start_production.py`
   - Port: `8080`

5. **Configure Service**
   - Service name: `attack-simulator-backend`
   - CPU: 1 vCPU
   - Memory: 2 GB
   - Environment variables: (none needed for now)

6. **Deploy**
   - Click "Create & Deploy"
   - Wait 5-10 minutes for deployment

### Option 2: Using apprunner.yaml

If you have `apprunner.yaml` in your backend folder, AWS App Runner will auto-detect it.

## 🔧 Important Changes Made

### 1. Created `apprunner.yaml`
Configuration file for AWS App Runner deployment.

### 2. Created `start_production.py`
Production startup script that:
- Uses PORT environment variable (App Runner default: 8080)
- Removes reload mode (production setting)
- Uses proper host binding

### 3. CORS Configuration
Already set to allow all origins in `app/main.py`:
```python
allow_origins=["*"]
```

**After deployment, update to your frontend URL:**
```python
allow_origins=[
    "http://localhost:3000",  # Local development
    "https://your-frontend-url.vercel.app"  # Production frontend
]
```

## 📝 Post-Deployment

### 1. Get Your Backend URL
After deployment, AWS App Runner will give you a URL like:
```
https://xyz123.us-east-1.awsapprunner.com
```

### 2. Update Frontend .env.local
```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=https://xyz123.us-east-1.awsapprunner.com
```

### 3. Test Your API
```bash
curl https://your-app-url.awsapprunner.com/health
```

Should return:
```json
{"status": "healthy"}
```

## 🌐 Frontend Deployment

Deploy your Next.js frontend to:

### Option 1: Vercel (Recommended for Next.js)
```bash
cd frontend
npm install -g vercel
vercel
```

### Option 2: Netlify
```bash
cd frontend
npm run build
# Upload .next folder to Netlify
```

### Option 3: AWS Amplify
- Connect GitHub repo
- Build settings auto-detected for Next.js
- Deploy

## 💰 Pricing

AWS App Runner pricing:
- **Provisioned:** ~$0.007/hr (~$5/month) + data transfer
- **Pay-per-use:** Based on requests and compute time

**Free tier:** 
- First deployment includes some free credits
- Check current AWS Free Tier offerings

## 🔒 Security Improvements

### 1. Update CORS (After Frontend Deployment)
```python
# app/main.py
allow_origins=[
    "https://your-frontend.vercel.app",
    "http://localhost:3000"  # Keep for local dev
]
```

### 2. Add Environment Variables (Optional)
In App Runner service configuration:
- `ENVIRONMENT=production`
- `LOG_LEVEL=info`

### 3. Enable HTTPS (Automatic)
App Runner provides HTTPS by default.

## 📊 Monitoring

Access logs and metrics in AWS Console:
- App Runner → Your Service → Logs
- CloudWatch for detailed metrics

## 🔄 Auto-Deployment

With GitHub integration:
- Every push to `main` branch triggers auto-deployment
- Or configure manual deployments only

## 🐛 Troubleshooting

### Port Issues
Make sure `start_production.py` uses port 8080 or reads from PORT env var.

### Build Failures
Check that all dependencies in `requirements.txt` are compatible with Python 3.11.

### CORS Errors
Update `allow_origins` in `app/main.py` with your actual frontend URL.

### Memory Issues
If app crashes, increase memory in App Runner configuration (try 3-4 GB).

## 📱 Testing Locally with Production Settings

```bash
cd backend
conda activate attack_simulator
export PORT=8080
python start_production.py
```

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] `apprunner.yaml` in backend folder
- [ ] `start_production.py` created
- [ ] AWS App Runner service created
- [ ] Service deployed successfully
- [ ] Backend URL obtained
- [ ] Frontend `.env.local` updated with backend URL
- [ ] Frontend redeployed
- [ ] API endpoints tested
- [ ] CORS configured for production

---

**Your backend is now ready for AWS App Runner! 🚀**

Next step: Deploy the frontend and update CORS settings.
