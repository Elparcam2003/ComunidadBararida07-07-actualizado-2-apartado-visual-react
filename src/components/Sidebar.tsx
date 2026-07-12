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
  X,
  ClipboardList,
  FileSignature,
  Lock,
  LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Sidebar() {
  const { usuarioActual, pestanaActiva, setPestanaActiva, familiaActual, logout } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  // Si no hay usuario (estamos en el Login), no renderizar el Sidebar
  if (!usuarioActual) return null;

  // Lógica de permisos
  const esJefeFamilia = usuarioActual.rol === 'JEFE_FAMILIA';
  const estaAprobado = familiaActual?.estado === 'APROBADA';
  const puedeVerModulosComunitarios = !esJefeFamilia || estaAprobado;

  const obtenerEstilosRol = () => {
    switch (usuarioActual.rol) {
      case 'SUPER_ADMIN': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'ADMIN_EDIFICIO': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'VOCERO': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      default: return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    }
  };

  const obtenerNombreRol = (rol: string) => {
    const nombres: Record<string, string> = {
      'SUPER_ADMIN': 'Administrador Superior',
      'VOCERO': 'Vocero Comunal',
      'ADMIN_EDIFICIO': 'Admin. de Edificio',
      'JEFE_FAMILIA': 'Jefe de Familia'
    };
    return nombres[rol] || rol;
  };

  const cambiarVista = (id: string) => {
    setPestanaActiva(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* 📱 HEADER SUPERIOR MÓVILES */}
      <div className="md:hidden bg-slate-950 text-white p-4 flex justify-between items-center shadow-md sticky top-0 z-50 border-b border-slate-800">
        <h1 className="font-black text-xs tracking-wider uppercase text-indigo-400">Condominio Inteligente</h1>
        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-200 focus:outline-none p-1">
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* 💻 CONTENEDOR PRINCIPAL */}
      {/* ✨ AQUÍ ESTABA EL ERROR: Agregué 'md:translate-x-0' para que no se esconda en la PC */}
      <div className={`bg-slate-950 text-slate-300 w-64 h-screen fixed md:sticky top-0 z-40 border-r border-slate-900 transition-transform duration-300 flex flex-col md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* === ÁREA SCROLLEABLE (MENÚ) === */}
        <div className="flex-1 overflow-y-auto p-5 hide-scrollbar">
          <div className="hidden md:block mb-6 border-b border-slate-900 pb-4">
            <h1 className="font-black text-white text-base tracking-wider uppercase">Urbanizacion Bararida</h1>
            <p className="text-[11px] text-slate-500 font-bold">Ecosistema Familiar Unificado</p>
          </div>

          {/* 👤 TARJETA DEL USUARIO */}
          <div className="bg-slate-900/50 border border-slate-800/60 p-3.5 rounded-2xl mb-6 shadow-sm">
            <div className="font-bold text-slate-200 text-sm truncate">{usuarioActual.nombre}</div>
            <span className={`text-[9px] uppercase tracking-widest font-black px-2 py-0.5 rounded-md border inline-block mt-2 shadow-inner ${obtenerEstilosRol()}`}>
              {obtenerNombreRol(usuarioActual.rol)}
            </span>
            {usuarioActual.edificioId && (
              <p className="text-slate-500 font-semibold text-[11px] mt-1.5">
                Bloque {usuarioActual.edificioId} {usuarioActual.apartamento && `- Apto ${usuarioActual.apartamento}`}
              </p>
            )}
          </div>

          {/* 🗺️ NAVEGACIÓN */}
          <nav className="space-y-1">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-3 mb-2.5">Módulos Administrativos</p>

            {/* === CENSOS (SUPER ADMIN) === */}
            {usuarioActual.rol === 'SUPER_ADMIN' && (
              <>
                <button 
                  onClick={() => cambiarVista('censo-familiar')} 
                  className={`w-full flex items-center text-left gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${pestanaActiva === 'censo-familiar' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
                >
                  <UserPlus size={18} className="shrink-0" />
                  <span className="leading-tight">Registro Familiar Manual</span>
                </button>
                <button onClick={() => cambiarVista('solicitudes-censo')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${pestanaActiva === 'solicitudes-censo' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
                  <FileSignature size={18} /><span>Solicitudes de Censo</span>
                </button>
                <button onClick={() => cambiarVista('registro-censos')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${pestanaActiva === 'registro-censos' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
                  <ClipboardList size={18} /><span>Registro de Censos</span>
                </button>
              </>
            )}

            {/* === CENSOS (VOCERO) === */}
            {usuarioActual.rol === 'VOCERO' && (
              <button onClick={() => cambiarVista('mi-bloque')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${pestanaActiva === 'mi-bloque' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
                <Users size={18} /><span>Censo de Bloque {usuarioActual.edificioId}</span>
              </button>
            )}

            {/* === CENSOS (JEFE DE FAMILIA) === */}
            {esJefeFamilia && (
              <button onClick={() => cambiarVista('censo-familiar')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${pestanaActiva === 'censo-familiar' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
                <UserPlus size={18} /><span>Mi Censo Familiar</span>
              </button>
            )}

            {/* === MENSAJE DE BLOQUEO PARA JEFE DE FAMILIA NO APROBADO === */}
            {esJefeFamilia && !estaAprobado && (
              <div className="mx-3 mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2">
                <Lock size={14} className="text-red-400 mt-0.5 shrink-0" />
                <p className="text-[10px] text-red-300 font-semibold leading-relaxed">
                  Módulos comunitarios bloqueados hasta que tu censo sea aprobado.
                </p>
              </div>
            )}

            {/* === REPORTES COMUNITARIOS === */}
            {(usuarioActual.rol === 'VOCERO' || (esJefeFamilia && estaAprobado)) && (
              <button onClick={() => cambiarVista('reportes')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${pestanaActiva === 'reportes' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
                <FileWarning size={18} />
                <span>{esJefeFamilia ? 'Mis Reportes' : 'Reportes del Área'}</span>
              </button>
            )}

            {/* === FINANZAS === */}
            {(usuarioActual.rol === 'SUPER_ADMIN' || usuarioActual.rol === 'VOCERO') && (
              <button onClick={() => cambiarVista('finanzas')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${pestanaActiva === 'finanzas' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
                <CreditCard size={18} /><span>Control de Finanzas</span>
              </button>
            )}

            {/* === CONSULTAS Y ENCUESTAS === */}
            {puedeVerModulosComunitarios && (
              <button onClick={() => cambiarVista('encuestas')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${pestanaActiva === 'encuestas' ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/10' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
                <BarChart3 size={18} /><span>Consultas Comunitarias</span>
              </button>
            )}

            {/* === INSTANCIAS SUPERIORES (SOLO SUPER ADMIN) === */}
            {usuarioActual.rol === 'SUPER_ADMIN' && (
              <div className="pt-4 border-t border-slate-900 mt-4 space-y-1">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-3 mb-2">Instancias Superiores</p>
                
                <button onClick={() => cambiarVista('casos-escalados')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${pestanaActiva === 'casos-escalados' ? 'bg-red-900/40 text-red-400 border border-red-900/50 font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
                  <AlertTriangle size={18} className="text-rose-500" /><span>Casos Escalados</span>
                </button>

                <button onClick={() => cambiarVista('gestion-personal')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${pestanaActiva === 'gestion-personal' ? 'bg-slate-800 text-slate-100 font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
                  <ShieldAlert size={18} /><span>Gestión de Personal</span>
                </button>

                <button onClick={() => cambiarVista('bitacora')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${pestanaActiva === 'bitacora' ? 'bg-slate-800 text-slate-100 font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
                  <ShieldAlert size={18} /><span>Bitácora General</span>
                </button>
              </div>
            )}
          </nav>
        </div>

        {/* === ÁREA FIJA INFERIOR (CERRAR SESIÓN) === */}
        <div className="p-4 border-t border-slate-800 mt-auto bg-slate-950">
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all border border-transparent hover:border-rose-500/20 shadow-sm"
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>

      </div>

      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/50 z-30 md:hidden" />
      )}
    </>
  );
} 