// Database types for the auto service management system
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  customer_id: string;
  make: string;
  model: string;
  year: number;
  license_plate?: string;
  vin?: string;
  color?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'mechanic';
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkOrder {
  id: string;
  customer_id: string;
  vehicle_id: string;
  assigned_to?: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  estimated_hours?: number;
  actual_hours?: number;
  labor_rate?: number;
  estimated_completion?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Inventory {
  id: string;
  name: string;
  sku: string;
  description?: string;
  stock_quantity?: number;
  min_stock_level?: number;
  unit_price?: number;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  customer_id: string;
  vehicle_id: string;
  assigned_to?: string;
  title: string;
  description?: string;
  appointment_date: string;
  duration_minutes?: number;
  status?: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  work_order_id: string;
  customer_id: string;
  invoice_number: string;
  subtotal?: number;
  tax_rate?: number;
  tax_amount?: number;
  total_amount?: number;
  status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issued_date?: string;
  due_date?: string;
  paid_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}