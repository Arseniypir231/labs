import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Vehicles from './components/Vehicles';
import Routes from './components/Routes';
import Shipments from './components/Shipments';
import VehicleDetail from './components/VehicleDetail';
import RouteDetail from './components/RouteDetail';
import ShipmentDetail from './components/ShipmentDetail';

function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="nav">
      <Link to="/vehicles" className={location.pathname === '/vehicles' ? 'active' : ''}>
        Транспортные средства
      </Link>
      <Link to="/routes" className={location.pathname === '/routes' ? 'active' : ''}>
        Маршруты
      </Link>
      <Link to="/shipments" className={location.pathname === '/shipments' ? 'active' : ''}>
        Грузоперевозки
      </Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="container">
        <header className="header">
          <h1>Система управления транспортной логистикой</h1>
          <Navigation />
        </header>
        <Routes>
          <Route path="/" element={<Vehicles />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/vehicles/:id" element={<VehicleDetail />} />
          <Route path="/routes" element={<Routes />} />
          <Route path="/routes/:id" element={<RouteDetail />} />
          <Route path="/shipments" element={<Shipments />} />
          <Route path="/shipments/:id" element={<ShipmentDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
