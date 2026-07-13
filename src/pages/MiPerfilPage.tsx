// src/pages/MiPerfilPage.tsx
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, ShieldCheck, KeyRound, AlertCircle, CheckCircle, Building, Mail } from 'lucide-react';

export function MiPerfilPage() {
  const { usuarioActual, actualizarClavePerfil } = useApp();
  
  const [claveActual, setClaveActual] = useState('');
  const [respuestaSecreta, setRespuestaSecreta] = useState('');
  const [nuevaClave, setNuevaClave] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');
  
  const [error, setError] = useState('');
  const [exitoMsg, setExitoMsg] = useState('');

  if (!usuarioActual) return null;

  const manejarCambioClave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setExitoMsg('');

    // Validaciones estrictas
    if (claveActual !== usuarioActual.claveLogin) return setError('La contraseña actual es incorrecta.');
    
    const respuestaGuardada = usuarioActual.respuestaSeguridad?.trim().toLowerCase();
    const respuestaIngresada = respuestaSecreta.trim().toLowerCase();
    
    if (respuestaIngresada !== respuestaGuardada) return setError('La respuesta de seguridad no coincide con nuestros registros.');
    if (nuevaClave.length < 6) return setError('La nueva contraseña debe tener al menos 6 caracteres.');
    if (nuevaClave !== confirmarClave) return setError('Las contraseñas nuevas no coinciden.');
    if (claveActual === nuevaClave) return setError('La nueva contraseña no puede ser igual a la anterior.');

    // Ejecutar cambio
    actualizarClavePerfil(nuevaClave);
    
    setExitoMsg('¡Contraseña actualizada correctamente!');
    setClaveActual('');
    setRespuestaSecreta('');
    setNuevaClave('');
    setConfirmarClave('');
  };

  const obtenerPreguntaFormateada = () => {
    const p = usuarioActual.preguntaSeguridad;
    if (p === 'mascota') return '¿Cuál es el nombre de tu primera mascota?';
    if (p === 'ciudad_madre') return '¿En qué ciudad nació tu madre?';
    if (p === 'color') return '¿Cuál es tu color favorito?';
    if (p === 'vehiculo') return '¿Cuál fue tu primer vehículo?';
    return p || 'Pregunta no configurada';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Mi Perfil y Seguridad</h1>
        <p className="text-sm text-gray-500">Gestiona tus datos personales y credenciales de acceso.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* COLUMNA IZQUIERDA: DATOS DE LECTURA */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
            <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-md">
              <User size={32} className="text-indigo-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">{usuarioActual.nombre}</h2>
            <span className="text-[10px] uppercase tracking-widest font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mt-2">
              {usuarioActual.rol.replace('_', ' ')}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b pb-2">Información de Contacto</h3>
            
            <div className="flex items-start gap-3">
              <Mail className="text-gray-400 mt-0.5" size={16} />
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Correo Electrónico</p>
                <p className="text-sm font-medium text-gray-800">{usuarioActual.correo}</p>
              </div>
            </div>

            {usuarioActual.rol !== 'SUPER_ADMIN' && (
              <div className="flex items-start gap-3">
                <Building className="text-gray-400 mt-0.5" size={16} />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Ubicación Residencial</p>
                  <p className="text-sm font-medium text-gray-800">
                    Bloque {usuarioActual.edificioId} {usuarioActual.apartamento ? `- Apto ${usuarioActual.apartamento}` : ''}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: FORMULARIO DE SEGURIDAD */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
              <ShieldCheck className="text-indigo-600" size={24} />
              <div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight">Cambio de Contraseña</h3>
                <p className="text-xs text-gray-500">Para proteger tu cuenta, requerimos verificación adicional.</p>
              </div>
            </div>

            <form onSubmit={manejarCambioClave} className="space-y-5">
              {error && (
                <div className="bg-rose-50 text-rose-700 text-xs font-bold p-3 rounded-xl flex items-center gap-2 border border-rose-200">
                  <AlertCircle size={16} className="shrink-0" /> {error}
                </div>
              )}
              {exitoMsg && (
                <div className="bg-emerald-50 text-emerald-700 text-xs font-bold p-3 rounded-xl flex items-center gap-2 border border-emerald-200">
                  <CheckCircle size={16} className="shrink-0" /> {exitoMsg}
                </div>
              )}

              {/* PASO 1: VERIFICACIÓN ACTUAL */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">1. Verifica tu Identidad</h4>
                
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Contraseña Actual</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="password" value={claveActual} onChange={(e) => setClaveActual(e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Ingresa tu clave actual" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-indigo-600 mb-1">Pregunta de Seguridad: {obtenerPreguntaFormateada()}</label>
                  <input type="text" value={respuestaSecreta} onChange={(e) => setRespuestaSecreta(e.target.value)} className="w-full bg-indigo-50/50 border border-indigo-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Tu respuesta secreta..." />
                </div>
              </div>

              {/* PASO 2: NUEVA CLAVE */}
              <div className="space-y-4 pt-2">
                <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">2. Nueva Credencial</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Nueva Contraseña</label>
                    <input type="password" value={nuevaClave} onChange={(e) => setNuevaClave(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Mínimo 6 caracteres" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Confirmar Contraseña</label>
                    <input type="password" value={confirmarClave} onChange={(e) => setConfirmarClave(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Repite la nueva clave" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <button type="submit" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md float-right">
                  Actualizar Contraseña
                </button>
                <div className="clear-both"></div>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
} 