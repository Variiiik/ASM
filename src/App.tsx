import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import CustomerList from './components/Customers/CustomerList';

const AppContent: React.FC = () => {
  const { user, userProfile, loading } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard onSectionChange={setActiveSection} />;
      case 'customers':
        return <CustomerList />;
      case 'vehicles':
        return <div className="p-6"><h1 className="text-2xl font-bold">Vehicles</h1><p>Coming soon...</p></div>;
      case 'work-orders':
        return <div className="p-6"><h1 className="text-2xl font-bold">Work Orders</h1><p>Coming soon...</p></div>;
      case 'appointments':
        return <div className="p-6"><h1 className="text-2xl font-bold">Appointments</h1><p>Coming soon...</p></div>;
      case 'inventory':
        return <div className="p-6"><h1 className="text-2xl font-bold">Inventory</h1><p>Coming soon...</p></div>;
      case 'invoices':
        return <div className="p-6"><h1 className="text-2xl font-bold">Invoices</h1><p>Coming soon...</p></div>;
      case 'settings':
        return <div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p>Coming soon...</p></div>;
      default:
        return <Dashboard onSectionChange={setActiveSection} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={handleMobileMenuToggle}
      />
      
      <div className="flex-1 lg:ml-0">
        <main className="p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;