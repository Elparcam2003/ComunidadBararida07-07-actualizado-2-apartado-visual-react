import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { XCircle, Eye } from 'lucide-react';
import { FamiliaDetalleModal } from '../components/FamiliaDetalleModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { RechazarModal } from '../components/RechazarModal'; // 🟢 Importamos el modal de rechazo con motivos

export function SolicitudesCensoPage() {
  const { familias, aprobarFamilia} = useApp(); // 🟢 Extraemos usuarioActual para la auditoría

  const [familiaDetalle, setFamiliaDetalle] = useState<string | null>(null);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    tipo: 'APROBADA' | 'RECHAZADA';
    familiaId: string; 
  }>({
    isOpen: false,
    tipo: 'APROBADA',
    familiaId: '', 
  });

  const pendientes = familias.filter(f => f.estado === 'PENDIENTE');
  const familiaSeleccionada = familias.find(f => f.id === familiaDetalle);
  
  // Obtenemos los datos de la familia que se está evaluando en los botones directos de la lista
  const familiaParaEvaluar = familias.find(f => f.id === modalConfig.familiaId);

  const handleCambiarEstado = (id: string, estado: 'APROBADA' | 'RECHAZADA') => {
    setModalConfig({
      isOpen: true,
      tipo: estado,
      familiaId: id,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Solicitudes de Censo</h1>
        <p className="text-gray-500">Familias pendientes por aprobación.</p>
      </div>

      {pendientes.length === 0 && (
        <div className="bg-white border rounded-xl p-6 text-center text-gray-500">
          No hay solicitudes pendientes.
        </div>
      )}

      {pendientes.map(familia => (
        <div key={familia.id} className="bg-white border rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-bold text-lg">{familia.jefeFamilia}</h2>
              <p className="text-sm text-gray-600">Cédula: {familia.cedulaJefe}</p>
              <p className="text-sm text-gray-600">
                Torre {familia.torre} · Bloque {familia.bloque} · Apt {familia.apartamento}
              </p>
              <p className="text-sm text-gray-600">Integrantes: {familia.integrantes.length}</p>
              <p className="text-sm text-gray-600">
                Registro: {new Date(familia.fechaRegistro).toLocaleDateString()}
              </p>
              <div className="mt-2">
                <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold">
                  Pendiente de revisión
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFamiliaDetalle(familia.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded flex items-center gap-2 text-sm font-medium transition-colors"
              >
                <Eye size={16} />
                Ver
              </button>

              <button
                onClick={() => handleCambiarEstado(familia.id, 'APROBADA')}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded flex items-center gap-2 text-sm font-medium transition-colors"
              >
                Aprobar
              </button>

              <button
                onClick={() => handleCambiarEstado(familia.id, 'RECHAZADA')}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded flex items-center gap-2 text-sm font-medium transition-colors"
              >
                <XCircle size={16} />
                Rechazar
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* MODAL DE DETALLES */}
      <FamiliaDetalleModal
        familia={familiaSeleccionada ?? null}
        onClose={() => setFamiliaDetalle(null)}
        esAdministrador={true} // 🟢 Le pasamos true para que use los botones internos también si se abre
        aprobarFamilia={aprobarFamilia}
      />

      {/* 🟢 MODAL DE CONFIRMACIÓN (SOLO PARA APROBACIONES) */}
      <ConfirmModal
        isOpen={modalConfig.isOpen && modalConfig.tipo === 'APROBADA'}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        titulo="¿Aprobar solicitud?"
        mensaje="Esta acción registrará a la familia en el sistema de manera activa."
        textoConfirmar="Sí, Aprobar"
        variante="success" // 🟢 Se vuelve verde automáticamente
        onConfirm={() => {
          if (aprobarFamilia) {
              aprobarFamilia(modalConfig.familiaId, 'APROBADA'); 
          } 
          setModalConfig({ ...modalConfig, isOpen: false });
        }}
      />

      {/* 🟢 NUEVO: SUB-MODAL DE MOTIVO DE RECHAZO (SOLO PARA RECHAZOS) */}
      <RechazarModal
        isOpen={modalConfig.isOpen && modalConfig.tipo === 'RECHAZADA'}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        nombreJefe={familiaParaEvaluar?.jefeFamilia || ''}
        onConfirm={() => {
          if (aprobarFamilia) {
            aprobarFamilia(modalConfig.familiaId, 'RECHAZADA');
          }
          setModalConfig({ ...modalConfig, isOpen: false });
        }}
      />
    </div>
  );
}