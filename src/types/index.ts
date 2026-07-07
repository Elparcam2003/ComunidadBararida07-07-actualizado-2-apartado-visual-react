// src/types/index.ts

export type Rol = 'SUPER_ADMIN' | 'ADMIN_EDIFICIO' | 'VOCERO' | 'JEFE_FAMILIA';

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

export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  rol: Rol;
  edificioId?: string;
  voceria?: Voceria;
  usuarioLogin?: string;
  claveLogin?: string;
  apartamento?: string;
  areaVoceria?: Voceria;
}

export interface Pago {
  id: string;
  familiaId: string; // Apunta a la Familia / Vivienda que paga
  jefeNombre: string;
  edificioId: string;
  apartamento: string;
  monto: number;
  fecha: string;
  referencia: string;
  metodoPago: 'PAGO_MOVIL' | 'TRANSFERENCIA' | 'EFECTIVO';
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'INACTIVO';
}

export interface Encuesta {
  id: string;
  casoId?: string; // Opcional si es global o manual
  edificioId: string; // 'TODOS' o el ID del bloque específico
  pregunta: string;
  opciones: { texto: string; votos: number }[];
  votosResidentes: string[]; // IDs de los Jefes de Familia (usuarios) que ya votaron
  alcance: 'GLOBAL' | 'BLOQUE' | 'DIRECTO';
  destinoId?: string; // Si es DIRECTO, guarda el usuarioId del Jefe de Familia específico
}

export interface Caso {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: 'INFRAESTRUCTURA' | 'SERVICIOS' | 'CONVIVENCIA';
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA';
  edificioId: string;
  reportadoPorId: string; // ID del Jefe de Familia o Admin que reporta
  reportadoPorNombre: string;
  fechaReporte: string;
  estado: 'ABIERTO' | 'EN_PROCESO' | 'RESUELTO';
  esEscalado: boolean;
  motivoEscalacion?: string;
  areaDestino?: Voceria; // Enlazado con las vocerías para el Paso de Voceros
}

export type ModuloBitacora =
  | 'PERSONAL'
  | 'CENSO'
  | 'FINANZAS'
  | 'CASOS'
  | 'ENCUESTAS'
  | 'SISTEMA';
  
export interface Bitacora {
  id: string;
  fecha: string;
  usuarioId: string;
  usuarioNombre: string;
  rol: Rol;
  accion: string;
  modulo: ModuloBitacora;
  descripcion: string;
}

export type Parentesco =
  | 'JEFE FAMILIA'
  | 'CONYUGE'
  | 'HIJO'
  | 'HIJA'
  | 'PADRE'
  | 'MADRE'
  | 'ABUELO'
  | 'ABUELA'
  | 'OTRO';

export interface IntegranteFamilia {
  id: string;
  nombre: string;
  cedula: string;
  fechaNacimiento: string;
  sexo: 'MASCULINO' | 'FEMENINO';
  parentesco: Parentesco;
  poseeDiscapacidad: boolean;
  tipoDiscapacidad?: 'MOTORA' | 'VISUAL' | 'AUDITIVA' | 'INTELECTUAL' | 'PSICOSOCIAL' | 'MULTIPLE' | 'OTRA';
  descripcionDiscapacidad?: string;
  poseeEnfermedad: boolean;
  descripcionEnfermedad?: string;
}

export interface Familia {
  id: string;
  jefeFamilia: string;
  cedulaJefe: string;
  usuarioId?: string; // Enlace al login del jefe
  tieneAccesoApp: boolean;
  telefono: string;
  correo: string;
  torre: string;
  bloque: string;
  apartamento: string;
  integrantes: IntegranteFamilia[];
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'INACTIVO';
  fechaRegistro: string;
  fechaRevision?: string;
  revisadoPor?: string;
  motivoRechazo?: string;
}