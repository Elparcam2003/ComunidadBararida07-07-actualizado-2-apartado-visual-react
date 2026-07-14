// src/components/Sidebar.tsx
import { useState } from 'react';
import { Users, ShieldAlert, AlertTriangle, CreditCard, FileWarning, UserPlus, BarChart3, Menu, X, ClipboardList, FileSignature, Lock, LogOut, User } from 'lucide-react';
import { obtenerNombreRol, obtenerNombreVoceria } from '../utils/nombres';
import { useApp } from '../context/AppContext';

export function Sidebar() {
  const { usuarioActual, pestanaActiva, setPestanaActiva, familiaActual, logout } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  // Si no hay usuario (estamos en el Login), no renderizar el Sidebar
  if (!usuarioActual) return null;

  // Lógica de permisos originales
  const esJefeFamilia = usuarioActual.rol === 'JEFE_FAMILIA';
  const estaAprobado = familiaActual?.estado === 'APROBADA';
  const puedeVerModulosComunitarios = !esJefeFamilia || estaAprobado;

  // Nombres x Rol originales
  const nombresFinanzas =
    usuarioActual.rol === 'SUPER_ADMIN' ? 'Control de Finanzas' :
    usuarioActual.rol === 'VOCERO' ? `Finanzas del Bloque ${usuarioActual.edificioId}` :
    usuarioActual.rol === 'JEFE_FAMILIA' ? 'Mis Finanzas' : 'Finanzas';

  const nombresReportes = 
    usuarioActual.rol === 'VOCERO' ? `Reportes de ${obtenerNombreVoceria(usuarioActual.areaVoceria)}` :
    usuarioActual.rol === 'JEFE_FAMILIA' ? 'Reportes' : 'Reportes';

  // Colores por rol originales
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
    setIsOpen(false);
  };

  // ✨ EL MOLDE PREMIUM: Aplica el diseño sin dañar tu lógica
  const NavItem = ({ id, icon: Icon, texto, color = 'indigo' }: { id: string, icon: any, texto: string, color?: 'indigo' | 'emerald' | 'rose' | 'slate' }) => {
    const activo = pestanaActiva === id;
    const estilos = {
      indigo: { bg: 'bg-indigo-500/15', txt: 'text-indigo-400', bar: 'bg-indigo-500', shadow: 'shadow-indigo-500/50' },
      emerald: { bg: 'bg-emerald-500/15', txt: 'text-emerald-400', bar: 'bg-emerald-500', shadow: 'shadow-emerald-500/50' },
      rose: { bg: 'bg-rose-500/15', txt: 'text-rose-400', bar: 'bg-rose-500', shadow: 'shadow-rose-500/50' },
      slate: { bg: 'bg-slate-700/40', txt: 'text-slate-200', bar: 'bg-slate-400', shadow: 'shadow-slate-400/50' }
    }[color];

    return (
      <button onClick={() => cambiarVista(id)} className={`w-full flex items-center text-left gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative overflow-hidden group active:scale-95 ${activo ? `${estilos.bg} ${estilos.txt}` : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
        {activo && <div className={`absolute left-0 top-0 bottom-0 w-1 ${estilos.bar} shadow-[0_0_10px] ${estilos.shadow} rounded-r-full animate-fadeIn`} />}
        <Icon size={18} className={`shrink-0 ${activo ? estilos.txt : 'text-slate-500 group-hover:text-slate-400 transition-colors'}`} />
        <span className="leading-tight">{texto}</span>
      </button>
    );
  };

  return (
    <>
      {/* 📱 HEADER SUPERIOR MÓVILES (AHORA CON LOGO) */}
      <div className="md:hidden bg-slate-950 p-4 flex justify-between items-center border-b border-slate-800 sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-700">
             <img src="/IconoEntrada.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-black text-white tracking-wider uppercase text-xs">Condominio Inteligente</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-200 p-1 active:scale-95 transition-transform">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 💻 CONTENEDOR PRINCIPAL */}
      <div className={`bg-slate-950 text-slate-300 w-64 md:w-72 h-screen fixed md:sticky top-0 z-40 border-r border-slate-900 transition-transform duration-300 flex flex-col md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* === ÁREA SCROLLEABLE (MENÚ) === */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          
          {/* LOGO PC */}
          <div className="hidden md:flex flex-col items-center py-4 border-b border-slate-800/50 mb-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg shadow-indigo-500/10 border border-slate-700 mb-3 hover:scale-105 transition-transform">
              <img src="/IconoEntrada3.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="font-black text-white text-sm tracking-wider uppercase text-center leading-tight">Urbanización Bararida</h1>
            <p className="text-[10px] text-slate-500 font-bold mt-1">Ecosistema Familiar Unificado</p>
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
                <NavItem id="censo-familiar" icon={UserPlus} texto="Registro Familiar Manual" />
                <NavItem id="solicitudes-censo" icon={FileSignature} texto="Solicitudes de Censo" />
                <NavItem id="registro-censos" icon={ClipboardList} texto="Registro de Censos" />
              </>
            )}

            {/* === CENSOS (VOCERO) === */}
            {usuarioActual.rol === 'VOCERO' && (
              <NavItem id="mi-bloque" icon={Users} texto={`Censo de Bloque ${usuarioActual.edificioId}`} />
            )}

            {/* === CENSOS (JEFE DE FAMILIA) === */}
            {esJefeFamilia && (
              <NavItem id="censo-familiar" icon={UserPlus} texto="Mi Censo Familiar" />
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
              <NavItem id="reportes" icon={FileWarning} texto={nombresReportes} />
            )}

            {/* === FINANZAS === */}
            {(usuarioActual.rol === 'SUPER_ADMIN' || usuarioActual.rol === 'VOCERO' || usuarioActual.rol === 'JEFE_FAMILIA') && (
              <NavItem id="finanzas" icon={CreditCard} texto={nombresFinanzas} color="emerald" />
            )}

            {/* === CONSULTAS Y ENCUESTAS === */}
            {puedeVerModulosComunitarios && (
              <NavItem id="encuestas" icon={BarChart3} texto="Consultas Comunitarias" />
            )}

            {/* === INSTANCIAS SUPERIORES (SOLO SUPER ADMIN) === */}
            {usuarioActual.rol === 'SUPER_ADMIN' && (
              <div className="pt-4 border-t border-slate-900 mt-4 space-y-1">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-3 mb-2">Instancias Superiores</p>
                <NavItem id="casos-escalados" icon={AlertTriangle} texto="Casos Escalados" color="rose" />
                <NavItem id="gestion-personal" icon={ShieldAlert} texto="Gestión de Personal" color="slate" />
                <NavItem id="bitacora" icon={ShieldAlert} texto="Bitácora General" color="slate" />
              </div>
            )}
          </nav>
        </div>

        {/* === ÁREA FIJA INFERIOR (PERFIL Y CERRAR SESIÓN) === */}
        <div className="p-4 border-t border-slate-800 mt-auto bg-slate-950/50 backdrop-blur-sm space-y-2">
          <button onClick={() => cambiarVista('mi-perfil')} className={`w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border shadow-sm active:scale-95 ${pestanaActiva === 'mi-perfil' ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-600/20' : 'text-slate-300 hover:bg-slate-900 border-slate-800'}`}>
            <User size={18} /> Mi Perfil
          </button>
          
          <button onClick={logout} className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all border border-transparent hover:border-rose-500/20 shadow-sm active:scale-95">
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>

      </div>

      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/50 z-30 md:hidden animate-fadeIn" />
      )}
    </>
  );
}