import { useRouter } from "next/router";
import React, {useState, useEffect} from "react";


interface HuespedData {
  id: number,
    posIva: string,
    nacionalidad: string,
    ocupacion: string,
    fechaNacimiento: string,
    mediosDeContacto: {
        id: number,
        telefono: string,
        correo: string,
        domicilio: string,
        pais: string,
        localidad: string,
    },
    nombre: string,
    apellido: string,
    docIdentidad: string,
    tipoDoc: string
}

function Huesped () {
  const router = useRouter();
  const { id } = router.query;

  const [huesped, setHuesped] = useState<HuespedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchHuesped = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:8080/api/huesped/${id}`);
        if (!res.ok) {
          throw new Error("Error al obtener los datos del huésped");
        }
        const data = await res.json();
        setHuesped(data);
      } catch (error) {
        console.error(error);
        setError("Ha ocurrido un error al cargar los datos del huésped.");
      } finally {
        setLoading(false);
      }
    };
    setLoading(false);


    fetchHuesped();
  }, [id]);
  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!huesped) return <p>No se encontró el huésped.</p>;
  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg border border-gray-100"> 
  
  <h1 className="text-3xl font-bold border-b pb-3 mb-4 text-indigo-700">
    Detalle del Huésped {id}
  </h1>
  
  <div className="space-y-3 mb-6">
    <p className="text-gray-700 text-lg">
      <span className="font-semibold text-gray-900">Nombre:</span> {huesped.nombre}
    </p>
    <p className="text-gray-700 text-lg">
      <span className="font-semibold text-gray-900">Apellido:</span> {huesped.apellido}
    </p>
    <p className="text-gray-700">
      <span className="font-semibold">Documento:</span> {huesped.tipoDoc} ({huesped.docIdentidad})
    </p>
    <p className="text-gray-700">
      <span className="font-semibold">Email:</span> {huesped.mediosDeContacto.correo}
    </p>
    <p className="text-gray-700">
      <span className="font-semibold">Teléfono:</span> {huesped.mediosDeContacto.telefono}
    </p>
  </div>
  
  <div className="flex justify-around space-x-3 pt-4 border-t">
    
    <button 
      className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out"
      onClick={() => 
        {
          router.push(`/huesped/${id}/modificar`);
        }
      }
    >
      Editar Huésped
    </button>
    

    <button 
      className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out"
      onClick={() => setIsModalOpen(true)}
    >
      Borrar
    </button>
  </div>
  {isModalOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Confirmar Borrado</h2>
        <p className="mb-6">¿Está seguro que desea borrar este huésped?</p>
        <div className="flex justify-end space-x-4">
          <button 
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out"
            onClick={() => setIsModalOpen(false)}
          >
            Cancelar
          </button>
          <button 
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out"
            onClick={() => {
              // Lógica de borrado
              setIsModalOpen(false);
            }}
          >
            Borrar
          </button>
        </div>
      </div>
    </div>
  ): null}
</div>
  )
}

export default Huesped;