import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">
          Sistema de Facturación Hotel
        </h1>

        <p className="text-gray-600 mb-6">
          Gestión de facturas asociadas a reservas y huéspedes
        </p>

        <Link
          href="/facturacion"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 inline-block"
        >
          Ir a Facturación
        </Link>
      </div>
    </main>
  );
}
