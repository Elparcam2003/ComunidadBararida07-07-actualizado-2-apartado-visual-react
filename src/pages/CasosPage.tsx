import { AlertTriangle, Home, Info, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function CasosPage() {
  const { usuarioActual, casos, actualizarEstadoCaso } = useApp();

  // Filtrado estricto: Solo casos marcados como ESCALADOS
  const casosEscaladosVisibles = casos.filter(c => {
    if (!c.esEscalado) return false;
    return usuarioActual.rol === 'SUPER_ADMIN' ? true : c.edificioId === usuarioActual.edificioId;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-red-900 flex items-center gap-2">
          <AlertTriangle className="text-rose-600"/> Bandeja de Casos Escalados
        </h1>
        <p className="text-sm text-gray-500">
          Incidencias críticas transferidas por los Administradores de Edificios por inviabilidad financiera o desacuerdo interno.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {casosEscaladosVisibles.length === 0 ? (
          <div className="md:col-span-2 bg-white p-12 rounded-xl border border-dashed text-center text-gray-400 italic text-sm">
            Felicidades. No hay disputas ni alertas críticas escaladas en este momento.
          </div>
        ) : (
          casosEscaladosVisibles.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border-2 border-rose-200 shadow-sm overflow-hidden flex flex-col justify-between">
              
              <div className="bg-rose-50 px-4 py-2.5 border-b border-rose-100 flex justify-between items-center text-xs">
                <span className="font-black text-rose-700 flex items-center gap-1 uppercase tracking-wide">
                  <Home size={12}/> Origen: Bloque {c.edificioId}
                </span>
                <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded">
                  ALTA PRIORIDAD
                </span>
              </div>

              <div className="p-4 space-y-3 flex-1">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{c.categoria}</span>
                  <h3 className="font-extrabold text-gray-800 text-base mt-0.5">{c.titulo}</h3>
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Informe Técnico de la Falla:</span>
                  <p className="text-gray-600 text-xs leading-relaxed bg-gray-50 p-2.5 rounded border">{c.descripcion}</p>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs">
                  <div className="font-bold text-amber-800 flex items-center gap-1">
                    <Info size={12}/> Argumento de Escalación del Administrador:
                  </div>
                  <p className="text-amber-900 mt-1 font-medium italic">
                    "{c.motivoEscalacion || 'No se cargó una justificación detallada.'}"
                  </p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-slate-500">
                  Estado: {c.estado}
                </span>
                {c.estado !== 'RESUELTO' && (
                  <button 
                    onClick={() => actualizarEstadoCaso(c.id, 'RESUELTO')}
                    className="px-3 py-1.5 bg-green-600 text-white rounded-md text-xs font-bold flex items-center gap-1 hover:bg-green-700 transition"
                  >
                    <CheckCircle size={12}/> Finiquitar y Archivar Caso
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}