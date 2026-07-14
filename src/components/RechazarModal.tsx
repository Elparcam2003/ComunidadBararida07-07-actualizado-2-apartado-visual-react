import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // ✨ 1. Importamos el Portal
import { X, AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (motivo: string) => void;
  nombreJefe: string;
}

export function RechazarModal({ isOpen, onClose, onConfirm, nombreJefe }: Props) {
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState(false);

  // ✨ 2. Bloqueamos el scroll del fondo cuando se abre
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const manejarConfirmacion = () => {
    if (!motivo.trim()) {
      setError(true);
      return;
    }
    setError(false);
    onConfirm(motivo);
    setMotivo(''); // Limpiar el estado
  };

  // ✨ 3. Envolvemos el retorno en createPortal
  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4 animate-fadeIn">
      
      {/* Tarjeta del modal con bordes más redondeados (rounded-3xl) para el toque premium */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 flex flex-col">
        
        {/* Cabecera */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-rose-100 bg-rose-50/50">
          <div className="flex items-center gap-2 text-rose-700">
            <AlertTriangle size={20} />
            <h3 className="font-black text-base tracking-tight">Rechazar Registro Familiar</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-rose-100 rounded-full transition-colors active:scale-95"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            Estás a punto de rechazar el censo de <span className="font-black text-slate-900">{nombreJefe}</span>. 
            Por favor, indica el motivo específico para que el residente sepa qué debe corregir.
          </p>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Motivo del Rechazo
            </label>
            <textarea
              value={motivo}
              onChange={(e) => {
                setMotivo(e.target.value);
                if (e.target.value.trim()) setError(false);
              }}
              placeholder="Ej: La foto de la cédula no es legible o el número de apartamento no coincide..."
              className={`w-full h-28 border rounded-xl p-3 text-sm bg-slate-50 focus:bg-white focus:ring-2 transition-all resize-none outline-none ${
                error 
                  ? 'border-rose-300 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/30' 
                  : 'border-slate-300 focus:ring-rose-500 focus:border-rose-500'
              }`}
            />
            {error && (
              <p className="text-xs text-rose-600 font-bold flex items-center gap-1 mt-1">
                <AlertTriangle size={14} /> El motivo de rechazo es obligatorio.
              </p>
            )}
          </div>
        </div>

        {/* Footer de Acciones */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 text-sm">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition-all active:scale-95 shadow-sm"
          >
            Cancelar
          </button>
          <button
            onClick={manejarConfirmacion}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md shadow-rose-600/20 transition-all active:scale-95"
          >
            Confirmar Rechazo
          </button>
        </div>

      </div>
    </div>,
    document.body // ✨ Lo mandamos al fondo del HTML 
  );
}