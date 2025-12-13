import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import React from "react";

interface HuespedData {
    id: number;
    posIva: string;
    nacionalidad: string;
    ocupacion: string;
    fechaNacimiento: string;
    mediosDeContacto: {
        id: number;
        telefono: string;
        correo: string;
        domicilio: string;
        pais: string;
        localidad: string;
    };
    nombre: string;
    apellido: string;
    docIdentidad: string;
    tipoDoc: string;
}

type FormData = {
    nombre: string;
    apellido: string;
    tipoDoc: string;
    nroDoc: string;
    email: string;
    telefono: string;
    posIva: string;
    nacionalidad: string;
    ocupacion: string;
    fechaNacimiento: string;
    contactoId: number;
    domicilio: string;
    pais: string;
    localidad: string;
};

const initialFormData: FormData = {
    nombre: '',
    apellido: '',
    tipoDoc: '',
    nroDoc: '',
    email: '',
    telefono: '',
    posIva: '',
    nacionalidad: '',
    ocupacion: '',
    fechaNacimiento: '',
    contactoId: 0, // <-- El ID inicial es 0, no undefined
    domicilio: '',
    pais: '',
    localidad: '',
};

const transformToHuespedData = (data: Partial<FormData>, huespedId: number): HuespedData => {
  const contactoId = data.contactoId;
  console.log("id de contacto:", contactoId)
  if (!contactoId || contactoId == 0) {
    console.log("no se cargó el contacto")
    throw new Error("El ID de MediosDeContacto es inválido o no se cargó correctamente.");
  }
    return {
        id: huespedId,
        posIva: data.posIva || '',
        nacionalidad: data.nacionalidad || '',
        ocupacion: data.ocupacion || '',
        fechaNacimiento: data.fechaNacimiento || '',
        mediosDeContacto: {
            id: data.contactoId || 0,
            telefono: data.telefono || '',
            correo: data.email || '',
            domicilio: data.domicilio || '',
            pais: data.pais || '',
            localidad: data.localidad || '',
        },
        nombre: data.nombre || '',
        apellido: data.apellido || '',
        docIdentidad: data.nroDoc || '',
        tipoDoc: data.tipoDoc || '',
    };
}

