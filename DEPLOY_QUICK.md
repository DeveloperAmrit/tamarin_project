# Quick AWS App Runner Deployment

## Files Created for AWS App Runner:
✅ `backend/apprunner.yaml` - App Runner configuration
✅ `backend/start_production.py` - Production startup script
✅ `AWS_DEPLOYMENT.md` - Full deployment guide

## Quick Steps:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add AWS App Runner config"
   git push origin main
   ```

2. **In AWS Console:**
   - Go to App Runner
   - Create Service → GitHub → Select repo
   - Source directory: `/backend`
   - Start command: `python start_production.py`
   - Port: 8080
   - Deploy!

3. **After Deployment:**
   - Copy your App Runner URL (e.g., https://xyz.awsapprunner.com)
   - Update `frontend/.env.local`:
     ```
     NEXT_PUBLIC_API_URL=https://your-url.awsapprunner.com
     ```

4. **Deploy Frontend:**
   - Vercel (recommended): `cd frontend && vercel`
   - Or Netlify/AWS Amplify

5. **Update CORS (Important!):**
   After frontend deployment, edit `backend/app/main.py`:
   ```python
   allow_origins=[
       "https://your-frontend.vercel.app",
       "http://localhost:3000"
   ]
   ```
   Then redeploy backend.

## That's it! 🎉

Your app will be live at:
- Backend: https://your-backend.awsapprunner.com
- Frontend: https://your-frontend.vercel.app
