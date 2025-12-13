import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import TablaEstadoDeHabitaciones from '../../../components/TablaEstadoDeHabitaciones';

const MostrarEstadoHabitaciones = () => {
  const [habitaciones, setHabitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    tipo: '',
  });

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value,
    });
  };

  
  const fetchHabitaciones = async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
      if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
      if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
      //if (filtros.tipo) params.append('tipo', filtros.tipo);
    const url = `http://localhost:8080/api/habitaciones/buscar?${params.toString()}`;
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error('Error al obtener los datos de las habitaciones');
        }
        const data = await res.json();
        setHabitaciones(data);
      } catch (error) {
        console.error(error);
        setError('Ha ocurrido un error al cargar los datos de las habitaciones.');
      } finally {
        setLoading(false);
      }
    };
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
        <label htmlFor="fechaInicion">
          Fecha de Inicio:
        </label>
        <input type="date" id="fechaInicion" name="fechaInicion" className="border p-2 ml-2 mr-4"/>
        <label htmlFor="fechaFin">
          Fecha de Fin:
        </label>
        <input type="date" id="fechaFin" name="fechaFin" className="border p-2 ml-2 mr-4"/>
        <label htmlFor="tipo">Tipo:</label>
        <select id="tipo" name="tipo" className="border p-2 ml-2 mr-4">
          <option value="">Todos</option>
          <option value="SIMPLE">Simple</option>
          <option value="DOBLE">Doble</option>
          <option value="SUITE">Suite</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded ml-4">
          Filtrar
        </button>
      </form>
      
    </div>
  );
};


export default MostrarEstadoHabitaciones;