// src/pages/CensoVoceriaPage.tsx
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Filter, Heart, Zap, ShieldCheck, Home, Phone, User } from 'lucide-react';

export function CensoVoceriaPage() {
  const { familias, usuarioActual } = useApp();
  const [busqueda, setBusqueda] = useState('');
  const [filtroNecesidad, setFiltroNecesidad] = useState<'TODOS' | 'SALUD' | 'DISCAPACIDAD'>('TODOS');

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

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Censo de Gestión: {usuarioActual.rol === 'SUPER_ADMIN' ? 'Urbanización Completa' : `Bloque ${usuarioActual.edificioId}`}
        </h1>
        <p className="text-sm text-gray-500">Supervisión de núcleos familiares y casos de atención especial.</p>
      </div>

      {/* BARRA DE HERRAMIENTAS RESPONSIVA */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Buscar por jefe de familia o apartamento..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
          <button 
            onClick={() => setFiltroNecesidad('TODOS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${filtroNecesidad === 'TODOS' ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Todos
          </button>
          <button 
            onClick={() => setFiltroNecesidad('SALUD')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${filtroNecesidad === 'SALUD' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
          >
            <Heart size={14} /> Casos Salud
          </button>
          <button 
            onClick={() => setFiltroNecesidad('DISCAPACIDAD')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${filtroNecesidad === 'DISCAPACIDAD' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
          >
            <ShieldCheck size={14} /> Discapacidad
          </button>
        </div>
      </div>

      {/* LISTADO DE FAMILIAS (TARJETAS ADAPTATIVAS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {familiasDelBloque.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <Home className="mx-auto text-gray-300 mb-3" size={48} />
            <p className="text-gray-500 font-medium">No se encontraron familias con esos criterios.</p>
          </div>
        ) : (
          familiasDelBloque.map(familia => (
            <div key={familia.id} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <User size={24} />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg uppercase tracking-tighter">
                    Apto {familia.apartamento}
                  </span>
                  <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">{familia.bloque}</p>
                </div>
              </div>

              <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{familia.jefeFamilia}</h3>
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-4">
                <Phone size={12} />
                <span>{familia.telefono || 'Sin teléfono'}</span>
              </div>

              {/* Indicadores de Alerta Comunitaria (Lo que el Vocero debe saber) */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-gray-600">
                  <User size={12} /> {familia.integrantes.length} Pers.
                </div>
                
                {familia.integrantes.some(i => i.poseeEnfermedad) && (
                  <div className="flex items-center gap-1.5 bg-red-50 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-red-600">
                    <Heart size={12} fill="currentColor" /> Crónicos
                  </div>
                )}

                {familia.integrantes.some(i => i.poseeDiscapacidad) && (
                  <div className="flex items-center gap-1.5 bg-indigo-50 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-indigo-600">
                    <ShieldCheck size={12} /> Discapacidad
                  </div>
                )}
              </div>
              
              <button className="w-full mt-5 bg-gray-50 hover:bg-slate-900 hover:text-white text-gray-600 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                Ver Detalles del Núcleo
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}