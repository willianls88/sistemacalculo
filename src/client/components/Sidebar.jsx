import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HiHome,
  HiOutlineUser,
  HiCog,
  HiOutlineTruck,
  HiTruck,
  HiChevronDown,
  HiArchiveBoxXMark
} from "react-icons/hi2";

export default function Sidebar({ open = false, onClose }) {
  const [configOpen, setConfigOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = () => {
    if (onClose) onClose(); // fecha menu no mobile
  };

  return (
    <>
      {/* Overlay mobile */}
      <div
        className={`fixed inset-0 bg-black z-20 md:hidden transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 left-0 h-screen z-30 md:relative md:z-auto bg-black border-r border-black/20 p-3 md:p-5 flex flex-col transition-transform duration-300 transform w-64 md:w-64 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Topo: Logo + botão fechar mobile */}
        <div className="flex items-center justify-between gap-3 flex-shrink-0">
          <div className="text-xl font-bold">Pizzaria Pop</div>
          <button className="md:hidden text-white" onClick={onClose}>
            <HiArchiveBoxXMark size={24} />
          </button>
        </div>

        {/* Menu / Navegação */}
        <nav className="flex-1 mt-4 overflow-auto">
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/"
                icon={<HiHome size={20} />}
                label="Dashboard"
                active={isActive("/")}
                onClick={handleLinkClick}
              />
            </li>
            <li>
              <NavLink
                to="/motoboys"
                icon={<HiOutlineTruck size={20} />}
                label="Motoboys"
                active={isActive("/motoboys")}
                onClick={handleLinkClick}
              />
            </li>
            <li>
              <NavLink
                to="/entregas"
                icon={<HiTruck size={20} />}
                label="Entregas"
                active={isActive("/entregas")}
                onClick={handleLinkClick}
              />
            </li>
            <li>
              {/* Config */}
              <button
                onClick={() => setConfigOpen(!configOpen)}
                className={`flex items-center justify-between p-3 rounded-lg w-full hover:bg-white/5 transition-colors ${
                  configOpen ? "bg-white/10" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <HiCog size={20} />
                  <span>Config</span>
                </div>
                <HiChevronDown
                  className={`transition-transform duration-300 ${
                    configOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {/* Submenu Config */}
              <div
                className={`ml-3 md:ml-10 mt-2 overflow-hidden transition-[max-height] duration-300 ${
                  configOpen ? "max-h-[500px]" : "max-h-0"
                }`}
              >
                <Link
                  to="/usuarios"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 p-2 rounded-lg w-full hover:bg-white/5 transition-colors"
                >
                  <HiOutlineUser size={18} />
                  <span>Usuários</span>
                </Link>
              </div>
            </li>
          </ul>
        </nav>

        {/* Rodapé */}
        <div className="text-xs text-gray-400 hidden md:block flex-shrink-0 mt-4">v1.0</div>
      </aside>
    </>
  );
}

// NavLink ajustado para mobile
function NavLink({ to, icon, label, active, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors ${
        active ? "bg-white/10 font-semibold" : ""
      }`}
    >
      <div className="w-8 h-8 flex items-center justify-center bg-white/5 rounded">{icon}</div>
      <div>{label}</div> {/* sempre visível */}
    </Link>
  );
}
