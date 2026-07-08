// src/pages/PersonalPage.tsx
import { useState } from 'react';
import { ShieldAlert, Trash2, Edit3, Key, UserPlus, Building, KeyRound, Mail, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { type Usuario, type Rol } from '../types';

// ✨ Definición de las Vocerías solicitadas
export type Voceria =
  | 'LEGISLACION'
  | 'SALUD'
  | 'CONTRALORIA_SOCIAL'
  | 'ADMINISTRACION_FINANZAS'
  | 'VIVIENDA_HABITAT'
  | 'ECOSOCIALISMO'
  | 'JUSTICIA_PAZ'
  | 'JUVENTUD_DEPORTE'
  | 'COMISION_ELECTORAL';

const VOCERIAS_LABELS: Record<Voceria, string> = {
  LEGISLACION: 'Legislación',
  SALUD: 'Salud',
  CONTRALORIA_SOCIAL: 'Contraloría Social',
  ADMINISTRACION_FINANZAS: 'Administración y Finanzas',
  VIVIENDA_HABITAT: 'Vivienda y Hábitat',
  ECOSOCIALISMO: 'Ecosocialismo',
  JUSTICIA_PAZ: 'Justicia y Paz',
  JUVENTUD_DEPORTE: 'Juventud y Deporte',
  COMISION_ELECTORAL: 'Comisión Electoral',
};

export function PersonalPage() {
  const { usuarioActual, usuariosDisponibles, agregarUsuarioPersonal, editarUsuarioPersonal, eliminarUsuarioPersonal } = useApp();
  
  // Estados para el formulario
  const [mostrarForm, setMostrarForm] = useState(false);
  const [usuarioEnEdicion, setUsuarioEnEdicion] = useState<Usuario | null>(null);
  
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [rol, setRol] = useState<Rol>('VOCERO'); 
  const [edificioId, setEdificioId] = useState('B3');
  const [apartamento, setApartamento] = useState(''); 
  const [usuarioLogin, setUsuarioLogin] = useState('');
  const [claveLogin, setClaveLogin] = useState('');

  // ✨ Estados nuevos para el control de áreas y condiciones de vocería
  const [areaVoceria, setAreaVoceria] = useState<Voceria>('LEGISLACION');
  const [condicionVocero, setCondicionVocero] = useState<'PRINCIPAL' | 'SUPLENTE'>('PRINCIPAL');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Restricción de seguridad perimetral
  if (usuarioActual.rol !== 'SUPER_ADMIN') {
    return (
      <div className="bg-red-50 p-6 rounded-xl border border-red-200 text-center py-12 m-4">
        <ShieldAlert size={48} className="mx-auto text-red-500 mb-3" />
        <h2 className="text-lg font-bold text-red-800">Acceso Restringido</h2>
        <p className="text-red-600 text-sm max-w-md mx-auto mt-1">
          Solo la Jefa de la Comunidad (SUPER ADMIN) posee las atribuciones de auditoría necesarias para alterar las credenciales del personal de vocería y jefaturas.
        </p>
      </div>
    );
  }

  const prepararEdicion = (u: Usuario) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setUsuarioEnEdicion(u);
    setNombre(u.nombre);
    setCorreo(u.correo);
    setRol(u.rol);
    setEdificioId(u.edificioId || 'B3');
    setApartamento(u.apartamento || '');
    setUsuarioLogin(u.usuarioLogin || '');
    setClaveLogin(u.claveLogin || '');
    
    // ✨ Cargar propiedades de vocería si el usuario a editar ya es vocero
    if (u.rol === 'VOCERO') {
      setAreaVoceria((u as any).areaVoceria || 'LEGISLACION');
      setCondicionVocero((u as any).condicionVocero || 'PRINCIPAL');
    }

    setMostrarForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generarClaveTemporal = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let resultado = '';
    for (let i = 0; i < 6; i++) {
      resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    setClaveLogin(resultado);
  };

  const manejarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!nombre || !correo || !usuarioLogin || !claveLogin) {
      setErrorMsg('Por favor, rellene todos los campos requeridos.');
      return;
    }

    // ✨ VALIDACIÓN DE NEGOCIO: Control de Vacantes de Vocería (1 Principal y 1 Suplente máx)
    if (rol === 'VOCERO') {
      const coincidencia = usuariosDisponibles.find(
        (u) =>
          u.rol === 'VOCERO' &&
          (u as any).areaVoceria === areaVoceria &&
          (u as any).condicionVocero === condicionVocero &&
          u.id !== usuarioEnEdicion?.id // Ignorar al propio usuario si se está editando
      );

      if (coincidencia) {
        if (condicionVocero === 'PRINCIPAL') {
          setErrorMsg(
            `¡Error de Asignación! Ya se encuentra registrado un Vocero PRINCIPAL en el área de ${VOCERIAS_LABELS[areaVoceria]}. Debe remover al titular actual (${coincidencia.nombre}) o marcar la opción de SUPLENTE.`
          );
        } else {
          setErrorMsg(
            `¡Error de Asignación! Ya se encuentra registrado un Vocero SUPLENTE en el área de ${VOCERIAS_LABELS[areaVoceria]} (${coincidencia.nombre}). Cada área permite un máximo de (1) suplente.`
          );
        }
        return;
      }
    }

    const datosUsuario = {
      nombre,
      correo,
      rol,
      usuarioLogin,
      claveLogin,
      edificioId: rol !== 'SUPER_ADMIN' ? edificioId : undefined,
      apartamento: rol === 'JEFE_FAMILIA' ? apartamento : undefined,
      // ✨ Inyección de nuevos parámetros comunales extendidos
      areaVoceria: rol === 'VOCERO' ? areaVoceria : undefined,
      condicionVocero: rol === 'VOCERO' ? condicionVocero : undefined,
    };

    if (usuarioEnEdicion) {
      editarUsuarioPersonal({ ...usuarioEnEdicion, ...datosUsuario });
      setSuccessMsg('Ficha de acceso actualizada correctamente.');
    } else {
      agregarUsuarioPersonal(datosUsuario);
      setSuccessMsg('Nueva credencial registrada y activada con éxito.');
    }

    // Resetear estados limpios
    setNombre(''); setCorreo(''); setUsuarioLogin(''); setClaveLogin(''); setApartamento('');
    setRol('VOCERO'); 
    setAreaVoceria('LEGISLACION');
    setCondicionVocero('PRINCIPAL');
    setUsuarioEnEdicion(null); 
    setMostrarForm(false);
  };

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* CABECERA RESPONSIVA */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900">Gestión de Personal y Accesos</h1>
          <p className="text-sm text-gray-500">Administra cuentas, contraseñas y asignaciones de la comunidad.</p>
        </div>
        <button 
          onClick={() => { 
            if(mostrarForm) { setUsuarioEnEdicion(null); setErrorMsg(null); }
            setMostrarForm(!mostrarForm); 
          }}
          className="w-full sm:w-auto bg-slate-950 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-sm"
        >
          <UserPlus size={16} />
          {mostrarForm ? 'Cancelar Registro' : 'Nuevo Usuario'}
        </button>
      </div>

      {/* Alertas de Feedback */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex items-start gap-2.5 shadow-sm animate-fadeIn">
          <AlertCircle className="shrink-0 mt-0.5" size={16} />
          <div>{errorMsg}</div>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl text-sm flex items-start gap-2.5 shadow-sm animate-fadeIn">
          <CheckCircle className="shrink-0 mt-0.5" size={16} />
          <div>{successMsg}</div>
        </div>
      )}

      {/* FORMULARIO CRUD OPTIMIZADO */}
      {mostrarForm && (
        <form onSubmit={manejarSubmit} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4 animate-fadeIn">
          <h3 className="text-sm font-bold text-gray-700 border-b pb-2">
            {usuarioEnEdicion ? '⚙️ Editando Ficha de Acceso' : '📝 Datos de la Nueva Credencial'}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre Completo</label>
              <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} className="w-full bg-gray-50 border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"/>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Correo Electrónico</label>
              <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} className="w-full bg-gray-50 border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"/>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rol en el Sistema</label>
              <select value={rol} onChange={e => setRol(e.target.value as Rol)} className="w-full bg-gray-50 border border-gray-300 p-2.5 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500">
                <option value="VOCERO">Vocero de Bloque</option>
                <option value="SUPER_ADMIN">Super Administrador (Co-Jefe)</option>
                <option value="JEFE_FAMILIA">Jefe de Familia (Propietario/Residente)</option>
              </select>
            </div>

            {/* ✨ CAMPOS ADICIONALES EXCLUSIVOS SI EL SELECCIONADO ES VOCERO */}
            {rol === 'VOCERO' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-indigo-600 uppercase mb-1">Área de Vocería</label>
                  <select value={areaVoceria} onChange={e => setAreaVoceria(e.target.value as Voceria)} className="w-full bg-indigo-50/50 border border-indigo-200 p-2.5 rounded-lg text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                    {(Object.keys(VOCERIAS_LABELS) as Voceria[]).map(key => (
                      <option key={key} value={key}>{VOCERIAS_LABELS[key]}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-indigo-600 uppercase mb-1">Condición del Cargo</label>
                  <select value={condicionVocero} onChange={e => setCondicionVocero(e.target.value as any)} className="w-full bg-indigo-50/50 border border-indigo-200 p-2.5 rounded-lg text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                    <option value="PRINCIPAL">Principal</option>
                    <option value="SUPLENTE">Suplente</option>
                  </select>
                </div>
              </>
            )}
            
            {/* UBICACIÓN COMPARTIDA (VOCEROS Y JEFES DE FAMILIA) */}
            {rol !== 'SUPER_ADMIN' && (
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bloque / Torre Asignada</label>
                <select value={edificioId} onChange={e => setEdificioId(e.target.value)} className="w-full bg-gray-50 border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">
                  <option value="B3">Bloque 3</option>
                  <option value="B4">Bloque 4</option>
                  <option value="B5">Bloque 5</option>
                </select>
              </div>
            )}

            {/* APARTAMENTO EXCLUSIVO PARA JEFES DE FAMILIA */}
            {rol === 'JEFE_FAMILIA' && (
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nro de Apartamento</label>
                <input type="text" value={apartamento} onChange={e => setApartamento(e.target.value)} placeholder="Ej: 12-A" className="w-full bg-gray-50 border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"/>
              </div>
            )}

            {/* CREDENCIALES */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1"><Key size={12}/> Usuario de Acceso</label>
              <input type="text" value={usuarioLogin} onChange={e => setUsuarioLogin(e.target.value)} placeholder="Ej: pedro.b4" className="w-full bg-indigo-50/40 border border-indigo-200 p-2.5 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"/>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1 justify-between">
                <span className="flex items-center gap-1"><Key size={12}/> Contraseña</span>
                <button type="button" onClick={generarClaveTemporal} className="text-indigo-600 hover:text-indigo-800 normal-case font-bold text-[10px] bg-indigo-50 px-2 py-0.5 rounded transition">Generar temporal</button>
              </label>
              <input type="text" value={claveLogin} onChange={e => setClaveLogin(e.target.value)} placeholder="Clave de ingreso" className="w-full bg-indigo-50/40 border border-indigo-200 p-2.5 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"/>
            </div>
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition shadow-sm text-sm">
            {usuarioEnEdicion ? 'Actualizar Ficha y Credenciales' : 'Registrar y Activar Cuenta'}
          </button>
        </form>
      )}

      {/* LISTADO DE PERSONAL: TABLA EN PC / TARJETAS EN MÓVIL */}
      <div>
        <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <ThemeHead />
            <tbody className="divide-y divide-gray-100">
              {usuariosDisponibles.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/75 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-gray-100 rounded-lg text-gray-600"><User size={16}/></div>
                      <div>
                        <div className="font-bold text-gray-800">{u.nombre}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1"><Mail size={12}/>{u.correo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className={`w-max px-2 py-0.5 rounded text-xs font-bold ${
                        u.rol === 'SUPER_ADMIN' ? 'bg-red-100 text-red-700' : 
                        u.rol === 'VOCERO' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {u.rol === 'SUPER_ADMIN' ? 'Co-Jefe General' : u.rol === 'VOCERO' ? 'Vocero' : 'Jefe de Familia'}
                      </span>
                      
                      {/* ✨ Mapear visualmente el área de vocería y condición en la tabla si es vocero */}
                      {u.rol === 'VOCERO' && (u as any).areaVoceria && (
                        <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded w-max mt-0.5">
                          {VOCERIAS_LABELS[(u as any).areaVoceria as Voceria]} ({(u as any).condicionVocero})
                        </span>
                      )}

                      {u.edificioId && (
                        <span className="text-xs text-gray-500 flex items-center gap-0.5 font-medium">
                          <Building size={12}/> {u.edificioId} {u.apartamento ? `- Apto: ${u.apartamento}` : ''}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-mono text-xs">
                    <div className="bg-slate-50 border border-gray-100 p-2 rounded-lg w-max space-y-0.5">
                      <div><span className="text-gray-400">User:</span> <span className="font-bold text-slate-800">{u.usuarioLogin}</span></div>
                      <div><span className="text-gray-400">Clave:</span> <span className="text-indigo-600 font-semibold">{u.claveLogin}</span></div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => prepararEdicion(u)} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition"><Edit3 size={16} /></button>
                      <button onClick={() => eliminarUsuarioPersonal(u.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vista Móvil */}
        <div className="block md:hidden space-y-3">
          {usuariosDisponibles.map((u) => (
            <div key={u.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-slate-50 rounded-lg text-gray-600"><User size={16}/></div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{u.nombre}</h4>
                    <p className="text-xs text-gray-400">{u.correo}</p>
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <button onClick={() => prepararEdicion(u)} className="p-2 text-slate-500 hover:bg-gray-100 rounded-lg"><Edit3 size={16} /></button>
                  <button onClick={() => eliminarUsuarioPersonal(u.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-100">
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  u.rol === 'SUPER_ADMIN' ? 'bg-red-100 text-red-700' : 
                  u.rol === 'VOCERO' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {u.rol === 'SUPER_ADMIN' ? 'Co-Jefe' : u.rol === 'VOCERO' ? 'Vocero' : 'Jefe Familia'}
                </span>

                {/* ✨ Mapear área de vocería en la tarjeta móvil */}
                {u.rol === 'VOCERO' && (u as any).areaVoceria && (
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {VOCERIAS_LABELS[(u as any).areaVoceria as Voceria]} ({(u as any).condicionVocero})
                  </span>
                )}

                {u.edificioId && (
                  <span className="text-xs text-gray-500 font-medium flex items-center gap-0.5">
                    <Building size={12}/> {u.edificioId} {u.apartamento ? `(Apto ${u.apartamento})` : ''}
                  </span>
                )}
              </div>

              <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl space-y-1 font-mono text-xs">
                <div className="flex items-center gap-1"><KeyRound size={12} className="text-gray-400"/> <span className="text-gray-500">User:</span> <span className="font-bold text-slate-800">{u.usuarioLogin}</span></div>
                <div className="flex items-center gap-1"><KeyRound size={12} className="text-gray-400"/> <span className="text-gray-500">Clave:</span> <span className="text-indigo-600 font-bold">{u.claveLogin}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ThemeHead() {
  return (
    <thead className="bg-gray-50 border-b border-gray-200">
      <tr>
        <th className="p-4 font-bold text-gray-600">Usuario / Contacto</th>
        <th className="p-4 font-bold text-gray-600">Área o Ubicación</th>
        <th className="p-4 font-bold text-gray-600">Credenciales de Ingreso</th>
        <th className="p-4 font-bold text-gray-600 text-right">Acciones</th>
      </tr>
    </thead>
  );
}