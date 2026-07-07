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
  if (!isOpen) return null;

  // Diccionario de colores según la variante
  const clasesBoton = {
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white',
    info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-lg font-bold text-gray-900">{titulo}</h3>
        <p className="mt-2 text-sm text-gray-500">{mensaje}</p>
        
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${clasesBoton[variante]}`}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  ); 
}