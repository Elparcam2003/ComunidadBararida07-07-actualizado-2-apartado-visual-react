// src/pages/ReportesPage.tsx
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, CheckCircle2, Clock, Send, MessageSquare, ArrowUpRight, ShieldAlert } from 'lucide-react';
import { CasoChatPanel } from '../components/CasoChatPanel';
import { EscalarCasoModal } from '../components/EscalarCasoModal';
import type { Caso } from '../types';

export function ReportesPage() {
  // 🤝 Agregamos escalarCasoASuperAdmin aquí
  const { usuarioActual, casos, reportarCaso, actualizarEstadoCaso, enviarMensajeCaso, escalarCasoASuperAdmin } = useApp();
  
  const [categoria, setCategoria] = useState<'SERVICIOS' | 'INFRAESTRUCTURA' | 'SALUD_ALERTA' | 'SEGURIDAD_JUSTICIA' | 'OTRO'>('SERVICIOS');
  const [asunto, setAsunto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  
  // Estados para los paneles y modales
  const [casoParaChat, setCasoParaChat] = useState<Caso | null>(null);
  const [casoAEscalar, setCasoAEscalar] = useState<Caso | null>(null);

  // 🚀 FILTRADO
  const reportesVisibles = casos.filter(rep => {
    if (usuarioActual.rol === 'SUPER_ADMIN') return true; 
    
    if (usuarioActual.rol === 'VOCERO') {
      const areaOriginal = usuarioActual.areaVoceria || '';
      const areaVocero = String(areaOriginal).trim().toUpperCase();

      if (!areaVocero || areaVocero === 'UNDEFINED' || areaVocero === 'GENERAL') return true;

      if (rep.categoria === 'SERVICIOS' && (areaVocero.includes('FINANZAS') || areaVocero.includes('ADMINISTRACION') || areaVocero.includes('SERVICIOS'))) return true;
      if (rep.categoria === 'INFRAESTRUCTURA' && (areaVocero.includes('VIVIENDA') || areaVocero.includes('HABITAT') || areaVocero.includes('INFRAESTRUCTURA'))) return true;
      if (rep.categoria === 'CONVIVENCIA' && (areaVocero.includes('JUSTICIA') || areaVocero.includes('SEGURIDAD') || areaVocero.includes('PAZ'))) return true;

      return false; 
    }
    
    return rep.reportadoPorId === usuarioActual.id; 
  });

  const manejarCrearReporte = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asunto || !descripcion) return;

    const categoriaFormateada = categoria === 'SEGURIDAD_JUSTICIA' ? 'CONVIVENCIA' : categoria;

    reportarCaso({
      titulo: asunto,
      descripcion: descripcion,
      categoria: categoriaFormateada as 'INFRAESTRUCTURA' | 'SERVICIOS' | 'CONVIVENCIA',
      prioridad: 'MEDIA',
      edificioId: usuarioActual.edificioId || 'B3',
      mensajes: []
    });

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
              <div key={rep.id} className={`bg-white border ${rep.esEscalado ? 'border-amber-200 bg-amber-50/20' : 'border-gray-100'} rounded-2xl p-5 shadow-sm space-y-4`}>
                
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded border bg-slate-100 text-slate-800 border-slate-200">
                        {((rep as any).categoria || 'CASO').replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-gray-400 font-semibold">{rep.fechaReporte}</span>
                      
                      {/* Badge visual si el caso fue escalado */}
                      {rep.esEscalado && (
                        <span className="flex items-center gap-1 text-[9px] uppercase font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                          <ShieldAlert size={10} />
                          Escalado a Super Admin
                        </span>
                      )}
                    </div>
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

                {/* Si está escalado mostramos el motivo para que el vocero o jefe de familia sepan el estatus */}
                {rep.esEscalado && rep.motivoEscalacion && (
                   <div className="p-2.5 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-800">
                     <strong className="block mb-0.5">Nota de escalación:</strong>
                     <span className="italic">"{rep.motivoEscalacion}"</span>
                   </div>
                )}

                {/* ACCIONES (CHAT, SOLUCIONADO, ESCALAR) */}
                <div className="flex justify-between items-center gap-2 pt-3 border-t border-gray-100 mt-2">
                  
                  {/* Botón de chat visible para todos */}
                  <button 
                    type="button"
                    onClick={() => setCasoParaChat(rep)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-bold transition"
                  >
                    <MessageSquare size={14} />
                    Chat
                    {rep.mensajes && rep.mensajes.length > 0 && (
                      <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        {rep.mensajes.length}
                      </span>
                    )}
                  </button>

                  <div className="flex gap-2">
                    {/* Botón Escalar: Solo Vocero, no resuelto y NO escalado aún */}
                    {usuarioActual.rol === 'VOCERO' && rep.estado !== 'RESUELTO' && !rep.esEscalado && (
                      <button 
                        onClick={() => setCasoAEscalar(rep)}
                        className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                      >
                        <ArrowUpRight size={14} />
                        Escalar a Admin
                      </button>
                    )}

                    {/* Botón Solucionado: Admin/Vocero, no resuelto y NO escalado */}
                    {usuarioActual.rol !== 'JEFE_FAMILIA' && rep.estado !== 'RESUELTO' && !rep.esEscalado && (
                      <button 
                        onClick={() => actualizarEstadoCaso(rep.id, 'RESUELTO')}
                        className="bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
                      >
                        Marcar Solucionado
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* MODALES Y PANELES */}
      <EscalarCasoModal
        isOpen={!!casoAEscalar}
        onClose={() => setCasoAEscalar(null)}
        tituloCaso={casoAEscalar?.titulo || ''}
        onConfirm={(motivo) => {
          if (casoAEscalar) {
            escalarCasoASuperAdmin(casoAEscalar.id, motivo);
          }
          setCasoAEscalar(null);
        }}
      />

      <CasoChatPanel
        isOpen={!!casoParaChat}
        onClose={() => setCasoParaChat(null)}
        caso={casoParaChat}
        usuarioActualId={usuarioActual.id}
        onEnviarMensaje={(texto) => {
          if (casoParaChat) {
            enviarMensajeCaso(casoParaChat.id, texto);
          }
        }}
      />
    </div>
  );
}