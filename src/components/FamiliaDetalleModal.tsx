import { useState } from 'react';
import { X, Printer, Calendar, User, Fingerprint, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { Familia } from '../types';
import { RechazarModal } from './RechazarModal';   // 🟢 Importamos tu nuevo modal de motivos

interface Props {
  familia: Familia | null;
  onClose: () => void;
  aprobarFamilia?: (id: string, estado: Familia['estado'], motivo?: string) => void;
  esAdministrador?: boolean;
}

export function FamiliaDetalleModal({
  familia,
  onClose,
  aprobarFamilia, // 🟢 Lo añadimos a la desestructuración para poder usarlo
  esAdministrador = false,
}: Props) {
  // 🟢 Estado para controlar el modal con el formulario de rechazo
  const [modalRechazoAbierto, setModalRechazoAbierto] = useState(false);
  
  if (!familia) return null;

  console.log("🔍 DIAGNÓSTICO MODAL -> esAdministrador:", esAdministrador, " | rolActual:", (familia as any).usuarioActual?.rol);
  
  const fechaRegistro = (familia as any).fechaRegistro || 'No especificada';
  const fechaAccion = (familia as any).fechaAccion || null;
  const nombreUsuarioEmisor = (familia as any).nombreUsuarioEmisor || `ID Usuario: ${familia.usuarioId}`;

  const obtenerBadgeEstado = (estado: Familia['estado']) => {
    switch (estado) {
      case 'APROBADA':
        return {
          bg: 'bg-green-50 border-green-200 text-green-700',
          icon: <CheckCircle size={16} className="text-green-600" />
        };
      case 'RECHAZADA':
        return {
          bg: 'bg-red-50 border-red-200 text-red-700',
          icon: <XCircle size={16} className="text-red-600" />
        };
      default:
        return {
          bg: 'bg-yellow-50 border-yellow-200 text-yellow-700',
          icon: <AlertCircle size={16} className="text-yellow-600" />
        };
    }
  };

  const badge = obtenerBadgeEstado(familia.estado || 'PENDIENTE');

  const manejarImpresion = () => {
    window.print();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex justify-center items-center z-50 p-4 animate-fadeIn">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto flex flex-col border">
          
          {/* --- CABECERA --- */}
          <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50/50 sticky top-0 bg-white z-10">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">Expediente Socio Comunitario</h2>
                <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.bg}`}>
                  {badge.icon}
                  {familia.estado || 'PENDIENTE'}
                </span>
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 font-mono">
                <Fingerprint size={12} /> ID CENSO: {familia.id}
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors print:hidden"
            >
              <X size={22} />
            </button>
          </div>

          {/* --- CUERPO DEL EXPEDIENTE --- */}
          <div className="p-6 space-y-6 flex-1 print:p-0">
            
            {/* BARRA DE METADATOS Y AUDITORÍA */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-100 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-gray-400" />
                <div>
                  <span className="block font-semibold text-gray-500">Fecha de Registro:</span>
                  <span className="font-medium text-gray-800">{fechaRegistro}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User size={14} className="text-gray-400" />
                <div>
                  <span className="block font-semibold text-gray-500">Enviado Por:</span>
                  <span className="font-medium text-gray-800 truncate block max-w-[180px]">{nombreUsuarioEmisor}</span>
                </div>
              </div>
              {fechaAccion && (
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-gray-400" />
                  <div>
                    <span className="block font-semibold text-gray-500">Fecha de Evaluación:</span>
                    <span className="font-medium text-gray-800">{fechaAccion}</span>
                  </div>
                </div>
              )}
            </div>

            {/* DATOS DE LA VIVIENDA Y JEFE DE FAMILIA */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3 border-b pb-1">
                Datos de Ubicación y Titularidad
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white border p-4 rounded-xl shadow-xs">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block">Jefe de Familia</label>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{familia.jefeFamilia}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block">Cédula de Identidad</label>
                  <p className="text-sm font-medium text-gray-800 mt-0.5">{familia.cedulaJefe}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block">Teléfono de Contacto</label>
                  <p className="text-sm text-gray-800 mt-0.5">{familia.telefono || 'No posee'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block">Correo Electrónico</label>
                  <p className="text-sm text-gray-800 mt-0.5 truncate">{familia.correo || 'No posee'}</p>
                </div>
                <div className="pt-2">
                  <label className="text-xs font-semibold text-gray-500 block">Bloque</label>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{familia.bloque}</p>
                </div>
                <div className="pt-2">
                  <label className="text-xs font-semibold text-gray-500 block">Torre</label>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{familia.torre || 'N/A'}</p>
                </div>
                <div className="pt-2">
                  <label className="text-xs font-semibold text-gray-500 block">Apartamento</label>
                  <p className="text-sm font-bold text-indigo-600 mt-0.5">{familia.apartamento}</p>
                </div>
              </div>
            </div>

            {/* LISTADO DE INTEGRANTES */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3 border-b pb-1">
                Carga Familiar Registrada ({familia.integrantes.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {familia.integrantes.map(integrante => (
                  <div key={integrante.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 shadow-xs">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-gray-900 text-sm">{integrante.nombre}</h4>
                      <span className="text-[10px] uppercase font-extrabold bg-gray-200 px-2 py-0.5 rounded text-gray-600">
                        {integrante.parentesco}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-gray-600">
                      <p><strong>Cédula:</strong> {integrante.cedula}</p>
                      <p><strong>Sexo:</strong> {integrante.sexo}</p>
                      <p className="col-span-2"><strong>Fecha Nacimiento:</strong> {integrante.fechaNacimiento || 'No registrada'}</p>
                    </div>

                    {integrante.poseeDiscapacidad && (
                      <div className="mt-2 text-xs bg-red-50 border border-red-100 p-2 rounded-lg text-red-700">
                        <span className="font-bold block">♿ Discapacidad ({integrante.tipoDiscapacidad}):</span>
                        <p className="text-gray-600 italic mt-0.5">{integrante.descripcionDiscapacidad || 'Sin descripción adicional'}</p>
                      </div>
                    )}

                    {integrante.poseeEnfermedad && (
                      <div className="mt-2 text-xs bg-orange-50 border border-orange-100 p-2 rounded-lg text-orange-700">
                        <span className="font-bold block">⚕️ Condición Médica / Enfermedad:</span>
                        <p className="text-gray-600 italic mt-0.5">{integrante.descripcionEnfermedad}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* BLOQUE DE CONTROL Y AUDITORÍA */}
              {familia.revisadoPor && (
                <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 border-b border-slate-200 pb-1">
                    Información de Control y Revisión
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700">
                    <div>
                      <span className="block text-slate-500 font-medium">Estado del Expediente:</span>
                      <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                        familia.estado === 'APROBADA' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {familia.estado}
                      </span>
                    </div>
          
                    <div>
                      <span className="block text-slate-500 font-medium">Evaluado por:</span>
                      <p className="font-semibold text-slate-900 mt-1">{familia.revisadoPor}</p>
                    </div>

                    <div>
                      <span className="block text-slate-500 font-medium">Fecha y Hora de Dictamen:</span>
                      <p className="font-medium text-slate-800 mt-1">
                        {familia.fechaRevision ? new Date(familia.fechaRevision).toLocaleString() : '-'}
                      </p>
                    </div>
                  </div>

                  {/* 🟢 Si fue rechazada, mostramos el motivo detallado abajo */}
                  {familia.estado === 'RECHAZADA' && (familia as any).motivoRechazo && (
                    <div className="mt-3.5 border-t border-slate-200 pt-3 text-xs text-red-800">
                      <strong>Motivo de la desaprobación:</strong>
                      <p className="mt-1 bg-red-50/50 border border-red-100 rounded-lg p-2.5 text-gray-700 italic">
                        "{(familia as any).motivoRechazo}"
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* --- BARRA DE ACCIONES (FOOTER FIXED) 🟢 --- */}
          <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center sticky bottom-0 z-10 print:hidden">
            
            {esAdministrador ? (
              <button 
                onClick={manejarImpresion}
                className="flex items-center gap-2 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-xs"
              >
                <Printer size={16} />
                Imprimir Expediente
              </button>
            ) : (
              <div />
            )}

          {/* BOTONES DE DECISIÓN ADMINISTRATIVA */}
          {esAdministrador && aprobarFamilia && (
            <div className="flex gap-2">
              {/* Solo muestra "Aprobar" si está PENDIENTE o RECHAZADA */}
              {familia.estado !== 'APROBADA' && (
                <button
                  onClick={() => {
                    if (window.confirm(`¿Re-evaluar y APROBAR el censo de ${familia.jefeFamilia}?`)) {
                      aprobarFamilia(familia.id, 'APROBADA');
                      onClose();
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-xs transition-colors"
                >
                  {familia.estado === 'RECHAZADA' ? 'Corregir y Aprobar' : 'Aprobar Censo'}
                </button>
              )}

              {/* Solo muestra "Rechazar" si está PENDIENTE o APROBADA */}
              {familia.estado !== 'RECHAZADA' && (
                <button
                  onClick={() => setModalRechazoAbierto(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-xs transition-colors"
                >
                  {familia.estado === 'APROBADA' ? 'Revertir y Rechazar' : 'Rechazar'}
                </button>
              )}
            </div>
          )}

          {familia.estado === 'APROBADA' && esAdministrador && (
            <button
              onClick={() => {
                if (window.confirm('¿Está seguro de dar de baja este censo? Se marcará como Inactivo (histórico).')) {
                  aprobarFamilia?.(familia.id, 'INACTIVO');
                  onClose();
                }
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Dar de Baja
            </button>
          )}
          
          </div>
        </div>
      </div>

      {/* 🟢 RENDERIZADO DEL SUB-MODAL DE RECHAZO (En tu FamiliaDetalleModal) */}
      <RechazarModal
        isOpen={modalRechazoAbierto}
        onClose={() => setModalRechazoAbierto(false)}
        nombreJefe={familia.jefeFamilia}
        
        // 💡 El cambio va exactamente aquí:
        onConfirm={(motivo) => {
          if (aprobarFamilia) {
            // Ahora sí le pasas el texto capturado como tercer parámetro
            aprobarFamilia(familia.id, 'RECHAZADA', motivo);
          }
          setModalRechazoAbierto(false);
          onClose(); 
        }}
      />
    </>
  );
}