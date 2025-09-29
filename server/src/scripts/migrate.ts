import fs from 'fs';
import path from 'path';
import pool from '../config/database';

const runMigrations = async () => {
  try {
    console.log('🔄 Running database migrations...');

    // Create auth_users table for authentication
    await pool.query(`
      CREATE TABLE IF NOT EXISTS auth_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Create updated_at trigger function
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
        email TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'mechanic')),
        phone TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Create customers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT NOT NULL,
        address TEXT,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Create vehicles table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
        make TEXT NOT NULL,
        model TEXT NOT NULL,
        year INTEGER NOT NULL,
        license_plate TEXT,
        vin TEXT,
        color TEXT,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Create inventory table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS inventory (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        sku TEXT UNIQUE NOT NULL,
        description TEXT,
        stock_quantity INTEGER DEFAULT 0,
        min_stock_level INTEGER DEFAULT 10,
        unit_price DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Create work_orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS work_orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_id UUID NOT NULL REFERENCES customers(id),
        vehicle_id UUID NOT NULL REFERENCES vehicles(id),
        assigned_to UUID REFERENCES users(id),
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
        priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
        estimated_hours DECIMAL(4,2) DEFAULT 0,
        actual_hours DECIMAL(4,2) DEFAULT 0,
        labor_rate DECIMAL(6,2) DEFAULT 75.00,
        estimated_completion TIMESTAMPTZ,
        completed_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Create work_order_items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS work_order_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        work_order_id UUID REFERENCES work_orders(id) ON DELETE CASCADE,
        inventory_id UUID REFERENCES inventory(id),
        quantity INTEGER NOT NULL DEFAULT 1,
        unit_price DECIMAL(10,2) NOT NULL,
        total_price DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Create appointments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_id UUID NOT NULL REFERENCES customers(id),
        vehicle_id UUID NOT NULL REFERENCES vehicles(id),
        assigned_to UUID REFERENCES users(id),
        title TEXT NOT NULL,
        description TEXT,
        appointment_date TIMESTAMPTZ NOT NULL,
        duration_minutes INTEGER DEFAULT 60,
        status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled')),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Create invoices table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        work_order_id UUID NOT NULL REFERENCES work_orders(id),
        customer_id UUID NOT NULL REFERENCES customers(id),
        invoice_number TEXT UNIQUE NOT NULL,
        subtotal DECIMAL(10,2) DEFAULT 0,
        tax_rate DECIMAL(4,2) DEFAULT 8.25,
        tax_amount DECIMAL(10,2) DEFAULT 0,
        total_amount DECIMAL(10,2) DEFAULT 0,
        status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
        issued_date DATE DEFAULT CURRENT_DATE,
        due_date DATE DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
        paid_date DATE,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Add triggers for updated_at
    const tables = ['users', 'customers', 'vehicles', 'inventory', 'work_orders', 'appointments', 'invoices'];
    for (const table of tables) {
      await pool.query(`
        DROP TRIGGER IF EXISTS update_${table}_updated_at ON ${table};
        CREATE TRIGGER update_${table}_updated_at
          BEFORE UPDATE ON ${table}
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
      `);
    }

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_vehicles_customer_id ON vehicles(customer_id);
      CREATE INDEX IF NOT EXISTS idx_work_orders_customer_id ON work_orders(customer_id);
      CREATE INDEX IF NOT EXISTS idx_work_orders_vehicle_id ON work_orders(vehicle_id);
      CREATE INDEX IF NOT EXISTS idx_work_orders_assigned_to ON work_orders(assigned_to);
      CREATE INDEX IF NOT EXISTS idx_work_orders_status ON work_orders(status);
      CREATE INDEX IF NOT EXISTS idx_work_order_items_work_order_id ON work_order_items(work_order_id);
      CREATE INDEX IF NOT EXISTS idx_appointments_assigned_to ON appointments(assigned_to);
      CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
      CREATE INDEX IF NOT EXISTS idx_invoices_work_order_id ON invoices(work_order_id);
      CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
    `);

    console.log('✅ Database migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

runMigrations();