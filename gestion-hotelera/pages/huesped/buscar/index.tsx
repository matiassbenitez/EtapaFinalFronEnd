import React from "react";
import { useState } from "react";
import { Link } from 'next/link';


interface Huesped {
  id: number;
  nombre: string;
  apellido: string;
  tipoDoc: string;
  docIdentidad: string;
}

const HuespedSearchPage = () => {
  const [buscado, setBuscado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(
    {
      nombre: "",
      apellido: "",
      tipoDoc: "",
      nroDoc: ""
    }
  );

  const [data, setData] = useState<Huesped[]>([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const baseURL = "http://localhost:8080/api/huesped";
    const params = new URLSearchParams(formData).toString();
    // const baseURL = "http://localhost:8080/api/huesped"
    try {
    const response = await fetch(`${baseURL}?${params}`, {
    //const response = await fetch(`${baseURL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }

    const result = await response.json();
    console.log("Datos recibidos de la API:", result);
    setData(result);
    setBuscado(true);
    } catch (error) {
    console.error("Error al buscar huésped:", error);
    } finally {
    setLoading(false);
    }

    // const dataFalsa = [
    //   {
    //     id: 1,
    //     nombre: "María",
    //     apellido: "Perez_Nro_1",
    //     tipoDoc: "DNI",
    //     nroDoc: "123456701"
    //   },
    //   {
    //     id: 2,
    //     nombre: "Juan",
    //     apellido: "Perez_Nro_2",
    //     tipoDoc: "LC",
    //     nroDoc: "123456702"
    //   },
    //   {
    //     id: 3,
    //     nombre: "Juan",
    //     apellido: "Perez_Nro_3",
    //     tipoDoc: "Pasaporte",
    //     nroDoc: "123456703"
    //   },
    //   {
    //     id: 4,
    //     nombre: "Juan",
    //     apellido: "Perez_Nro_4",
    //     tipoDoc: "DNI",
    //     nroDoc: "123456704"
    //   },
    //   {
    //     id: 5,
    //     nombre: "Juan",
    //     apellido: "Perez_Nro_5",
    //     tipoDoc: "LC",
    //     nroDoc: "123456705"
    //   },
    //   {
    //     id: 6,
    //     nombre: "María",
    //     apellido: "Perez_Nro_6",
    //     tipoDoc: "Pasaporte",
    //     nroDoc: "123456706"
    //   },
    //   {
    //     id: 7,
    //     nombre: "Juan",
    //     apellido: "Perez_Nro_7",
    //     tipoDoc: "DNI",
    //     nroDoc: "123456707"
    //   },
    //   {
    //     id: 8,
    //     nombre: "Juan",
    //     apellido: "Perez_Nro_8",
    //     tipoDoc: "LC",
    //     nroDoc: "123456708"
    //   },
    //   {
    //     id: 9,
    //     nombre: "Juan",
    //     apellido: "Perez_Nro_9",
    //     tipoDoc: "Pasaporte",
    //     nroDoc: "123456709"
    //   },
    //   {
    //     id: 10,
    //     nombre: "Juan",
    //     apellido: "Perez_Nro_10",
    //     tipoDoc: "DNI",
    //     nroDoc: "123456710"
    //   },
    //   {
    //     id: 11,
    //     nombre: "María",
    //     apellido: "Perez_Nro_11",
    //     tipoDoc: "LC",
    //     nroDoc: "123456711"
    //   },
    //   {
    //     id: 12,
    //     nombre: "Juan",
    //     apellido: "Perez_Nro_12",
    //     tipoDoc: "Pasaporte",
    //     nroDoc: "123456712"
    //   },
    //   {
    //     id: 13,
    //     nombre: "Juan",
    //     apellido: "Perez_Nro_13",
    //     tipoDoc: "DNI",
    //     nroDoc: "123456713"
    //   },
    //   {
    //     id: 14,
    //     nombre: "Juan",
    //     apellido: "Perez_Nro_14",
    //     tipoDoc: "LC",
    //     nroDoc: "123456714"
    //   },
    //   {
    //     id: 15,
    //     nombre: "María",
    //     apellido: "Perez_Nro_15",
    //     tipoDoc: "Pasaporte",
    //     nroDoc: "123456715"
    //   },
    //   {
    //     id: 16,
    //     nombre: "Juan",
    //     apellido: "Perez_Nro_16",
    //     tipoDoc: "DNI",
    //     nroDoc: "123456716"
    //   },
    //   {
    //     id: 17,
    //     nombre: "Juan",
    //     apellido: "Perez_Nro_17",
    //     tipoDoc: "LC",
    //     nroDoc: "123456717"
    //   },
    //   {
    //     id: 18,
    //     nombre: "Juan",
    //     apellido: "Perez_Nro_18",
    //     tipoDoc: "Pasaporte",
    //     nroDoc: "123456718"
    //   },
    //   {
    //     id: 19,
    //     nombre: "Juan",
    //     apellido: "Perez_Nro_19",
    //     tipoDoc: "DNI",
    //     nroDoc: "123456719"
    //   },
    //   {
    //     id: 20,
    //     nombre: "María",
    //     apellido: "Perez_Nro_20",
    //     tipoDoc: "LC",
    //     nroDoc: "123456720"
    //   }
    // ];
    // const resp = data.filter((huesped) => {
    //   return (
    //     (formData.nombre === "" || huesped.nombre.toLowerCase().includes(formData.nombre.toLowerCase())) &&
    //     (formData.apellido === "" || huesped.apellido.toLowerCase().includes(formData.apellido.toLowerCase())) &&
    //     (formData.tipoDoc === "" || huesped.tipoDoc.toLowerCase() === formData.tipoDoc.toLowerCase()) &&
    //     (formData.nroDoc === "" || huesped.nroDoc.includes(formData.nroDoc))
    //   );
    // });
    //const result = resp;
    //setData(result);
    setBuscado(true);
  }
  return (
    <div className="bg-gray-100 pb-10">
      <div className="block text-gray-700 font-medium mb-1 space-y-4" >
        <h1 className=" mt-0 pt-4 text-center text-4xl font-bold text-gray-900 mb-6">BUSCAR HUESPED</h1>

        <form className="m-10 p-4 border rounded-lg shadow-md" onSubmit={handleSubmit} >

          <div className="grid grid-cols-5 gap-4">
            <div className="mb-4">
              <label htmlFor="nombre" className="block text-gray-700 font-medium mb-1" >Nombre:</label>
              <input type="text"
                id="nombre"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-10" />
            </div>
            <div className="mb-4">
              <label htmlFor="apellido" className="block text-gray-700 font-medium mb-1" >Apellido</label>
              <input type="text"
                id="apellido"
                name="apellido"
                placeholder="Apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-10" />
            </div>
            <div className="mb-4">

              <label htmlFor="tipoDoc" className="block text-gray-700 font-medium mb-1" >Tipo de documento</label>
              <select
                name="tipoDoc"
                id="tipoDoc"
                value={formData.tipoDoc}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-10" >
                <option value="" disabled>Tipo de Documento</option>
                <option value="dni">DNI</option>
                <option value="le">LE</option>
                <option value="lc">LC</option>
                <option value="pasaporte">Pasaporte</option>
                <option value="other">Otro</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="nroDoc" className="block text-gray-700 font-medium mb-1" >Nro de documento</label>
              <input type="text"
                id="nroDoc"
                name="nroDoc"
                value={formData.nroDoc}
                onChange={handleChange}
                placeholder="Número de documento" 
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-10" />
            </div>
            <div className="mb-4 flex items-end">
              <button
                type="submit"
                className="w-full h-10 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-150">
                Buscar
              </button>
            </div>
          </div>
        </form>
      </div>
      {buscado && data.length > 0 ? (
        <div className="m-10 p-4 border rounded-lg shadow-md">
          <h2 className="text-center text-4xl font-bold text-gray-900 mb-6">Resultados de la búsqueda</h2>
          <div >
            <div className="grid grid-cols-5 gap-0 bg-gray-100 p-3 font-semibold text-xs uppercase tracking-wider text-gray-600 border-b border-gray-300">
              <div className="text-left">Nombre</div>
              <div className="text-left">Apellido</div>
              <div className="text-left">Tipo de Documento</div>
              <div className="text-left">Número de Documento</div>
              <div className="text-right">Acción</div>
            </div>
            <div className="divide-y divide-gray-200">
              {data.map((huesped) => (
                <div key={huesped.id} className="grid grid-cols-5 gap-0 p-3 text-sm hover:bg-gray-50 transition duration-150">
                  <div className="text-left text-gray-900 font-medium">
                    {huesped.nombre}
                  </div>
                  <div className="text-left text-gray-500">
                    {huesped.apellido}
                  </div>
                  <div className="text-left text-gray-500">
                    {huesped.tipoDoc}
                  </div>
                  <div className="text-left text-gray-500">
                    {huesped.docIdentidad}
                  </div>
                  <div className="text-right font-medium">
                    <p
                      // href={`/huesped/${huesped.id}/modificar`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Modificar
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) :
        (<p></p>
        )}
      {buscado && data.length === 0 && (
        <div className="m-10 p-4 border rounded-lg shadow-md">
          <h2 className="text-center text-4xl font-bold text-gray-900 mb-6">Resultados de la búsqueda</h2>
          <p className="text-center text-gray-600">No se encontraron huéspedes que coincidan con los criterios de búsqueda.</p>
        </div>
      )}
    </div>
  );
}

export default HuespedSearchPage;