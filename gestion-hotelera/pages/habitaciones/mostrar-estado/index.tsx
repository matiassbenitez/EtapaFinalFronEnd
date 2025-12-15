import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import TablaEstadoDeHabitaciones from '../../../components/TablaEstadoDeHabitaciones';
import ModalHuesped from './../../../components/ModalHuesped';

type ReservaPendiente = {
  habitacionId: number;
  fechaInicio: string;
  fechaFin: string;
}

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
    const response = await fetch('http://localhost:8080/api/reserva', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reserva),
    });
    if (!response.ok) {
      console.log('json enviado:', JSON.stringify(reserva));
      throw new Error('Error al enviar las reservas al servidor');
    }
    const data = await response.json();
    console.log('Reservas enviadas con éxito:', data);
    alert('Reservas enviadas con éxito');
  } catch (error) {
    console.error('Error al enviar las reservas:', error);
    alert('Error al enviar las reservas');
  }
};

const MostrarEstadoHabitaciones = () => {
  const [habitaciones, setHabitaciones] = useState([]);
  const [reservaPendiente, setReservaPendiente] = useState<ReservaPendiente | null>(null);
  const [mostrarModalHuesped, setMostrarModalHuesped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buscado, setBuscado] = useState(false);

  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
  });

  const handleReservaSeleccionada = (reserva: ReservaPendiente) => {
    setReservaPendiente(reserva);
    alert(`Reserva seleccionada: Habitación ${reserva.habitacionId} desde ${reserva.fechaInicio} hasta ${reserva.fechaFin}`);
    alert(reservaPendiente);
    handleAbrirModalCliente(reserva);
  };

  const handleAbrirModalCliente = (reserva: ReservaPendiente) => {
    // if (!reservaPendiente) {
    //   alert('Por favor, seleccione una reserva primero.');
    //   return;
    // }
    setMostrarModalHuesped(true);
  };

  const handleConfirmarReserva = (huespedData: {nombre: string, apellido: string, contacto: string}) => {
    if (!reservaPendiente) return;
    const reservaCompleta: ReservaData = {
      huespedesIds: [],
      habitacionesIds: [reservaPendiente.habitacionId],
      fechaInicio: reservaPendiente.fechaInicio + 'T00:00:00',
      fechaFin: reservaPendiente.fechaFin + 'T23:59:59',
      nombre: huespedData.nombre,
      apellido: huespedData.apellido,
      contacto: huespedData.contacto,
    };
    console.log("reservaCompleta enviada: ", reservaCompleta);
    enviarReservasAlServidor(reservaCompleta);
    setReservaPendiente(null);
    setMostrarModalHuesped(false);
  }


  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value,
    });
  };

  
  const fetchHabitaciones = async () => {
    if (!filtros.fechaInicio || !filtros.fechaFin) {
    // Si falta alguna fecha, detenemos la función.
    // Opcional: Establecer 'loading' a false inmediatamente para no mostrar "Cargando..."
    setLoading(false); 
    setHabitaciones([]); // Limpiamos resultados anteriores si existieran
    return;
  }
    
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
      if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio+'T00:00:00');
      if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin+'T23:59:59');
      console.log("params", params.toString());
      //if (filtros.tipo) params.append('tipo', filtros.tipo);
    const url = `http://localhost:8080/api/habitacion/buscar?${params.toString()}`;
    console.log("URL de fetch:", url);
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error('Error al obtener los datos de las habitaciones');
        }
        const data = await res.json();
        console.log("Datos recibidos de la API:", data);
        setHabitaciones(data);
      } catch (error) {
        console.error(error);
        setError('Ha ocurrido un error al cargar los datos de las habitaciones.');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchHabitaciones();
    }, [filtros]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      fetchHabitaciones();
    };
    


  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="container mx-auto p-4">
      <form className="mb-4">
        <h1 className="text-2xl font-bold mb-4">Estado de Habitaciones</h1>
        <label htmlFor="fechaInicio">
          Fecha de Inicio:
        </label>
        <input 
        type="date" 
        id="fechaInicio" 
        name="fechaInicio"
        value={filtros.fechaInicio}
        onChange={handleFiltroChange}
        className="border p-2 ml-2 mr-4"/>
        <label htmlFor="fechaFin">
          Fecha de Fin:
        </label>
        <input 
        type="date" 
        id="fechaFin" 
        name="fechaFin"
        value={filtros.fechaFin}
        onChange={handleFiltroChange}
        className="border p-2 ml-2 mr-4"/>
      </form>
    {filtros.fechaInicio && filtros.fechaFin ? (
      <TablaEstadoDeHabitaciones
      habitaciones = {habitaciones}
      fechaInicio = {filtros.fechaInicio}
      fechaFin = {filtros.fechaFin}
      onReservaSeleccionada = {handleReservaSeleccionada}
      reservaActual={reservaPendiente}
      />
    ):(
    <p>Seleccione un rango de fechas</p>
  )
  }
      {mostrarModalHuesped && (
        <ModalHuesped
          mostrar={mostrarModalHuesped}
          onConfirmar={handleConfirmarReserva}
          onCancelar={() => setMostrarModalHuesped(false)}
        />
      )}
    </div>
  );
};


export default MostrarEstadoHabitaciones;