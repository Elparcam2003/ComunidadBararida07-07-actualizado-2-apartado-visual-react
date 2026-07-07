// src/context/AppContext.tsx

import React, { createContext, useContext, useState } from 'react';
import type { Usuario, Familia, Pago, Caso, Encuesta, Bitacora, MensajeCaso, IntegranteFamilia, Rol } from '../types';

interface AppContextProps {
  usuariosDisponibles: Usuario[];
  usuarioActual: Usuario;
  cambiarUsuario: (id: string) => void;
  pestanaActiva: string;
  setPestanaActiva: (pestana: string) => void;
  
  // Gestión de Personal / Usuarios
  agregarUsuarioPersonal: (usuario: Omit<Usuario, 'id'>) => void;
  editarUsuarioPersonal: (usuario: Usuario) => void;
  eliminarUsuarioPersonal: (id: string) => void;

  // Censo Familiar Único
  familias: Familia[];
  familiaActual: Familia | undefined;
  agregarFamilia: (familia: Omit<Familia, 'id' | 'estado' | 'fechaRegistro'>) => void;
  aprobarFamilia: (id: string, estado: Familia['estado'], motivo?: string) => void;
  reenviarSolicitudFamilia: (id: string, datos: Omit<Familia, 'id' | 'estado' | 'fechaRegistro'>) => void;
  agregarIntegranteFamilia: (familiaId: string, integrante: IntegranteFamilia) => void;

  // Finanzas por Vivienda
  pagos: Pago[];
  registrarPago: (nuevoPago: Omit<Pago, 'id' | 'estado'>) => void;
  procesarPago: (id: string, estado: Pago['estado']) => void;

  // Casos Comunales
  casos: Caso[];
  reportarCaso: (nuevoCaso: Omit<Caso, 'id' | 'fechaReporte' | 'estado' | 'esEscalado' | 'reportadoPorId' | 'reportadoPorNombre'>) => void;
  enviarMensajeCaso: (casoId: string, texto: string) => void;
  actualizarEstadoCaso: (id: string, estado: Caso['estado']) => void;
  escalarCasoASuperAdmin: (casoId: string, motivo: string) => void;
  // Encuestas de Decisiones
  encuestas: Encuesta[];
  crearEncuesta: (casoId: string | undefined, edificioId: string, pregunta: string, opcionesTexto: string[], alcance: Encuesta['alcance'], destinoId?: string) => void;
  votarEncuesta: (encuestaId: string, opcionIndex: number, usuarioId: string) => void;

