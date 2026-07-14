// src/pages/LoginPage.tsx
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, User, LogIn, AlertCircle, ArrowLeft, KeyRound, HelpCircle, CheckCircle } from 'lucide-react';


export function LoginPage() {
  const { login, obtenerFichaRecuperacion, recuperarClave } = useApp();
  
  // Modos de la pantalla: 'LOGIN' | 'PEDIR_USUARIO' | 'RESPONDER_PREGUNTA'
  const [modo, setModo] = useState<'LOGIN' | 'PEDIR_USUARIO' | 'RESPONDER_PREGUNTA'>('LOGIN');
  
  // Estados Generales
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [exitoMsg, setExitoMsg] = useState('');

  // Estados de Recuperación
  const [preguntaRecuperacion, setPreguntaRecuperacion] = useState('');
  const [respuestaSecreta, setRespuestaSecreta] = useState('');
  const [nuevaClave, setNuevaClave] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');

  const manejarLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setExitoMsg('');
    const exito = login(usuario, clave);
    if (!exito) {
      setError('Usuario o contraseña incorrectos.');
    }
  };

  const verificarUsuarioRecuperacion = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!usuario) return setError('Por favor, ingresa tu usuario.');

    const resultado = obtenerFichaRecuperacion(usuario);
    
    if (resultado.exito && resultado.pregunta) {
      setPreguntaRecuperacion(resultado.pregunta);
      setModo('RESPONDER_PREGUNTA');
    } else {
      setError(resultado.mensaje || 'Error desconocido.');
    }
  };

  const manejarCambioDeClave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (nuevaClave.length < 6) return setError('La nueva contraseña debe tener al menos 6 caracteres.');
    if (nuevaClave !== confirmarClave) return setError('Las contraseñas no coinciden.');
    if (!respuestaSecreta) return setError('Debes ingresar tu respuesta secreta.');

    const exito = recuperarClave(usuario, respuestaSecreta, nuevaClave);
    
    if (exito) {
      setModo('LOGIN');
      setClave('');
      setExitoMsg('¡Contraseña restablecida con éxito! Ya puedes iniciar sesión.');
      setRespuestaSecreta('');
      setNuevaClave('');
      setConfirmarClave('');
    } else {
      setError('La respuesta secreta es incorrecta.');
    }
  };

  const cancelarRecuperacion = () => {
    setModo('LOGIN');
    setError('');
    setExitoMsg('');
    setClave('');
    setRespuestaSecreta('');
    setNuevaClave('');
    setConfirmarClave('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 selection:bg-indigo-500 selection:text-white animate-fadeIn">
      <div className="bg-slate-950/50 p-6 md:p-8 rounded-3xl border border-slate-800 w-full max-w-md shadow-2xl backdrop-blur-sm relative overflow-hidden">
        
        {/* === VISTA 1: LOGIN TRADICIONAL === */}
        {modo === 'LOGIN' && (
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              
              {/* ✨ Logo centrado con mx-auto y margen inferior con mb-4 */}
              <div className="w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg shadow-indigo-500/10 border border-slate-800">
                <img
                  src="/LogoInicio.jpg"
                  alt="Logo Comunidad Bararida"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h1 className="text-2xl font-black text-white tracking-tight">Comunidad Bararida</h1>
              <p className="text-slate-400 text-sm mt-1 font-medium">Introduzca sus datos</p>
            </div>

            <form onSubmit={manejarLogin} className="space-y-5">
              {exitoMsg && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
                  <CheckCircle size={16} className="shrink-0" /> {exitoMsg}
                </div>
              )}
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" /> {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Usuario</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="text" value={usuario} onChange={(e) => { setUsuario(e.target.value); setError(''); }}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="Ingresa tu usuario..."
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="password" value={clave} onChange={(e) => { setClave(e.target.value); setError(''); }}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="••••••"
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 mt-4">
                <LogIn size={18} /> Iniciar Sesión
              </button>
            </form>

            <div className="mt-6 text-center">
              <button 
                type="button" 
                onClick={() => { setModo('PEDIR_USUARIO'); setError(''); setExitoMsg(''); }} 
                className="text-xs text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </div>
        )}

        {/* === VISTA 2: PEDIR USUARIO PARA RECUPERACIÓN === */}
        {modo === 'PEDIR_USUARIO' && (
          <div className="animate-fadeIn">
            <button onClick={cancelarRecuperacion} className="text-slate-400 hover:text-white flex items-center gap-1 text-xs font-bold mb-6 transition-colors">
              <ArrowLeft size={14} /> Volver al inicio
            </button>
            
            <h2 className="text-xl font-black text-white mb-2">Recuperar Acceso</h2>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Ingresa tu nombre de usuario para buscar tus preguntas de seguridad asociadas.
            </p>

            <form onSubmit={verificarUsuarioRecuperacion} className="space-y-4">
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold p-3 rounded-xl flex items-start gap-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" /> <span className="leading-tight">{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Usuario</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="text" value={usuario} onChange={(e) => { setUsuario(e.target.value); setError(''); }}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="Ej: pedro.b4"
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg border border-slate-700 mt-2">
                Buscar Usuario
              </button>
            </form>
          </div>
        )}

        {/* === VISTA 3: RESPONDER PREGUNTA Y CAMBIAR CLAVE === */}
        {modo === 'RESPONDER_PREGUNTA' && (
          <div className="animate-fadeIn">
            <button onClick={() => setModo('PEDIR_USUARIO')} className="text-slate-400 hover:text-white flex items-center gap-1 text-xs font-bold mb-4 transition-colors">
              <ArrowLeft size={14} /> Usar otra cuenta
            </button>

            <div className="bg-indigo-900/30 border border-indigo-500/20 p-4 rounded-xl mb-6">
              <div className="flex items-center gap-2 mb-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                <HelpCircle size={16} /> Pregunta de Seguridad
              </div>
              <p className="text-indigo-100 font-medium text-sm">
                {preguntaRecuperacion === 'mascota' && '¿Cuál es el nombre de tu primera mascota?'}
                {preguntaRecuperacion === 'ciudad_madre' && '¿En qué ciudad nació tu madre?'}
                {preguntaRecuperacion === 'color' && '¿Cuál es tu color favorito?'}
                {preguntaRecuperacion === 'vehiculo' && '¿Cuál fue tu primer vehículo?'}
                {/* Fallback en caso de que la guarde literal */}
                {(!['mascota', 'ciudad_madre', 'color', 'vehiculo'].includes(preguntaRecuperacion)) && preguntaRecuperacion}
              </p>
            </div>

            <form onSubmit={manejarCambioDeClave} className="space-y-4">
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold p-3 rounded-xl flex items-start gap-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" /> <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Tu Respuesta Secreta</label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="text" value={respuestaSecreta} onChange={(e) => { setRespuestaSecreta(e.target.value); setError(''); }}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="Escribe tu respuesta..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Nueva Clave</label>
                  <input 
                    type="password" value={nuevaClave} onChange={(e) => { setNuevaClave(e.target.value); setError(''); }}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="Mínimo 6"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Confirmar</label>
                  <input 
                    type="password" value={confirmarClave} onChange={(e) => { setConfirmarClave(e.target.value); setError(''); }}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="Repetir clave"
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20 mt-4">
                Restablecer Contraseña
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
} 