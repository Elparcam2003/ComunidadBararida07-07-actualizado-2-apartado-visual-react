import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Sliders } from 'lucide-react';

// Importación de todas tus páginas
import { PersonalPage } from './pages/PersonalPage';
import { CasosPage } from './pages/CasosPage';
import { CensoFamiliarPage } from './pages/CensoFamiliarPage';
import { BitacoraPage } from './pages/BitacoraPage';
import { ReportesPage } from './pages/ReportesPage';
import { SolicitudesCensoPage } from './pages/SolicitudesCensoPage';
import { RegistroCensosPage } from './pages/RegistroCensosPage';
import { EncuestasPage } from './pages/EncuestasPage';
import { CensoVoceriaPage } from './pages/CensoVoceriaPage';

function Layout() {
  const { usuariosDisponibles, cambiarUsuario, usuarioActual, pestanaActiva, setPestanaActiva } = useApp();

  // Función corregida: Sincronizada 100% con los IDs de tu Sidebar
  const manejarCambioUsuarioSimulado = (id: string) => {
    cambiarUsuario(id);
    const targetUser = usuariosDisponibles.find(u => u.id === id);
    if (targetUser) {
      if (targetUser.rol === 'JEFE_FAMILIA') {
        setPestanaActiva('censo-familiar');
      } else if (targetUser.rol === 'VOCERO') {
        setPestanaActiva('mi-bloque');
      } else if (targetUser.rol === 'ADMIN_EDIFICIO') {
        setPestanaActiva('casos-locales');
      } else if (targetUser.rol === 'SUPER_ADMIN') {
        setPestanaActiva('registro-censos'); // Ruta principal para el Admin
      } else {
        setPestanaActiva('reportes'); // Fallback seguro
      }
    }
  };

  const obtenerNombreRol = (rol: string) => {
    const nombres: Record<string, string> = {
      'SUPER_ADMIN': 'Administrador Superior',
      'VOCERO': 'Vocero Comunal',
      'ADMIN_EDIFICIO': 'Admin. de Edificio',
      'JEFE_FAMILIA': 'Jefe de Familia'
    };
    return nombres[rol] || rol; // Si por error llega otro, muestra el original
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 select-none">
      
      {/* PANEL SUPERIOR DE PRUEBAS */}
      <div className="bg-slate-900 text-white px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm border-b border-slate-800 z-50 shadow-md">
        <div className="flex items-center gap-2 text-slate-400 font-medium">
          <Sliders size={16} className="text-indigo-400" />
          <span>Panel de Pruebas:</span>
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
              {u.nombre.split(' ')[0]} ({obtenerNombreRol(u.rol)})
            </button>
          ))}
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        {/* RENDERIZADO DINÁMICO (Router) */}
        <main className="flex-1 p-8 overflow-y-auto bg-gray-50">
          {/* Censos */}
          {pestanaActiva === 'censo-familiar' && <CensoFamiliarPage />}
          {pestanaActiva === 'mi-bloque' && <CensoVoceriaPage />}
          {pestanaActiva === 'solicitudes-censo' && <SolicitudesCensoPage />}
          {pestanaActiva === 'registro-censos' && <RegistroCensosPage />}
          
          {/* Comunicación y Reportes */}
          {pestanaActiva === 'reportes' && <ReportesPage />}
          {pestanaActiva === 'encuestas' && <EncuestasPage />}
          
          {/* Administración (Solo Super Admin) */}
          {pestanaActiva === 'casos-escalados' && <CasosPage />}
          {pestanaActiva === 'gestion-personal' && <PersonalPage />}
          {pestanaActiva === 'bitacora' && <BitacoraPage />}
          
          {/* Fallback de seguridad (Opcional, pero recomendado) */}
          {!['censo-familiar', 'mi-bloque', 'solicitudes-censo', 'registro-censos', 'reportes', 'encuestas', 'casos-escalados', 'gestion-personal', 'bitacora'].includes(pestanaActiva) && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <p>Selecciona una opción del menú.</p>
            </div>
          )}
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