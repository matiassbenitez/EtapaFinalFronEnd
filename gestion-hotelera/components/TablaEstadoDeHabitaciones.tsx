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
  listado: ReservaPendiente[];
  habitaciones: HabitacionData[];
  fechaInicio: string;
  fechaFin: string;
  onReservaSeleccionada: (reserva: ReservaPendiente) => void;
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
    case 'OCUPADO': 
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'FUERA_DE_SERVICIO': 
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'RESERVADO': 
      return 'bg-rose-100 text-rose-700 border-rose-200';
    default: 
      return 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'; // DISPONIBLE
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
  listado
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

        if (celdasSeleccionadas.length === 1 && celdasSeleccionadas[0].habitacionId === habitacionId && celdasSeleccionadas[0].fecha === fecha) {
            return true;
        }

        return listado.some(reserva => {
            if (reserva.habitacionId !== habitacionId) return false;
            const fechaActual = new Date(fecha);
            const inicio = new Date(reserva.fechaInicio);
            const fin = new Date(reserva.fechaFin);
            // Si la fecha actual está entre el inicio y el fin (inclusive)
            return fechaActual.getTime() >= inicio.getTime() && fechaActual.getTime() <= fin.getTime();
        });
    };

  const fechas: string[] = useMemo(() => {
    if (!fechaInicio || !fechaFin) return [];
    return fechasEnRango(fechaInicio, fechaFin);
  }, [fechaInicio, fechaFin]);

  if (!habitaciones || habitaciones.length === 0) {
    return <p>No hay habitaciones disponibles.</p>;
  }
  return (

    <div className="relative z-0 overflow-x-auto overflow-y-auto max-h-[70vh] rounded-xl border border-gray-200">
      <table className="min-w-full border-separate border-spacing-0 bg-white">
        <thead className="bg-gray-50">
          <tr>

            <th className="sticky top-0 left-0 z-50 bg-gray-100 p-4 border-b border-r border-gray-200 text-left text-xs font-bold uppercase text-gray-600 shadow-[2px_2px_5px_rgba(0,0,0,0.1)]">
              Calendario
            </th>
            {habitaciones.map((habitacion) => (

              <th 
                key={habitacion.id} 
                className="sticky top-0 z-30 bg-gray-50 p-4 border-b border-r border-gray-200 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 shadow-[0_2px_5px_rgba(0,0,0,0.05)]"
              >
                Hab. {habitacion.id}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {fechas.map((fecha) => (
            <tr key={fecha} className="hover:bg-gray-50/50 transition-colors">

              <td className="sticky left-0 z-20 bg-white py-3 px-6 border-r border-gray-200 font-medium text-sm text-gray-600 whitespace-nowrap min-w-[140px] shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                {new Date(fecha).toLocaleDateString('es-ES', { 
                    weekday: 'short', 
                    day: '2-digit', 
                    month: 'short' 
                })}
              </td>
              
              {habitaciones.map((habitacion) => {
                const estado = estadosPorDia(habitacion, fecha); 
                const claseEstado = obtenerClaseEstado(estado);
                const cellKey = `${fecha}-${habitacion.id}`; 
                const seleccionada = esCeldaSeleccionada(habitacion.id, fecha);
                
                return (
                  <td 
                    key={cellKey}
                    onClick={() => handleCeldaClick(habitacion.id, fecha, estado, fechas.indexOf(fecha))} 
                    className={`
                      relative py-4 px-3 border-r border-b border-gray-100 text-center cursor-pointer transition-all duration-200
                      ${claseEstado}
                      ${seleccionada ? 'ring-2 ring-inset ring-black z-10 shadow-lg scale-[0.98]' : ''}
                    `}
                  >
                    <span className="text-[10px] font-bold tracking-tight uppercase">
                      {estado}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaEstadoDeHabitaciones;