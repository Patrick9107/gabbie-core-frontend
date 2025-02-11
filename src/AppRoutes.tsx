import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from "./app/layout/AppShell.tsx";
import ListOrders from "./app/orders/ListOrders.tsx";
import Dashboard from "./app/old_dashboard/Dashboard.tsx";
import LoginForm from './app/login/LoginForm.tsx';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress from MUI
import Box from '@mui/material/Box';
import { useAuth } from './app/login/AuthProvider.tsx';
import  Logout  from './app/login/Logout.tsx';
import VehicleList from "./app/cars/VehicleList.tsx";
import ListProducts from "./app/products/ListProducts.tsx"; // Box for centering the spinner

function AppRoutes() {

  const { isTokenValid } = useAuth();
  console.log(isTokenValid);// Access global auth state

  // If token validation is still in progress
  if (isTokenValid === null) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route element={<AppShell />}>
          <Route>
            <Route path="/" element={isTokenValid ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/bestellungen" element={isTokenValid ? <ListOrders /> : <Navigate to="/login" />} />
            <Route path="/produkte" element={isTokenValid ? <ListProducts /> : <Navigate to="/login" />} />
            <Route path="/fahrzeuge" element={<VehicleList />} />
            <Route path="/logout" element={<Logout />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;