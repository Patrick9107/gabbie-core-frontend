import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AppShell from "./app/layout/AppShell";
import ListOrders from "./app/orders/ListOrders";
import Dashboard from "./app/old_dashboard/Dashboard";
import LoginForm from './app/login/LoginForm';
import Logout from './app/login/Logout';
import VehicleList from "./app/cars/VehicleList";
import ListProducts from "./app/products/ListProducts";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useAuth } from './app/login/AuthProvider';

function RequireAuth({ children }: { children: JSX.Element }) {
  const { isTokenValid, role } = useAuth();
  const location = useLocation();

  if (isTokenValid === false) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }


  //TODO change /driver to a valid DRIVERS ROUTE!!!!!!!!!!!
  console.log(role);
  if(role !== "Admin"){
    return <Navigate to="/driver" state={{ from: location }} replace />
  }
  return children;
}

function AppRoutes() {
  const { isTokenValid} = useAuth();

  if (isTokenValid === null) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route element={<AppShell />}>
          <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/bestellungen" element={<RequireAuth><ListOrders /></RequireAuth>} />
          <Route path="/produkte" element={<RequireAuth><ListProducts /></RequireAuth>} />
          <Route path="/fahrzeuge" element={<RequireAuth><VehicleList /></RequireAuth>} />
          <Route path="/logout" element={<Logout />} />


        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;