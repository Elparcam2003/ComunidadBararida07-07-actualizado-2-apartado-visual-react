// src/context/AppContext.tsx
import React, { createContext, useContext, useState } from 'react';
import type { Usuario, Familia, Pago, Caso, Encuesta, Bitacora, MensajeCaso, IntegranteFamilia, Rol } from '../types';

interface AppContextProps {
  usuariosDisponibles: Usuario[];
  usuarioActual: Usuario | null;
  login: (usuarioLogin: string, claveLogin: string) => boolean;
  logout: () => void;
  completarConfiguracionInicial: (nuevaClave: string, pregunta: string, respuesta: string) => void;
  // ✨ NUEVAS FUNCIONES DE RECUPERACIÓN
  obtenerFichaRecuperacion: (usuarioLogin: string) => { exito: boolean; pregunta?: string; mensaje?: string };
  recuperarClave: (usuarioLogin: string, respuesta: string, nuevaClave: string) => boolean;
  actualizarClavePerfil: (nuevaClave: string) => void;

  pestanaActiva: string;
  setPestanaActiva: (pestana: string) => void;
  
  agregarUsuarioPersonal: (usuario: Omit<Usuario, 'id'>) => void;
  editarUsuarioPersonal: (usuario: Usuario) => void;
  eliminarUsuarioPersonal: (id: string) => void;

  familias: Familia[];
  familiaActual: Familia | undefined;
  agregarFamilia: (familia: Omit<Familia, 'id' | 'estado' | 'fechaRegistro'>) => void;
  aprobarFamilia: (id: string, estado: Familia['estado'], motivo?: string) => void;
  reenviarSolicitudFamilia: (id: string, datos: Omit<Familia, 'id' | 'estado' | 'fechaRegistro'>) => void;
  agregarIntegranteFamilia: (familiaId: string, integrante: IntegranteFamilia) => void;

  pagos: Pago[];
  registrarPago: (nuevoPago: Omit<Pago, 'id' | 'estado'>) => void;
  procesarPago: (id: string, estado: Pago['estado']) => void;

  casos: Caso[];
  reportarCaso: (nuevoCaso: Omit<Caso, 'id' | 'fechaReporte' | 'estado' | 'esEscalado' | 'reportadoPorId' | 'reportadoPorNombre'>) => void;
  enviarMensajeCaso: (casoId: string, texto: string) => void;
  actualizarEstadoCaso: (id: string, estado: Caso['estado']) => void;
  escalarCasoASuperAdmin: (casoId: string, motivo: string) => void;
  
  encuestas: Encuesta[];
  crearEncuesta: (casoId: string | undefined, edificioId: string, pregunta: string, opcionesTexto: string[], alcance: Encuesta['alcance'], destinoId?: string) => void;
  votarEncuesta: (encuestaId: string, opcionIndex: number, usuarioId: string) => void;

  bitacora: Bitacora[];
  registrarBitacora: (usuarioId: string, usuarioNombre: string, rol: Rol, accion: string, modulo: Bitacora['modulo'], descripcion: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [usuariosDisponibles, setUsuariosDisponibles] = useState<Usuario[]>([
    { id: '1', nombre: 'Carmen Rodríguez', correo: 'carmen@comunidad.com', rol: 'SUPER_ADMIN', usuarioLogin: 'admin', claveLogin: '123', esPrimerIngreso: true },
    { id: '2', nombre: 'Marcos Pérez', correo: 'marcos@bloque3.com', rol: 'VOCERO', edificioId: 'B3', areaVoceria: 'JUSTICIA_PAZ', usuarioLogin: 'vocero', claveLogin: '123', esPrimerIngreso: true },
    { id: '3', nombre: 'Ana María Silva', correo: 'anamaria@vecino.com', rol: 'JEFE_FAMILIA', edificioId: 'B3', apartamento: '2B', usuarioLogin: 'anamaria', claveLogin: '123', esPrimerIngreso: true },
  ]);

  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);
  const [pestanaActiva, setPestanaActiva] = useState<string>('registro-censos');

