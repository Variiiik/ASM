# Auto Service Management System

A comprehensive auto service management application built with React, TypeScript, Node.js, Express, and PostgreSQL. This system helps auto repair shops manage customers, vehicles, work orders, inventory, appointments, and billing.

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
- **Vite** for development and building

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** database
- **JWT** authentication with jose library
- **bcrypt** for password hashing

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+

### 1. Clone and Install

```bash
git clone <repository-url>
cd auto-service-management
npm install
cd server && npm install && cd ..
```

### 2. Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE auto_service_db;
```

2. Copy environment files:
```bash
cp .env.example .env
cp server/.env.example server/.env
```

3. Update the database configuration in `server/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=auto_service_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

4. Run database migrations and seed data:
```bash
npm run db:setup
```

### 3. Start Development

Start both frontend and backend:
```bash
npm run dev:full
```

Or start them separately:
```bash
# Terminal 1 - Backend
npm run server:dev

# Terminal 2 - Frontend  
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

### 4. Login

Use the seeded demo accounts:
- **Admin**: admin@autoservice.com / password
- **Mechanic**: mechanic@autoservice.com / password

## Database Schema

The system uses the following main tables:

- **`auth_users`** - Authentication credentials
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
├── src/                    # Frontend React app
│   ├── components/         # React components
│   ├── contexts/          # React contexts
│   ├── lib/               # Utilities and API client
│   └── types/             # TypeScript type definitions
├── server/                # Backend Node.js app
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   └── scripts/       # Database scripts
│   └── package.json
└── package.json           # Frontend dependencies
```

### API Endpoints

#### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - Create new user (admin only)

#### Customers
- `GET /api/customers` - List all customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Database Management

```bash
# Run migrations
npm run db:migrate

# Seed sample data
npm run db:seed

# Reset and setup database
npm run db:setup
```

### Adding New Features

1. Create database tables in a new migration file
2. Add API routes in the server
3. Create React components for the UI
4. Add navigation items to the sidebar
5. Update TypeScript types

### Security

- JWT-based authentication
- Password hashing with bcrypt
- SQL injection protection with parameterized queries
- CORS configuration
- Input validation and sanitization

## Production Deployment

### Backend
1. Set production environment variables
2. Build the server: `npm run server:build`
3. Start with: `npm run server:start`

### Frontend
1. Update API URL in `.env`
2. Build: `npm run build`
3. Serve the `dist` folder with any static hosting service

### Database
- Use a production PostgreSQL instance
- Run migrations: `npm run db:migrate`
- Update connection settings in server `.env`

## Docker Deployment

Use the included Docker configuration:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database
- Node.js backend
- Nginx serving the frontend

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
2. Review the application logs for error details
3. Check database connectivity

---

Built with ❤️ for auto repair shops everywhere.