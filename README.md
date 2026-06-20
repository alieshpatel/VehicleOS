# VehicleOS

VehicleOS is an intelligent vehicle management platform built with Next.js 15, Neon Postgres, Drizzle ORM, Clerk Auth, UploadThing, and Gemini AI. It helps vehicle owners track maintenance, log fuel expenses, store important documents securely, and get AI-powered diagnostics.

## Features

- **Maintenance Tracking**: Keep detailed logs of all services and repairs.
- **Fuel Logs & Efficiency**: Track fuel fill-ups to automatically calculate real-world mileage.
- **Smart Reminders**: Set reminders for insurance renewals, PUC deadlines, and services.
- **Digital Glovebox**: Securely store your RC book, insurance policies, and service bills.
- **AI Diagnostics**: Describe symptoms, and the Gemini-powered AI suggests possible causes and estimates.
- **Cost Analytics**: Visualize your monthly spending with interactive charts.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, ShadCN UI
- **Backend**: Next.js Server Actions & Route Handlers
- **Database**: PostgreSQL (Neon Serverless)
- **ORM**: Drizzle ORM
- **Authentication**: Clerk
- **File Storage**: UploadThing
- **Charts**: Recharts
- **AI Integration**: Google Gemini API

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Set up your environment variables by copying `.env.example` to `.env.local` and filling in the values:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   CLERK_WEBHOOK_SECRET=
   DATABASE_URL=
   UPLOADTHING_TOKEN=
   GEMINI_API_KEY=
   ```
4. Push the database schema to your Neon Postgres database:
   ```bash
   yarn drizzle-kit push
   ```
5. Run the development server:
   ```bash
   yarn dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) in your browser.
