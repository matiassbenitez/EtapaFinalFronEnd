export interface Servicio {
  id: number;
  tipoServicio: string;
  costoTotal: number;
}

export interface EstadiaServicio {
  id: number;
  estadiaId?: number;
  servicioId?: number;
  incluido: boolean;
  servicio: Servicio; // Objeto anidado que trae el endpoint de servicios detallados
}

export interface Huesped {
  id: number;
  nombre: string;
  apellido: string;
  docIdentidad: string;
  tipoDoc: string;
}

export interface Estadia {
  id: number;
  reservaId: number;
  habitacionId: number;
  fechaIngreso: string;
  fechaEgreso: string;
  huespedes: Huesped[];
  servicios: EstadiaServicio[];
}

export interface Reserva {
  fechaFin: any;
  fechaInicio: any;
  id: number;
  estado: string;
  nombre: string;
  apellido: string;
  huespedes: Huesped[];
  estadias: Estadia[];
}