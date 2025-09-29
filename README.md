# Auto Service Management System

A comprehensive on-premise solution for managing auto service operations, including customer management, work orders, inventory tracking, and billing.

## Features

- **Role-based Authentication** (Admin/Manager and Mechanic/Staff)
- **Customer & Vehicle Management** with linked relationships
- **Work Order System** with status tracking and mechanic assignment
- **Inventory Management** with stock tracking and low-stock alerts
- **Appointment Scheduling** with calendar view
- **Billing & Invoicing** system
- **Mobile-responsive Design** optimized for workshop use

## Quick Start (Development)

### Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd auto-service-management
npm install
cd server && npm install && cd ..
```

### 2. Database Setup

```bash
# Start PostgreSQL (if not running)
# Create database
createdb auto_service_db

# Copy environment files
cp .env.example .env
cp server/.env.example server/.env

# Edit server/.env with your database credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=auto_service_db
# DB_USER=your_username
# DB_PASSWORD=your_password
```

### 3. Run Migrations and Seed Data

```bash
# Setup database (migrate + seed)
npm run db:setup

# Or run separately:
# npm run db:migrate
# npm run db:seed
```

### 4. Start Development Servers

```bash
# Start both frontend and backend
npm run dev:full

# Or start separately:
# Backend: npm run server:dev
# Frontend: npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

### Default Login Credentials

- **Admin**: admin@autoservice.com / password
- **Mechanic**: mechanic@autoservice.com / password

## Production Deployment

### Option 1: Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

### Option 2: Manual Deployment

#### Backend Deployment

```bash
cd server
npm install
npm run build
npm start
```

#### Frontend Deployment

```bash
npm install
npm run build

# Serve the dist folder with your web server (nginx, apache, etc.)
```

### Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/auto_service_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=auto_service_db
DB_USER=username
DB_PASSWORD=password

# Server
PORT=3001
NODE_ENV=production

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

## API Documentation

### Authentication
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signup` - Create new user (admin only)

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Additional endpoints for vehicles, work orders, inventory, appointments, and invoices follow similar patterns.

## Database Schema

The system uses PostgreSQL with the following main tables:
- `auth_users` - Authentication data
- `users` - User profiles and roles
- `customers` - Customer information
- `vehicles` - Vehicle details linked to customers
- `work_orders` - Service jobs and repairs
- `inventory` - Parts and supplies
- `appointments` - Scheduled services
- `invoices` - Billing and payments

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- SQL injection protection
- CORS configuration
- Helmet.js security headers

## Mobile Optimization

The interface is fully responsive and optimized for:
- Tablets (primary workshop device)
- Smartphones
- Desktop computers

## Support

For technical support or questions:
1. Check the logs: `docker-compose logs` or `npm run server:dev`
2. Verify database connection
3. Ensure all environment variables are set correctly

## License

This project is licensed under the MIT License.