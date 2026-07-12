// src/pages/PrimerIngresoPage.tsx
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Lock, HelpCircle, KeyRound, AlertCircle } from 'lucide-react';

export function PrimerIngresoPage() {
  const { usuarioActual, completarConfiguracionInicial } = useApp();
  const [nuevaClave, setNuevaClave] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');
  const [pregunta, setPregunta] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [error, setError] = useState('');

  const manejarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (nuevaClave.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.');
    if (nuevaClave !== confirmarClave) return setError('Las contraseñas no coinciden.');
    if (!pregunta) return setError('Debes seleccionar una pregunta de seguridad.');
    if (respuesta.trim().length < 3) return setError('La respuesta debe ser más larga.');

    // Si todo está bien, guardamos y el sistema lo dejará pasar automáticamente
    completarConfiguracionInicial(nuevaClave, pregunta, respuesta);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 selection:bg-indigo-500 selection:text-white animate-fadeIn">
      <div className="bg-slate-950/80 p-8 rounded-3xl border border-indigo-500/30 w-full max-w-md shadow-2xl backdrop-blur-md">
        
        <div className="text-center mb-8">
          <div className="bg-indigo-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
            <ShieldCheck className="text-indigo-400" size={32} />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Seguridad de la Cuenta</h1>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            Hola <b className="text-indigo-300">{usuarioActual?.nombre?.split(' ')[0]}</b>. Como es tu primer ingreso con una clave temporal, debes configurar tu propia contraseña y una pregunta de recuperación.
          </p>
        </div>

        <form onSubmit={manejarSubmit} className="space-y-4">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* CAMPO: NUEVA CLAVE */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Nueva Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="password" value={nuevaClave} onChange={(e) => setNuevaClave(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                placeholder="Mínimo 6 caracteres..."
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Confirmar Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="password" value={confirmarClave} onChange={(e) => setConfirmarClave(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                placeholder="Repite la contraseña..."
              />
            </div>
          </div>

          {/* CAMPO: PREGUNTA DE SEGURIDAD */}
          <div className="space-y-1.5 pt-3 border-t border-slate-800">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Pregunta de Seguridad</label>
            <div className="relative">
              <HelpCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <select 
                value={pregunta} onChange={(e) => setPregunta(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none"
              >
                <option value="" disabled>Selecciona una pregunta...</option>
                <option value="mascota">¿Cuál es el nombre de tu primera mascota?</option>
                <option value="ciudad_madre">¿En qué ciudad nació tu madre?</option>
                <option value="color">¿Cuál es tu color favorito?</option>
                <option value="vehiculo">¿Cuál fue tu primer vehículo?</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Respuesta Secreta</label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" value={respuesta} onChange={(e) => setRespuesta(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                placeholder="Tu respuesta secreta..."
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 mt-6">
            Guardar y Continuar
          </button>
        </form>
      </div>
    </div>
  );
}