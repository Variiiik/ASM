import bcrypt from 'bcryptjs';
import pool from '../config/database';

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');

    // Check if admin user already exists
    const existingAdmin = await pool.query(
      'SELECT id FROM auth_users WHERE email = $1',
      ['admin@autoservice.com']
    );

    if (existingAdmin.rows.length === 0) {
      // Create admin user
      const adminPasswordHash = await bcrypt.hash('password', 12);
      const adminResult = await pool.query(`
        INSERT INTO auth_users (id, email, password_hash) 
        VALUES ('550e8400-e29b-41d4-a716-446655440000', 'admin@autoservice.com', $1)
        RETURNING id
      `, [adminPasswordHash]);

      if (adminResult.rows.length > 0) {
        await pool.query(`
          INSERT INTO users (user_id, email, full_name, role, phone)
          VALUES ('550e8400-e29b-41d4-a716-446655440000', 'admin@autoservice.com', 'System Administrator', 'admin', '(555) 123-4567')
        `);
        console.log('✅ Admin user created');
      }
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    // Check if mechanic user already exists
    const existingMechanic = await pool.query(
      'SELECT id FROM auth_users WHERE email = $1',
      ['mechanic@autoservice.com']
    );

    if (existingMechanic.rows.length === 0) {
      // Create mechanic user
      const mechanicPasswordHash = await bcrypt.hash('password', 12);
      const mechanicResult = await pool.query(`
        INSERT INTO auth_users (id, email, password_hash) 
        VALUES ('550e8400-e29b-41d4-a716-446655440001', 'mechanic@autoservice.com', $1)
        RETURNING id
      `, [mechanicPasswordHash]);

      if (mechanicResult.rows.length > 0) {
        await pool.query(`
          INSERT INTO users (user_id, email, full_name, role, phone)
          VALUES ('550e8400-e29b-41d4-a716-446655440001', 'mechanic@autoservice.com', 'John Smith', 'mechanic', '(555) 987-6543')
        `);
        console.log('✅ Mechanic user created');
      }
    } else {
      console.log('ℹ️ Mechanic user already exists');
    }

    // Check if sample customers exist
    const existingCustomers = await pool.query('SELECT COUNT(*) FROM customers');
    const customerCount = parseInt(existingCustomers.rows[0].count);

    if (customerCount === 0) {
      // Seed sample customers
      await pool.query(`
        INSERT INTO customers (id, name, email, phone, address) VALUES
        ('550e8400-e29b-41d4-a716-446655440010', 'Alice Johnson', 'alice@email.com', '(555) 111-2222', '123 Main St, Anytown, ST 12345'),
        ('550e8400-e29b-41d4-a716-446655440011', 'Bob Wilson', 'bob@email.com', '(555) 333-4444', '456 Oak Ave, Somewhere, ST 67890'),
        ('550e8400-e29b-41d4-a716-446655440012', 'Carol Davis', 'carol@email.com', '(555) 555-6666', '789 Pine Rd, Elsewhere, ST 11111')
      `);
      console.log('✅ Sample customers created');
    } else {
      console.log('ℹ️ Customers already exist');
    }

    // Check if sample vehicles exist
    const existingVehicles = await pool.query('SELECT COUNT(*) FROM vehicles');
    const vehicleCount = parseInt(existingVehicles.rows[0].count);

    if (vehicleCount === 0) {
      // Seed sample vehicles
      await pool.query(`
        INSERT INTO vehicles (customer_id, make, model, year, license_plate, vin, color) VALUES
        ('550e8400-e29b-41d4-a716-446655440010', 'Toyota', 'Camry', 2020, 'ABC123', '1HGBH41JXMN109186', 'Silver'),
        ('550e8400-e29b-41d4-a716-446655440011', 'Honda', 'Civic', 2019, 'XYZ789', '2HGFC2F59KH123456', 'Blue'),
        ('550e8400-e29b-41d4-a716-446655440012', 'Ford', 'F-150', 2021, 'DEF456', '1FTFW1ET5DFC12345', 'Red')
      `);
      console.log('✅ Sample vehicles created');
    } else {
      console.log('ℹ️ Vehicles already exist');
    }

    // Check if sample inventory exists
    const existingInventory = await pool.query('SELECT COUNT(*) FROM inventory');
    const inventoryCount = parseInt(existingInventory.rows[0].count);

    if (inventoryCount === 0) {
      // Seed sample inventory
      await pool.query(`
        INSERT INTO inventory (name, sku, description, stock_quantity, min_stock_level, unit_price) VALUES
        ('Engine Oil 5W-30', 'OIL-5W30-001', 'Premium synthetic engine oil', 50, 10, 24.99),
        ('Oil Filter', 'FILTER-OIL-001', 'Standard oil filter', 25, 5, 12.99),
        ('Air Filter', 'FILTER-AIR-001', 'Engine air filter', 20, 5, 18.99),
        ('Brake Pads Front', 'BRAKE-PAD-F001', 'Front brake pads set', 15, 3, 89.99),
        ('Brake Pads Rear', 'BRAKE-PAD-R001', 'Rear brake pads set', 12, 3, 79.99),
        ('Spark Plugs', 'SPARK-001', 'Iridium spark plugs set of 4', 30, 8, 45.99),
        ('Transmission Fluid', 'FLUID-TRANS-001', 'Automatic transmission fluid', 8, 5, 32.99),
        ('Coolant', 'COOLANT-001', 'Engine coolant concentrate', 18, 6, 19.99)
      `);
      console.log('✅ Sample inventory created');
    } else {
      console.log('ℹ️ Inventory already exists');
    }

    console.log('✅ Database seeded successfully!');
    console.log('📧 Admin login: admin@autoservice.com / password');
    console.log('🔧 Mechanic login: mechanic@autoservice.com / password');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

seedDatabase();