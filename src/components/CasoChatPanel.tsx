import { useState, useRef, useEffect } from 'react';
import { X, Send, User } from 'lucide-react';
import type { Caso } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  caso: Caso | null;
  usuarioActualId: string;
  onEnviarMensaje: (texto: string) => void;
}

export function CasoChatPanel({ isOpen, onClose, caso, usuarioActualId, onEnviarMensaje }: Props) {
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const finalDelChatRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al final cuando se abre el panel o hay un nuevo mensaje
  useEffect(() => {
    if (isOpen) {
      finalDelChatRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, caso?.mensajes]);

  if (!isOpen || !caso) return null;

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevoMensaje.trim()) {
      onEnviarMensaje(nuevoMensaje.trim());
      setNuevoMensaje('');
    }
  };

  return (
    <>
      {/* Fondo oscuro semi-transparente */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Panel Lateral */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
        
        {/* Cabecera del Panel */}
        <div className="px-5 py-4 border-b bg-slate-50 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-900 leading-tight">Chat del Caso</h3>
            <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[280px]">{caso.titulo}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Área de Mensajes */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50">
          {!caso.mensajes || caso.mensajes.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
              <User size={40} className="opacity-20" />
              <p className="text-sm">No hay mensajes aún. ¡Escribe el primero!</p>
            </div>
          ) : (
            caso.mensajes.map((msg) => {
              const esMio = msg.autorId === usuarioActualId;
              return (
                <div key={msg.id} className={`flex flex-col ${esMio ? 'items-end' : 'items-start'}`}>
                  {/* Nombre y Rol encima de la burbuja */}
                  <div className="flex items-baseline gap-2 mb-1 px-1">
                    <span className="text-[10px] font-bold text-gray-500">{msg.autorNombre}</span>
                    <span className="text-[9px] uppercase text-indigo-400">{msg.autorRol.replace('_', ' ')}</span>
                  </div>
                  
                  {/* Burbuja del mensaje */}
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                    esMio 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                  }`}>
                    {msg.texto}
                  </div>
                  
                  {/* Fecha/Hora */}
                  <span className="text-[9px] text-gray-400 mt-1 px-1">{msg.fecha}</span>
                </div>
              );
            })
          )}
          <div ref={finalDelChatRef} />
        </div>

        {/* Footer: Input para escribir */}
        <div className="p-4 bg-white border-t">
          <form onSubmit={manejarEnvio} className="flex items-center gap-2">
            <input
              type="text"
              value={nuevoMensaje}
              onChange={(e) => setNuevoMensaje(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-full px-4 py-2.5 text-sm transition-all outline-none"
            />
            <button
              type="submit"
              disabled={!nuevoMensaje.trim()}
              className="p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shadow-sm"
            >
              <Send size={18} className="translate-x-[-1px] translate-y-[1px]" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}