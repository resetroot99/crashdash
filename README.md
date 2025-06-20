# Profit Per Job Analyzer

A Next.js PWA for analyzing collision repair job profitability from CCC estimates.

## Features

- 📊 **Line-item job costing** (parts, labor, sublets, tech time)
- 🚨 **Profitability alerts** per job  
- 📈 **Per-job margin tracking** with actual vs billed
- 🏭 **Department breakdown** (body, paint, glass, ADAS)
- 📁 **CCC XML/CSV import** from estimating systems
- ⚡ **Real-time calculations** with health scores
- 📱 **PWA support** for offline use

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **Payments**: Stripe
- **File Parsing**: xml2js, papaparse
- **PWA**: Service Workers, Web App Manifest

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment variables:
   ```bash
   cp env.example .env.local
   ```

3. Set up Supabase:
   - Create new project at supabase.com
   - Add your URL and anon key to `.env.local`
   - Run database migration (see `/supabase` folder)

4. Run development server:
   ```bash
   npm run dev
   ```

## Usage

1. **Upload CCC File**: Drag & drop XML or CSV exports from CCC
2. **View Analysis**: See profit margins, department breakdown, alerts
3. **Track Performance**: Monitor job health scores and trends

## Database Schema

```sql
-- Jobs table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  job_number TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  vehicle_info TEXT NOT NULL,
  raw_data JSONB NOT NULL,
  parsed_data JSONB NOT NULL,
  profit_analysis JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/profit-per-job-analyzer)

## Roadmap

- [ ] QuickBooks integration
- [ ] Multi-shop support
- [ ] Advanced reporting
- [ ] Mobile app
- [ ] API for third-party integrations 