import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, X, AlertTriangle, CheckCircle, Clock, Trash2, ShieldAlert, Check } from 'lucide-react';
import type { IntegranteFamilia } from '../types';

export function CensoFamiliarPage() {
  const { 
    familias,
    agregarFamilia,
    reenviarSolicitudFamilia,
    usuarioActual,
  } = useApp();

  // --- CONTROL DE EDICIÓN AVANZADA ---
  const [editandoRechazado, setEditandoRechazado] = useState(false);
  const [integrantesEditables, setIntegrantesEditables] = useState<IntegranteFamilia[]>([]);
  if (!usuarioActual) return null;

  // --- DATOS FORMULARIO (JEFE / VIVIENDA) ---
  const [nombre, setNombre] = useState('');
  const [cedula, setCedula] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [torre, setTorre] = useState('');
  const [bloque, setBloque] = useState('');
  const [apartamento, setApartamento] = useState('');

  // --- DATOS CONTROL ADMIN ---
  const [idResidenteAsistido, setIdResidenteAsistido] = useState('');

  // --- CONTROL MODAL INTEGRANTES ---
  const [mostrarModalIntegrante, setMostrarModalIntegrante] = useState(false);
  const [nombreIntegrante, setNombreIntegrante] = useState('');
  const [cedulaIntegrante, setCedulaIntegrante] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [sexo, setSexo] = useState<'MASCULINO' | 'FEMENINO'>('MASCULINO');
  const [parentesco, setParentesco] = useState<IntegranteFamilia['parentesco']>('HIJO');
  
  // ♿ Discapacidad corregida y dinámica
  const [poseeDiscapacidad, setPoseeDiscapacidad] = useState(false);
  const [tipoDiscapacidad, setTipoDiscapacidad] = useState<IntegranteFamilia['tipoDiscapacidad']>('MOTORA');
  const [descripcionDiscapacidad, setDescripcionDiscapacidad] = useState('');
  
  // ⚕️ Enfermedades
  const [poseeEnfermedad, setPoseeEnfermedad] = useState(false);
  const [descripcionEnfermedad, setDescripcionEnfermedad] = useState('');

  // ================= VALIDACIONES =================

  // Solo letras, espacios y acentos
  const validarNombre = (nombre: string) => {
    return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,80}$/.test(nombre.trim());
  };

  // Solo números entre 6 y 10 dígitos (cédula venezolana)
  const validarCedula = (cedula: string) => {
    return /^[0-9]{6,10}$/.test(cedula);
  };

  // Teléfono venezolano (0412, 0414, 0424, etc.)
  const validarTelefono = (telefono: string) => {
    return /^04(12|14|16|24|26)[0-9]{7}$/.test(telefono);
  };

  // Correo electrónico
  const validarCorreo = (correo: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  };

  // --- 🔔 NUEVO SISTEMA DE TOASTS EMERGENTES (PREMIUM) ---
  const [toast, setToast] = useState<{ mostrar: boolean; mensaje: string; tipo: 'error' | 'exito' }>({
    mostrar: false,
    mensaje: '',
    tipo: 'exito'
  });

  const lanzarToast = (mensaje: string, tipo: 'error' | 'exito') => {
    setToast({ mostrar: true, mensaje, tipo });
    setTimeout(() => setToast(prev => ({ ...prev, mostrar: false })), 4000);
  };

  // --- BUSQUEDA DEL CENSO PROPIO ---
  const miFamilia = familias.find(f => f.usuarioId === usuarioActual.id);

  const estadoSolicitud = miFamilia?.estado;
  const estaPendiente = estadoSolicitud === 'PENDIENTE';
  const fueRechazada = estadoSolicitud === 'RECHAZADA';
  const fueAprobada = estadoSolicitud === 'APROBADA';

  // 🟢 ACTIVAR MODO EDICIÓN TOTAL
  const activarEdicionRechazado = () => {
    if (!miFamilia) return;
    setNombre(miFamilia.jefeFamilia);
    setCedula(miFamilia.cedulaJefe);
    setTelefono(miFamilia.telefono);
    setCorreo(miFamilia.correo);
    setTorre(miFamilia.torre);
    setBloque(miFamilia.bloque);
    setApartamento(miFamilia.apartamento);
    
    setIntegrantesEditables([...miFamilia.integrantes]);
    setEditandoRechazado(true);
  };

  // 🟢 MANEJAR EL AGREGAR INTEGRANTE
  const guardarIntegrante = () => {
    if (!validarNombre(nombreIntegrante)) {
    lanzarToast("Ingrese un nombre válido para el integrante.", "error");
    return;
    } 

    if (!validarCedula(cedulaIntegrante)) {
    lanzarToast("Ingrese una cédula válida para el integrante.", "error");
    return;
    }

    const nuevoIntegrante: IntegranteFamilia = {
      id: 'int_' + crypto.randomUUID(),
      nombre: nombreIntegrante,
      cedula: cedulaIntegrante,
      fechaNacimiento,
      sexo,
      parentesco,
      poseeDiscapacidad,
      tipoDiscapacidad: poseeDiscapacidad ? tipoDiscapacidad : undefined,
      descripcionDiscapacidad: poseeDiscapacidad ? descripcionDiscapacidad : undefined,
      poseeEnfermedad,
      descripcionEnfermedad: poseeEnfermedad ? descripcionEnfermedad : undefined
    };

    setIntegrantesEditables([...integrantesEditables, nuevoIntegrante]);
    lanzarToast(`${nombreIntegrante} fue vinculado temporalmente.`, "exito");

    // Limpieza
    setMostrarModalIntegrante(false);
    setNombreIntegrante(''); setCedulaIntegrante(''); setFechaNacimiento('');
    setPoseeDiscapacidad(false); setTipoDiscapacidad('MOTORA'); setDescripcionDiscapacidad('');
    setPoseeEnfermedad(false); setDescripcionEnfermedad('');
  };

  // 🟢 ELIMINAR INTEGRANTE EN MODO EDICIÓN
  const eliminarIntegranteTemporal = (id: string, parentescoX: string) => {
    if (parentescoX === 'JEFE FAMILIA') {
      lanzarToast("No puedes eliminar al Jefe de Familia de la carga de integrantes.", "error");
      return;
    }
    setIntegrantesEditables(integrantesEditables.filter(i => i.id !== id));
    lanzarToast("Integrante removido del formulario.", "exito");
  };

  // 🟢 PROCESAR ENVÍO O CORRECCIÓN
  const procesarFormularioFamilia = () => {
    if (!validarNombre(nombre)) {
      lanzarToast("Ingrese un nombre válido.", "error");
      return;
    }

    if (!validarCedula(cedula)) {
      lanzarToast("Ingrese una cédula válida.", "error");
      return;
    }

    if (telefono && !validarTelefono(telefono)) {
      lanzarToast("Ingrese un teléfono venezolano válido.", "error");
      return;
    }

    if (correo && !validarCorreo(correo)) {
      lanzarToast("Ingrese un correo electrónico válido.", "error");
      return;
    }

    if (editandoRechazado && miFamilia) {
      const integrantesFinales = integrantesEditables.map(i =>
        i.parentesco === 'JEFE FAMILIA' ? { ...i, nombre, cedula } : i
    );

      reenviarSolicitudFamilia(miFamilia.id, {
        ...miFamilia,
        jefeFamilia: nombre,
        cedulaJefe: cedula,
        telefono,
        correo,
        torre,
        bloque,
        apartamento,
        integrantes: integrantesFinales
      });

      lanzarToast("¡Corrección enviada! Tu censo volvió a revisión.", "exito");
      setEditandoRechazado(false);
      limpiarFormulario();
    } else {
      const esAdmin = usuarioActual.rol === 'SUPER_ADMIN';
      const jefeAsIntegrante: IntegranteFamilia = {
        id: 'jefe_' + crypto.randomUUID(),
        nombre,
        cedula,
        fechaNacimiento: "",
        sexo: "MASCULINO",
        parentesco: "JEFE FAMILIA",
        poseeDiscapacidad: false,
        poseeEnfermedad: false
      };

      agregarFamilia({
        jefeFamilia: nombre,
        cedulaJefe: cedula,
        telefono,
        correo,
        torre,
        bloque,
        apartamento,
        usuarioId: esAdmin ? idResidenteAsistido : usuarioActual.id,
        tieneAccesoApp: true,
        integrantes: [jefeAsIntegrante, ...integrantesEditables]
      });

      lanzarToast("Censo familiar registrado con éxito.", "exito");
      limpiarFormulario();
    }
  };

  const limpiarFormulario = () => {
    setNombre(''); setCedula(''); setTelefono(''); setCorreo('');
    setTorre(''); setBloque(''); setApartamento(''); setIdResidenteAsistido('');
    setIntegrantesEditables([]);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-2 relative">
      
      {/* 🔔 COMPONENTE TOAST DE NOTIFICACIÓN CUSTOMIZADO */}
      {toast.mostrar && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3.5 rounded-xl shadow-xl border animate-slideIn max-w-sm backdrop-blur-xs ${
          toast.tipo === 'exito' 
            ? 'bg-emerald-500 border-emerald-400 text-white' 
            : 'bg-red-600 border-red-500 text-white'
        }`}>
          {toast.tipo === 'exito' ? <Check size={18} className="shrink-0" /> : <ShieldAlert size={18} className="shrink-0" />}
          <p className="text-xs font-semibold tracking-wide">{toast.mensaje}</p>
          <button onClick={() => setToast(prev => ({ ...prev, mostrar: false }))} className="ml-auto p-0.5 hover:bg-white/20 rounded-md transition-colors">
            <X size={14} />
          </button>
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Módulo de Censo Familiar</h1>

      {/* ================= PANELS DE ESTADOS (RESIDENTE) ================= */}
      {usuarioActual.rol === 'JEFE_FAMILIA' && miFamilia && !editandoRechazado && (
        <div className="bg-white border rounded-2xl shadow-xs overflow-hidden">
          <div className="p-6 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center bg-gray-100">
              {fueAprobada && <CheckCircle className="text-green-600 w-7 h-7" />}
              {estaPendiente && <Clock className="text-yellow-600 w-7 h-7" />}
              {fueRechazada && <AlertTriangle className="text-red-600 w-7 h-7" />}
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {fueAprobada && 'Censo Familiar Verificado y Aprobado'}
                {estaPendiente && 'Tu censo está en período de revisión'}
                {fueRechazada && 'Tu solicitud de censo ha sido rechazada'}
              </h2>
              <p className="text-sm text-gray-500 max-w-md mx-auto mt-1">
                {fueAprobada && 'Los datos se encuentran validados por la mesa técnica del consejo comunal.'}
                {estaPendiente && 'Los voceros están validando la información física contra la digital.'}
                {fueRechazada && 'Revisa las objeciones del administrador abajo y realiza las correcciones.'}
              </p>
            </div>

            {fueRechazada && (
              <div className="bg-red-50/70 border border-red-100 rounded-xl p-4 max-w-xl mx-auto text-left space-y-3">
                <div>
                  <span className="text-xs font-bold text-red-700 uppercase tracking-wider block">Motivo del Rechazo:</span>
                  <p className="text-sm text-gray-700 italic mt-1 font-medium">
                    "{(miFamilia as any).motivoRechazo || (miFamilia as any).motivo || 'Verifica los campos estructurados e integrantes del grupo.'}"
                  </p>
                </div>
                <button
                  onClick={activarEdicionRechazado}
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  Corregir Solicitud e Integrantes
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= FORMULARIO COMPUESTO (CREACIÓN O EDICIÓN TOTAL) ================= */}
      {((usuarioActual.rol === 'JEFE_FAMILIA' && (!miFamilia || editandoRechazado)) || usuarioActual.rol !== 'JEFE_FAMILIA') && (
        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden animate-fadeIn">
          <div className="bg-slate-50 border-b px-6 py-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-800">
                {editandoRechazado ? '📍 Modo de Corrección Completa' : '📝 Formulario de Registro Socio-Comunitario'}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">Complete con precisión los datos de la vivienda y su carga familiar.</p>
            </div>
            {editandoRechazado && (
              <span className="bg-red-100 text-red-700 text-[10px] font-bold uppercase px-2.5 py-1 rounded-md border border-red-200">
                Corregir
              </span>
            )}
          </div>

          <div className="p-6 space-y-6">
            {/* Campos de la Vivienda y Jefe */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <h4 className="sm:col-span-2 md:col-span-4 text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-1">1. Datos de Ubicación y Jefe</h4>
              
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-gray-600 block mb-1">Nombre Completo del Jefe:</label>
                <input value={nombre} onChange={e => setNombre(e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, ""))} className="border border-gray-300 p-2.5 rounded-xl text-sm w-full bg-gray-50/30 focus:bg-white transition-all outline-hidden focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Cédula Jefe:</label>
                <input value={cedula} onChange={e => setCedula(e.target.value.replace(/\D/g, "").slice(0,10))} className="border border-gray-300 p-2.5 rounded-xl text-sm w-full bg-gray-50/30 focus:bg-white transition-all outline-hidden focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Teléfono:</label>
                <input value={telefono} onChange={e => setTelefono(e.target.value.replace(/\D/g, "").slice(0,11))}maxLength={11} placeholder="04141234567" className="border border-gray-300 p-2.5 rounded-xl text-sm w-full bg-gray-50/30 focus:bg-white transition-all outline-hidden focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div className="sm:col-span-1">
                <label className="text-xs font-semibold text-gray-600 block mb-1">Correo Electrónico:</label>
                <input value={correo} onChange={e => setCorreo(e.target.value)} className="border border-gray-300 p-2.5 rounded-xl text-sm w-full bg-gray-50/30 focus:bg-white transition-all outline-hidden focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Bloque / Sector:</label>
                <input value={bloque} onChange={e => setBloque(e.target.value)} className="border border-gray-300 p-2.5 rounded-xl text-sm w-full bg-gray-50/30 focus:bg-white transition-all outline-hidden focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Torre:</label>
                <input value={torre} onChange={e => setTorre(e.target.value)} className="border border-gray-300 p-2.5 rounded-xl text-sm w-full bg-gray-50/30 focus:bg-white transition-all outline-hidden focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Nº Apartamento:</label>
                <input value={apartamento} onChange={e => setApartamento(e.target.value)} className="border border-gray-300 p-2.5 rounded-xl text-sm w-full bg-indigo-50/40 text-indigo-700 font-bold focus:bg-white transition-all outline-hidden focus:ring-2 focus:ring-indigo-500/20" />
              </div>
            </div>

            {/* Carga Familiar */}
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b pb-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">2. Carga e Integrantes Familiares</h4>
                <button
                  type="button"
                  onClick={() => setMostrarModalIntegrante(true)}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus size={14} /> Añadir Familiar
                </button>
              </div>

              {integrantesEditables.filter(i => i.parentesco !== 'JEFE FAMILIA').length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4 bg-gray-50 rounded-xl border border-dashed">No has cargado integrantes adicionales aún. Presiona "Añadir Familiar".</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {integrantesEditables.filter(i => i.parentesco !== 'JEFE FAMILIA').map(i => (
                    <div key={i.id} className="border bg-slate-50/50 rounded-xl p-3.5 flex justify-between items-start group shadow-2xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-gray-900 text-sm">{i.nombre}</h5>
                          <span className="text-[9px] bg-gray-200 text-gray-600 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">{i.parentesco}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">V- {i.cedula} • {i.sexo}</p>
                        {(i.poseeDiscapacidad || i.poseeEnfermedad) && (
                          <div className="flex gap-1.5 mt-2">
                            {i.poseeDiscapacidad && <span className="text-[10px] bg-red-50 text-red-700 font-medium px-1.5 py-0.5 rounded border border-red-100">♿ {i.tipoDiscapacidad || 'Discapacidad'}</span>}
                            {i.poseeEnfermedad && <span className="text-[10px] bg-orange-50 text-orange-700 font-medium px-1.5 py-0.5 rounded border border-orange-100">⚕️ Crónico</span>}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => eliminarIntegranteTemporal(i.id, i.parentesco)}
                        className="text-gray-400 hover:text-red-600 p-1 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Acciones del Formulario */}
            <div className="flex justify-end gap-3 border-t pt-4">
              {editandoRechazado && (
                <button
                  type="button"
                  onClick={() => { setEditandoRechazado(false); limpiarFormulario(); }}
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-5 py-2 rounded-xl text-sm cursor-pointer transition-colors"
                >
                  Cancelar Corrección
                </button>
              )}
              <button
                type="button"
                onClick={procesarFormularioFamilia}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-xl text-sm shadow-sm transition-colors cursor-pointer"
              >
                {editandoRechazado ? 'Reenviar Todo Corregido' : 'Registrar Grupo Familiar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SECCIÓN HISTÓRICO / VISTA EN EL SISTEMA (SOLO LECTURA DEBAJO) ================= */}
      {(!editandoRechazado && fueAprobada) && (
        <div className="bg-white border rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-start border-b pb-2">
            <div>
              <h3 className="font-bold text-lg text-gray-900">{miFamilia?.jefeFamilia}</h3>
              <p className="text-xs text-gray-500 mt-0.5">Bloque {miFamilia?.bloque} • Torre {miFamilia?.torre} • Apto {miFamilia?.apartamento}</p>
            </div>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">APROBADA</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {miFamilia?.integrantes.map(integrante => (
              <div key={integrante.id} className="bg-gray-50/50 border rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm text-gray-800">{integrante.nombre}</h4>
                  <span className="text-[10px] font-extrabold bg-gray-200 px-2 py-0.5 rounded text-gray-600 uppercase">{integrante.parentesco}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Cédula: {integrante.cedula} | Sexo: {integrante.sexo}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= COMPONENTE MODAL INTERNO PARA INTEGRANTES ================= */}
      {mostrarModalIntegrante && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-4 max-h-[88vh] overflow-y-auto border border-gray-100 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-lg text-gray-900">Registrar Carga Familiar</h3>
              <button onClick={() => setMostrarModalIntegrante(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-lg hover:bg-gray-50"><X size={20} /></button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Nombre Completo:</label>
                <input value={nombreIntegrante} onChange={e => setNombreIntegrante(e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, ""))} className="border p-2.5 w-full rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-hidden" placeholder="Ej: Juan Silva" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Cédula de Identidad:</label>
                <input value={cedulaIntegrante} onChange={e => setCedulaIntegrante(e.target.value.replace(/\D/g, "").slice(0,10))} className="border p-2.5 w-full rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-hidden" placeholder="Ej: 30123456" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Parentesco:</label>
                  <select value={parentesco} onChange={e => setParentesco(e.target.value as any)} className="border p-2.5 w-full rounded-xl text-sm bg-white cursor-pointer focus:ring-2 focus:ring-indigo-500/20 outline-hidden">
                    <option value="HIJO">Hijo / Hija</option>
                    <option value="CONYUGE">Cónyuge</option>
                    <option value="PADRE">Padre</option>
                    <option value="MADRE">Madre</option>
                    <option value="ABUELO">Abuelo / Abuela</option>
                    <option value="OTRO">Otro Familiar</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Sexo:</label>
                  <select value={sexo} onChange={e => setSexo(e.target.value as any)} className="border p-2.5 w-full rounded-xl text-sm bg-white cursor-pointer focus:ring-2 focus:ring-indigo-500/20 outline-hidden">
                    <option value="MASCULINO">Masculino</option>
                    <option value="FEMENINO">Femenino</option>
                  </select>
                </div>
              </div>

              {/* Salud Avanzada */}
              <div className="pt-2 space-y-3 border-t">
                
                {/* CHECKBOX DISCAPACIDAD */}
                <label className="flex items-center gap-2 text-gray-700 cursor-pointer text-xs font-medium">
                  <input type="checkbox" checked={poseeDiscapacidad} onChange={e => setPoseeDiscapacidad(e.target.checked)} className="rounded text-indigo-600 w-4 h-4 cursor-pointer" />
                  <span className="font-bold text-gray-700">Posee alguna Discapacidad</span>
                </label>
                
                {/* 🟢 SELECTOR DINÁMICO RECUPERADO Y VISUALMENTE IMPACTANTE */}
                {poseeDiscapacidad && (
                  <div className="space-y-2 pl-6 animate-fadeIn">
                    <div>
                      <label className="text-[11px] font-bold text-gray-500 block mb-1 uppercase tracking-wider">Tipo de Discapacidad:</label>
                      <select 
                        value={tipoDiscapacidad} 
                        onChange={e => setTipoDiscapacidad(e.target.value as any)} 
                        className="border p-2 w-full rounded-xl text-xs bg-gray-50 cursor-pointer font-medium focus:ring-2 focus:ring-indigo-500/20 outline-hidden"
                      >
                        <option value="MOTORA">Motora / Física</option>
                        <option value="VISUAL">Visual</option>
                        <option value="AUDITIVA">Auditiva</option>
                        <option value="INTELECTUAL">Intelectual / Cognitiva</option>
                        <option value="PSICOSOCIAL">Psicosocial</option>
                        <option value="OTRA">Otra Especificación</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-500 block mb-1 uppercase tracking-wider">Especificación detallada (Opcional):</label>
                      <textarea 
                        placeholder="Indique brevemente el grado de asistencia o requerimientos..." 
                        value={descripcionDiscapacidad} 
                        onChange={e => setDescripcionDiscapacidad(e.target.value)} 
                        className="border p-2 w-full rounded-xl text-xs h-16 bg-gray-50/50 resize-none focus:bg-white outline-hidden focus:ring-2 focus:ring-indigo-500/20" 
                      />
                    </div>
                  </div>
                )}

                {/* CHECKBOX ENFERMEDAD */}
                <label className="flex items-center gap-2 text-gray-700 cursor-pointer text-xs font-medium pt-1">
                  <input type="checkbox" checked={poseeEnfermedad} onChange={e => setPoseeEnfermedad(e.target.checked)} className="rounded text-indigo-600 w-4 h-4 cursor-pointer" />
                  <span className="font-bold text-gray-700">Sufre de Enfermedad Crónica</span>
                </label>
                {poseeEnfermedad && (
                  <div className="pl-6 animate-fadeIn">
                    <textarea 
                      placeholder="Hipertensión, Diabetes, Asma... Especifique el tratamiento o medicamentos requeridos." 
                      value={descripcionEnfermedad} 
                      onChange={e => setDescripcionEnfermedad(e.target.value)} 
                      className="border p-2 w-full rounded-xl text-xs h-16 bg-gray-50/50 resize-none focus:bg-white outline-hidden focus:ring-2 focus:ring-indigo-500/20" 
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="button" 
                onClick={guardarIntegrante} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white w-full p-2.5 rounded-xl font-bold text-sm transition-all shadow-xs cursor-pointer text-center"
              >
                Vincular Miembro Temporalmente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 