import { useState } from 'react';
import { CheckCircle, ArrowUpRight, ShieldAlert, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EscalarCasoModal } from '../components/EscalarCasoModal';
import { CasoChatPanel } from '../components/CasoChatPanel';
import type { Caso } from '../types';

export function CasosPage() {
  const { usuarioActual, casos, actualizarEstadoCaso, escalarCasoASuperAdmin, enviarMensajeCaso } = useApp();
  if (!usuarioActual) return null;
  
  // Estados para controlar los modales y paneles
  const [casoAEscalar, setCasoAEscalar] = useState<Caso | null>(null);
  const [casoParaChat, setCasoParaChat] = useState<Caso | null>(null);

  // --- LÓGICA DE FILTRADO SEGÚN EL ROL ---
  const casosVisibles = casos.filter(caso => {
    if (usuarioActual.rol === 'JEFE_FAMILIA') {
      return caso.reportadoPorId === usuarioActual.id;
    }
    if (usuarioActual.rol === 'VOCERO') {
      return caso.edificioId === usuarioActual.edificioId && !caso.esEscalado; 
    }
    return true; // SUPER_ADMIN ve todos
  });

  const obtenerColorEstado = (estado: Caso['estado']) => {
    switch (estado) {
      case 'ABIERTO': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'EN_PROCESO': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'RESUELTO': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Casos Comunales</h1>
          <p className="text-sm text-gray-500 mt-1">
            {usuarioActual.rol === 'SUPER_ADMIN' 
              ? 'Supervisión general de todos los casos y escalaciones.' 
              : 'Administración de reportes y solicitudes vecinales.'}
          </p>
        </div>
        {usuarioActual.rol === 'JEFE_FAMILIA' && (
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm">
            + Reportar Nuevo Caso
          </button>
        )}
      </div>

      {/* Lista de Casos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {casosVisibles.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white rounded-xl border border-dashed border-gray-300 text-gray-500">
            No hay casos comunitarios para mostrar en este momento.
          </div>
        ) : (
          casosVisibles.map(caso => (
            <div key={caso.id} className={`bg-white rounded-xl p-5 shadow-sm border ${caso.esEscalado ? 'border-amber-300 bg-amber-50/10' : 'border-gray-200'} flex flex-col`}>
              
              <div className="flex justify-between items-start mb-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${obtenerColorEstado(caso.estado)}`}>
                  {caso.estado}
                </span>
                
                {caso.esEscalado && (
                  <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded flex-shrink-0">
                    <ShieldAlert size={12} />
                    ESCALADO
                  </span>
                )}
              </div>

              <h3 className="font-bold text-gray-900 text-lg leading-tight">{caso.titulo}</h3>
              <p className="text-sm text-gray-600 mt-2 flex-1 line-clamp-3">{caso.descripcion}</p>

              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-1.5">
                <p><strong>Reportado por:</strong> {caso.reportadoPorNombre}</p>
                <p><strong>Fecha:</strong> {caso.fechaReporte}</p>
                <p><strong>Categoría:</strong> {caso.categoria}</p>
              </div>

              {caso.esEscalado && caso.motivoEscalacion && (
                <div className="mt-3 p-2 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-800">
                  <strong className="block mb-0.5">Motivo de escalación:</strong>
                  <span className="italic">"{caso.motivoEscalacion}"</span>
                </div>
              )}

              {/* Botonera de Acciones */}
              <div className="mt-4 pt-4 flex gap-2 justify-between items-center border-t border-gray-100">
                
                {/* Botón de Chat (Visible para todos) */}
                <button 
                  onClick={() => setCasoParaChat(caso)}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <MessageSquare size={14} />
                  Chat
                  {caso.mensajes && caso.mensajes.length > 0 && (
                    <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      {caso.mensajes.length}
                    </span>
                  )}
                </button>

                <div className="flex gap-2">
                  {usuarioActual.rol === 'VOCERO' && caso.estado !== 'RESUELTO' && !caso.esEscalado && (
                    <>
                      <button 
                        onClick={() => actualizarEstadoCaso(caso.id, 'EN_PROCESO')}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors"
                      >
                        En Proceso
                      </button>
                      <button 
                        onClick={() => setCasoAEscalar(caso)}
                        className="px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <ArrowUpRight size={14} />
                        Escalar
                      </button>
                    </>
                  )}

                  {usuarioActual.rol === 'SUPER_ADMIN' && caso.estado !== 'RESUELTO' && (
                    <button 
                      onClick={() => {
                        if(window.confirm('¿Marcar este caso como Resuelto?')) {
                          actualizarEstadoCaso(caso.id, 'RESUELTO');
                        }
                      }}
                      className="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <CheckCircle size={14} />
                      Resolver
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* MODALES Y PANELES (Renderizados fuera del map de casos) */}
      
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
        caso={casos.find(c => c.id === casoParaChat?.id) || null}
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