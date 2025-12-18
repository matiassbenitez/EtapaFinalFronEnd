export interface Habitacion {
  numero: number;
  tipo: string;
  precioPorNoche: number;
  noches: number;
}

export interface Servicio {
  id: number;
  nombre: string;
  precio: number;
}

export interface FacturaDetalle {
  reservaId: number;
  huespedResponsable: string;
  habitaciones: Habitacion[];
  servicios: Servicio[];
  total: number;
  yaFacturada: boolean;
}
