import type { Familia } from '../types';

interface Props {
  estado: Familia['estado'];
}

export function EstadoFamiliaBadge({ estado }: Props) {
  const estilos = {
    PENDIENTE: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    APROBADA: 'bg-green-100 text-green-800 border-green-300',
    RECHAZADA: 'bg-red-100 text-red-800 border-red-300',
    INACTIVO: 'bg-slate-100 text-slate-600 border-slate-300'
  };

  const texto = {
    PENDIENTE: '⏳ Pendiente',
    APROBADA: '✅ Aprobada',
    RECHAZADA: '❌ Rechazada',
    INACTIVO: '❌ Inactivo'
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold border ${estilos[estado]}`}
    >
      {texto[estado]}
    </span>
  );
}