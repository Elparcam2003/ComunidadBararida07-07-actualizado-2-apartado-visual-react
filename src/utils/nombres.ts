import type { Voceria } from '../types';

export const obtenerNombreRol = (rol: string) => {
    const nombres: Record<string, string> = {
      'SUPER_ADMIN': 'Administrador Superior',
      'VOCERO': 'Vocero Comunal',
      'ADMIN_EDIFICIO': 'Admin. de Edificio',
      'JEFE_FAMILIA': 'Jefe de Familia'
    };
    return nombres[rol] || rol;
  };

export const obtenerNombreVoceria = (voceria?: Voceria): string => {
  if (!voceria) return 'Sin vocería';

  const nombres: Record<Voceria, string> = {
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

  return nombres[voceria];
};
