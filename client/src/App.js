import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import Vehicles from './components/Vehicles';
import RoutesList from './components/Routes';
import Shipments from './components/Shipments';
import VehicleDetail from './components/VehicleDetail';
import RouteDetail from './components/RouteDetail';
import ShipmentDetail from './components/ShipmentDetail';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import ChangePassword from './components/ChangePassword';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import { getMe, logout } from './store/slices/authSlice';

function Navigation() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="nav">
      <Link to="/dashboard" className={location.pathname === '/dashboard' || location.pathname === '/' ? 'active' : ''}>
        📊 Аналитика
      </Link>
      <Link to="/vehicles" className={location.pathname === '/vehicles' ? 'active' : ''}>
        Транспортные средства
      </Link>
      <Link to="/routes" className={location.pathname === '/routes' ? 'active' : ''}>
        Маршруты
      </Link>
      <Link to="/shipments" className={location.pathname === '/shipments' ? 'active' : ''}>
        Грузоперевозки
      </Link>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span style={{ color: 'white' }}>
          {user?.firstName} {user?.lastName} ({user?.role})
        </span>
        <Link to="/change-password" className={location.pathname === '/change-password' ? 'active' : ''}>
          Сменить пароль
        </Link>
        <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '14px' }}>
          Выйти
        </button>
      </div>
    </nav>
  );
}

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    // Проверка токена при загрузке приложения
    if (token) {
      dispatch(getMe());
    }
  }, [dispatch, token]);

  return (
    <Router>
      <div className="container">
        <header className="header">
          <h1>Система управления транспортной логистикой</h1>
          <Navigation />
        </header>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehicles"
            element={
              <ProtectedRoute>
                <Vehicles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehicles/:id"
            element={
              <ProtectedRoute>
                <VehicleDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/routes"
            element={
              <ProtectedRoute>
                <RoutesList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/routes/:id"
            element={
              <ProtectedRoute>
                <RouteDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shipments"
            element={
              <ProtectedRoute>
                <Shipments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shipments/:id"
            element={
              <ProtectedRoute>
                <ShipmentDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
