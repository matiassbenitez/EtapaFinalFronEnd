
import { useEffect, useState } from "react";
import { useRouter } from "next/router"; 
import { EstadiaServicio, Reserva } from "@/types/Reserva";
import { FacturaCreateDTO, ResponsablePago, PersonaJuridica } from "@/types/facturacion";
import { 
  getReservaById, 
  createFactura, 
  getPersonaJuridicaByCuit,
  createPersonaJuridica,
  getServiciosPorEstadia 
} from "@/lib/api";

export default function FacturacionPage() {

  // const [itemsPendientes, setItemsPendientes] = useState<EstadiaServicio[]>([]);
  // const [itemsPagados, setItemsPagados] = useState<EstadiaServicio[]>([]);
  // const total = itemsPendientes.reduce((sum, item) => sum + item.servicio.costoTotal, 0);

  // 3. CAMBIO DE HOOKS: Pages Router usa un solo hook para todo

  const router = useRouter();
  const { reservaId } = router.query; // Los parámetros vienen de router.query

  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [serviciosDetallados, setServiciosDetallados] = useState<EstadiaServicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);

  // Estados de formulario (se mantienen iguales)
  const [modoFacturacion, setModoFacturacion] = useState<"HUESPED" | "EMPRESA">("HUESPED");
  const [responsableSeleccionado, setResponsableSeleccionado] = useState<ResponsablePago | null>(null);
  const [selectedServicios, setSelectedServicios] = useState<Record<number, boolean>>({});
  const [cuitBusqueda, setCuitBusqueda] = useState("");
  const [buscandoEmpresa, setBuscandoEmpresa] = useState(false);
  const [mostrarFormAltaEmpresa, setMostrarFormAltaEmpresa] = useState(false);
  const [nuevaEmpresa, setNuevaEmpresa] = useState<PersonaJuridica>({
    razonSocial: "", cuit: "", telefono: "", condicionIva: "Responsable Inscripto"
  });

  useEffect(() => {
    const init = async () => {

      if (!router.isReady) return; 

      try {
        setLoading(true);
        const id = Number(reservaId);
        if (isNaN(id)) return;

        const dataReserva = await getReservaById(id);
        setReserva(dataReserva);

        if (dataReserva.estadias.length > 0) {
          const idEstadia = dataReserva.estadias[0].id;
          const serviciosFull = await getServiciosPorEstadia(idEstadia);
          setServiciosDetallados(serviciosFull);

          const pendientes: Record<number, boolean> = {};
          serviciosFull.forEach(s => {
            if (!s.incluido) pendientes[s.id] = true;
          });
          setSelectedServicios(pendientes);
        }
      } catch (e) {
        console.error(e);
        alert("Error al cargar datos del servidor");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [reservaId, router.isReady]);

  const handleBuscarEmpresa = async () => {
    if (!cuitBusqueda) return;
    setBuscandoEmpresa(true);
    setMostrarFormAltaEmpresa(false);
    setResponsableSeleccionado(null);

    try {
        const empresa = await getPersonaJuridicaByCuit(cuitBusqueda);
        if (empresa && empresa.id) {
            setResponsableSeleccionado({
                id: empresa.id,
                nombre: empresa.razonSocial,
                identificador: empresa.cuit,
                tipo: "EMPRESA"
            });
        } else {
            setMostrarFormAltaEmpresa(true);
            setNuevaEmpresa(prev => ({ ...prev, cuit: cuitBusqueda }));
        }
    } catch (e) {
        alert("Error al buscar empresa");
    } finally {
        setBuscandoEmpresa(false);
    }
  };

  const handleCrearEmpresa = async () => {
    try {
        const empresaCreada = await createPersonaJuridica(nuevaEmpresa);
        if(empresaCreada.id) {
            setResponsableSeleccionado({
                id: empresaCreada.id,
                nombre: empresaCreada.razonSocial,
                identificador: empresaCreada.cuit,
                tipo: "EMPRESA"
            });
            setMostrarFormAltaEmpresa(false);
        }
    } catch (e) {
        alert("Error al crear empresa");
    }
  };

  const handleGenerarFactura = async () => {
    const itemsAFacturar = serviciosDetallados.filter(s => !s.incluido && selectedServicios[s.id]);
    if (!reserva || !responsableSeleccionado || itemsAFacturar.length === 0) {
        alert("Por favor seleccione un responsable y al menos un servicio para facturar.");
        return;
    }
    setProcesando(true);
    try {
        const estadiaId = reserva.estadias[0].id;
        const dto: FacturaCreateDTO = {
            idResponsableDePago: responsableSeleccionado.id,
            idEstadia: estadiaId,
            servicios: itemsAFacturar.map(s => ({
                id: s.id,                
                estadiaId: estadiaId,
                servicioId: s.servicio.id,
                incluido: true
            }))
        };
        await createFactura(dto);
        alert("✅ Factura generada correctamente");
        router.push("/");
    } catch (e) {
        alert("❌ Error al generar factura");
    } finally {
        setProcesando(false);
    }
  };

  if (loading || !reserva) return <div className="p-10 text-center">Cargando...</div>;

  
  const itemsPendientes = serviciosDetallados.filter(s => !s.incluido);
  const itemsPagados = serviciosDetallados.filter(s => s.incluido);
  
  const total = itemsPendientes
    .filter(s => selectedServicios[s.id])
    .reduce((acc, s) => acc + (s.servicio.costoTotal || 0), 0);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Nueva Factura</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="md:col-span-2 space-y-6">
            
            <div className="bg-white p-6 rounded shadow border">
                <h2 className="text-lg font-bold mb-4">1. Responsable de Pago</h2>
                <div className="flex gap-4 mb-4">
                    <button onClick={() => setModoFacturacion("HUESPED")} className={`p-2 border w-full rounded ${modoFacturacion === "HUESPED" ? "bg-blue-100 border-blue-500 font-bold" : ""}`}>Huesped</button>
                    <button onClick={() => setModoFacturacion("EMPRESA")} className={`p-2 border w-full rounded ${modoFacturacion === "EMPRESA" ? "bg-blue-100 border-blue-500 font-bold" : ""}`}>Empresa</button>
                </div>

                {modoFacturacion === "HUESPED" && (
                    <div className="space-y-2">
                        {reserva.estadias[0].huespedes.map((h, idx) => (
                            <div key={`huesped-${h.id}-${idx}`} onClick={() => setResponsableSeleccionado({id: h.id, nombre: `${h.nombre} ${h.apellido}`, identificador: h.docIdentidad, tipo: "HUESPED"})} 
                                className={`p-3 border rounded cursor-pointer ${responsableSeleccionado?.id === h.id ? "bg-green-100 border-green-500" : "hover:bg-gray-50"}`}>
                                {h.nombre} {h.apellido}
                            </div>
                        ))}
                    </div>
                )}

                {modoFacturacion === "EMPRESA" && (
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <input type="text" placeholder="CUIT" className="flex-1 border p-2" value={cuitBusqueda} onChange={e => setCuitBusqueda(e.target.value)} />
                            <button onClick={handleBuscarEmpresa} className="bg-gray-800 text-white px-4 rounded">{buscandoEmpresa ? "..." : "Buscar"}</button>
                        </div>
                        {responsableSeleccionado?.tipo === "EMPRESA" && (
                            <div className="p-2 bg-green-100 text-green-800 rounded font-bold">Empresa: {responsableSeleccionado.nombre}</div>
                        )}
                        {mostrarFormAltaEmpresa && (
                            <div className="p-4 border bg-yellow-50 rounded">
                                <h3 className="font-bold mb-2">Alta Empresa</h3>
                                <input type="text" placeholder="Razon Social" className="w-full border p-2 mb-2" value={nuevaEmpresa.razonSocial} onChange={e => setNuevaEmpresa({...nuevaEmpresa, razonSocial: e.target.value})} />
                                <button onClick={handleCrearEmpresa} className="w-full bg-yellow-600 text-white p-2 rounded font-bold">Guardar y Seleccionar</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="bg-white p-6 rounded shadow border">
                <h2 className="text-lg font-bold mb-4">2. Servicios a Facturar</h2>
                <table className="w-full text-sm">
                    <thead className="bg-gray-100"><tr><th className="p-2">Sel</th><th className="p-2">Item</th><th className="p-2 text-right">Monto</th></tr></thead>
                    <tbody>
                        {itemsPendientes.map((s, idx) => (
                            s.incluido && (
                            <tr key={`pend-${s.id}-${idx}`} className="border-b">
                                <td className="p-2 text-center"><input type="checkbox" checked={s.incluido ? false : !!selectedServicios[s.id]} onChange={() => setSelectedServicios(prev => ({...prev, [s.id]: !prev[s.id]}))} /></td>
                                <td className="p-2">{s.servicio.tipoServicio}</td>
                                <td className="p-2 text-right">${s.servicio.costoTotal}</td>
                            </tr>)
                        ))}
                    </tbody>
                </table>
            </div>

            {itemsPagados.length > 0 && (
                <div className="bg-gray-100 p-6 rounded border">
                    <h3 className="font-bold text-gray-500 mb-2">Historial Pagado</h3>
                    <table className="w-full text-sm text-gray-500">
                        <tbody>
                            {itemsPagados.map((s, idx) => (
                                <tr key={`pag-${s.id}-${idx}`} className="border-b">
                                    <td className="p-2">{s.servicio.tipoServicio}</td>
                                    <td className="p-2 text-right">${s.servicio.costoTotal}</td>
                                    <td className="p-2 text-center text-green-600 font-bold">PAGADO</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

        <div className="md:col-span-1">
            <div className="bg-white p-6 rounded shadow border sticky top-10">
                <h3 className="font-bold text-xl mb-4 border-b pb-2">Resumen</h3>
                <p className="text-gray-500 text-sm">Responsable:</p>
                <p className="font-bold text-lg mb-4 text-blue-900">{responsableSeleccionado?.nombre || "Seleccione..."}</p>
                <p className="text-gray-500 text-sm">Total:</p>
                <p className="font-bold text-3xl mb-6 text-blue-600">${total}</p>
                <button onClick={handleGenerarFactura} disabled={!responsableSeleccionado || total === 0 || procesando} 
                    className="w-full bg-blue-600 text-white py-3 rounded font-bold disabled:bg-gray-300">
                    {procesando ? "Procesando..." : "Confirmar Factura"}
                </button>
            </div>
        </div>

      </div>
    </div>
  );
}