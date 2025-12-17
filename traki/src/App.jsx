import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/loginPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { TrucksPage } from './pages/TrucksPage.jsx';
import { TripsPage } from './pages/TripsPage.jsx';
import { TrailersPage } from './pages/TrailersPage.jsx';
import { TiresPage } from './pages/TiresPage.jsx';
import { FuelLogsPage } from './pages/FuelLogsPage.jsx';

function ProtectedRoute({ children, isAuthenticated }) {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} 
        />
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trucks"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <TrucksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trips"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <TripsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trailers"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <TrailersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tires"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <TiresPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fuellogs"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <FuelLogsPage />
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
