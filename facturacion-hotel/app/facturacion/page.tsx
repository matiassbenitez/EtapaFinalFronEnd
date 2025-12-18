"use client";
import { useEffect, useState } from "react";
import { getReservas } from "../../lib/api"; 
import { Reserva } from "../../types/reserva"; 
import { useRouter } from "next/navigation";

export default function FacturacionPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const router = useRouter();

  async function cargarReservas() {
    try {
      const data = await getReservas({ nombre, apellido });
      setReservas(data);
    } catch (error) {
      console.error("Error cargando reservas:", error);
    }
  }

  useEffect(() => {
    cargarReservas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Facturación</h1>

      {/* Buscador */}
      <div className="flex gap-2 mb-6">
        <input
          placeholder="Nombre Responsable"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border p-2 rounded w-48"
        />
        <input
          placeholder="Apellido Responsable"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          className="border p-2 rounded w-48"
        />
        <button
          onClick={cargarReservas}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
        >
          Buscar
        </button>
      </div>

      
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
              <th className="px-4 py-3 w-1/12 text-center">ID</th>
              <th className="px-4 py-3 w-4/12">Responsable de la reserva</th> 
              <th className="px-4 py-3 w-2/12 text-center">Ingreso</th>
              <th className="px-4 py-3 w-2/12 text-center">Salida</th>
              <th className="px-4 py-3 w-2/12 text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            {reservas.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center">
                  No se encontraron reservas.
                </td>
              </tr>
            ) : (
              reservas.map((r) => (
                <tr key={r.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-center font-medium text-gray-900">
                    {r.id}
                  </td>
                  
                  
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    {r.nombre} {r.apellido}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {r.fechaInicio ? r.fechaInicio.split("T")[0] : "-"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {r.fechaFin ? r.fechaFin.split("T")[0] : "-"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => router.push(`/facturacion/${r.id}`)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                    >
                      Facturar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}