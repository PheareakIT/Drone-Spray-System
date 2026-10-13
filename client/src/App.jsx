import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import OverviewPage from './pages/OverviewPage';
import SpraysPage from './pages/SpraysPage';
import CustomersPage from './pages/CustomersPage';
import PaymentsPage from './pages/PaymentsPage';
import UsersPage from './pages/UsersPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import { customerApi, sprayApi, userApi } from './api/client';
import { Toaster } from 'react-hot-toast';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-400 text-sm">កំពុងភ្ជាប់ទៅកាន់ម៉ាស៊ីនបម្រើ ដ្រូនកសិកម្មព្រៃតូច...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function MainApp() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [sprays, setSprays] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const isAdminOrSuper = user?.role === 'admin' || user?.role === 'super';

  const fetchData = async () => {
    if (!user || !isAdminOrSuper) return;
    setLoadingData(true);
    try {
      const [customersRes, spraysRes] = await Promise.all([
        customerApi.getAll().catch(() => []),
        sprayApi.getAll().catch(() => []),
      ]);

      setCustomers(customersRes || []);
      setSprays(spraysRes || []);

      const usersRes = await userApi.getAll().catch(() => ({ users: [] }));
      setUsers(usersRes.users || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAdminOrSuper) {
      fetchData();
    }
  }, [user]);

  const pendingPaymentsCount = sprays.filter(
    (s) => s.paymentStatus === 'pending' || !s.paymentStatus
  ).length;

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout
              onRefresh={isAdminOrSuper ? fetchData : undefined}
              loadingData={loadingData}
              counts={{
                sprays: sprays.length,
                customers: customers.length,
                pendingPayments: pendingPaymentsCount,
                users: users.length,
              }}
            />
          </ProtectedRoute>
        }
      >
        {isAdminOrSuper ? (
          <>
            <Route
              index
              element={
                <OverviewPage
                  sprays={sprays}
                  customers={customers}
                  users={users}
                />
              }
            />
            <Route
              path="sprays"
              element={
                <SpraysPage
                  sprays={sprays}
                  customers={customers}
                  onRefresh={fetchData}
                />
              }
            />
            <Route
              path="customers"
              element={
                <CustomersPage
                  customers={customers}
                  onRefresh={fetchData}
                />
              }
            />
            <Route
              path="payments"
              element={
                <PaymentsPage
                  sprays={sprays}
                  customers={customers}
                  onRefresh={fetchData}
                />
              }
            />
            <Route
              path="users"
              element={
                <UsersPage
                  users={users}
                  onRefresh={fetchData}
                />
              }
            />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
          </>
        ) : (
          <>
            <Route index element={<Navigate to="/about" replace />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="*" element={<Navigate to="/about" replace />} />
          </>
        )}
      </Route>

      {/* Catch-all redirect */}
      <Route
        path="*"
        element={<Navigate to={isAdminOrSuper ? '/' : '/about'} replace />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#1e293b',
                color: '#f8fafc',
                border: '1px solid #334155',
                borderRadius: '1rem',
                padding: '12px 16px',
                fontSize: '0.875rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#0f172a',
                },
              },
              error: {
                iconTheme: {
                  primary: '#f43f5e',
                  secondary: '#0f172a',
                },
              },
            }}
          />
          <MainApp />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}