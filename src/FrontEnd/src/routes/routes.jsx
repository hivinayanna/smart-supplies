// routes.jsx
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Auth from "../pages/Auth";
import StartPage from "../pages/StartPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Auth" element={<Auth />} />
        <Route path="/Start" element={<StartPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
