import HomePage from "@/pages/HomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";



const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
        <Route path="/" element={<HomePage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
