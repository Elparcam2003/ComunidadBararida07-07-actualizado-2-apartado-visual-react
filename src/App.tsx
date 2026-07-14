// src/App.tsx
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { PrimerIngresoPage } from './pages/PrimerIngresoPage';

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
import { FinanzasPage } from './pages/FinanzasPage';

function Layout() {
  const { pestanaActiva } = useApp();

  return (
    // ✨ bg-slate-50 en lugar de gray-100 para un look más frío/limpio
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 select-none overflow-hidden text-slate-800">
      
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full relative scroll-smooth">
        {pestanaActiva === 'censo-familiar' && <CensoFamiliarPage />}
        {pestanaActiva === 'mi-bloque' && <CensoVoceriaPage />}
        {pestanaActiva === 'solicitudes-censo' && <SolicitudesCensoPage />}
        {pestanaActiva === 'registro-censos' && <RegistroCensosPage />}
        
        {pestanaActiva === 'gestion-personal' && <PersonalPage />}
        {pestanaActiva === 'casos-escalados' && <CasosPage />}
        {pestanaActiva === 'bitacora' && <BitacoraPage />}
        
        {pestanaActiva === 'reportes' && <ReportesPage />}
        {pestanaActiva === 'encuestas' && <EncuestasPage />}
        {pestanaActiva === 'mi-perfil' && <MiPerfilPage />}
        {pestanaActiva === 'finanzas' && <FinanzasPage />}
      </main>
    </div>
  );
} 

function MainRouter() {
  const { usuarioActual } = useApp();
  
  if (!usuarioActual) return <LoginPage />;
  if (usuarioActual.esPrimerIngreso === true) return <PrimerIngresoPage />;

  return <Layout />;
}

export default function App() { 
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  ); 
} 