  // Bitácora de Auditoría
  bitacora: Bitacora[];
  registrarBitacora: (usuarioId: string, usuarioNombre: string, rol: Rol, accion: string, modulo: Bitacora['modulo'], descripcion: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Mock inicial limpio
  const [usuariosDisponibles, setUsuariosDisponibles] = useState<Usuario[]>([
    { id: '1', nombre: 'Carmen Rodríguez', correo: 'carmen@comunidad.com', rol: 'SUPER_ADMIN' },
    { id: '2', nombre: 'Marcos Pérez', correo: 'marcos@bloque3.com', rol: 'VOCERO', edificioId: 'B3',areaVoceria: 'JUSTICIA_PAZ' },
    { id: '3', nombre: 'Ana María Silva', correo: 'anamaria@vecino.com', rol: 'JEFE_FAMILIA', edificioId: 'B3', apartamento: '2B', usuarioLogin: 'anamaria', claveLogin: '123456' },
  ]);

  const [usuarioActual, setUsuarioActual] = useState<Usuario>(usuariosDisponibles[0]);
  const [pestanaActiva, setPestanaActiva] = useState<string>('censo');

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

  const familiaActual = familias.find(f => f.usuarioId === usuarioActual.id);

  const cambiarUsuario = (id: string) => {
    const user = usuariosDisponibles.find(u => u.id === id);
    if (user) setUsuarioActual(user);
  };

  // --- CONTROL DE PERSONAL / USUARIOS ---
  const agregarUsuarioPersonal = (usuario: Omit<Usuario, 'id'>) => {
    const nuevoId = 'u_' + Math.random().toString(36).substr(2, 9);
    const nuevoUsuario: Usuario = { ...usuario, id: nuevoId };
    setUsuariosDisponibles(prev => [...prev, nuevoUsuario]);

    // Generación automática del censo si se crea un Jefe de Familia directo
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
  };

  const editarUsuarioPersonal = (usuario: Usuario) => {
    setUsuariosDisponibles(prev => prev.map(u => u.id === usuario.id ? usuario : u));
    setFamilias(prev => prev.map(f => f.usuarioId === usuario.id ? {
      ...f,
      jefeFamilia: usuario.nombre,
      correo: usuario.correo,
      bloque: usuario.edificioId || f.bloque,
      apartamento: usuario.apartamento || f.apartamento
    } : f));
  };

  const eliminarUsuarioPersonal = (id: string) => {
    setUsuariosDisponibles(prev => prev.filter(u => u.id !== id));
    setFamilias(prev => prev.filter(f => f.usuarioId !== id));
  };

  // --- CONTROL DEL CENSO FAMILIAR ---
  const agregarFamilia = (familia: Omit<Familia, 'id' | 'estado' | 'fechaRegistro'>) => {
    const nueva: Familia = {
      ...familia,
      id: 'fam_' + Math.random().toString(36).substr(2, 9),
      estado: 'PENDIENTE',
      fechaRegistro: new Date().toISOString()
    };
    setFamilias(prev => [nueva, ...prev]);
  };

  const aprobarFamilia = (id: string, estado: Familia['estado'], motivo?: string) => {
    setFamilias(prev => prev.map(f => f.id === id ? {
      ...f,
      estado,
      motivoRechazo: estado === 'RECHAZADA' ? motivo : undefined,
      fechaRevision: new Date().toISOString(),
      revisadoPor: usuarioActual.nombre
    } : f));
  };

  const reenviarSolicitudFamilia = (id: string, datos: Omit<Familia, 'id' | 'estado' | 'fechaRegistro'>) => {
    setFamilias(prev => prev.map(f => f.id === id ? { ...f, ...datos, estado: 'PENDIENTE', motivoRechazo: undefined, fechaRegistro: new Date().toISOString() } : f));
  };

  const agregarIntegranteFamilia = (familiaId: string, integrante: IntegranteFamilia) => {
    setFamilias(prev => prev.map(f => f.id === familiaId ? { ...f, integrantes: [...f.integrantes, integrante] } : f));
  };

  // --- FINANZAS / PAGOS ---
  const registrarPago = (nuevoPago: Omit<Pago, 'id' | 'estado'>) => {
    const nuevo: Pago = { ...nuevoPago, id: 'pag_' + Math.random().toString(36).substr(2, 9), estado: 'PENDIENTE' };
    setPagos(prev => [nuevo, ...prev]);
  };

  const procesarPago = (id: string, estado: Pago['estado']) => {
    setPagos(prev => prev.map(p => p.id === id ? { ...p, estado } : p));
  };

  // --- CASOS COMUNALES ---
  const reportarCaso = (nuevoCaso: Omit<Caso, 'id' | 'fechaReporte' | 'estado' | 'esEscalado' | 'reportadoPorId' | 'reportadoPorNombre'>) => {
    const nuevo: Caso = {
      ...nuevoCaso,
      id: 'cas_' + Math.random().toString(36).substr(2, 9),
      reportadoPorId: usuarioActual.id,
      reportadoPorNombre: usuarioActual.nombre,
      fechaReporte: new Date().toISOString().split('T')[0],
      estado: 'ABIERTO',
      esEscalado: false,
      mensajes: []
    };
    setCasos(prev => [nuevo, ...prev]);
  };

  const enviarMensajeCaso = (casoId: string, texto: string) => {
  const nuevoMensaje: MensajeCaso = {
    id: Date.now().toString(), // Generador de ID temporal
    autorId: usuarioActual.id,
    autorNombre: usuarioActual.nombre,
    autorRol: usuarioActual.rol as 'JEFE_FAMILIA' | 'VOCERO' | 'SUPER_ADMIN',
    texto,
    fecha: new Date().toLocaleString()
  };

  setCasos(prevCasos => prevCasos.map(caso => 
    caso.id === casoId 
      ? { ...caso, mensajes: [...(caso.mensajes || []), nuevoMensaje] }
      : caso
  ));
};

  const actualizarEstadoCaso = (id: string, estado: Caso['estado']) => {
    setCasos(prev => prev.map(c => c.id === id ? { ...c, estado } : c));
  };

  const asignarEstatusCasoVoceros = (casoId: string, motivo: string) => {
    setCasos(prev => prev.map(c => c.id === casoId ? { ...c, esEscalado: true, motivoEscalacion: motivo, prioridad: 'ALTA' } : c));
  };

  // --- ENCUESTAS ---
  const crearEncuesta = (casoId: string | undefined, edificioId: string, pregunta: string, opcionesTexto: string[], alcance: Encuesta['alcance'], destinoId?: string) => {
    const nueva: Encuesta = {
      id: 'enc_' + Math.random().toString(36).substr(2, 9),
      casoId,
      edificioId,
      pregunta,
      opciones: opcionesTexto.map(t => ({ texto: t, votos: 0 })),
      votosResidentes: [],
      alcance,
      destinoId
    };
    setEncuestas(prev => [...prev, nueva]);
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
    const nueva: Bitacora = { id: 'bit_' + Math.random().toString(36).substr(2, 9), fecha: new Date().toLocaleString(), usuarioId, usuarioNombre, rol, accion, modulo, descripcion };
    setBitacora(prev => [nueva, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        usuariosDisponibles,
        usuarioActual,
        cambiarUsuario,
        pestanaActiva,
        setPestanaActiva,
        agregarUsuarioPersonal,
        editarUsuarioPersonal,
        eliminarUsuarioPersonal,
        familias,
        familiaActual,
        agregarFamilia,
        aprobarFamilia,
        reenviarSolicitudFamilia,
        agregarIntegranteFamilia,
        pagos,
        registrarPago,
        procesarPago,
        casos,
        reportarCaso,
        enviarMensajeCaso,
        actualizarEstadoCaso,
        escalarCasoASuperAdmin: asignarEstatusCasoVoceros,
        encuestas,
        crearEncuesta,
        votarEncuesta,
        bitacora,
        registrarBitacora
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