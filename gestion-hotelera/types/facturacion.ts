import { EstadiaServicio } from "./reserva";

export interface ResponsablePago {
  id: number;
  nombre: string;
  identificador: string; // DNI o CUIT
  tipo: "HUESPED" | "EMPRESA";
}

export interface PersonaJuridica {
  id?: number;
  razonSocial: string;
  cuit: string;
  condicionIva: string;
  telefono: string;
  direccion?: string;
}

export interface FacturaCreateDTO {
  idResponsableDePago: number;
  idEstadia: number;
  servicios: Partial<EstadiaServicio>[]; 
}