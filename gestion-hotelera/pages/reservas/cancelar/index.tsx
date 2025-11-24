import React, { useState } from "react";
import { MOCK_RESERVAS } from "@/data/mockReservas";

interface Reserva {
    id: number;
    nombre: string;
    apellido: string;
    fecha: string;
    estado: string;
}
function CancelarReservaPage() {
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [busquedaRealizada, setBusquedaRealizada] = useState<boolean>(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const url = "/api/reservas/buscar";
        const formData = new FormData(event.target as HTMLFormElement);
        const nombre = formData.get("nombre") as string;
        const apellido = formData.get("apellido") as string;
        setLoading(true);
        setError(null);
        setBusquedaRealizada(true);
        // try {
        //     await fetchData(url, nombre, apellido);
        // } catch (error) {
        //     console.error("Error fetching data:", error);
        // }
        setReservas(
            MOCK_RESERVAS.filter(
                (reserva) =>
                    reserva.nombre.toLowerCase() === nombre.toLowerCase() &&
                    reserva.apellido.toLowerCase() === apellido.toLowerCase()
            )
        );
        setLoading(false);

    await new Promise(resolve => setTimeout(resolve, 500)); 
            setReservas(MOCK_RESERVAS); 
            setLoading(false);
            console.log("Datos simulados cargados:", MOCK_RESERVAS);
        return true;
      };
    

    // const fetchData = async (url: string, nombre: string, apellido: string) => {
    //     try {
    //         const response = await fetch(url, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({ nombre, apellido }),
    //         });
    //         if (!response.ok) {
    //             throw new Error("Network response was not ok");
    //         }

    //         const data: Reserva[] = await response.json();
    //         setReservas(data);
    //     } catch (error) {
    //         console.error("Error fetching data:", error);
    //         setError("Error fetching data");
    //         setReservas([]);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">Buscar Reserva</h1>
            <form action="" onSubmit={handleSubmit} className="m-10 p-4 border rounded-lg shadow-md bg-white">
                <label htmlFor="nombre" className="block text-gray-700 font-medium mb-1" >Nombre:</label>
                <input type="text" name="nombre" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-10" />
                <br />
                <label htmlFor="apellido" className="block text-gray-700 font-medium mb-1" >Apellido:</label>
                <input type="text" name="apellido" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-10" />
                <br />
                <button type="submit" disabled={loading} className="mt-2 w-full h-10 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-150">
                    {loading ? "Buscando..." : "Buscar"}
                </button>
            </form>
            {error && <p className="text-red-500">{error}</p>}
            <div className="mt-4">
                {reservas.length > 0 ? (
                    <div className="w-full max-w-2xl">
                        <h2 className="text-2xl font-bold mb-2">
                            Reservas Encontradas:
                        </h2>
                        <div className="space-y-4">
                            {reservas.map((reserva) => (
                                <div
                                    key={reserva.id}
                                    className="p-4 border rounded shadow">
                                    <p>
                                        <strong>Nombre:</strong>{" "}
                                        {reserva.nombre} {reserva.apellido}
                                    </p>
                                    <p>
                                        <strong>Fecha:</strong>{" "}
                                        {reserva.fecha}
                                    </p>
                                    <p>
                                        <strong>Estado:</strong>{" "}
                                        {reserva.estado}
                                    </p>
                                    <button className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                                        Cancelar Reserva
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    !loading && busquedaRealizada && <p>No se encontraron reservas.</p>
                )}
            </div>
        </div>
    );
}
export default CancelarReservaPage;
