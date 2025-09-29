import React, { useEffect, useState } from 'react';
import { Users, Car, Wrench, Calendar, Package, AlertTriangle, DollarSign, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import StatsCard from './StatsCard';
import QuickActions from './QuickActions';
import RecentActivity from './RecentActivity';

interface DashboardProps {
  onSectionChange: (section: string) => void;
}

interface Stats {
  totalCustomers: number;
  totalVehicles: number;
  activeWorkOrders: number;
  todayAppointments: number;
  lowStockItems: number;
  pendingInvoices: number;
  monthlyRevenue: number;
  completedJobs: number;
}

const Dashboard: React.FC<DashboardProps> = ({ onSectionChange }) => {
  const { userProfile } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalCustomers: 0,
    totalVehicles: 0,
    activeWorkOrders: 0,
    todayAppointments: 0,
    lowStockItems: 0,
    pendingInvoices: 0,
    monthlyRevenue: 0,
    completedJobs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const today = new Date();
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      // Get counts in parallel
      const [
        { count: customerCount },
        { count: vehicleCount },
        { count: activeWorkOrderCount },
        { count: todayAppointmentCount },
        { count: pendingInvoiceCount },
        { count: completedJobCount },
        inventoryData,
        revenueData
      ] = await Promise.all([
        supabase.from('customers').select('*', { count: 'exact', head: true }),
        supabase.from('vehicles').select('*', { count: 'exact', head: true }),
        supabase.from('work_orders').select('*', { count: 'exact', head: true }).in('status', ['pending', 'in_progress']),
        supabase.from('appointments').select('*', { count: 'exact', head: true })
          .gte('appointment_date', startOfToday.toISOString())
          .lt('appointment_date', endOfToday.toISOString()),
        supabase.from('invoices').select('*', { count: 'exact', head: true }).neq('status', 'paid'),
        supabase.from('work_orders').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
        supabase.from('inventory').select('*').lte('stock_quantity', supabase.raw('min_stock_level')),
        supabase.from('invoices').select('total_amount')
          .eq('status', 'paid')
          .gte('paid_date', startOfMonth.toISOString())
      ]);

      // Calculate monthly revenue
      const monthlyRevenue = revenueData.data?.reduce((sum: number, invoice: any) => 
        sum + (parseFloat(invoice.total_amount) || 0), 0
      ) || 0;

      setStats({
        totalCustomers: customerCount || 0,
        totalVehicles: vehicleCount || 0,
        activeWorkOrders: activeWorkOrderCount || 0,
        todayAppointments: todayAppointmentCount || 0,
        lowStockItems: inventoryData.data?.length || 0,
        pendingInvoices: pendingInvoiceCount || 0,
        monthlyRevenue,
        completedJobs: completedJobCount || 0,
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'new-customer':
        onSectionChange('customers');
        break;
      case 'new-vehicle':
        onSectionChange('vehicles');
        break;
      case 'new-work-order':
        onSectionChange('work-orders');
        break;
      case 'new-appointment':
        onSectionChange('appointments');
        break;
      case 'check-inventory':
        onSectionChange('inventory');
        break;
    }
  };

  const isAdmin = userProfile?.role === 'admin';

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-300 rounded mb-2" />
              <div className="h-8 bg-gray-300 rounded mb-2" />
              <div className="h-3 bg-gray-300 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {userProfile?.full_name?.split(' ')[0] || 'User'}!
        </h1>
        <p className="opacity-90">
          Here's what's happening in your shop today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isAdmin && (
          <StatsCard
            title="Total Customers"
            value={stats.totalCustomers}
            icon={Users}
            color="blue"
          />
        )}
        <StatsCard
          title="Total Vehicles"
          value={stats.totalVehicles}
          icon={Car}
          color="green"
        />
        <StatsCard
          title="Active Work Orders"
          value={stats.activeWorkOrders}
          subtitle="Pending & In Progress"
          icon={Wrench}
          color="orange"
        />
        <StatsCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          icon={Calendar}
          color="purple"
        />
        <StatsCard
          title="Low Stock Items"
          value={stats.lowStockItems}
          subtitle="Need attention"
          icon={AlertTriangle}
          color="red"
        />
        {isAdmin && (
          <StatsCard
            title="Pending Invoices"
            value={stats.pendingInvoices}
            icon={DollarSign}
            color="orange"
          />
        )}
        {isAdmin && (
          <StatsCard
            title="Monthly Revenue"
            value={`$${stats.monthlyRevenue.toLocaleString()}`}
            icon={TrendingUp}
            color="green"
          />
        )}
        <StatsCard
          title="Completed Jobs"
          value={stats.completedJobs}
          subtitle="All time"
          icon={Wrench}
          color="blue"
        />
      </div>

      {/* Quick Actions */}
      {isAdmin && <QuickActions onAction={handleQuickAction} />}

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
};

export default Dashboard;