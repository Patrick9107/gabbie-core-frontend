import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AppShell from "./app/layout/AppShell";
import ListOrders from "./app/orders/ListOrders";
import Dashboard from "./app/old_dashboard/Dashboard";
import LoginForm from './app/login/LoginForm';
import Logout from './app/login/Logout';
import VehicleList from "./app/vehicle/VehicleList";
import ListProducts from "./app/products/ListProducts";
import RoutesPage from "./app/routes/Routes.tsx";
import DriverPage from "./app/driver/DriverPage.tsx";
import CircularProgress from '@mui/material/CircularProgress';
import HistoryPage from "./app/history/HistoryPage.tsx";
import Box from '@mui/material/Box';
import { useAuth } from './app/login/AuthProvider';

function RequireAuth({ children }: { children: JSX.Element }) {
  const { isTokenValid, role } = useAuth();
  const location = useLocation();

  if (isTokenValid === null) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isTokenValid) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role !== "Admin") {
    return <Navigate to="/driver" state={{ from: location }} replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/driver" element={<DriverPage />} />

        <Route element={<AppShell />}>
          <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/bestellungen" element={<RequireAuth><ListOrders /></RequireAuth>} />
          <Route path="/produkte" element={<RequireAuth><ListProducts /></RequireAuth>} />
          <Route path="/fahrzeuge" element={<RequireAuth><VehicleList /></RequireAuth>} />
          <Route path="/routes" element={<RequireAuth><RoutesPage /></RequireAuth>}  />
          <Route path="/history" element={<RequireAuth><HistoryPage /></RequireAuth>}  />
          <Route path="/logout" element={<Logout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;