import React, {useMemo, useState} from "react";

interface estadoHabitacion {
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
  historialEstado: estadoHabitacion[];
  reservas: any[];
}

interface TablaEstadoDeHabitacionesProps {
  habitaciones: HabitacionData[];
  fechaInicio: string;
  fechaFin: string;
  onReservaSeleccionada: (reserva: ReservaPendiente) => void;
  reservaActual: ReservaPendiente | null;
}

type ReservaPendiente = {
  habitacionId: number;
  fechaInicio: string;
  fechaFin: string;
}

type CeldaSeleccionada = {
  habitacionId: number;
  fecha: string;
  rowIndex: number;
}

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const obtenerClaseEstado = (estado: string) => {
  switch (estado) {
    case 'OCUPADO': return 'bg-blue-400 text-white font-bold';
    case 'FUERA_DE_SERVICIO': return 'bg-yellow-400 text-gray-900 font-bold';
    case 'RESERVADO': return 'bg-red-400 text-white font-bold';
    default: return 'bg-green-400 text-white font-bold'; // DISPONIBLE
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
  //console.log("habitacion:"+ habitacion.id + habitacion.historialEstado)
if (habitacion.historialEstado && Array.isArray(habitacion.historialEstado)) {
  //console.log("Historial de estados:", habitacion.historialEstado);
  for (const item of habitacion.historialEstado) {
    const inicioTimestamp = new Date(item.fechaInicio).getTime();
    const finTimestamp = new Date(item.fechaFin).getTime();
    if (dayTimestamp >= inicioTimestamp && dayTimestamp <= finTimestamp) {
      status = item.estado;
      break;
    }
  }
}
  return status;
};



const TablaEstadoDeHabitaciones: React.FC<TablaEstadoDeHabitacionesProps> = ({ 
  habitaciones, 
  fechaInicio, 
  fechaFin,
  onReservaSeleccionada,
  reservaActual
}) => {
  const [celdasSeleccionadas, setCeldasSeleccionadas] = useState<CeldaSeleccionada[]>([]);

  const handleCeldaClick = (habitacionId: number, fecha: string, estado: string, rowIndex: number) => {
        
        // 1. Evitar la selección de celdas no disponibles
        if (estado !== 'DISPONIBLE') {
            alert(`No se puede seleccionar una celda con estado: ${estado}`);
            setCeldasSeleccionadas([]);
            return;
        }

        const nuevaCelda: CeldaSeleccionada = { habitacionId, fecha, rowIndex };

        if (celdasSeleccionadas.length === 0) {
            // --- Primera Selección ---
            setCeldasSeleccionadas([nuevaCelda]);

        } else if (celdasSeleccionadas.length === 1) {
            const [sel1] = celdasSeleccionadas;

            // 2. Validar que sea la misma habitación
            if (sel1.habitacionId !== nuevaCelda.habitacionId) {
                alert("No puede seleccionar dos habitaciones diferentes.");
                setCeldasSeleccionadas([]); // Limpiar selección
                return;
            }

            // 3. Determinar el orden correcto de las fechas
            let [fechaIni, fechaFin] = [sel1.fecha, nuevaCelda.fecha];
            let [filaIni, filaFin] = [sel1.rowIndex, nuevaCelda.rowIndex];
            
            // Si la nueva fecha es anterior a la primera, intercambiar
            if (new Date(fechaIni) > new Date(fechaFin)) {
                [fechaIni, fechaFin] = [fechaFin, fechaIni];
                [filaIni, filaFin] = [filaFin, filaIni];
            }
            
            // 4. Recorrer el rango de fechas/filas para verificar disponibilidad
            const indiceHabitacion = habitaciones.findIndex(h => h.id === habitacionId);
            const fechasRango = fechasEnRango(fechaIni, fechaFin);
            
            let todasDisponibles = true;
            for (const dia of fechasRango) {
                const estadoDia = estadosPorDia(habitaciones[indiceHabitacion], dia);
                if (estadoDia !== 'DISPONIBLE') {
                    todasDisponibles = false;
                    break;
                }
            }
            
            if (!todasDisponibles) {
                alert("Todas las fechas seleccionadas deben estar disponibles.");
                setCeldasSeleccionadas([]);
                return;
            }

            // 5. Selección y Validación Exitosa: Crear la Reserva y limpiar el estado de selección
            const nuevaReserva: ReservaPendiente = {
                habitacionId: habitacionId,
                fechaInicio: fechaIni,
                fechaFin: fechaFin,
            };
            
            // Notificar al componente padre de la reserva seleccionada
            onReservaSeleccionada(nuevaReserva); 
            
            // Limpiar las celdas seleccionadas (la reserva pendiente se almacena en el padre)
            setCeldasSeleccionadas([]); 

        } else {
             // Esto no debería suceder con la lógica anterior, pero es un buen resguardo
            setCeldasSeleccionadas([]);
            handleCeldaClick(habitacionId, fecha, estado, rowIndex); // Volver a iniciar
        }
    };

    const esCeldaSeleccionada = (habitacionId: number, fecha: string): boolean => {
        // Resaltar la selección temporal (si hay una primera celda)
        if (celdasSeleccionadas.length === 1 && celdasSeleccionadas[0].habitacionId === habitacionId && celdasSeleccionadas[0].fecha === fecha) {
            return true;
        }

        // Resaltar todo el rango de la reserva actual (si existe)
        if (reservaActual && reservaActual.habitacionId === habitacionId) {
            const fechaActual = new Date(fecha);
            const inicio = new Date(reservaActual.fechaInicio);
            const fin = new Date(reservaActual.fechaFin);
            
            // Si la fecha actual está entre el inicio y el fin (inclusive)
            return fechaActual.getTime() >= inicio.getTime() && fechaActual.getTime() <= fin.getTime();
        }
        
        return false;
    };

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
              Habitación {habitacion.id}
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
                  data-id={habitacion.id}
                  data-fecha={fecha}
                  onClick={() => handleCeldaClick(habitacion.id, fecha, estado, fechas.indexOf(fecha))} 
                  className={`py-2 px-4 border-b text-center text-sm ${claseEstado}
                  ${esCeldaSeleccionada(habitacion.id, fecha) ? 'border-4 border-black/50' : ''}`}
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