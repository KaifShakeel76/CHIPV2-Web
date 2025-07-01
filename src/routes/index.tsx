import HomePage from "@/pages/HomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "@/pages/DashboardPage";
import UserDetailsPage from "@/pages/UserDetails";



const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/user-details" element={<UserDetailsPage />} />
 
 
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
