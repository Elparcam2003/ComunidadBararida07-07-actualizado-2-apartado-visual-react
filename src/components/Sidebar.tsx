// src/components/Sidebar.tsx

import { useState } from 'react';
import { 
  Users, 
  ShieldAlert, 
  AlertTriangle, 
  CreditCard, 
  FileWarning, 
  UserPlus, 
  BarChart3, 
  Menu, 
  X 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Sidebar() {
  const { usuarioActual, pestanaActiva, setPestanaActiva } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  // Colores dinámicos del badge de rol basados en tu lógica original, adaptados al modo oscuro
  const obtenerEstilosRol = () => {
    switch (usuarioActual.rol) {
      case 'SUPER_ADMIN': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'ADMIN_EDIFICIO': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'VOCERO': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      default: return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    }
  };

  const cambiarVista = (id: string) => {
    setPestanaActiva(id);
    setIsOpen(false); // Cierra el menú desplegable en móviles
  };

  return (
    <>
      {/* 📱 HEADER SUPERIOR EXCLUSIVO PARA MÓVILES */}
      <div className="md:hidden bg-slate-950 text-white p-4 flex justify-between items-center shadow-md sticky top-0 z-50 border-b border-slate-800">
        <h1 className="font-black text-xs tracking-wider uppercase text-indigo-400">Condominio Inteligente</h1>
        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-200 focus:outline-none p-1">
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* 💻 CONTENEDOR PRINCIPAL DEL SIDEBAR (DARK PREMIUM) */}
      <div className={`bg-slate-950 text-slate-300 w-64 min-h-screen p-5 fixed md:sticky top-0 z-40 border-r border-slate-900 transition-transform duration-300 md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:block'
      }`}>
        
        {/* Título de la App en PC */}
        <div className="hidden md:block mb-6 border-b border-slate-900 pb-4">
          <h1 className="font-black text-white text-base tracking-wider uppercase">Panel Urbano</h1>
          <p className="text-[11px] text-slate-500 font-bold">Ecosistema Familiar Unificado</p>
        </div>

        {/* 👤 TARJETA DEL USUARIO CONECTADO */}
        <div className="bg-slate-900/50 border border-slate-800/60 p-3.5 rounded-2xl mb-6 shadow-sm">
          <div className="font-bold text-slate-200 text-sm truncate">{usuarioActual.nombre}</div>
          <span className={`text-[9px] uppercase tracking-widest font-black px-2 py-0.5 rounded-md border inline-block mt-2 shadow-inner ${obtenerEstilosRol()}`}>
            {usuarioActual.rol.replace('_', ' ')}
          </span>
          {usuarioActual.edificioId && (
            <p className="text-slate-500 font-semibold text-[11px] mt-1.5">
              Bloque {usuarioActual.edificioId} {usuarioActual.apartamento && `- Apto ${usuarioActual.apartamento}`}
            </p>
          )}
        </div>

        {/* 🗺️ NAVEGACIÓN DINÁMICA POR ROLES (STRINGS ORIGINALES + NUEVOS) */}
        <nav className="space-y-1">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-3 mb-2.5">Módulos Administrativos</p>
          
          {/* VISTA: JEFATURA GLOBAL (SUPER_ADMIN) */}
          {usuarioActual.rol === 'SUPER_ADMIN' && (
            <>
              <button 
                onClick={() => cambiarVista('global-residentes')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${pestanaActiva === 'global-residentes' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <Users size={18} />
                <span>Censo Urbanización</span>
              </button>

              <button
                onClick={() => cambiarVista('censo-familiar')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${pestanaActiva === 'censo-familiar' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <UserPlus size={18} />
                <span>Censo Familiar</span>
              </button>

              <button
                onClick={() => cambiarVista('solicitudes-censo')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${pestanaActiva === 'solicitudes-censo' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <Users size={18} />
                <span>Solicitudes de Censo</span>
              </button>

              <button
                onClick={() => cambiarVista('registro-censos')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${pestanaActiva === 'registro-censos' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <Users size={18} />
                <span>Registro de Censos</span>
              </button>

              <button
                onClick={() => cambiarVista('bitacora')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${pestanaActiva === 'bitacora' ? 'bg-slate-800 text-slate-100 font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <ShieldAlert size={18} />
                <span>Bitácora General</span>
              </button>
              
              <button 
                onClick={() => cambiarVista('gestion-personal')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${pestanaActiva === 'gestion-personal' ? 'bg-slate-800 text-slate-100 font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <ShieldAlert size={18} />
                <span>Gestión de Personal</span>
              </button>
            </>
          )}

          {/* VISTA: VOCERO DE BLOQUE */}
          {usuarioActual.rol === 'VOCERO' && (
            <button 
              onClick={() => cambiarVista('mi-bloque')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${pestanaActiva === 'mi-bloque' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
            >
              <Users size={18} />
              <span>Censo de Bloque {usuarioActual.edificioId}</span>
            </button>
          )}

          {/* VISTA: ADMINISTRADOR DE EDIFICIO */}
          {usuarioActual.rol === 'ADMIN_EDIFICIO' && (
            <button 
              onClick={() => cambiarVista('casos-locales')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${pestanaActiva === 'casos-locales' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
            >
              <AlertTriangle size={18} />
              <span>Casos de Mi Edificio</span>
            </button>
          )}

          {/* MÓDULOS DE FINANZAS COMPARTIDOS */}
          {(usuarioActual.rol === 'SUPER_ADMIN' || usuarioActual.rol === 'VOCERO') && (
            <button 
              onClick={() => cambiarVista('finanzas')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${pestanaActiva === 'finanzas' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
            >
              <CreditCard size={18} />
              <span>Control de Finanzas</span>
            </button>
          )}

          {/* VISTA: JEFE DE FAMILIA COMÚN */}
          {usuarioActual.rol === 'JEFE_FAMILIA' && (
            <button
              onClick={() => cambiarVista('censo-familiar')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${pestanaActiva === 'censo-familiar' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
            >
              <UserPlus size={18} />
              <span>Mi Censo Familiar</span>
            </button>
          )}

          {/* REPORTES COMUNITARIOS COMPARTIDOS */}
          {(usuarioActual.rol === 'JEFE_FAMILIA' || usuarioActual.rol === 'VOCERO') && (
            <button 
              onClick={() => cambiarVista('reportes')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${pestanaActiva === 'reportes' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
            >
              <FileWarning size={18} />
              <span>
                {usuarioActual.rol === 'JEFE_FAMILIA' ? 'Mis Reportes' : 'Reportes del Edificio'}
              </span>
            </button>
          )}

          {/* 🗳️ NUEVO MÓDULO: CONSULTAS Y ENCUESTAS (DISPONIBLE PARA TODOS LOS ROLES) */}
          <button 
            onClick={() => cambiarVista('encuestas')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${pestanaActiva === 'encuestas' ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/10' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
          >
            <BarChart3 size={18} />
            <span>Consultas Comunitarias</span>
          </button>

          {/* BANDEJA DE MEDIACIÓN Y CASOS ESCALADOS */}
          {(usuarioActual.rol === 'SUPER_ADMIN' || usuarioActual.rol === 'VOCERO') && (
            <div className="pt-4 border-t border-slate-900 mt-4">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-3 mb-2">Instancias Superiores</p>
              <button 
                onClick={() => cambiarVista('casos-escalados')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${pestanaActiva === 'casos-escalados' ? 'bg-red-900/40 text-red-400 border border-red-900/50 font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <AlertTriangle size={18} className="text-rose-500" />
                <span>Casos Escalados 🚨</span>
              </button>
            </div>
          )}

        </nav>
      </div>

      {/* Sombras traslúcidas de fondo al abrir menú móvil */}
      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/50 z-30 md:hidden" />
      )}
    </>
  );
}