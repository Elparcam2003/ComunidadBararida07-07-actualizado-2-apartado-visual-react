import { useState } from 'react';
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex justify-center items-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 flex flex-col">
        
        {/* Cabecera */}
        <div className="flex justify-between items-center px-5 py-4 border-b bg-red-50/50">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle size={20} />
            <h3 className="font-bold text-base">Rechazar Registro Familiar</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-600">
            Estás a punto de rechazar el censo de <span className="font-semibold text-gray-950">{nombreJefe}</span>. 
            Por favor, indica el motivo específico para que el residente sepa qué debe corregir.
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Motivo del Rechazo:
            </label>
            <textarea
              value={motivo}
              onChange={(e) => {
                setMotivo(e.target.value);
                if (e.target.value.trim()) setError(false);
              }}
              placeholder="Ej: La foto de la cédula no es legible o el número de apartamento no coincide con el bloque..."
              className={`w-full h-28 border rounded-lg p-3 text-sm bg-gray-50/50 focus:bg-white focus:ring-2 transition-all resize-none outline-hidden ${
                error 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/10' 
                  : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
            />
            {error && (
              <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                ⚠️ El motivo de rechazo es obligatorio para notificar al usuario.
              </p>
            )}
          </div>
        </div>

        {/* Footer de Acciones */}
        <div className="px-5 py-3.5 bg-gray-50 border-t flex justify-end gap-2 text-sm">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={manejarConfirmacion}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-xs transition-colors"
          >
            Confirmar Rechazo
          </button>
        </div>

      </div>
    </div>
  );
}