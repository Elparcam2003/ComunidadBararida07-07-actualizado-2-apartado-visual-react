import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  XCircle, 
  Eye, 
  CheckCircle, 
  FileSignature, 
  Users, 
  MapPin, 
  Calendar,
  Inbox
} from 'lucide-react';
import { FamiliaDetalleModal } from '../components/FamiliaDetalleModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { RechazarModal } from '../components/RechazarModal'; 

export function SolicitudesCensoPage() {
  const { familias, aprobarFamilia } = useApp(); 

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
  
  const familiaParaEvaluar = familias.find(f => f.id === modalConfig.familiaId);

  const handleCambiarEstado = (id: string, estado: 'APROBADA' | 'RECHAZADA') => {
    setModalConfig({
      isOpen: true,
      tipo: estado,
      familiaId: id,
    });
  };

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-[1400px] mx-auto animate-fadeIn">
      
      {/* HEADER DE LA PÁGINA */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
              <FileSignature size={24} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Solicitudes de Censo</h1>
          </div>
          <p className="text-sm text-slate-500 mt-2 ml-14">
            Revisión y aprobación de nuevos ingresos al sistema comunitario.
          </p>
        </div>
        
        {/* Contador de Pendientes */}
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl text-amber-700 font-bold text-sm shadow-sm">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          {pendientes.length} {pendientes.length === 1 ? 'Solicitud en cola' : 'Solicitudes en cola'}
        </div>
      </div>

      {/* ESTADO VACÍO (Bandeja limpia) */}
      {pendientes.length === 0 && (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl py-20 flex flex-col items-center justify-center text-center mt-8">
          <div className="bg-white p-5 rounded-full shadow-sm border border-slate-100 mb-4 text-slate-300">
            <Inbox size={48} strokeWidth={1.5} />
          </div>
          <h3 className="text-slate-900 font-bold text-lg">Bandeja al día</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-sm">
            No hay solicitudes de censo pendientes por revisar. Excelente trabajo.
          </p>
        </div>
      )}

      {/* GRID DE SOLICITUDES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {pendientes.map(familia => (
          <div key={familia.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
            
            {/* Cabecera Tarjeta */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                  Jefe de Familia
                </span>
                <h2 className="font-bold text-lg text-slate-900 leading-tight">{familia.jefeFamilia}</h2>
                <p className="text-indigo-600 font-bold text-xs mt-0.5">CI: {familia.cedulaJefe}</p>
              </div>
              
              <span className="flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-200">
                Pendiente
              </span>
            </div>

            {/* Detalles Rápidos (Caja Gris) */}
            <div className="bg-slate-50 rounded-xl p-3.5 mb-5 flex-1 space-y-2.5 border border-slate-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <MapPin size={14} className="text-slate-400 shrink-0" />
                <span className="truncate">
                  {familia.torre && `T-${familia.torre} · `} 
                  B-${familia.bloque} · Apto {familia.apartamento}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <Users size={14} className="text-slate-400 shrink-0" />
                <span>{familia.integrantes.length} Integrantes registrados</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <Calendar size={14} className="text-slate-400 shrink-0" />
                <span>Registrado: {new Date(familia.fechaRegistro).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Acciones (Botones) */}
            <div className="flex gap-2">
              <button
                onClick={() => setFamiliaDetalle(familia.id)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-colors shadow-sm"
                title="Inspeccionar detalles"
              >
                <Eye size={16} />
                Detalles
              </button>

              <button
                onClick={() => handleCambiarEstado(familia.id, 'APROBADA')}
                className="flex-[1.2] bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-500 hover:text-white py-2 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all shadow-sm"
              >
                <CheckCircle size={16} />
                Aprobar
              </button>

              <button
                onClick={() => handleCambiarEstado(familia.id, 'RECHAZADA')}
                className="flex-[1.2] bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-500 hover:text-white py-2 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all shadow-sm"
              >
                <XCircle size={16} />
                Rechazar
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* ================================================== */}
      {/* MODALES (Mantenidos intactos de tu lógica original) */}
      {/* ================================================== */}

      <FamiliaDetalleModal
        familia={familiaSeleccionada ?? null}
        onClose={() => setFamiliaDetalle(null)}
        esAdministrador={true}
        aprobarFamilia={aprobarFamilia}
      />

      <ConfirmModal
        isOpen={modalConfig.isOpen && modalConfig.tipo === 'APROBADA'}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        titulo="¿Aprobar solicitud?"
        mensaje="Esta acción registrará a la familia en el sistema de manera activa."
        textoConfirmar="Sí, Aprobar"
        variante="success" 
        onConfirm={() => {
          if (aprobarFamilia) {
              aprobarFamilia(modalConfig.familiaId, 'APROBADA'); 
          } 
          setModalConfig({ ...modalConfig, isOpen: false });
        }}
      />

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