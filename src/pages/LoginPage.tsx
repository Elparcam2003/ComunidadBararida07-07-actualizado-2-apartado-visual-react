// src/pages/LoginPage.tsx
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, User, LogIn, AlertCircle } from 'lucide-react';

export function LoginPage() {
  const { login } = useApp(); 
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState(false);

  const manejarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const exito = login(usuario, clave);
    if (!exito) {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 selection:bg-indigo-500 selection:text-white">
      <div className="bg-slate-950/50 p-8 rounded-3xl border border-slate-800 w-full max-w-md shadow-2xl backdrop-blur-sm">
        
        <div className="text-center mb-8">
          <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-600/20 rotate-3">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Comunidad Bararida</h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">Acceso al Ecosistema Inteligente</p>
        </div> 

        <form onSubmit={manejarSubmit} className="space-y-5">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
              <AlertCircle size={16} /> Usuario o contraseña incorrectos.
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Usuario</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                value={usuario}
                onChange={(e) => { setUsuario(e.target.value); setError(false); }}
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
                type="password" 
                value={clave}
                onChange={(e) => { setClave(e.target.value); setError(false); }}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                placeholder="••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 mt-4"
          >
            <LogIn size={18} />
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/60 text-center">
          <p className="text-[11px] text-slate-500 font-medium">
            Credenciales de prueba:<br/>
            Admin: <b>admin</b> / 123 <br/>
            Vocero: <b>vocero</b> / 123 <br/>
            Residente: <b>anamaria</b> / 123
          </p>
        </div>
      </div>
    </div>
  );
}