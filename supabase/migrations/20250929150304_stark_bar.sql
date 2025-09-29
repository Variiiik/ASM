/*
  # Sample Data for Auto Service Management System

  This migration adds sample data for testing and demonstration purposes.
*/

-- Insert sample inventory items
INSERT INTO inventory (name, sku, description, stock_quantity, min_stock_level, unit_price) VALUES
('Engine Oil 5W-30', 'OIL-5W30-001', 'Premium synthetic motor oil', 50, 10, 29.99),
('Oil Filter - Honda/Toyota', 'FILTER-OIL-001', 'Standard oil filter for Honda/Toyota vehicles', 25, 5, 12.99),
('Air Filter - Universal', 'FILTER-AIR-001', 'High-performance air filter', 30, 5, 24.99),
('Brake Pads - Front', 'BRAKE-PAD-F001', 'Ceramic brake pads for front wheels', 20, 3, 89.99),
('Brake Pads - Rear', 'BRAKE-PAD-R001', 'Ceramic brake pads for rear wheels', 18, 3, 69.99),
('Spark Plugs - Set of 4', 'SPARK-PLUG-001', 'Platinum spark plugs', 40, 8, 34.99),
('Transmission Fluid', 'TRANS-FLUID-001', 'ATF transmission fluid', 15, 3, 19.99),
('Coolant - 1 Gallon', 'COOLANT-001', 'Extended life coolant', 20, 5, 24.99),
('Battery 12V', 'BATTERY-12V-001', 'Maintenance-free car battery', 10, 2, 129.99),
('Windshield Wipers', 'WIPER-001', 'All-season windshield wipers', 25, 5, 19.99);

-- Insert sample customers
INSERT INTO customers (name, email, phone, address, notes) VALUES
('John Smith', 'john.smith@email.com', '(555) 123-4567', '123 Main St, Anytown, ST 12345', 'Regular customer, prefers synthetic oil'),
('Sarah Johnson', 'sarah.j@email.com', '(555) 234-5678', '456 Oak Ave, Somewhere, ST 12346', 'Drives frequently for work'),
('Mike Davis', 'mike.davis@email.com', '(555) 345-6789', '789 Pine Rd, Elsewhere, ST 12347', 'Fleet owner - 3 vehicles'),
('Emily Brown', 'emily.brown@email.com', '(555) 456-7890', '321 Elm St, Another, ST 12348', 'New customer'),
('Robert Wilson', 'robert.w@email.com', '(555) 567-8901', '654 Maple Dr, Different, ST 12349', 'Vintage car enthusiast');

-- Insert sample vehicles (need to use UUIDs from customers)
DO $$
DECLARE
    customer_john uuid;
    customer_sarah uuid;
    customer_mike uuid;
    customer_emily uuid;
    customer_robert uuid;
BEGIN
    SELECT id INTO customer_john FROM customers WHERE name = 'John Smith';
    SELECT id INTO customer_sarah FROM customers WHERE name = 'Sarah Johnson';
    SELECT id INTO customer_mike FROM customers WHERE name = 'Mike Davis';
    SELECT id INTO customer_emily FROM customers WHERE name = 'Emily Brown';
    SELECT id INTO customer_robert FROM customers WHERE name = 'Robert Wilson';

    INSERT INTO vehicles (customer_id, make, model, year, license_plate, vin, color, notes) VALUES
    (customer_john, 'Honda', 'Civic', 2020, 'ABC123', '1HGBH41JXMN109186', 'Blue', 'Well maintained, regular service'),
    (customer_sarah, 'Toyota', 'Camry', 2019, 'XYZ789', '4T1BF1FK5KU123456', 'White', 'High mileage vehicle'),
    (customer_mike, 'Ford', 'F-150', 2021, 'FLEET1', '1FTFW1ET5MKE12345', 'Black', 'Work truck, heavy use'),
    (customer_mike, 'Ford', 'Transit', 2020, 'FLEET2', '1FTBW2CM5LKB12345', 'White', 'Delivery van'),
    (customer_mike, 'Chevrolet', 'Silverado', 2019, 'FLEET3', '1GCUYGED5KZ123456', 'Gray', 'Crew truck'),
    (customer_emily, 'Nissan', 'Altima', 2022, 'NEW456', '1N4BL4BV8NC123456', 'Silver', 'Recently purchased'),
    (customer_robert, 'Ford', 'Mustang', 1967, 'CLASSIC', '7R02C123456', 'Red', 'Classic restoration project');
END $$;