# PWS Asset Management System

A comprehensive asset management application for Public Water Systems, developed for the **Choctaw Nation Sustainable Communities Program**.

## Features

- **Dashboard**: Overview of system health, asset conditions, and upcoming maintenance
- **Asset Management**: Complete CRUD operations for water system infrastructure
  - Wells, pumps, tanks, pipes, valves, hydrants, meters, and more
  - Life cycle tracking and replacement cost management
  - Condition monitoring
- **Maintenance Tracking**: Schedule and track maintenance activities
  - Preventive, corrective, emergency, and inspection tasks
  - Priority and status management
  - Cost tracking
- **Condition Assessments**: Record and track asset condition changes over time
- **Reports & Analytics**: Comprehensive reporting and capital planning
  - 5-year replacement forecasting
  - Condition distribution analysis
  - Maintenance cost summaries
- **Settings**: Configure water system information and contacts

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
```

## Deployment

This application is configured for deployment on Vercel:

1. Push to your GitHub repository
2. Import project in Vercel
3. Deploy

## Asset Categories

The system supports tracking for common water system assets:

- **Water Source**: Wells, springs, surface water intakes
- **Treatment**: Treatment plants, chemical feed systems
- **Storage**: Tanks, reservoirs, standpipes
- **Distribution**: Pipes, mains
- **Pumping**: Pump stations, booster pumps
- **Metering**: Flow meters, customer meters
- **Fire Hydrants**: Fire protection infrastructure
- **Valves**: Gate valves, PRVs, air release valves
- **Electrical/SCADA**: Control systems, generators

## Support

For questions or support, contact the Choctaw Nation Sustainable Communities Program.

---

Developed with support from the Choctaw Nation of Oklahoma
