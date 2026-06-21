# Deployment Guide for TechNow Mobile

This guide covers deploying all three parts of TechNow Mobile (backend API, customer storefront, and admin dashboard) to Vercel, setting up a managed MySQL database, and configuring Cloudinary for image storage.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Cloudinary Setup](#cloudinary-setup)
3. [Provision a Managed MySQL Database](#provision-a-managed-mysql-database)
4. [Deploy the Backend API to Vercel](#deploy-the-backend-api-to-vercel)
5. [Deploy the Customer Storefront to Vercel](#deploy-the-customer-storefront-to-vercel)
6. [Deploy the Admin Dashboard to Vercel](#deploy-the-admin-dashboard-to-vercel)
7. [Update Backend CORS Origins](#update-backend-cors-origins)

---

## Prerequisites
You will need the following accounts:
- A [Vercel account](https://vercel.com/signup)
- A [Cloudinary account](https://cloudinary.com/users/register/free)
- A [PlanetScale](https://planetscale.com/), [Railway](https://railway.app/), or [Aiven](https://aiven.io/) account for managed MySQL

---

## Cloudinary Setup
Cloudinary is used for product image storage because Vercel's serverless functions have an ephemeral filesystem that can't store files.

1. **Create a free Cloudinary account**: https://cloudinary.com/users/register/free
2. **Get your API credentials**:
   - Log in to your Cloudinary dashboard
   - Look for the "Dashboard" section, which will show:
     - Cloud Name
     - API Key
     - API Secret
3. Save these credentials—you'll need them for the backend environment variables.

---

## Provision a Managed MySQL Database
We'll use PlanetScale (free tier available) as an example.

### Option 1: PlanetScale
1. **Sign up/Log in**: https://planetscale.com/
2. **Create a database**:
   - Click "New Database"
   - Name it `technow_mobile`
   - Select a region near you
   - Click "Create"
3. **Get connection details**:
   - Go to your database's "Connect" tab
   - Choose "Connect with Prisma" or "Connect with Node.js"
   - Copy the host, username, password, and database name.
4. **Import the schema**:
   - From your terminal, connect to your PlanetScale database using the credentials above
   - Run the contents of `backend/database/schema.sql`
   - Then run the seed script: `cd backend && node database/seed.js` (make sure your backend `.env` is set up with your PlanetScale credentials first)

### Option 2: Railway/Aiven
The process is similar—create a free-tier MySQL database and get the host, username, password, and database name.

---

## Deploy the Backend API to Vercel
1. **Push your code to GitHub/GitLab/Bitbucket** (Vercel needs this to deploy)
2. **Create a new Vercel project**:
   - Go to https://vercel.com/new
   - Import your TechNow Mobile repository
   - Select the `backend` directory as the root
3. **Configure the project**:
   - **Framework Preset**: Other
   - **Build Command**: Leave blank
   - **Output Directory**: Leave blank
   - **Install Command**: `npm install`
4. **Add Environment Variables**: Copy everything from `backend/.env.example` and fill in the values:
   ```env
   PORT=5000
   NODE_ENV=production
   
   DB_HOST=<your-db-host>
   DB_PORT=3306
   DB_USER=<your-db-user>
   DB_PASSWORD=<your-db-password>
   DB_NAME=technow_mobile
   
   JWT_SECRET=<generate-a-long-random-secret-key>
   JWT_EXPIRES_IN=7d
   
   USDT_WALLET_ADDRESS=<your-trc20-wallet-address>
   EXCHANGE_RATE_API_URL=https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd
   CURRENCY_RATE_API_URL=https://api.exchangerate-api.com/v4/latest/USD
   
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
   
   SMTP_HOST=<your-smtp-host> (optional)
   SMTP_PORT=587
   SMTP_USER=<your-smtp-user> (optional)
   SMTP_PASSWORD=<your-smtp-password> (optional)
   SMTP_FROM_EMAIL=noreply@technowmobile.com
   
   STOREFRONT_URL=<we'll-fill-this-in-later>
   ADMIN_URL=<we'll-fill-this-in-later>
   
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   
   CRON_SECRET=<generate-a-long-random-secret>
   ```
5. **Deploy!** Click the "Deploy" button. Once deployed, you'll get your backend URL (e.g., `https://technow-backend.vercel.app`)—save this!

---

## Deploy the Customer Storefront to Vercel
1. **Create another Vercel project**:
   - Go to https://vercel.com/new
   - Import the same repository
   - Select the `frontend-storefront` directory as the root
2. **Configure the project**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. **Add Environment Variable**:
   - `VITE_API_URL=https://<your-backend-url>.vercel.app/api`
4. **Deploy!** Once deployed, save your storefront URL.

---

## Deploy the Admin Dashboard to Vercel
1. **Create a third Vercel project**:
   - Go to https://vercel.com/new
   - Import the same repository
   - Select the `frontend-admin` directory as the root
2. **Configure the project**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. **Add Environment Variable**:
   - `VITE_API_URL=https://<your-backend-url>.vercel.app/api`
4. **Deploy!** Once deployed, save your admin URL.

---

## Update Backend CORS Origins
Now that we have both frontend URLs, go back to your backend Vercel project's settings and update the environment variables:
- `STOREFRONT_URL=https://<your-storefront-url>.vercel.app`
- `ADMIN_URL=https://<your-admin-url>.vercel.app`

Then **redeploy your backend** to apply the changes.

---

## Congratulations!
Your entire TechNow Mobile platform is now deployed and running!
