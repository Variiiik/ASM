# Auto Service Management System

A comprehensive auto service management application built with React, TypeScript, and Supabase. This system helps auto repair shops manage customers, vehicles, work orders, inventory, appointments, and billing.

## Features

- **🔐 Role-based Authentication** (Admin and Mechanic roles)
- **👥 Customer Management** with contact information and vehicle history
- **🚗 Vehicle Management** linked to customers
- **🔧 Work Order System** with status tracking and mechanic assignment
- **📦 Inventory Management** with stock tracking and low-stock alerts
- **📅 Appointment Scheduling** with calendar integration
- **💰 Billing & Invoicing** system with tax calculations
- **📱 Mobile-responsive Design** optimized for workshop tablets and phones
- **📊 Dashboard** with key metrics and recent activity

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Supabase** for authentication and database
- **Vite** for development and building

### Backend (Database)
- **Supabase** (PostgreSQL with real-time features)
- **Row Level Security (RLS)** for data protection
- **Automatic timestamps** and triggers

## Quick Start

### Prerequisites

- Node.js 18+
- A Supabase account and project

### 1. Clone and Install

```bash
git clone <repository-url>
cd auto-service-management
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings → API to get your project URL and anon key
3. Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Database Setup

The database migrations are located in `supabase/migrations/`. To apply them:

1. Install the Supabase CLI
2. Link your project: `supabase link --project-ref your-project-ref`
3. Push migrations: `supabase db push`

Or manually run the SQL files in your Supabase SQL editor.

### 4. Start Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Create Your First Admin User

After setting up the database, you'll need to create an admin user:

1. Go to your Supabase project → Authentication → Users
2. Create a new user with email and password
3. In the SQL editor, run:

```sql
INSERT INTO users (user_id, email, full_name, role)
VALUES ('your-user-id-from-auth', 'admin@yourshop.com', 'Admin Name', 'admin');
```

## Database Schema

The system uses the following main tables:

- **`users`** - User profiles and roles
- **`customers`** - Customer information
- **`vehicles`** - Vehicle details linked to customers
- **`work_orders`** - Service jobs and repairs
- **`work_order_items`** - Parts used in work orders
- **`inventory`** - Parts and supplies inventory
- **`appointments`** - Scheduled services
- **`invoices`** - Billing and payment tracking

## User Roles

### Admin
- Full access to all features
- Customer and vehicle management
- Work order creation and assignment
- Inventory management
- Invoice creation and management
- User management

### Mechanic
- View assigned work orders
- Update work order status and progress
- View customer and vehicle information
- Check inventory levels
- View appointments

## Key Features Explained

### Dashboard
- Real-time metrics and KPIs
- Recent activity feed
- Quick action buttons
- Low stock alerts

### Customer Management
- Complete customer profiles
- Contact information and notes
- Vehicle history per customer
- Search and filtering

### Work Orders
- Detailed job descriptions
- Status tracking (Pending → In Progress → Completed)
- Time and labor tracking
- Parts and materials used
- Mechanic assignment

### Inventory
- Stock level monitoring
- Low stock alerts
- Part pricing and descriptions
- Usage tracking through work orders

### Invoicing
- Automatic invoice generation from work orders
- Tax calculations
- Payment tracking
- PDF generation (planned)

## Development

### Project Structure

```
src/
├── components/          # React components
│   ├── Auth/           # Authentication components
│   ├── Dashboard/      # Dashboard widgets
│   ├── Customers/      # Customer management
│   └── Layout/         # Layout components
├── contexts/           # React contexts
├── lib/               # Utilities and Supabase client
└── types/             # TypeScript type definitions

supabase/
├── migrations/        # Database migrations
└── config.toml       # Supabase configuration
```

### Adding New Features

1. Create database tables in a new migration file
2. Update TypeScript types in `src/lib/database.types.ts`
3. Add RLS policies for security
4. Create React components for the UI
5. Add navigation items to the sidebar

### Security

- All database access is protected by Row Level Security (RLS)
- JWT-based authentication through Supabase
- Role-based access control
- Input validation and sanitization

## Deployment

### Supabase (Recommended)

1. Push your database migrations to Supabase
2. Build the frontend: `npm run build`
3. Deploy the `dist` folder to any static hosting service
4. Update your Supabase project's allowed origins

### Self-hosted

For self-hosted deployments, you can use the included Docker configuration or deploy to any Node.js hosting service.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions:
1. Check the GitHub issues
2. Review the Supabase documentation
3. Check the application logs for error details

---

Built with ❤️ for auto repair shops everywhere.