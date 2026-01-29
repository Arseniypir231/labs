import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VehiclesPage from './pages/VehiclesPage';
import DriversPage from './pages/DriversPage';
import DeliveriesPage from './pages/DeliveriesPage';
import VehicleDetailPage from './pages/VehicleDetailPage';
import DriverDetailPage from './pages/DriverDetailPage';
import DeliveryDetailPage from './pages/DeliveryDetailPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="container">
            <Link to="/" className="logo">
              <h1>🚚 Transport Logistics</h1>
            </Link>
            <div className="nav-links">
              <Link to="/vehicles">Транспорт</Link>
              <Link to="/drivers">Водители</Link>
              <Link to="/deliveries">Доставки</Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path="/" element={<VehiclesPage />} />
              <Route path="/vehicles" element={<VehiclesPage />} />
              <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
              <Route path="/drivers" element={<DriversPage />} />
              <Route path="/drivers/:id" element={<DriverDetailPage />} />
              <Route path="/deliveries" element={<DeliveriesPage />} />
              <Route path="/deliveries/:id" element={<DeliveryDetailPage />} />
            </Routes>
          </div>
        </main>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;
