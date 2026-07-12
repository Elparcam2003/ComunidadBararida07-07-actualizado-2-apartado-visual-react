import { useState } from 'react';
import { 
  Eye, 
  Search, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Building, 
  DoorOpen, 
  Filter 
} from 'lucide-react';
import { FamiliaDetalleModal } from '../components/FamiliaDetalleModal';
import { useApp } from '../context/AppContext';

export function RegistroCensosPage() {
  const { familias, aprobarFamilia, usuarioActual } = useApp();
  if (!usuarioActual) return null;
  
  // Estados
  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('TODOS');
  const [bloqueFiltro, setBloqueFiltro] = useState('');
  const [aptoFiltro, setAptoFiltro] = useState('');
  const [familiaDetalle, setFamiliaDetalle] = useState<string | null>(null);

  // Lógica de contadores
  const total = familias.length;
  const pendientes = familias.filter(f => f.estado === 'PENDIENTE').length;
  const aprobadas = familias.filter(f => f.estado === 'APROBADA').length;
  const rechazadas = familias.filter(f => f.estado === 'RECHAZADA').length;

  const obtenerColorEstado = (estado: string) => {
    switch(estado){
      case 'APROBADA': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'RECHAZADA': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const obtenerIconoEstado = (estado: string) => {
    switch(estado){
      case 'APROBADA': return <CheckCircle size={14} className="mr-1" />;
      case 'RECHAZADA': return <XCircle size={14} className="mr-1" />;
      default: return <Clock size={14} className="mr-1" />;
    }
  };

  // Lógica de filtrado
  const familiasFiltradas = familias.filter(f => {
    const busquedaLimpia = busqueda.toLowerCase();
    const aptoTexto = f.apartamento ? String(f.apartamento).toLowerCase() : '';

    const coincideBusqueda = f.jefeFamilia.toLowerCase().includes(busquedaLimpia) || f.cedulaJefe.includes(busqueda);
    const coincideEstado = estadoFiltro === 'TODOS' || f.estado === estadoFiltro;
    const coincideBloque = !bloqueFiltro || f.bloque.toLowerCase().includes(bloqueFiltro.toLowerCase());
    const coincideApto = !aptoFiltro || aptoTexto.includes(aptoFiltro.toLowerCase());

    return coincideBusqueda && coincideEstado && coincideBloque && coincideApto;
  }).sort((a, b) => new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime());

  // Familia seleccionada para el modal
  const familiaSeleccionada = familias.find(f => f.id === familiaDetalle);

  return (
    <div className="space-y-8 p-4 md:p-6 max-w-[1400px] mx-auto animate-fadeIn">
      
      {/* SECCIÓN 1: Título */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Directorio de Censos</h1>
        <p className="text-sm text-slate-500 mt-1">Gestión y revisión del registro habitacional de la comunidad.</p>
      </div>

      {/* SECCIÓN 2: Estadísticas (Diseño Premium) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users size={48} className="text-indigo-600" />
          </div>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Total Registros</p>
          <h2 className="text-3xl font-black text-slate-900 mt-2">{total}</h2>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-200 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Clock size={48} className="text-amber-600" />
          </div>
          <p className="text-sm text-amber-700 font-bold uppercase tracking-wider">Pendientes</p>
          <h2 className="text-3xl font-black text-amber-700 mt-2">{pendientes}</h2>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle size={48} className="text-emerald-600" />
          </div>
          <p className="text-sm text-emerald-700 font-bold uppercase tracking-wider">Aprobados</p>
          <h2 className="text-3xl font-black text-emerald-700 mt-2">{aprobadas}</h2>
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-white border border-rose-200 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <XCircle size={48} className="text-rose-600" />
          </div>
          <p className="text-sm text-rose-700 font-bold uppercase tracking-wider">Rechazados</p>
          <h2 className="text-3xl font-black text-rose-700 mt-2">{rechazadas}</h2>
        </div>
      </div>

      {/* SECCIÓN 3: Panel de Filtros */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Filter size={14} /> Filtros de Búsqueda
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Nombre o Cédula..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="relative">
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none text-slate-700 font-medium"
            >
              <option value="TODOS">Todos los Estados</option>
              <option value="PENDIENTE">Solo Pendientes</option>
              <option value="APROBADA">Solo Aprobados</option>
              <option value="RECHAZADA">Solo Rechazados</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>

          <div className="relative">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Bloque o Torre..."
              value={bloqueFiltro}
              onChange={(e) => setBloqueFiltro(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="relative">
            <DoorOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Nro. Apartamento..."
              value={aptoFiltro}
              onChange={(e) => setAptoFiltro(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* SECCIÓN 4: Grid de Tarjetas */}
      {familiasFiltradas.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl py-16 flex flex-col items-center justify-center text-center">
          <Users size={48} className="text-slate-300 mb-3" />
          <h3 className="text-slate-900 font-bold">No hay censos que coincidan</h3>
          <p className="text-slate-500 text-sm mt-1">Intenta ajustar los filtros de búsqueda superior.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {familiasFiltradas.map(f => {
            const colorEstado = obtenerColorEstado(f.estado);
            
            return (
              <div key={f.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col">
                
                {/* Cabecera Tarjeta */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                      Jefe de Familia
                    </span>
                    <h2 className="font-bold text-lg text-slate-900 leading-tight truncate max-w-[180px]" title={f.jefeFamilia}>
                      {f.jefeFamilia}
                    </h2>
                    <p className="text-indigo-600 font-bold text-xs mt-0.5">CI: {f.cedulaJefe}</p>
                  </div>
                  
                  <span className={`flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${colorEstado}`}>
                    {obtenerIconoEstado(f.estado)}
                    {f.estado}
                  </span>
                </div>

                {/* Info Ubicación y Familia */}
                <div className="bg-slate-50 rounded-xl p-3 mb-4 flex-1">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-slate-500 mb-0.5">Ubicación:</p>
                      <p className="font-semibold text-slate-700">
                        {f.torre && `T-${f.torre} `} 
                        B-{f.bloque} 
                        <span className="text-slate-400 mx-1">•</span> 
                        Ap.{f.apartamento}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-0.5">Núcleo Familiar:</p>
                      <p className="font-semibold text-slate-700 flex items-center gap-1">
                        <Users size={12} className="text-slate-400"/>
                        {f.integrantes.length} {f.integrantes.length === 1 ? 'persona' : 'personas'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Tarjeta */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium">
                    Reg: {new Date(f.fechaRegistro).toLocaleDateString()}
                  </span>
                  
                  <button
                    onClick={() => setFamiliaDetalle(f.id)}
                    className="flex items-center gap-1.5 bg-slate-900 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
                  >
                    <Eye size={14} />
                    Inspeccionar
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* MODAL RENDERIZADO FUERA DEL MAP (Mejora de rendimiento) */}
      <FamiliaDetalleModal
        familia={familiaSeleccionada ?? null}
        onClose={() => setFamiliaDetalle(null)}
        esAdministrador={usuarioActual.rol === 'SUPER_ADMIN'}
        aprobarFamilia={aprobarFamilia}
      />
    </div>
  );
} 