  const [familias, setFamilias] = useState<Familia[]>([
    {
      id: 'fam_1',
      jefeFamilia: 'Ana María Silva',
      cedulaJefe: 'V-14987654',
      usuarioId: '3',
      tieneAccesoApp: true,
      telefono: '0412-7654321',
      correo: 'anamaria@vecino.com',
      torre: 'Torre 1',
      bloque: 'B3',
      apartamento: '2B',
      integrantes: [],
      estado: 'APROBADA',
      fechaRegistro: new Date().toISOString()
    }
  ]);

  const [pagos, setPagos] = useState<Pago[]>([]);
  const [casos, setCasos] = useState<Caso[]>([]);
  const [encuestas, setEncuestas] = useState<Encuesta[]>([]);
  const [bitacora, setBitacora] = useState<Bitacora[]>([]);

  const familiaActual = usuarioActual ? familias.find(f => f.usuarioId === usuarioActual.id) : undefined;

  // --- LOGIN Y LOGOUT ---
  const login = (usuarioLogin: string, claveLogin: string) => {
    const user = usuariosDisponibles.find(u => u.usuarioLogin === usuarioLogin && u.claveLogin === claveLogin);
    if (user) {
      setUsuarioActual(user);
      if (user.rol === 'JEFE_FAMILIA') setPestanaActiva('censo-familiar');
      else if (user.rol === 'VOCERO') setPestanaActiva('mi-bloque');
      else if (user.rol === 'ADMIN_EDIFICIO') setPestanaActiva('casos-locales');
      else if (user.rol === 'SUPER_ADMIN') setPestanaActiva('registro-censos');
      else setPestanaActiva('reportes');
      return true;
    }
    return false;
  };

  const logout = () => {
    setUsuarioActual(null);
  };

  // ✨ AQUÍ ESTÁ LA MAGIA QUE FORZARÁ EL AVANCE
  const completarConfiguracionInicial = (nuevaClave: string, pregunta: string, respuesta: string) => {
    if (!usuarioActual) return;
    
    const usuarioActualizado = {
      ...usuarioActual,
      claveLogin: nuevaClave,
      preguntaSeguridad: pregunta,
      respuestaSeguridad: respuesta,
      esPrimerIngreso: false // <-- Esto abre el candado
    };

    // Actualizamos al usuario en tiempo real
    setUsuarioActual(usuarioActualizado);
    setUsuariosDisponibles(prev => prev.map(u => u.id === usuarioActual.id ? usuarioActualizado : u));

    // Alerta para asegurarnos de que la función se ejecutó correctamente
    alert("¡Seguridad configurada con éxito! Bienvenido al sistema.");
  };

  // ✨ SISTEMA DE RECUPERACIÓN DE CLAVE
  const obtenerFichaRecuperacion = (usuarioLogin: string) => {
    const user = usuariosDisponibles.find(u => u.usuarioLogin === usuarioLogin);
    if (!user) return { exito: false, mensaje: 'El usuario ingresado no existe en nuestros registros.' };
    
    // Aquí está la validación brillante que propusiste:
    if (user.esPrimerIngreso) {
      return { exito: false, mensaje: 'Aún no has configurado tus preguntas de seguridad. Debes solicitar una clave temporal al Administrador.' };
    }
    if (!user.preguntaSeguridad) return { exito: false, mensaje: 'Este usuario no tiene preguntas configuradas.' };
    
    return { exito: true, pregunta: user.preguntaSeguridad };
  };

  const recuperarClave = (usuarioLogin: string, respuesta: string, nuevaClave: string) => {
    const user = usuariosDisponibles.find(u => u.usuarioLogin === usuarioLogin);
    if (!user) return false;
    
    // Ignoramos mayúsculas, minúsculas y espacios extra para que sea amigable con el usuario
    const respuestaGuardada = user.respuestaSeguridad?.trim().toLowerCase();
    const respuestaIngresada = respuesta.trim().toLowerCase();
    
    if (respuestaGuardada !== respuestaIngresada) return false;

    // Actualizamos la base de datos simulada con la nueva clave
    setUsuariosDisponibles(prev => prev.map(u => u.id === user.id ? { ...u, claveLogin: nuevaClave } : u));
    return true;
  };

  // ✨ CAMBIAR CLAVE DESDE EL PERFIL
  const actualizarClavePerfil = (nuevaClave: string) => {
    if (!usuarioActual) return;
    const usuarioActualizado = { ...usuarioActual, claveLogin: nuevaClave };
    setUsuarioActual(usuarioActualizado);
    setUsuariosDisponibles(prev => prev.map(u => u.id === usuarioActual.id ? usuarioActualizado : u));
  };

