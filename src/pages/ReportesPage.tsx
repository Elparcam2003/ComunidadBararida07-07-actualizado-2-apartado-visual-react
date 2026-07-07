// src/pages/ReportesPage.tsx
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, CheckCircle2, Clock, Send, MessageSquare } from 'lucide-react';

export function ReportesPage() {
  // 🤝 Consumimos el estado global "casos" y las funciones de tu AppContext
  const { usuarioActual, casos, reportarCaso, actualizarEstadoCaso } = useApp();
  
  // Control local de los campos del formulario
  const [categoria, setCategoria] = useState<'SERVICIOS' | 'INFRAESTRUCTURA' | 'SALUD_ALERTA' | 'SEGURIDAD_JUSTICIA' | 'OTRO'>('SERVICIOS');
  const [asunto, setAsunto] = useState('');
  const [descripcion, setDescripcion] = useState('');

  // 🚀 FILTRADO: Basado estrictamente en la competencia del Área de Vocería
  const reportesVisibles = casos.filter(rep => {
    // 1. El Super Admin/Co-Jefe de calle ve todo
    if (usuarioActual.rol === 'SUPER_ADMIN') return true; 
    
    if (usuarioActual.rol === 'VOCERO') {
      const areaOriginal = usuarioActual.areaVoceria || '';
      const areaVocero = String(areaOriginal).trim().toUpperCase();

      // Fallback de seguridad por si el vocero no tiene área
      if (!areaVocero || areaVocero === 'UNDEFINED' || areaVocero === 'GENERAL') {
        return true;
      }

      // 2. Enrutamiento por competencia de área real
      if (rep.categoria === 'SERVICIOS' && (areaVocero.includes('FINANZAS') || areaVocero.includes('ADMINISTRACION') || areaVocero.includes('SERVICIOS'))) {
        return true;
      }
      if (rep.categoria === 'INFRAESTRUCTURA' && (areaVocero.includes('VIVIENDA') || areaVocero.includes('HABITAT') || areaVocero.includes('INFRAESTRUCTURA'))) {
        return true;
      }
      // ✨ Cruzamos tu categoría 'CONVIVENCIA' con el área 'JUSTICIA_PAZ' de Marcos
      if (rep.categoria === 'CONVIVENCIA' && (areaVocero.includes('JUSTICIA') || areaVocero.includes('SEGURIDAD') || areaVocero.includes('PAZ'))) {
        return true;
      }

      return false; 
    }
    
    // Si es un Jefe de Familia común, ve persistentemente lo que él reportó
    return rep.reportadoPorId === usuarioActual.id; 
  });

 const manejarCrearReporte = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asunto || !descripcion) return;

    // Traducimos de manera limpia la selección del formulario al tipo de tu backend/contexto
    const categoriaFormateada = categoria === 'SEGURIDAD_JUSTICIA' ? 'CONVIVENCIA' : categoria;

    // Ejecutamos tu función global del AppContext con las llaves exactas de tu interfaz Caso
    reportarCaso({
      titulo: asunto, // ✨ Tu interfaz usa 'titulo'
      descripcion: descripcion,
      categoria: categoriaFormateada as 'INFRAESTRUCTURA' | 'SERVICIOS' | 'CONVIVENCIA',
      prioridad: 'MEDIA', // Valor por defecto inicial
      edificioId: usuarioActual.edificioId || 'B3', // ✨ Tu interfaz usa 'edificioId'
    });

    // Limpiamos los inputs
    setAsunto('');
    setDescripcion('');
  };

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Control de Reportes y Averías</h1>
        <p className="text-sm text-gray-500">
          {usuarioActual.rol === 'JEFE_FAMILIA' 
            ? 'Notifica incidencias de tu hogar o áreas comunes directamente a tu vocero.' 
            : `Gestión de casos asignados a: ${usuarioActual.rol === 'SUPER_ADMIN' ? 'Toda la Urbanización' : `Área: ${(usuarioActual as any).areaVoceria || 'General'}`}`}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMNA FORMULARIO (Solo para Jefes de Familia) */}
        {usuarioActual.rol === 'JEFE_FAMILIA' && (
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm h-fit space-y-4">
            <h2 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <AlertTriangle size={16} className="text-indigo-600" /> Crear Reporte de Incidencia
            </h2>
            <form onSubmit={manejarCrearReporte} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Categoría del Incidente</label>
                <select 
                  value={categoria} 
                  onChange={e => setCategoria(e.target.value as any)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none"
                >
                  <option value="SERVICIOS">Servicios Públicos (Agua/Luz/Internet)</option>
                  <option value="INFRAESTRUCTURA">Infraestructura (Ascensor/Techo/Áreas)</option>
                  <option value="SALUD_ALERTA">Alerta de Salud Comunitaria</option>
                  <option value="SEGURIDAD_JUSTICIA">Seguridad, Convivencia y Hurtos</option>
                  <option value="OTRO">Otros Casos Especiales</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Asunto Corto</label>
                <input 
                  type="text" 
                  value={asunto}
                  onChange={e => setAsunto(e.target.value)}
                  placeholder="Ej: Problema con la convivencia en pasillo" 
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Descripción de la Situación</label>
                <textarea 
                  rows={4}
                  value={descripcion}
                  onChange={e => setDescripcion(e.target.value)}
                  placeholder="Detalla el inconveniente..." 
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2">
                <Send size={14} /> Enviar Reporte a Vocería
              </button>
            </form>
          </div>
        )}

        {/* COLUMNA HISTORIAL */}
        <div className={`${usuarioActual.rol === 'JEFE_FAMILIA' ? 'lg:col-span-2' : 'col-span-full'} space-y-3`}>
          <h2 className="font-bold text-gray-800 text-sm flex items-center gap-2 mb-2">
            <MessageSquare size={16} className="text-slate-700" /> Historial de Alertas ({reportesVisibles.length})
          </h2>

          {reportesVisibles.length === 0 ? (
            <div className="bg-white py-12 text-center rounded-2xl border border-dashed border-gray-200">
              <CheckCircle2 className="mx-auto text-gray-300 mb-2" size={36} />
              <p className="text-sm text-gray-400 font-medium">No hay reportes asignados o registrados en esta sección.</p>
            </div>
          ) : (
            reportesVisibles.map(rep => (
              <div key={rep.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded border bg-slate-100 text-slate-800 border-slate-200">
                        {((rep as any).categoria || 'CASO').replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-gray-400 font-semibold">{rep.fechaReporte}</span>
                    </div>
                    {/* ✨ Corregido: Ahora lee la propiedad 'titulo' directamente de tu interfaz Caso */}
                    <h3 className="font-extrabold text-gray-900 mt-1.5 text-base">{rep.titulo}</h3>
                    <p className="text-xs text-gray-400 font-bold mt-0.5 uppercase tracking-wide">
                      Emitido por: {rep.reportadoPorNombre} { (rep as any).bloque ? `(Bloque ${(rep as any).bloque})` : '' }
                    </p>
                  </div>

                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase flex items-center gap-1 ${
                    rep.estado === 'ABIERTO' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {rep.estado === 'ABIERTO' ? <Clock size={12} /> : <CheckCircle2 size={12} />}
                    {rep.estado}
                  </span>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                  {rep.descripcion}
                </p>

                {/* ACCIONES DEL VOCERO / ADMIN */}
                {usuarioActual.rol !== 'JEFE_FAMILIA' && rep.estado !== 'RESUELTO' && (
                  <div className="flex justify-end gap-2 pt-2 border-t border-gray-50">
                    <button 
                      onClick={() => actualizarEstadoCaso(rep.id, 'RESUELTO')}
                      className="bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
                    >
                      Marcar como Solucionado
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}