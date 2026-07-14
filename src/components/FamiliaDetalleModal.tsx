import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; 
import { X, Printer, Calendar, User, Fingerprint, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { Familia } from '../types';
import { RechazarModal } from './RechazarModal'; 

interface Props {
  familia: Familia | null;
  onClose: () => void;
  aprobarFamilia?: (id: string, estado: Familia['estado'], motivo?: string) => void;
  esAdministrador?: boolean;
}

export function FamiliaDetalleModal({
  familia,
  onClose,
  aprobarFamilia,
  esAdministrador = false,
}: Props) {
  const [modalRechazoAbierto, setModalRechazoAbierto] = useState(false);
  
  useEffect(() => {
    if (familia) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [familia]);

  if (!familia) return null;

  const fechaRegistro = (familia as any).fechaRegistro || 'No especificada';
  const fechaAccion = (familia as any).fechaAccion || null;
  const nombreUsuarioEmisor = (familia as any).nombreUsuarioEmisor || `ID Usuario: ${familia.usuarioId}`;

  const obtenerBadgeEstado = (estado: Familia['estado']) => {
    switch (estado) {
      case 'APROBADA': return { bg: 'bg-emerald-50 border-emerald-200 text-emerald-700', icon: <CheckCircle size={16} className="text-emerald-600" /> };
      case 'RECHAZADA': return { bg: 'bg-rose-50 border-rose-200 text-rose-700', icon: <XCircle size={16} className="text-rose-600" /> };
      default: return { bg: 'bg-amber-50 border-amber-200 text-amber-700', icon: <AlertCircle size={16} className="text-amber-600" /> };
    }
  };

  const badge = obtenerBadgeEstado(familia.estado || 'PENDIENTE');

  // ✨ AQUÍ ESTÁ LA FUNCIÓN QUE FALTABA
  const manejarImpresion = () => {
    window.print();
  };

  return createPortal(
    <>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[9999] p-4 animate-fadeIn">
        
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col border border-slate-200 overflow-hidden relative">
          
          {/* --- CABECERA FIJA --- */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-white z-10 shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-800">Expediente Socio Comunitario</h2>
                <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black tracking-widest border ${badge.bg}`}>
                  {badge.icon}
                  {familia.estado || 'PENDIENTE'}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-mono font-medium">
                <Fingerprint size={12} /> ID CENSO: {familia.id}
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-rose-600 p-2 hover:bg-rose-50 rounded-full transition-colors active:scale-95 print:hidden"
            >
              <X size={24} />
            </button>
          </div>

          {/* --- CUERPO DEL EXPEDIENTE (SCROLL INTERNO) --- */}
          <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar print:p-0 print:overflow-visible">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-indigo-400" />
                <div>
                  <span className="block font-bold text-slate-400 uppercase tracking-wider text-[10px]">Fecha de Registro</span>
                  <span className="font-bold text-slate-800 mt-0.5 block">{fechaRegistro}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User size={16} className="text-indigo-400" />
                <div>
                  <span className="block font-bold text-slate-400 uppercase tracking-wider text-[10px]">Enviado Por</span>
                  <span className="font-bold text-slate-800 truncate block max-w-[180px] mt-0.5">{nombreUsuarioEmisor}</span>
                </div>
              </div>
              {fechaAccion && (
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-indigo-400" />
                  <div>
                    <span className="block font-bold text-slate-400 uppercase tracking-wider text-[10px]">Fecha de Evaluación</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">{fechaAccion}</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-100 pb-2">
                Datos de Ubicación y Titularidad
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <div><label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Jefe de Familia</label><p className="text-sm font-black text-slate-800 mt-1">{familia.jefeFamilia}</p></div>
                <div><label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Cédula de Identidad</label><p className="text-sm font-bold text-slate-700 mt-1">{familia.cedulaJefe}</p></div>
                <div><label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Teléfono de Contacto</label><p className="text-sm font-medium text-slate-700 mt-1">{familia.telefono || 'No posee'}</p></div>
                <div><label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Correo Electrónico</label><p className="text-sm font-medium text-slate-700 mt-1 truncate">{familia.correo || 'No posee'}</p></div>
                <div className="pt-2"><label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Bloque</label><p className="text-sm font-black text-slate-800 mt-1">{familia.bloque}</p></div>
                <div className="pt-2"><label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Torre</label><p className="text-sm font-black text-slate-800 mt-1">{familia.torre || 'N/A'}</p></div>
                <div className="pt-2"><label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Apartamento</label><p className="text-sm font-black text-indigo-600 mt-1">{familia.apartamento}</p></div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-100 pb-2">
                Carga Familiar Registrada ({familia.integrantes.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {familia.integrantes.map(integrante => (
                  <div key={integrante.id} className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-black text-slate-800 text-sm">{integrante.nombre}</h4>
                      <span className="text-[9px] uppercase font-black tracking-widest bg-slate-100 px-2 py-1 rounded-md text-slate-500 border border-slate-200">
                        {integrante.parentesco}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p><strong className="text-slate-400 uppercase tracking-wider text-[9px] block mb-0.5">Cédula</strong> <span className="font-bold text-slate-700">{integrante.cedula}</span></p>
                      <p><strong className="text-slate-400 uppercase tracking-wider text-[9px] block mb-0.5">Sexo</strong> <span className="font-bold text-slate-700">{integrante.sexo}</span></p>
                      <p className="col-span-2"><strong className="text-slate-400 uppercase tracking-wider text-[9px] block mb-0.5">Fecha Nacimiento</strong> <span className="font-bold text-slate-700">{integrante.fechaNacimiento || 'No registrada'}</span></p>
                    </div>

                    {integrante.poseeDiscapacidad && (
                      <div className="mt-3 text-xs bg-rose-50/50 border border-rose-100 p-3 rounded-xl text-rose-700">
                        <span className="font-black block uppercase tracking-wider text-[10px] mb-1">♿ Discapacidad ({integrante.tipoDiscapacidad})</span>
                        <p className="text-rose-600 font-medium leading-relaxed">{integrante.descripcionDiscapacidad}</p>
                      </div>
                    )}

                    {integrante.poseeEnfermedad && (
                      <div className="mt-3 text-xs bg-amber-50/50 border border-amber-100 p-3 rounded-xl text-amber-700">
                        <span className="font-black block uppercase tracking-wider text-[10px] mb-1">⚕️ Condición Médica</span>
                        <p className="text-amber-600 font-medium leading-relaxed">{integrante.descripcionEnfermedad}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* BLOQUE DE CONTROL Y AUDITORÍA */}
              {familia.revisadoPor && (
                <div className="mt-8 bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-200 pb-2">Información de Revisión</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs text-slate-700">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Estado</span>
                      <span className={`inline-block px-3 py-1 rounded-md font-black tracking-widest text-[10px] uppercase border ${familia.estado === 'APROBADA' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-rose-100 text-rose-700 border-rose-200'}`}>
                        {familia.estado}
                      </span>
                    </div>
                    <div><span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Evaluado por</span><p className="font-black text-slate-800">{familia.revisadoPor}</p></div>
                    <div><span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Fecha de Dictamen</span><p className="font-bold text-slate-700">{familia.fechaRevision ? new Date(familia.fechaRevision).toLocaleString() : '-'}</p></div>
                  </div>
                  {familia.estado === 'RECHAZADA' && (familia as any).motivoRechazo && (
                    <div className="mt-5 border-t border-slate-200 pt-4 text-sm text-rose-800">
                      <strong className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-2 block">Motivo de la desaprobación</strong>
                      <p className="bg-white border border-rose-100 rounded-xl p-4 text-slate-700 font-medium shadow-sm">"{(familia as any).motivoRechazo}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* --- BARRA DE ACCIONES (FOOTER FIJO) --- */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center z-10 shrink-0 print:hidden">
            {esAdministrador ? (
              <button onClick={manejarImpresion} className="flex items-center gap-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
                <Printer size={18} className="text-slate-500" /> Imprimir Expediente
              </button>
            ) : <div />}

            {esAdministrador && aprobarFamilia && (
              <div className="flex gap-3">
                {familia.estado !== 'RECHAZADA' && (
                  <button onClick={() => setModalRechazoAbierto(true)} className="bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95">
                    {familia.estado === 'APROBADA' ? 'Revertir y Rechazar' : 'Rechazar'}
                  </button>
                )}
                {familia.estado !== 'APROBADA' && (
                  <button onClick={() => { if (window.confirm(`¿Re-evaluar y APROBAR el censo de ${familia.jefeFamilia}?`)) { aprobarFamilia(familia.id, 'APROBADA'); onClose(); } }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-indigo-600/20 transition-all active:scale-95">
                    {familia.estado === 'RECHAZADA' ? 'Corregir y Aprobar' : 'Aprobar Censo'}
                  </button>
                )}
              </div>
            )}

            {familia.estado === 'APROBADA' && esAdministrador && (
              <button onClick={() => { if (window.confirm('¿Está seguro de dar de baja este censo?')) { aprobarFamilia?.(familia.id, 'INACTIVO'); onClose(); } }} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold transition-colors active:scale-95">
                Dar de Baja
              </button>
            )}
          </div>
        </div>
      </div>

      <RechazarModal
        isOpen={modalRechazoAbierto}
        onClose={() => setModalRechazoAbierto(false)}
        nombreJefe={familia.jefeFamilia}
        onConfirm={(motivo) => {
          if (aprobarFamilia) { aprobarFamilia(familia.id, 'RECHAZADA', motivo); }
          setModalRechazoAbierto(false);
          onClose(); 
        }}
      />
    </>,
    document.body 
  );
} 