 // --- CONTROL DE PERSONAL / USUARIOS ---
  const agregarUsuarioPersonal = (usuario: Omit<Usuario, 'id'>) => {
    const nuevoId = 'u_' + Math.random().toString(36).substr(2, 9);
    
    // ✨ AHORA SÍ: Respetamos el usuario y clave que el Admin escribió en el formulario
    // Si por algún error vienen vacíos, entonces usamos el correo y '123' como plan B.
    const usuarioFinal = usuario.usuarioLogin || (usuario.correo ? usuario.correo.split('@')[0] : `user_${nuevoId}`);
    const claveFinal = usuario.claveLogin || '123';

    const nuevoUsuario: Usuario = { 
      ...usuario, 
      id: nuevoId,
      usuarioLogin: usuarioFinal, 
      claveLogin: claveFinal, 
      esPrimerIngreso: true // Se mantiene la regla de seguridad de cambio obligatorio
    };

    setUsuariosDisponibles(prev => [...prev, nuevoUsuario]);

    // Generación automática del censo
    if (usuario.rol === 'JEFE_FAMILIA') {
      const nuevaFam: Familia = {
        id: 'fam_' + Math.random().toString(36).substr(2, 9),
        jefeFamilia: usuario.nombre,
        cedulaJefe: '',
        usuarioId: nuevoId,
        tieneAccesoApp: true,
        telefono: '',
        correo: usuario.correo,
        torre: '',
        bloque: usuario.edificioId || '',
        apartamento: usuario.apartamento || '',
        integrantes: [],
        estado: 'PENDIENTE',
        fechaRegistro: new Date().toISOString()
      };
      setFamilias(prev => [nuevaFam, ...prev]);
    }
    
    // ✨ La alerta ahora muestra la clave y usuario reales que escribiste
    alert(`Usuario creado exitosamente. \n\nCredenciales de Ingreso:\nUsuario: ${usuarioFinal}\nClave: ${claveFinal}`);
  };

  const editarUsuarioPersonal = (usuario: Usuario) => {
    setUsuariosDisponibles(prev => prev.map(u => u.id === usuario.id ? usuario : u));
    setFamilias(prev => prev.map(f => f.usuarioId === usuario.id ? { ...f, jefeFamilia: usuario.nombre, correo: usuario.correo, bloque: usuario.edificioId || f.bloque, apartamento: usuario.apartamento || f.apartamento } : f));
  };

  const eliminarUsuarioPersonal = (id: string) => {
    setUsuariosDisponibles(prev => prev.filter(u => u.id !== id));
    setFamilias(prev => prev.filter(f => f.usuarioId !== id));
  };

  const agregarFamilia = (familia: Omit<Familia, 'id' | 'estado' | 'fechaRegistro'>) => {
    setFamilias(prev => [{ ...familia, id: 'fam_' + Math.random().toString(36).substr(2, 9), estado: 'PENDIENTE', fechaRegistro: new Date().toISOString() }, ...prev]);
  };

  const aprobarFamilia = (id: string, estado: Familia['estado'], motivo?: string) => {
    setFamilias(prev => prev.map(f => f.id === id ? { ...f, estado, motivoRechazo: estado === 'RECHAZADA' ? motivo : undefined, fechaRevision: new Date().toISOString(), revisadoPor: usuarioActual?.nombre || 'Sistema' } : f));
  };

  const reenviarSolicitudFamilia = (id: string, datos: Omit<Familia, 'id' | 'estado' | 'fechaRegistro'>) => {
    setFamilias(prev => prev.map(f => f.id === id ? { ...f, ...datos, estado: 'PENDIENTE', motivoRechazo: undefined, fechaRegistro: new Date().toISOString() } : f));
  };

  const agregarIntegranteFamilia = (familiaId: string, integrante: IntegranteFamilia) => {
    setFamilias(prev => prev.map(f => f.id === familiaId ? { ...f, integrantes: [...f.integrantes, integrante] } : f));
  };

