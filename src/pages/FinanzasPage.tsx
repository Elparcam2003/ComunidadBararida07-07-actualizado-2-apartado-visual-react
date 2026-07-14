// src/pages/FinanzasPage.tsx
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CreditCard, CheckCircle, XCircle, Clock, AlertCircle, PlusCircle, Search, Wallet, CalendarDays, Trash2, Building2, Globe } from 'lucide-react';

export function FinanzasPage() {
  const { usuarioActual, pagos, registrarPago, procesarPago, cuotas, publicarCuota, eliminarCuota } = useApp();
  
  // Estados para reportar pago
  const [conceptoSeleccionado, setConceptoSeleccionado] = useState('');
  const [conceptoOtro, setConceptoOtro] = useState('');
  const [monto, setMonto] = useState('');
  const [referencia, setReferencia] = useState('');
  const [metodo, setMetodo] = useState('Pago Móvil');
  
  // Estados para crear cuota
  const [nuevaCuotaConcepto, setNuevaCuotaConcepto] = useState('');
  const [nuevaCuotaMonto, setNuevaCuotaMonto] = useState('');
  const [nuevaCuotaFecha, setNuevaCuotaFecha] = useState('');
  const [nuevaCuotaAlcance, setNuevaCuotaAlcance] = useState('GLOBAL');

  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  if (!usuarioActual) return null;

  const esAdminOVocero = usuarioActual.rol === 'SUPER_ADMIN' || usuarioActual.rol === 'VOCERO';
  
  // Filtros de visibilidad
  const pagosVisibles = esAdminOVocero 
    ? (usuarioActual.rol === 'VOCERO' ? pagos.filter(p => p.edificioId === usuarioActual.edificioId) : pagos)
    : pagos.filter(p => p.usuarioId === usuarioActual.id);

  const cuotasVisibles = cuotas.filter(c => {
    if (usuarioActual.rol === 'SUPER_ADMIN') return true; // El SuperAdmin ve todas
    return c.edificioId === 'GLOBAL' || c.edificioId === usuarioActual.edificioId; // Vecinos y Voceros ven las globales y las de su bloque
  });

  const manejarEnvioPago = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setExito('');

    if (!conceptoSeleccionado) return setError('Selecciona el concepto del pago.');
    if (conceptoSeleccionado === 'Otro' && !conceptoOtro.trim()) return setError('Especifica el concepto de tu pago.');
    if (!monto || isNaN(Number(monto))) return setError('Ingresa un monto válido.');
    if (!referencia.trim() && metodo !== 'Efectivo') return setError('Ingresa el número de referencia.');

    const conceptoFinal = conceptoSeleccionado === 'Otro' ? conceptoOtro : conceptoSeleccionado;

    registrarPago({
      concepto: conceptoFinal, monto, referencia: metodo === 'Efectivo' ? 'N/A' : referencia, metodo, fecha: new Date().toLocaleDateString(), usuarioId: usuarioActual.id, usuarioNombre: usuarioActual.nombre, edificioId: usuarioActual.edificioId, apartamento: usuarioActual.apartamento
    });

    setExito('Pago reportado exitosamente.');
    setConceptoSeleccionado(''); setConceptoOtro(''); setMonto(''); setReferencia('');
  };

  const manejarCrearCuota = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaCuotaConcepto || !nuevaCuotaMonto || !nuevaCuotaFecha) return;
    
    // Si es Vocero, forzamos que el alcance sea solo su bloque
    const alcanceFinal = usuarioActual.rol === 'VOCERO' ? (usuarioActual.edificioId || 'GLOBAL') : nuevaCuotaAlcance;
    
    publicarCuota(nuevaCuotaConcepto, nuevaCuotaMonto, nuevaCuotaFecha, alcanceFinal);
    setNuevaCuotaConcepto(''); setNuevaCuotaMonto(''); setNuevaCuotaFecha('');
  };

  const prepararPagoRapido = (concepto: string, montoFijo: string) => {
    setConceptoSeleccionado('Otro');
    setConceptoOtro(concepto);
    setMonto(montoFijo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderBadgeEstado = (estado: string) => {
    switch (estado) {
      case 'APROBADA': return <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md text-[10px] font-black flex items-center gap-1"><CheckCircle size={12}/> APROBADO</span>;
      case 'RECHAZADA': return <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded-md text-[10px] font-black flex items-center gap-1"><XCircle size={12}/> RECHAZADO</span>;
      default: return <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-md text-[10px] font-black flex items-center gap-1"><Clock size={12}/> PENDIENTE</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-10">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Control de Finanzas</h1>
        <p className="text-sm text-gray-500">Gestión, cobros comunitarios y reportes de pago.</p>
      </div>

      {/* ✨ SECCIÓN NUEVA: CUOTAS ACTIVAS */}
      <div className="bg-indigo-900 rounded-2xl p-5 md:p-6 shadow-lg shadow-indigo-900/20 text-white">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-6">
          <div>
            <h3 className="text-lg font-bold text-indigo-100 flex items-center gap-2"><CalendarDays size={20} className="text-indigo-400"/> Cuotas Comunitarias Activas</h3>
            <p className="text-xs text-indigo-300">Pagos programados para la comunidad o bloques específicos.</p>
          </div>
          
          {esAdminOVocero && (
            <form onSubmit={manejarCrearCuota} className="bg-indigo-950/50 p-4 rounded-xl w-full lg:w-auto border border-indigo-800 flex flex-col sm:flex-row gap-3 items-end">
              <div className="w-full sm:w-auto">
                <label className="text-[10px] text-indigo-300 font-bold uppercase block mb-1">Concepto</label>
                <input type="text" value={nuevaCuotaConcepto} onChange={e => setNuevaCuotaConcepto(e.target.value)} placeholder="Ej: Reparación Tubo" className="bg-indigo-950 border border-indigo-700 rounded-lg px-3 py-2 text-xs text-white w-full outline-none" />
              </div>
              <div className="w-full sm:w-24">
                <label className="text-[10px] text-indigo-300 font-bold uppercase block mb-1">Monto ($)</label>
                <input type="number" step="0.01" value={nuevaCuotaMonto} onChange={e => setNuevaCuotaMonto(e.target.value)} placeholder="0.00" className="bg-indigo-950 border border-indigo-700 rounded-lg px-3 py-2 text-xs text-white w-full outline-none" />
              </div>
              <div className="w-full sm:w-28">
                <label className="text-[10px] text-indigo-300 font-bold uppercase block mb-1">Fecha Límite</label>
                <input type="text" value={nuevaCuotaFecha} onChange={e => setNuevaCuotaFecha(e.target.value)} placeholder="Ej: 20/07" className="bg-indigo-950 border border-indigo-700 rounded-lg px-3 py-2 text-xs text-white w-full outline-none" />
              </div>
              
              {usuarioActual.rol === 'SUPER_ADMIN' && (
                <div className="w-full sm:w-32">
                  <label className="text-[10px] text-indigo-300 font-bold uppercase block mb-1">Alcance</label>
                  <select value={nuevaCuotaAlcance} onChange={e => setNuevaCuotaAlcance(e.target.value)} className="bg-indigo-950 border border-indigo-700 rounded-lg px-3 py-2 text-xs text-white w-full outline-none">
                    <option value="GLOBAL">Todos</option>
                    <option value="B1">Bloque 1</option>
                    <option value="B2">Bloque 2</option>
                    <option value="B3">Bloque 3</option>
                  </select>
                </div>
              )}

              <button type="submit" className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 w-full sm:w-auto h-[34px] transition-colors">
                <PlusCircle size={16} /> Crear
              </button>
            </form>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cuotasVisibles.map(cuota => (
            <div key={cuota.id} className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-xl relative group">
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-black tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${cuota.edificioId === 'GLOBAL' ? 'bg-indigo-500/30 text-indigo-200' : 'bg-rose-500/30 text-rose-200'}`}>
                  {cuota.edificioId === 'GLOBAL' ? <><Globe size={10}/> COMUNIDAD</> : <><Building2 size={10}/> BLOQUE {cuota.edificioId}</>}
                </span>
                
                {esAdminOVocero && (
                  <button onClick={() => eliminarCuota(cuota.id)} className="text-rose-400 hover:bg-rose-500 hover:text-white p-1 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              
              <p className="font-bold text-sm text-white">{cuota.concepto}</p>
              <p className="text-[11px] text-indigo-300">Límite: <span className="text-indigo-100 font-semibold">{cuota.fechaLimite}</span></p>
              
              <div className="flex justify-between items-end mt-3 border-t border-white/10 pt-3">
                <p className="text-xl font-black text-white">${cuota.monto}</p>
                {!esAdminOVocero && (
                  <button onClick={() => prepararPagoRapido(cuota.concepto, cuota.monto)} className="bg-white text-indigo-900 hover:bg-indigo-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm">
                    Pagar
                  </button>
                )}
              </div>
            </div>
          ))}
          {cuotasVisibles.length === 0 && <p className="text-indigo-300 text-sm py-2">No hay cobros activos para mostrar.</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* === COLUMNA IZQUIERDA: FORMULARIO === */}
        <div className="lg:col-span-1 space-y-4">
          {!esAdminOVocero ? (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-4 ">
              <div className="flex items-center gap-2 mb-4 border-b pb-4">
                <Wallet className="text-indigo-600" size={24} />
                <h3 className="text-lg font-bold text-gray-900 leading-tight">Reportar Pago</h3>
              </div>
              <form onSubmit={manejarEnvioPago} className="space-y-4">
                {error && <div className="bg-rose-50 text-rose-700 text-xs font-bold p-3 rounded-xl flex items-center gap-2 "><AlertCircle size={16} /> {error}</div>}
                {exito && <div className="bg-emerald-50 text-emerald-700 text-xs font-bold p-3 rounded-xl flex items-center gap-2"><CheckCircle size={16} /> {exito}</div>}
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Concepto del Pago</label>
                  <select value={conceptoSeleccionado} onChange={(e) => setConceptoSeleccionado(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="" disabled>Selecciona el motivo...</option>
                    <option value="Fondo de Reserva">Fondo de Reserva</option>
                    <option value="Otro">Otro / Cuota Programada</option>
                  </select>
                </div>

                {conceptoSeleccionado === 'Otro' && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-indigo-600 uppercase">Especifique el motivo</label>
                    <input type="text" value={conceptoOtro} onChange={(e) => setConceptoOtro(e.target.value)} className="w-full bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2.5 text-sm outline-none" placeholder="Ej: Aseo Mensual" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600">Monto</label>
                    <input type="number" step="0.01" value={monto} onChange={(e) => setMonto(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2" placeholder="0.00" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600">Método</label>
                    <select value={metodo} onChange={(e) => setMetodo(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2">
                      <option value="Pago Móvil">Pago Móvil</option>
                      <option value="Transferencia">Transferencia</option>
                      <option value="Efectivo">Efectivo</option>
                    </select>
                  </div>
                </div>

                {metodo !== 'Efectivo' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600">Referencia (Últimos 6)</label>
                    <input type="text" value={referencia} onChange={(e) => setReferencia(e.target.value)} maxLength={6} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2" placeholder="123456" />
                  </div>
                )}

                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-md flex justify-center items-center gap-2"><PlusCircle size={18} /> Enviar Reporte</button>
              </form>
            </div>
          ) : (
            <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg">
              <h3 className="text-lg font-bold mb-1">Resumen Financiero</h3>
              <div className="text-4xl font-black mb-2 mt-4">{pagosVisibles.filter(p => p.estado === 'PENDIENTE').length}</div>
              <p className="text-sm font-medium text-indigo-100">Transacciones por verificar</p>
            </div>
          )}
        </div>

        {/* === COLUMNA DERECHA: BANDEJA === */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">{esAdminOVocero ? 'Bandeja de Verificación' : 'Mis Pagos'}</h3>
              <CreditCard size={20} className="text-slate-400" />
            </div>

            {pagosVisibles.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <Search className="mx-auto text-gray-300 mb-3" size={32} />
                <p className="text-gray-500 font-medium">No hay registros de pagos.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pagosVisibles.map(pago => (
                  <div key={pago.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{pago.concepto}</span>
                        {renderBadgeEstado(pago.estado)}
                      </div>
                      <p className="text-xs text-gray-500 font-medium">Por: {pago.usuarioNombre}</p>
                      <p className="text-[11px] text-gray-400">{pago.metodo} • Ref: {pago.referencia} • {pago.fecha}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-lg font-black text-indigo-600 mb-2">{pago.monto} <span className="text-xs text-indigo-400">USD/BS</span></div>
                      {esAdminOVocero && pago.estado === 'PENDIENTE' && (
                        <div className="flex gap-2">
                          <button onClick={() => procesarPago(pago.id, 'APROBADA')} className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold">Aprobar</button>
                          <button onClick={() => procesarPago(pago.id, 'RECHAZADA')} className="bg-rose-100 text-rose-700 px-3 py-1.5 rounded-lg text-xs font-bold">Rechazar</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}