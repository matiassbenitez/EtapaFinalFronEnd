import React, {useMemo} from "react";

interface HistorialEstadoHabitacion {
  id: number;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  habitacion: number;
}

interface HabitacionData {
  id: number;
  capacidad: number;
  precio: number;
  tipoHabitacion: string;
  numeroHabitacion: number;
  historialEstados: HistorialEstadoHabitacion[];
  reservas: any[];
}

interface TablaEstadoDeHabitacionesProps {
  habitaciones: HabitacionData[];
  fechaInicio: string;
  fechaFin: string;
}

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const obtenerClaseEstado = (estado: string) => {
  switch (estado) {
    case 'DISPONIBLE':
    case 'OCUPADA': return 'bg-green-400 text-white font-bold';
    case 'MANTENIMIENTO': return 'bg-yellow-400 text-gray-900 font-bold';
    case 'RESERVADA': return 'bg-red-400 text-white font-bold';
    default: return 'bg-gray-200 text-gray-600';
  }
};

const fechasEnRango = (fechaInicio: string, fechaFin: string): string[] => {
  const fechas: string[] = [];
  let currentDate = new Date(fechaInicio);
  const endDate = new Date(fechaFin);
  while (currentDate <= endDate) {
    fechas.push(currentDate.toISOString().split('T')[0]);
    currentDate = new Date(currentDate.getTime() + DAY_IN_MS);
  }
  return fechas;
};

const estadosPorDia = (habitacion: HabitacionData, dia: string): string => {
  const dayTimestamp = new Date(dia).getTime();
  let status = 'DISPONIBLE';

  for (const item of habitacion.historialEstados) {
    const inicioTimestamp = new Date(item.fechaInicio).getTime();
    const finTimestamp = new Date(item.fechaFin).getTime();
    if (dayTimestamp >= inicioTimestamp && dayTimestamp <= finTimestamp) {
      status = item.estado;
      break;
    }
  }
  return status;
};

const TablaEstadoDeHabitaciones: React.FC<TablaEstadoDeHabitacionesProps> = ({ habitaciones, fechaInicio, fechaFin }) => {
  const fechas: string[] = useMemo(() => {
    if (!fechaInicio || !fechaFin) return [];
    return fechasEnRango(fechaInicio, fechaFin);
  }, [fechaInicio, fechaFin]);

  if (!habitaciones || habitaciones.length === 0) {
    return <p>No hay habitaciones disponibles.</p>;
  }
  return (
    <table className="min-w-full bg-white border">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b">Fecha</th> 
          {habitaciones.map((habitacion) => (
            <th key={habitacion.id} className="py-2 px-4 border-b">
              Habitación {habitacion.numeroHabitacion}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {fechas.map((fecha) => (
          <tr key={fecha}>
            <td className="py-2 px-4 border-b font-medium text-gray-700">{fecha}</td>
            
            {habitaciones.map((habitacion) => {
              // Calculamos el estado de ESA habitación en ESA fecha
              const estado = estadosPorDia(habitacion, fecha); 
              const claseEstado = obtenerClaseEstado(estado);
              
              // Usamos una clave compuesta (o id único) para evitar advertencias
              const cellKey = `${fecha}-${habitacion.id}`; 
              
              return (
                <td 
                  key={cellKey} 
                  className={`py-2 px-4 border-b text-center text-sm ${claseEstado}`}
                >
                  {estado}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TablaEstadoDeHabitaciones;