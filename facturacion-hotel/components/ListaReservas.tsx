'use client';

import { useRouter } from 'next/navigation';

export default function ListaReservas({ reservas }: { reservas: any[] }) {
  const router = useRouter();

  return (
    <table className="min-w-full bg-white rounded shadow">
      <thead>
        <tr className="bg-gray-200">
          <th className="px-4 py-2">ID</th>
          <th className="px-4 py-2">Responsable</th>
          <th className="px-4 py-2">Acción</th>
        </tr>
      </thead>
      <tbody>
        {reservas.length === 0 && (
          <tr>
            <td colSpan={3} className="text-center py-4">
              No hay reservas
            </td>
          </tr>
        )}

        {reservas.map((r) => (
          <tr key={r.id} className="border-t">
            <td className="px-4 py-2">{r.id}</td>
            <td className="px-4 py-2">
              {r.responsable?.nombre} {r.responsable?.apellido}
            </td>
            <td className="px-4 py-2">
              <button
                onClick={() => router.push(`/facturacion/${r.id}`)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Facturar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
