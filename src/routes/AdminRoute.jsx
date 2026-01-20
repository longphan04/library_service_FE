import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";

// dashboard
import Inventory from "../pages/admin/dashboard/Inventory";
import InventoryLog from "../pages/admin/dashboard/InventoryLog";
import Statistics from "../pages/admin/dashboard/Statistics";

// users
import UserList from "../pages/admin/users/UserList";

// staff
import StaffList from "../pages/admin/staff/StaffList";

// account
import AdminProfile from "../pages/admin/account/AdminProfile";

export default function AdminRoutes() {
    return (
        <Routes>
            <Route element={<AdminLayout />}>
                {/* Home */}
                <Route path="" element={<Navigate to="/admin" />} />

                {/* Dashboard */}
                <Route path="statistics" element={<Statistics />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="inventory-log" element={<InventoryLog />} />

                {/* Users */}
                <Route path="users" element={<UserList />} />

                {/* Staff */}
                <Route path="staff" element={<StaffList />} />

                {/* Account */}
                <Route path="account" element={<AdminProfile />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/admin" />} />
            </Route>
        </Routes>
    );
}