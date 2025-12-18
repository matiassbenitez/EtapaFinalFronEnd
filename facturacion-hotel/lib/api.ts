import { FacturaCreateDTO, PersonaJuridica } from "@/types/facturacion";
import { Reserva, EstadiaServicio } from "@/types/reserva";

const API_BASE_URL = "http://localhost:8080/api";


export async function getReservas(p0: { nombre: string; apellido: string; }): Promise<Reserva[]> {
  const res = await fetch(`${API_BASE_URL}/reserva`, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al obtener reservas");
  return res.json();
}


export async function getReservaById(id: number): Promise<Reserva> {
  const res = await fetch(`${API_BASE_URL}/reserva/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al obtener la reserva");
  return res.json();
}


export async function getServiciosPorEstadia(idEstadia: number): Promise<EstadiaServicio[]> {
  const res = await fetch(`${API_BASE_URL}/estadia/servicios/${idEstadia}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al obtener servicios");
  return res.json();
}


export async function getPersonaJuridicaByCuit(cuit: string): Promise<PersonaJuridica | null> {
  const res = await fetch(`${API_BASE_URL}/factura/personaJuridica/cuit/${cuit}`, { cache: "no-store" });
  
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Error al buscar empresa");
  
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}


export async function createPersonaJuridica(pj: PersonaJuridica): Promise<PersonaJuridica> {
  const res = await fetch(`${API_BASE_URL}/factura/personaJuridica`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pj),
  });
  if (!res.ok) throw new Error("Error al crear la empresa");
  return res.json();
}


export async function createFactura(factura: FacturaCreateDTO): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/factura`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(factura),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Error al crear factura");
  }
  return res.json();
}