import React, { useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";

import HomePage from "./features/home/HomePage.jsx";
import WizardForm from "./features/applicant/components/WizardForm/WizardForm.jsx";
import ApplicantSearch from "./features/applicant/components/ApplicantSearch/ApplicantSearch.jsx";

import AdminLogin from "./features/admin/components/AdminLogin.jsx";
import ProcessorDashboard from "./features/admin/components/ProcessorDashboard/ProcessorDashboard.jsx";

export default function App() {
  const navigate = useNavigate();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const handleApplySuccess = (appNo) => {
    navigate(`/status/${appNo}`);
    window.scrollTo(0, 0);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-800 selection:bg-emerald-600 selection:text-white">
      <Header isAdminLoggedIn={isAdminLoggedIn} onAdminLogout={handleAdminLogout} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/apply" element={<WizardForm onSubmitSuccess={handleApplySuccess} />} />
          <Route path="/status" element={<ApplicantSearch />} />
          <Route path="/status/:appNo" element={<ApplicantSearch />} />
          
          <Route
            path="/admin/login"
            element={
              isAdminLoggedIn ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <AdminLogin onLoginSuccess={() => setIsAdminLoggedIn(true)} />
              )
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              isAdminLoggedIn ? (
                <ProcessorDashboard onLogout={handleAdminLogout} />
              ) : (
                <Navigate to="/admin/login" replace />
              )
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