  const registrarPago = (nuevoPago: Omit<Pago, 'id' | 'estado'>) => {
    setPagos(prev => [{ ...nuevoPago, id: 'pag_' + Math.random().toString(36).substr(2, 9), estado: 'PENDIENTE' }, ...prev]);
  };

  const procesarPago = (id: string, estado: Pago['estado']) => {
    setPagos(prev => prev.map(p => p.id === id ? { ...p, estado } : p));
  };

  const reportarCaso = (nuevoCaso: Omit<Caso, 'id' | 'fechaReporte' | 'estado' | 'esEscalado' | 'reportadoPorId' | 'reportadoPorNombre'>) => {
    if (!usuarioActual) return;
    setCasos(prev => [{ ...nuevoCaso, id: 'cas_' + Math.random().toString(36).substr(2, 9), reportadoPorId: usuarioActual.id, reportadoPorNombre: usuarioActual.nombre, fechaReporte: new Date().toISOString().split('T')[0], estado: 'ABIERTO', esEscalado: false, mensajes: [] }, ...prev]);
  };

  const enviarMensajeCaso = (casoId: string, texto: string) => {
    if (!usuarioActual) return;
    const nuevoMensaje: MensajeCaso = { id: Date.now().toString(), autorId: usuarioActual.id, autorNombre: usuarioActual.nombre, autorRol: usuarioActual.rol as 'JEFE_FAMILIA' | 'VOCERO' | 'SUPER_ADMIN', texto, fecha: new Date().toLocaleString() };
    setCasos(prev => prev.map(caso => caso.id === casoId ? { ...caso, mensajes: [...(caso.mensajes || []), nuevoMensaje] } : caso));
  };

  const actualizarEstadoCaso = (id: string, estado: Caso['estado']) => { setCasos(prev => prev.map(c => c.id === id ? { ...c, estado } : c)); };
  const asignarEstatusCasoVoceros = (casoId: string, motivo: string) => { setCasos(prev => prev.map(c => c.id === casoId ? { ...c, esEscalado: true, motivoEscalacion: motivo, prioridad: 'ALTA' } : c)); };

  const crearEncuesta = (casoId: string | undefined, edificioId: string, pregunta: string, opcionesTexto: string[], alcance: Encuesta['alcance'], destinoId?: string) => {
    setEncuestas(prev => [...prev, { id: 'enc_' + Math.random().toString(36).substr(2, 9), casoId, edificioId, pregunta, opciones: opcionesTexto.map(t => ({ texto: t, votos: 0 })), votosResidentes: [], alcance, destinoId }]);
  }; 

  const votarEncuesta = (encuestaId: string, opcionIndex: number, usuarioId: string) => {
    setEncuestas(prev => prev.map(en => {
      if (en.id !== encuestaId || en.votosResidentes.includes(usuarioId)) return en;
      const nuevasOpciones = [...en.opciones];
      nuevasOpciones[opcionIndex].votos += 1;
      return { ...en, opciones: nuevasOpciones, votosResidentes: [...en.votosResidentes, usuarioId] };
    }));
  };

  const registrarBitacora = (usuarioId: string, usuarioNombre: string, rol: Rol, accion: string, modulo: Bitacora['modulo'], descripcion: string) => {
    setBitacora(prev => [{ id: 'bit_' + Math.random().toString(36).substr(2, 9), fecha: new Date().toLocaleString(), usuarioId, usuarioNombre, rol, accion, modulo, descripcion }, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        usuariosDisponibles, usuarioActual, login, logout,
        completarConfiguracionInicial,
        obtenerFichaRecuperacion, recuperarClave, actualizarClavePerfil, // Exportada correctamente
        pestanaActiva, setPestanaActiva,
        agregarUsuarioPersonal, editarUsuarioPersonal, eliminarUsuarioPersonal,
        familias, familiaActual, agregarFamilia, aprobarFamilia, reenviarSolicitudFamilia, agregarIntegranteFamilia,
        pagos, registrarPago, procesarPago,
        casos, reportarCaso, enviarMensajeCaso, actualizarEstadoCaso, escalarCasoASuperAdmin: asignarEstatusCasoVoceros,
        encuestas, crearEncuesta, votarEncuesta,
        bitacora, registrarBitacora
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp debe usarse dentro de un AppProvider');
  return context;
} 