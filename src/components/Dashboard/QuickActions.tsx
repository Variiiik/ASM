import React from 'react';
import { Plus, Calendar, Users, Car, Wrench, Package } from 'lucide-react';

interface QuickActionsProps {
  onAction: (action: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  const actions = [
    {
      id: 'new-customer',
      label: 'Add Customer',
      icon: Users,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      id: 'new-vehicle',
      label: 'Add Vehicle',
      icon: Car,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      id: 'new-work-order',
      label: 'New Work Order',
      icon: Wrench,
      color: 'bg-orange-500 hover:bg-orange-600',
    },
    {
      id: 'new-appointment',
      label: 'Schedule Service',
      icon: Calendar,
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      id: 'check-inventory',
      label: 'Check Inventory',
      icon: Package,
      color: 'bg-indigo-500 hover:bg-indigo-600',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Plus size={20} className="mr-2" />
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onAction(action.id)}
              className={`${action.color} text-white p-4 rounded-lg flex flex-col items-center space-y-2 transition-colors hover:scale-105 transform duration-150`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium text-center">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;