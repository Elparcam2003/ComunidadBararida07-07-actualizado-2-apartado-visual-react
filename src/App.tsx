// src/App.tsx (o tu archivo principal)
import { AppProvider, useApp } from './context/AppContext';
import { PersonalPage } from './pages/PersonalPage';
import { CasosPage } from './pages/CasosPage';
import { CensoFamiliarPage } from './pages/CensoFamiliarPage';
import { Sidebar } from './components/Sidebar';
import { Sliders } from 'lucide-react';
import { BitacoraPage } from './pages/BitacoraPage';
import { ReportesPage } from './pages/ReportesPage';
import { SolicitudesCensoPage } from './pages/SolicitudesCensoPage';
import { RegistroCensosPage } from './pages/RegistroCensosPage';
import { EncuestasPage } from './pages/EncuestasPage';
import { CensoVoceriaPage } from './pages/CensoVoceriaPage'; // Asegúrate de importar la del vocero

function Layout() {
  const { usuariosDisponibles, cambiarUsuario, usuarioActual, pestanaActiva, setPestanaActiva } = useApp();

  // Orquestación inteligente de pestañas al cambiar de usuario simulado
  const manejarCambioUsuarioSimulado = (id: string) => {
    cambiarUsuario(id);
    const targetUser = usuariosDisponibles.find(u => u.id === id);
    if (targetUser) {
      if (targetUser.rol === 'JEFE_FAMILIA') {
        setPestanaActiva('censo-familiar'); // ✨ Corregido de 'dashboard' a su vista real
      } else if (targetUser.rol === 'VOCERO') {
        setPestanaActiva('mi-bloque'); // ✨ Corregido para que abra su censo de bloque nativo
      } else if (targetUser.rol === 'ADMIN_EDIFICIO') {
        setPestanaActiva('casos-locales');
      } else {
        setPestanaActiva('global-residentes');
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 select-none">
      
      {/* PANEL SUPERIOR DEL SIMULADOR COMUNITARIO */}
      <div className="bg-slate-900 text-white px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm border-b border-slate-800 z-50 shadow-md">
        <div className="flex items-center gap-2 text-slate-400 font-medium">
          <Sliders size={16} className="text-indigo-400" />
          <span>Panel de Pruebas Orgánica de Roles:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {usuariosDisponibles.map(u => (
            <button 
              key={u.id} 
              onClick={() => manejarCambioUsuarioSimulado(u.id)} 
              className={`px-3 py-1.5 rounded-lg font-semibold transition text-xs border ${
                usuarioActual.id === u.id 
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' 
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Ver como: {u.nombre.split(' ')[0]} ({
                u.rol === 'SUPER_ADMIN' ? 'Jefa' : 
                u.rol === 'ADMIN_EDIFICIO' ? 'Admin Bloque' : 
                u.rol === 'VOCERO' ? 'Vocero' : 'JEFE_FAMILIA'
              })
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        {/* ENRUTADOR DINÁMICO DE PÁGINAS */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Vistas Generales y Censos */}
          {pestanaActiva === 'censo-familiar' && <CensoFamiliarPage />}
          {pestanaActiva === 'mi-bloque' && <CensoVoceriaPage />} {/* ✨ Agregada la vista del Vocero */}
          {pestanaActiva === 'solicitudes-censo' && <SolicitudesCensoPage />}
          {pestanaActiva === 'registro-censos' && <RegistroCensosPage />}
          
          {/* Personal e Instancias */}
          {pestanaActiva === 'gestion-personal' && <PersonalPage />}
          {pestanaActiva === 'casos-escalados' && <CasosPage />}
          {pestanaActiva === 'bitacora' && <BitacoraPage />}
          
          {/* Módulos de Reportes y Encuestas Independizados */}
          {pestanaActiva === 'reportes' && <ReportesPage />}
          {pestanaActiva === 'encuestas' && <EncuestasPage />} {/* ✨ Sincronizado con 'encuestas' */}
        </main>
      </div>
    </div>
  );
}

export default function App() { 
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  ); 
}