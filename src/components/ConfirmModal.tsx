import { useEffect } from 'react';
import { createPortal } from 'react-dom'; // ✨ 1. Importamos el Portal

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  titulo: string;
  mensaje: string;
  textoConfirmar?: string; // Por si quieres que diga "Sí, Aprobar", "Sí, Eliminar", etc.
  variante?: 'success' | 'danger' | 'info'; // Para cambiar el color del botón
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  titulo,
  mensaje,
  textoConfirmar = 'Confirmar',
  variante = 'info'
}: Props) {

  // ✨ 2. Bloqueamos el scroll del fondo
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  // ✨ 3. Diccionario de colores actualizado al diseño Premium
  const clasesBoton = {
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20',
    info: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20'
  };

  // ✨ 4. Envolvemos todo en el Portal
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      
      {/* Tarjeta Premium: rounded-3xl, shadow-2xl */}
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">{titulo}</h3>
        <p className="mt-3 text-sm text-slate-500 leading-relaxed">{mensaje}</p>
        
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${clasesBoton[variante]}`}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>

    </div>,
    document.body // ✨ Lo mandamos al fondo del HTML
  ); 
} 