import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages & Layouts
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLayout from './layouts/AdminLayout';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Coupons from './pages/Coupons';
import News from './pages/News';
import Press from './pages/Press';
import Subscribers from './pages/Subscribers';
import Dashboard from './pages/Dashboard';
// Placeholder for our first real page
const DashboardOverview = () => (
  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 flex items-center justify-center h-64 text-neutral-400">
    Overview Statistics Coming Soon...
  </div>
);

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono text-sm">Loading System...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />

        {/* Protected Admin Routes */}
        {user ? (
          <Route path="/dashboard" element={<AdminLayout />}>
            <Route index element={<Dashboard/>} />
            {/* We will add these pages next! */}
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="news" element={<News />} />
            <Route path="press" element={<Press />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="subscribers" element={<Subscribers />} />
          </Route>
        ) : (
          <Route path="/dashboard/*" element={<Navigate to="/login" />} />
        )}
        
        {/* Redirect root to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}