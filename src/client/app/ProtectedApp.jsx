import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Dashboard from "../pages/Dashboard";
import Motoboys from "../pages/Motoboys";
import Usuarios from "../pages/Usuarios";
import Entregas from "../pages/Entregas";

export default function ProtectedApp({ auth }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header
          user={auth.user}
          onLogout={() => {
            auth.logout();
            navigate("/login");
          }}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)} // botão mobile
        />

        <main className="p-4 md:p-6 flex-1 relative">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/motoboys" element={<Motoboys />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/entregas" element={<Entregas />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
