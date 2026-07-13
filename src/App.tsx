// src/App.tsx
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { PrimerIngresoPage } from './pages/PrimerIngresoPage'; // ✨ IMPORTACIÓN CLAVE

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
import { MiPerfilPage } from './pages/MiPerfilPage';

function Layout() {
  const { pestanaActiva } = useApp();

  return (
    // ✨ EL ARREGLO ESTÁ AQUÍ: "flex-col md:flex-row" organiza todo perfecto según la pantalla
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 select-none overflow-hidden">
      
      <Sidebar />
      
      {/* ✨ Redujimos el padding en móviles (p-4) y lo mantuvimos amplio en PC (md:p-8) */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-gray-50 w-full relative">
        {pestanaActiva === 'censo-familiar' && <CensoFamiliarPage />}
        {pestanaActiva === 'mi-bloque' && <CensoVoceriaPage />}
        {pestanaActiva === 'solicitudes-censo' && <SolicitudesCensoPage />}
        {pestanaActiva === 'registro-censos' && <RegistroCensosPage />}
        {pestanaActiva === 'mi-perfil' && <MiPerfilPage />}
        
        {pestanaActiva === 'gestion-personal' && <PersonalPage />}
        {pestanaActiva === 'casos-escalados' && <CasosPage />}
        {pestanaActiva === 'bitacora' && <BitacoraPage />}
        
        {pestanaActiva === 'reportes' && <ReportesPage />}
        {pestanaActiva === 'encuestas' && <EncuestasPage />}
      </main>

    </div>
  );
}

// ✨ EL  "GUARDIA DE SEGURIDAD" DEFINITIVO
function MainRouter() {
  const { usuarioActual } = useApp();
  
  // 1. Si NO hay nadie conectado, bloquea todo y muestra el Login
  if (!usuarioActual) {
    return <LoginPage />;
  }

  // 2. Si SÍ está conectado, pero es su primer ingreso, lo mandamos a configurar la seguridad
  if (usuarioActual.esPrimerIngreso === true) {
    return <PrimerIngresoPage />;
  }

  // 3. Si todo está perfecto, lo dejamos pasar a la app principal
  return <Layout />;
}

export default function App() { 
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  ); 
} 