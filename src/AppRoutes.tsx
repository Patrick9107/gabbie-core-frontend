import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "./app/layout/AppShell.tsx";
import ListOrders from "./app/orders/ListOrders.tsx";
import Dashboard from "./app/old_dashboard/Dashboard.tsx";
import LoginForm from './app/login/LoginForm.tsx';

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/login" element={<LoginForm />} />

                <Route element={<AppShell />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/bestellungen" element={<ListOrders />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
