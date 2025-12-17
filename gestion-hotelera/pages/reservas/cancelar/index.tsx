import React, { useState, useCallback } from "react";
import { useRouter } from "next/router";

interface Reserva {
    id: number;
    nombre: string;
    apellido: string;
    fechaInicio: string;
    estado: string;
}
function CancelarReservaPage() {
    const router = useRouter();
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [busquedaRealizada, setBusquedaRealizada] = useState<boolean>(false);
    const [cancellingId, setCancellingId] = useState<number | null>(null);

    const fetchData = useCallback(async (url: string) => {
        setLoading(true);
        setError(null);
        setBusquedaRealizada(true);

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    `Error ${response.status}: ${
                        errorText || "Respuesta de red no exitosa"
                    }`
                );
            }

            const data: Reserva[] = await response.json();
            setReservas(data);
        } catch (err: any) {
            console.error("Error al obtener datos:", err);
            setError(
                `Error al buscar reservas: ${
                    err.message || "Error de conexión"
                }`
            );
            setReservas([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleCancel = async (reservaId: number) => {
        setCancellingId(reservaId);
        setError(null);
        const arrayReservasIds: number[] = [reservaId];
        try {
            const response = await fetch(
                `http://localhost:8080/api/reserva/cancelar`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(arrayReservasIds),
                }
            );
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    `Error ${response.status}: ${
                        errorText || "Respuesta de red no exitosa"
                    }`
                );
            }
            setReservas((prevReservas) =>
                prevReservas.filter((reserva) => reserva.id !== reservaId)
            );
        } catch (err: any) {
            console.error("Error al cancelar la reserva:", err);
            setError(
                `Error al cancelar la reserva: ${
                    err.message || "Error de conexión"
                }`
            );
        } finally {
            setCancellingId(null);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const urlBase = "http://localhost:8080/api/reserva/responsable";
        const formData = new FormData(event.target as HTMLFormElement);
        const nombre = ((formData.get("nombre") as string) || "").trim();
        const apellido = ((formData.get("apellido") as string) || "").trim();
        const params = new URLSearchParams();
        if (nombre) params.append("nombre", nombre);
        if (apellido) params.append("apellido", apellido);
        const urlFinal = `${urlBase}${
            params.toString() ? "?" + params.toString() : ""
        }`;
        await fetchData(urlFinal);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">Buscar Reserva</h1>
            <form
                action=""
                onSubmit={handleSubmit}
                className="m-10 p-4 border rounded-lg shadow-md bg-white"
            >
                <label
                    htmlFor="nombre"
                    className="block text-gray-700 font-medium mb-1"
                >
                    Nombre:
                </label>
                <input
                    type="text"
                    name="nombre"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-10"
                />
                <br />
                <label
                    htmlFor="apellido"
                    className="block text-gray-700 font-medium mb-1"
                >
                    Apellido:
                </label>
                <input
                    type="text"
                    name="apellido"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-10"
                />
                <br />
                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full h-10 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-150"
                >
                    {loading ? "Buscando..." : "Buscar"}
                </button>
                <button
                    type="button"
                    onClick={router.back}
                    className="mt-2 w-full h-10 bg-gray-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-700 transition duration-150"
                >
                    Volver
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
                            {reservas.map(
                                (reserva) => (
                                    console.log(reserva),
                                    (
                                        <div
                                            key={reserva.id}
                                            className="p-4 border rounded shadow"
                                        >
                                            <p>
                                                <strong>Nombre:</strong>{" "}
                                                {reserva.nombre}{" "}
                                                {reserva.apellido}
                                            </p>
                                            <p>
                                                <strong>Fecha:</strong>{" "}
                                                {reserva.fechaInicio
                                                    .split("T")[0]
                                                    .split("-")
                                                    .reverse()
                                                    .join("-")}
                                            </p>
                                            <p>
                                                <strong>Estado:</strong>{" "}
                                                {reserva.estado}
                                            </p>
                                            <button
                                                onClick={() =>
                                                    handleCancel(reserva.id)
                                                }
                                                disabled={
                                                    cancellingId ===
                                                        reserva.id ||
                                                    reserva.estado ==
                                                        "CANCELADA" || reserva.estado == "ACTIVA"
                                                }
                                                className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600
                                    disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
                                            >
                                                Cancelar Reserva
                                            </button>
                                        </div>
                                    )
                                )
                            )}
                        </div>
                    </div>
                ) : (
                    !loading &&
                    busquedaRealizada && <p>No se encontraron reservas.</p>
                )}
            </div>
        </div>
    );
}
export default CancelarReservaPage;