function Huesped() {
    const router = useRouter();
    const { id } = router.query;
    const [formData, setFormData] = useState<FormData>(initialFormData);

    //const [huesped, setHuesped] = useState<HuespedData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchHuesped = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(
                    `http://localhost:8080/api/huesped/${id}`
                );
                if (!res.ok) {
                    throw new Error("Error al obtener los datos del huésped");
                }
                const data = await res.json();
                setFormData({
                    nombre: data.nombre || '',
                    apellido: data.apellido || '',
                    tipoDoc: data.tipoDoc || '',
                    nroDoc: data.docIdentidad || '',
                    email: data.mediosDeContacto.correo || '',
                    telefono: data.mediosDeContacto.telefono || '',
                    posIva: data.posIva || '',
                    nacionalidad: data.nacionalidad || '',
                    ocupacion: data.ocupacion || '',
                    fechaNacimiento: data.fechaNacimiento || '',
                    contactoId: data.mediosDeContacto.id || 0,
                    domicilio: data.mediosDeContacto.domicilio || '',
                    pais: data.mediosDeContacto.pais || '',
                    localidad: data.mediosDeContacto.localidad || '',
                });
            } catch (error) {
                console.error(error);
                setError(
                    "Ha ocurrido un error al cargar los datos del huésped."
                );
            } finally {
                setLoading(false);
            }
        };
        fetchHuesped();
    }, [id]);
    
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const huespedId = id ? Number(id) : undefined;
        if (!huespedId) {
            console.error("ID de huésped inválido");
            return;
        }
        let huespedPayLoad: HuespedData;
        try {
            huespedPayLoad = transformToHuespedData(formData, huespedId);
        } catch (error) {
            console.error("Error al transformar los datos del formulario:", error);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const res = await fetch(
                `http://localhost:8080/api/huesped/${huespedId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(huespedPayLoad),
                }
            );
            if (!res.ok) {
                throw new Error("Error al modificar los datos del huésped");
            }
        } catch (error) {
            console.error(error);
            setError("Ha ocurrido un error al modificar los datos del huésped.");
            return;
        } finally {
            setLoading(false);
        }
        console.log("Modificando huésped con datos:", formData);
        router.push(`/huesped/${id}`);
      };
      if (loading) return <p>Cargando...</p>;
      if (error) return <p>Error: {error}</p>;
      if (!formData.nombre) return <p>No se encontró el huésped.</p>;
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Modificar Huésped {id}</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        className="block text-gray-700 font-medium mb-1"
                        htmlFor="nombre"
                    >
                        Nombre
                    </label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label
                        className="block text-gray-700 font-medium mb-1"
                        htmlFor="apellido"
                    >
                        Apellido
                    </label>
                    <input
                        type="text"
                        id="apellido"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label
                        className="block text-gray-700 font-medium mb-1"
                        htmlFor="tipoDoc"
                    >
                        Tipo de Documento
                    </label>
                    <select
                        id="tipoDoc"
                        name="tipoDoc"
                        value={formData.tipoDoc}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    >
                        <option value="" disabled>
                            Seleccione un tipo de documento
                        </option>
                        <option value="dni">DNI</option>
                        <option value="le">LE</option>
                        <option value="lc">LC</option>
                    </select>
                </div>
                <div>
                    <label
                        className="block text-gray-700 font-medium mb-1"
                        htmlFor="nroDoc"
                    >
                        Número de Documento
                    </label>
                    <input
                        type="text"
                        id="nroDoc"
                        name="nroDoc"
                        value={formData.nroDoc}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label
                        className="block text-gray-700 font-medium mb-1"
                        htmlFor="email"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label
                        className="block text-gray-700 font-medium mb-1"
                        htmlFor="telefono"
                    >
                        Teléfono
                    </label>
                    <input
                        type="text"
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label
                        className="block text-gray-700 font-medium mb-1"
                        htmlFor="posIva"
                    >
                        Posición IVA
                    </label>
                    <input
                        type="text"
                        id="posIva"
                        name="posIva"
                        value={formData.posIva}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label
                        className="block text-gray-700 font-medium mb-1"
                        htmlFor="nacionalidad"
                    >
                        Nacionalidad
                    </label>
                    <input
                        type="text"
                        id="nacionalidad"
                        name="nacionalidad"
                        value={formData.nacionalidad}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label
                        className="block text-gray-700 font-medium mb-1"
                        htmlFor="ocupacion"
                    >
                        Ocupación
                    </label>
                    <input
                        type="text"
                        id="ocupacion"
                        name="ocupacion"
                        value={formData.ocupacion}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label
                        className="block text-gray-700 font-medium mb-1"
                        htmlFor="fechaNacimiento"
                    >
                        Fecha de Nacimiento
                    </label>
                    <input
                        type="date"
                        id="fechaNacimiento"
                        name="fechaNacimiento"
                        value={formData.fechaNacimiento}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label
                        className="block text-gray-700 font-medium mb-1"
                        htmlFor="domicilio"
                    >
                        Domicilio
                    </label>
                    <input
                        type="text"
                        id="domicilio"
                        name="domicilio"
                        value={formData.domicilio}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label
                        className="block text-gray-700 font-medium mb-1"
                        htmlFor="pais"
                    >
                        País
                    </label>
                    <input
                        type="text"
                        id="pais"
                        name="pais"
                        value={formData.pais}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label
                        className="block text-gray-700 font-medium mb-1"
                        htmlFor="localidad"
                    >
                        Localidad
                    </label>
                    <input
                        type="text"
                        id="localidad"
                        name="localidad"
                        value={formData.localidad}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>
                
                <button
                    type="submit"
                    className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition"
                    
                >
                    Modificar Huésped
                </button>
            </form>
        </div>
    );
}

export default Huesped;
