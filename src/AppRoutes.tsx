import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "./app/layout/AppShell.tsx";
import ListOrders from "./app/orders/ListOrders.tsx";
import Dashboard from "./app/old_dashboard/Dashboard.tsx";
import LoginForm from './app/login/LoginForm.tsx';

function AppRoutes() {
    return (
        <BrowserRouter>
            <AppShell>
                <Routes>
                    <Route path="/" element={<Dashboard/>} />
                    <Route path="/login" element={<LoginForm/>}></Route>
                    <Route path="/bestellungsliste" element={<ListOrders />} />
                </Routes>
            </AppShell>
        </BrowserRouter>
    );
}

export default AppRoutes;
