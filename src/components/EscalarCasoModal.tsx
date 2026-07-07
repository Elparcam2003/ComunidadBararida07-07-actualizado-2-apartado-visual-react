import { useState } from 'react';
import { X, ArrowUpRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (motivo: string) => void;
  tituloCaso: string;
}

export function EscalarCasoModal({ isOpen, onClose, onConfirm, tituloCaso }: Props) {
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
    setMotivo(''); // Limpiar el estado tras confirmar
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex justify-center items-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 flex flex-col">
        
        {/* Cabecera */}
        <div className="flex justify-between items-center px-5 py-4 border-b bg-amber-50/50">
          <div className="flex items-center gap-2 text-amber-700">
            <ArrowUpRight size={20} className="stroke-[2.5]" />
            <h3 className="font-bold text-base">Escalar Caso a Super Admin</h3>
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
            Estás a punto de escalar el caso <span className="font-semibold text-gray-950">"{tituloCaso}"</span>. 
            Este caso pasará a la bandeja del Administrador Principal con prioridad ALTA.
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Motivo de la Escalación:
            </label>
            <textarea
              value={motivo}
              onChange={(e) => {
                setMotivo(e.target.value);
                if (e.target.value.trim()) setError(false);
              }}
              placeholder="Ej: Requiere aprobación de presupuesto mayor, excede mis competencias..."
              className={`w-full h-28 border rounded-lg p-3 text-sm bg-gray-50/50 focus:bg-white focus:ring-2 transition-all resize-none outline-none ${
                error 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/10' 
                  : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
              }`}
            />
            {error && (
              <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                ⚠️ Debes justificar por qué estás escalando este caso.
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
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2"
          >
            Confirmar Escalación
          </button>
        </div>

      </div>
    </div>
  );
}