import React from "react";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-8 tracking-tight">
  Hotel Premier
</h1>
      <Link href="/habitaciones/reservar" className="w-100 text-center my-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition">Reservar Habitación</Link>
      <Link href="/reservas/cancelar" className="w-100 text-center my-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition">Cancelar reserva</Link>
      <Link href="http://localhost:3001/facturacion" className="w-100 text-center my-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition">Facturar</Link>
      <Link href="/huesped/buscar" className="w-100 text-center my-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition">Buscar huésped</Link>
      <Link href="/huesped/crear" className="w-100 text-center my-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition">Dar de alta Huésped</Link>
   
 </div>
  );
}

export default HomePage;