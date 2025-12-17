import React from "react";
import { useState, useEffect, useCallback } from "react";
import TablaEstadoDeHabitaciones from "../../../components/TablaEstadoDeHabitaciones";
import ModalHuesped from "./../../../components/ModalHuesped";
import { useRouter } from "next/router";

type ReservaPendiente = {
    habitacionId: number;
    fechaInicio: string;
    fechaFin: string;
};

type ReservaData = {
    habitacionesIds: number[];
    huespedesIds: number[];
    fechaInicio: string;
    fechaFin: string;
    nombre: string;
    apellido: string;
    contacto: string;
};

const enviarReservasAlServidor = async (reserva: ReservaData) => {
    try {
        const response = await fetch("http://localhost:8080/api/reserva", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reserva),
        });
        if (!response.ok) {
            console.log("json enviado:", JSON.stringify(reserva));
            throw new Error("Error al enviar las reservas al servidor");
        }
        const data = await response.json();
        console.log("Reservas enviadas con éxito:", data);
    } catch (error) {
        console.error("Error al enviar las reservas:", error);
        alert("Error al enviar las reservas");
    }
};

const MostrarEstadoHabitaciones = () => {
    const router = useRouter();
    const [habitaciones, setHabitaciones] = useState([]);
    //const [reservaPendiente, setReservaPendiente] = useState<ReservaPendiente | null>(null);
    const [listaReservas, setListaReservas] = useState<ReservaPendiente[]>([]);
    const [mostrarModalHuesped, setMostrarModalHuesped] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [filtros, setFiltros] = useState({
        fechaInicio: "",
        fechaFin: "",
    });

    const handleReservaSeleccionada = (reserva: ReservaPendiente) => {
        //setReservaPendiente(reserva);
        setListaReservas([...listaReservas, reserva]);
        //alert(`Reserva seleccionada: Habitación ${reserva.habitacionId} desde ${reserva.fechaInicio} hasta ${reserva.fechaFin}`);
        //handleAbrirModalCliente(reserva);
    };

    const handleAbrirModalCliente = (reserva: ReservaPendiente) => {
        setMostrarModalHuesped(true);
    };

    const handleConfirmar = (huespedData: {
        nombre: string;
        apellido: string;
        contacto: string;
    }) => {
        for (const reservaPendiente of listaReservas) {
            const reservaCompleta: ReservaData = {
                huespedesIds: [],
                habitacionesIds: [reservaPendiente.habitacionId],
                fechaInicio: reservaPendiente.fechaInicio + "T00:00:00",
                fechaFin: reservaPendiente.fechaFin + "T23:59:59",
                nombre: huespedData.nombre,
                apellido: huespedData.apellido,
                contacto: huespedData.contacto,
            };
            console.log("reservaCompleta enviada: ", reservaCompleta);
            enviarReservasAlServidor(reservaCompleta);
        }
        fetchHabitaciones();
        setMostrarModalHuesped(false);
        setListaReservas([]);
    };

    const handleFiltroChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFiltros({
            ...filtros,
            [e.target.name]: e.target.value,
        });
    };

    const fetchHabitaciones = useCallback(async () => {
        if (!filtros.fechaInicio || !filtros.fechaFin) {
            setLoading(false);
            setHabitaciones([]); 
            return;
        }

        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        if (filtros.fechaInicio)
            params.append("fechaInicio", filtros.fechaInicio + "T00:00:00");
        if (filtros.fechaFin)
            params.append("fechaFin", filtros.fechaFin + "T23:59:59");
        console.log("params", params.toString());
        //if (filtros.tipo) params.append('tipo', filtros.tipo);
        const url = `http://localhost:8080/api/habitacion/buscar?${params.toString()}`;
        console.log("URL de fetch:", url);
        try {
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(
                    "Error al obtener los datos de las habitaciones"
                );
            }
            const data = await res.json();
            console.log("Datos recibidos de la API:", data);
            setHabitaciones(data);
        } catch (error) {
            console.error(error);
            setError(
                "Ha ocurrido un error al cargar los datos de las habitaciones."
            );
        } finally {
            setLoading(false);
        }
    }, [filtros]);

    const fechasInvertidas =
        filtros.fechaInicio &&
        filtros.fechaFin &&
        new Date(filtros.fechaInicio) > new Date(filtros.fechaFin);
    useEffect(() => {
        fetchHabitaciones();
    }, [filtros, fetchHabitaciones]);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;
    return (
        <div className="container mx-auto p-4 relative">
            {" "}
            {/* relative ayuda a controlar el contexto */}
            <form className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">
                    Estado de Habitaciones
                </h1>
                <div className="flex flex-wrap gap-4 items-center">
                    <div>
                        <label
                            htmlFor="fechaInicio"
                            className="block text-sm font-medium text-gray-600"
                        >
                            Fecha de Inicio:
                        </label>
                        <input
                            type="date"
                            id="fechaInicio"
                            name="fechaInicio"
                            value={filtros.fechaInicio}
                            onChange={handleFiltroChange}
                            className="border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="fechaFin"
                            className="block text-sm font-medium text-gray-600"
                        >
                            Fecha de Fin:
                        </label>
                        <input
                            type="date"
                            id="fechaFin"
                            name="fechaFin"
                            value={filtros.fechaFin}
                            onChange={handleFiltroChange}
                            className="border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>
            </form>
            <div className="relative z-0 overflow-hidden rounded-xl border border-gray-200">
                {fechasInvertidas ? (
                    <div className="p-10 text-center text-amber-600 bg-amber-50 font-medium">
                        La fecha de inicio debe ser anterior a la fecha de
                        fin.
                    </div>
                ) : loading ? (
                    <div className="p-10 text-center text-gray-500">
                        Cargando...
                    </div>
                ) : error ? (
                    <div className="p-10 text-center text-red-500 font-medium">
                        Error: {error}
                    </div>
                ) : filtros.fechaInicio && filtros.fechaFin ? (
                    <TablaEstadoDeHabitaciones
                        listado={listaReservas}
                        habitaciones={habitaciones}
                        fechaInicio={filtros.fechaInicio}
                        fechaFin={filtros.fechaFin}
                        onReservaSeleccionada={handleReservaSeleccionada}
                        //reservaActual={reservaPendiente}
                    />
                ) : (
                    <div className="p-10 text-center text-gray-400 bg-gray-50 italic">
                        Seleccione un rango de fechas para ver disponibilidad
                    </div>
                )}
            </div>
            {mostrarModalHuesped && (
                <div className="fixed inset-0 z-100">
                    <ModalHuesped
                        mostrar={mostrarModalHuesped}
                        onConfirmar={handleConfirmar}
                        onCancelar={() => {
                            setMostrarModalHuesped(false);
                            setListaReservas([]);
                        }}
                    />
                </div>
            )}
            {listaReservas.length > 0 && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-60">
                    <button
                        onClick={() => setMostrarModalHuesped(true)}
                        className="bg-blue-600 text-white px-8 py-3 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-4"
                    >
                        Confirmar Reservas Seleccionadas
                        <span className="bg-blue-500 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                            {listaReservas.length}
                        </span>
                    </button>
                </div>
            )}
            <button type="button" onClick={router.back} className="mt-2 w-full h-10 bg-gray-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-700 transition duration-150">
                                Volver
                            </button>
        </div>
    );
};

export default MostrarEstadoHabitaciones;
