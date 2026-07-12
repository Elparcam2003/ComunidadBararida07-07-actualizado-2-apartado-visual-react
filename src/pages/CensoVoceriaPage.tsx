// src/pages/CensoVoceriaPage.tsx
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Heart, ShieldCheck, Home, Phone, User, Eye } from 'lucide-react';
import { FamiliaDetalleModal } from '../components/FamiliaDetalleModal';

export function CensoVoceriaPage() {
  // 1. Extraemos aprobarFamilia del contexto
  const { familias, usuarioActual, aprobarFamilia } = useApp();
  if (!usuarioActual) return null;
  const [busqueda, setBusqueda] = useState('');
  const [filtroNecesidad, setFiltroNecesidad] = useState<'TODOS' | 'SALUD' | 'DISCAPACIDAD'>('TODOS');
  
  // 2. Estado para controlar qué familia se muestra en el modal
  const [familiaDetalle, setFamiliaDetalle] = useState<string | null>(null);
 
  // Filtrar familias según el bloque del vocero y la búsqueda
  const familiasDelBloque = familias.filter(f => {
    const coincideBloque = usuarioActual.rol === 'SUPER_ADMIN' ? true : f.bloque === usuarioActual.edificioId;
    const coincideBusqueda = f.jefeFamilia.toLowerCase().includes(busqueda.toLowerCase()) || f.apartamento.includes(busqueda);
    
    if (filtroNecesidad === 'SALUD') {
      return coincideBloque && coincideBusqueda && f.integrantes.some(i => i.poseeEnfermedad);
    }
    if (filtroNecesidad === 'DISCAPACIDAD') {
      return coincideBloque && coincideBusqueda && f.integrantes.some(i => i.poseeDiscapacidad);
    }
    
    return coincideBloque && coincideBusqueda;
  });

  // 3. Encontramos los datos completos de la familia a mostrar en el modal
  const familiaSeleccionada = familias.find(f => f.id === familiaDetalle);

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-[1400px] mx-auto animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Censo de Gestión: {usuarioActual.rol === 'SUPER_ADMIN' ? 'Urbanización Completa' : `Bloque ${usuarioActual.edificioId}`}
        </h1>
        <p className="text-sm text-slate-500 mt-1">Supervisión de núcleos familiares y casos de atención especial de tu área.</p>
      </div>

      {/* BARRA DE HERRAMIENTAS RESPONSIVA */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Buscar por jefe de familia o apartamento..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
          <button 
            onClick={() => setFiltroNecesidad('TODOS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${filtroNecesidad === 'TODOS' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Todos
          </button>
          <button 
            onClick={() => setFiltroNecesidad('SALUD')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${filtroNecesidad === 'SALUD' ? 'bg-rose-600 text-white shadow-md' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}
          >
            <Heart size={14} /> Casos Salud
          </button>
          <button 
            onClick={() => setFiltroNecesidad('DISCAPACIDAD')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${filtroNecesidad === 'DISCAPACIDAD' ? 'bg-indigo-600 text-white shadow-md' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
          >
            <ShieldCheck size={14} /> Discapacidad
          </button>
        </div>
      </div>

      {/* LISTADO DE FAMILIAS (TARJETAS ADAPTATIVAS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {familiasDelBloque.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <Home className="mx-auto text-slate-300 mb-3" size={48} />
            <p className="text-slate-500 font-medium">No se encontraron familias con esos criterios.</p>
          </div>
        ) : (
          familiasDelBloque.map(familia => (
            <div key={familia.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col group">
              
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <User size={24} />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg uppercase tracking-tighter">
                    Apto {familia.apartamento}
                  </span>
                  <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-widest">{familia.bloque}</p>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1 truncate" title={familia.jefeFamilia}>
                {familia.jefeFamilia}
              </h3>
              
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-4">
                <Phone size={12} className="shrink-0" />
                <span className="truncate">{familia.telefono || 'Sin teléfono registrado'}</span>
              </div>

              {/* Indicadores de Alerta Comunitaria */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 mt-auto">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold text-slate-600">
                  <User size={12} /> {familia.integrantes.length} Pers.
                </div>
                
                {familia.integrantes.some(i => i.poseeEnfermedad) && (
                  <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-100 px-2.5 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold text-rose-600">
                    <Heart size={12} fill="currentColor" /> Crónicos
                  </div>
                )}

                {familia.integrantes.some(i => i.poseeDiscapacidad) && (
                  <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 px-2.5 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold text-indigo-600">
                    <ShieldCheck size={12} /> Discap.
                  </div>
                )}
              </div>
              
              {/* Botón Funcional que activa el Modal */}
              <button 
                onClick={() => setFamiliaDetalle(familia.id)}
                className="w-full mt-5 bg-slate-50 border border-slate-200 hover:bg-slate-900 hover:border-slate-900 hover:text-white text-slate-600 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Eye size={14} />
                Ver Detalles del Núcleo
              </button>
            </div>
          ))
        )}
      </div>

      {/* 4. MODAL RENDERIZADO FUERA DEL BUCLE PARA RENDIMIENTO */}
      <FamiliaDetalleModal
        familia={familiaSeleccionada ?? null}
        onClose={() => setFamiliaDetalle(null)}
        /* Permitimos que tanto el Vocero como el Super Admin actúen como administradores en el modal */
        esAdministrador={usuarioActual.rol === 'SUPER_ADMIN' || usuarioActual.rol === 'VOCERO'}
        aprobarFamilia={aprobarFamilia}
      />
    </div>
  );
}