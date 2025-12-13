import React from "react";
import { useState } from "react";
import Link from 'next/link';


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
    const filteredFormData = Object.keys(formData).reduce((acc, key) => {
        // Excluir si el valor es una cadena vacía
        if (formData[key] !== "") {
            acc[key] = formData[key];
        }
        return acc;
    }, {});
    const params = new URLSearchParams(filteredFormData).toString();
    console.log("params:", params);
    // const baseURL = "http://localhost:8080/api/huesped"
    try {
    const response = await fetch(`${baseURL}?${params}`, {
    //const response = await fetch(`${baseURL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Respuesta de la API:", response);
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
                    <Link href={`/huesped/${huesped.id}/modificar`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                        Modificar
                    </Link>
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