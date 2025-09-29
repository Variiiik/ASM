import React, { useEffect, useState } from 'react';
import { Clock, User, Car, Wrench, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Activity {
  id: string;
  type: 'work_order' | 'appointment' | 'customer';
  title: string;
  subtitle: string;
  time: string;
  status?: string;
}

const RecentActivity: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentActivity();
  }, []);

  const loadRecentActivity = async () => {
    try {
      // Get recent work orders
      const { data: workOrders } = await supabase
        .from('work_orders')
        .select(`
          id, title, status, created_at,
          customers (name),
          vehicles (make, model)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      // Get recent appointments
      const { data: appointments } = await supabase
        .from('appointments')
        .select(`
          id, title, status, created_at,
          customers (name),
          vehicles (make, model)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      const activities: Activity[] = [];

      // Add work orders to activities
      if (workOrders) {
        workOrders.forEach((wo: any) => {
          activities.push({
            id: wo.id,
            type: 'work_order',
            title: wo.title,
            subtitle: `${wo.customers.name} - ${wo.vehicles.make} ${wo.vehicles.model}`,
            time: formatTimeAgo(wo.created_at),
            status: wo.status,
          });
        });
      }

      // Add appointments to activities
      if (appointments) {
        appointments.forEach((apt: any) => {
          activities.push({
            id: apt.id,
            type: 'appointment',
            title: apt.title,
            subtitle: `${apt.customers.name} - ${apt.vehicles.make} ${apt.vehicles.model}`,
            time: formatTimeAgo(apt.created_at),
            status: apt.status,
          });
        });
      }

      // Sort by time and take top 10
      activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      setActivities(activities.slice(0, 10));
    } catch (error) {
      console.error('Error loading recent activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'work_order':
        return Wrench;
      case 'appointment':
        return Calendar;
      case 'customer':
        return User;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-300 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Clock size={20} className="mr-2" />
        Recent Activity
      </h3>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No recent activity</p>
        ) : (
          activities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                  <p className="text-xs text-gray-500 truncate">{activity.subtitle}</p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span className="text-xs text-gray-500">{activity.time}</span>
                  {activity.status && (
                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getStatusColor(activity.status)}`}>
                      {activity.status.replace('_', ' ')}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentActivity;