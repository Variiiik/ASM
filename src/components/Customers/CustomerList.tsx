import React, { useEffect, useState } from 'react';
import { Plus, Search, Phone, Mail, MapPin, CreditCard as Edit2, Car } from 'lucide-react';
import { apiClient } from '../../lib/api';
import CustomerForm from './CustomerForm';
import type { Customer, Vehicle } from '../../lib/database.types';

interface CustomerWithVehicles extends Customer {
  vehicles: Vehicle[];
}

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerWithVehicles[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await apiClient.getCustomers();
      setCustomers(data || []);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingCustomer(null);
    loadCustomers();
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-300 rounded animate-pulse" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
            <div className="h-6 bg-gray-300 rounded mb-2" />
            <div className="h-4 bg-gray-300 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">Manage customer information and relationships</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
        >
          <Plus size={20} />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search customers by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Customer List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
              <button
                onClick={() => handleEdit(customer)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit2 size={16} />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {customer.email && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail size={16} />
                  <span className="truncate">{customer.email}</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone size={16} />
                <span>{customer.phone}</span>
              </div>
              {customer.address && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin size={16} />
                  <span className="truncate">{customer.address}</span>
                </div>
              )}
            </div>

            {/* Vehicles */}
            <div className="border-t pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 flex items-center">
                  <Car size={16} className="mr-1" />
                  Vehicles ({customer.vehicles.length})
                </span>
              </div>
              {customer.vehicles.length > 0 ? (
                <div className="space-y-1">
                  {customer.vehicles.slice(0, 2).map((vehicle) => (
                    <p key={vehicle.id} className="text-sm text-gray-600">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </p>
                  ))}
                  {customer.vehicles.length > 2 && (
                    <p className="text-xs text-gray-500">
                      +{customer.vehicles.length - 2} more
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No vehicles registered</p>
              )}
            </div>

            {customer.notes && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-sm text-gray-600 line-clamp-2">{customer.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No customers found</p>
        </div>
      )}

      {/* Customer Form Modal */}
      {showForm && (
        <CustomerForm
          customer={editingCustomer}
          onClose={() => {
            setShowForm(false);
            setEditingCustomer(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default CustomerList;