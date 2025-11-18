"use client";
import React from "react";
import { useState } from "react";
import { Link } from 'next/link';



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

  const [data, setData] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //setLoading(true);
    // const baseURL = "http://localhost:8080/api/huesped/buscar";
    // const params = new URLSearchParams({
    //   nombre: e.target.nombre.value,
    //   apellido: e.target.apellido.value,
    //   tipoDoc: e.target.tipoDoc.value,
    //   nroDoc: e.target.nroDoc.value,
    // });
    // const response = await fetch(`${baseURL}?${params.toString()}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    const dataFalsa = [
      {
        id: 1,
        nombre: "María",
        apellido: "Perez_Nro_1",
        tipoDoc: "DNI",
        nroDoc: "123456701"
      },
      {
        id: 2,
        nombre: "Juan",
        apellido: "Perez_Nro_2",
        tipoDoc: "LC",
        nroDoc: "123456702"
      },
      {
        id: 3,
        nombre: "Juan",
        apellido: "Perez_Nro_3",
        tipoDoc: "Pasaporte",
        nroDoc: "123456703"
      },
      {
        id: 4,
        nombre: "Juan",
        apellido: "Perez_Nro_4",
        tipoDoc: "DNI",
        nroDoc: "123456704"
      },
      {
        id: 5,
        nombre: "Juan",
        apellido: "Perez_Nro_5",
        tipoDoc: "LC",
        nroDoc: "123456705"
      },
      {
        id: 6,
        nombre: "María",
        apellido: "Perez_Nro_6",
        tipoDoc: "Pasaporte",
        nroDoc: "123456706"
      },
      {
        id: 7,
        nombre: "Juan",
        apellido: "Perez_Nro_7",
        tipoDoc: "DNI",
        nroDoc: "123456707"
      },
      {
        id: 8,
        nombre: "Juan",
        apellido: "Perez_Nro_8",
        tipoDoc: "LC",
        nroDoc: "123456708"
      },
      {
        id: 9,
        nombre: "Juan",
        apellido: "Perez_Nro_9",
        tipoDoc: "Pasaporte",
        nroDoc: "123456709"
      },
      {
        id: 10,
        nombre: "Juan",
        apellido: "Perez_Nro_10",
        tipoDoc: "DNI",
        nroDoc: "123456710"
      },
      {
        id: 11,
        nombre: "María",
        apellido: "Perez_Nro_11",
        tipoDoc: "LC",
        nroDoc: "123456711"
      },
      {
        id: 12,
        nombre: "Juan",
        apellido: "Perez_Nro_12",
        tipoDoc: "Pasaporte",
        nroDoc: "123456712"
      },
      {
        id: 13,
        nombre: "Juan",
        apellido: "Perez_Nro_13",
        tipoDoc: "DNI",
        nroDoc: "123456713"
      },
      {
        id: 14,
        nombre: "Juan",
        apellido: "Perez_Nro_14",
        tipoDoc: "LC",
        nroDoc: "123456714"
      },
      {
        id: 15,
        nombre: "María",
        apellido: "Perez_Nro_15",
        tipoDoc: "Pasaporte",
        nroDoc: "123456715"
      },
      {
        id: 16,
        nombre: "Juan",
        apellido: "Perez_Nro_16",
        tipoDoc: "DNI",
        nroDoc: "123456716"
      },
      {
        id: 17,
        nombre: "Juan",
        apellido: "Perez_Nro_17",
        tipoDoc: "LC",
        nroDoc: "123456717"
      },
      {
        id: 18,
        nombre: "Juan",
        apellido: "Perez_Nro_18",
        tipoDoc: "Pasaporte",
        nroDoc: "123456718"
      },
      {
        id: 19,
        nombre: "Juan",
        apellido: "Perez_Nro_19",
        tipoDoc: "DNI",
        nroDoc: "123456719"
      },
      {
        id: 20,
        nombre: "María",
        apellido: "Perez_Nro_20",
        tipoDoc: "LC",
        nroDoc: "123456720"
      }
    ];
    const response = { ok: true, json: async () => dataFalsa };
    const result = await response.json();
    setData(result);
    setBuscado(!buscado);
  }
  return (
    <div>
      <div className="mb-4 block text-gray-700 font-medium mb-1 space-y-4" >
        <h1 className=" mt-4 text-center text-4xl font-bold text-gray-900 mb-6">BUSCAR HUESPED</h1>

        <form className="m-5 p-4 border rounded-lg shadow-md" onSubmit={handleSubmit} >

          <div className="grid grid-cols-5 gap-4">
            <div className="mb-4">
              <label htmlFor="nombre" className="mb-4 block text-gray-700 font-medium mb-1 space-y-4" >Nombre:</label>
              <input type="text" id="nombre" name="nombre" placeholder="Nombre" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="mb-4">
              <label htmlFor="apellido" className="mb-4 block text-gray-700 font-medium mb-1 space-y-4" >Apellido</label>
              <input type="text" id="apellido" name="apellido" placeholder="Apellido" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="mb-4">

              <label htmlFor="tipoDoc" className="mb-4 block text-gray-700 font-medium mb-1 space-y-4" >Tipo de documento</label>
              <select name="tipoDoc" id="tipoDoc" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" >
                {/* <option selected disabled>Tipo de documento</option> */}
                <option value="dni">DNI</option>
                <option value="le">LE</option>
                <option value="lc">LC</option>
                <option value="pasaporte">Pasaporte</option>
                <option value="other">Otro</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="nroDoc" className="mb-4 block text-gray-700 font-medium mb-1 space-y-4" >Nro de documento</label>
              <input type="text" id="nroDoc" name="nroDoc" placeholder="Número de documento" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            <button type="submit" className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-150" >Buscar</button>
          </div>
        </form>
      </div>
      {buscado ? (
        <div className="m-5 p-4 border rounded-lg shadow-md">
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

                  {/* Columna 4: Nro Doc */}
                  <div className="text-left text-gray-500">
                    {huesped.nroDoc}
                  </div>

                  {/* Columna 5: Acción */}
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
        )};
    </div>
  );
}

export default HuespedSearchPage;