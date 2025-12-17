import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import React from "react";
import { validateHuespedForm } from "@/utils/validations";

// --- Definiciones de Tipos (Inalteradas) ---

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
    nombre: "",
    apellido: "",
    tipoDoc: "",
    nroDoc: "",
    email: "",
    telefono: "",
    posIva: "",
    nacionalidad: "",
    ocupacion: "",
    fechaNacimiento: "",
    contactoId: 0,
    domicilio: "",
    pais: "",
    localidad: "",
};

const transformToHuespedData = (
    data: Partial<FormData>,
    huespedId: number
): HuespedData => {
    const contactoId = data.contactoId;
    console.log("id de contacto:", contactoId);
    if (!contactoId || contactoId === 0) {
        console.log("no se cargó el contacto");
        // Se recomienda lanzar un error con un mensaje al usuario para mejor UX
        throw new Error(
            "El ID de MediosDeContacto es inválido o no se cargó correctamente. Por favor, recargue la página."
        );
    }
    return {
        id: huespedId,
        posIva: data.posIva || "",
        nacionalidad: data.nacionalidad || "",
        ocupacion: data.ocupacion || "",
        fechaNacimiento: data.fechaNacimiento || "",
        mediosDeContacto: {
            id: data.contactoId || 0,
            telefono: data.telefono || "",
            correo: data.email || "",
            domicilio: data.domicilio || "",
            pais: data.pais || "",
            localidad: data.localidad || "",
        },
        nombre: data.nombre || "",
        apellido: data.apellido || "",
        docIdentidad: data.nroDoc || "",
        tipoDoc: data.tipoDoc || "",
    };
};

function Huesped() {
    const router = useRouter();
    const { id } = router.query;
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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
                    // Manejo específico para 404
                    if (res.status === 404) {
                        setFormData(initialFormData); // No encontrado
                        throw new Error("Huésped no encontrado (404)");
                    }
                    throw new Error(
                        `Error ${res.status} al obtener los datos del huésped`
                    );
                }
                const data = await res.json();

                // Mapeo más seguro de los datos de la API al estado del formulario
                const contacto = data.mediosDeContacto || {};
                setFormData({
                    nombre: data.nombre || "",
                    apellido: data.apellido || "",
                    tipoDoc: data.tipoDoc || "",
                    nroDoc: data.docIdentidad || "",
                    email: contacto.correo || "",
                    telefono: contacto.telefono || "",
                    posIva: data.posIva || "",
                    nacionalidad: data.nacionalidad || "",
                    ocupacion: data.ocupacion || "",
                    // Ajustar el formato de fecha si es necesario (asumiendo que viene en formato 'YYYY-MM-DD')
                    fechaNacimiento: data.fechaNacimiento
                        ? data.fechaNacimiento.substring(0, 10)
                        : "",
                    contactoId: contacto.id || 0,
                    domicilio: contacto.domicilio || "",
                    pais: contacto.pais || "",
                    localidad: contacto.localidad || "",
                });
            } catch (error: any) {
                console.error(
                    "Error al cargar huésped:",
                    error.message || error
                );
                setError(
                    error.message ||
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
        if (!huespedId || isNaN(huespedId)) {
            console.error("ID de huésped inválido o ausente en la URL.");
            setError("ID de huésped inválido o ausente.");
            return;
        }

        const validationErrors = validateHuespedForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setFormErrors(validationErrors);
            return;
        }

        let huespedPayLoad: HuespedData;
        try {
            huespedPayLoad = transformToHuespedData(formData, huespedId);
        } catch (err: any) {
            console.error(
                "Error al transformar los datos del formulario:",
                err.message
            );
            setError(`Error de validación: ${err.message}`);
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
                const errorBody = await res
                    .json()
                    .catch(() => ({ message: "Error desconocido" }));
                throw new Error(
                    errorBody.message ||
                        `Error al modificar los datos del huésped. Estado: ${res.status}`
                );
            }

            // Simular un mensaje de éxito rápido o redirigir
            console.log("Huésped modificado con éxito.");
            router.push(`/huesped/${id}`); // Redirigir al detalle o a la lista
        } catch (err: any) {
            console.error("Error en la petición PUT:", err.message);
            setError(`Error al modificar: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // --- Renderizado de Estados ---
    const LoadingState = () => (
        <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="ml-3 text-lg text-indigo-600">Cargando...</p>
        </div>
    );

    const ErrorState = ({ message }: { message: string }) => (
        <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
        >
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{message}</span>
        </div>
    );

    if (loading && !formData.nombre) return <LoadingState />;
    if (error) return <ErrorState message={error} />;
    if (!formData.nombre && !loading)
        return (
            <ErrorState message="No se encontró el huésped o el ID es inválido." />
        );

    // --- Componente principal con estilos mejorados ---
    return (
        // Contenedor principal centrado, responsive y con sombra sutil
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl bg-white shadow-xl rounded-lg my-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-6 border-b pb-2">
                Modificar Huésped # {id}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* --- Sección de Datos Personales --- */}
                <h2 className="text-xl font-semibold text-indigo-600 border-l-4 border-indigo-600 pl-3 py-1 bg-indigo-50/50">
                    Datos Personales
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Nombre */}
                    <FormInput
                        label="Nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        errorText={formErrors.nombre}
                        type="text"
                        required
                    />

                    {/* Apellido */}
                    <FormInput
                        label="Apellido"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        errorText={formErrors.apellido}
                        type="text"
                        required
                    />

                    {/* Tipo de Documento (Select mejorado) */}
                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 mb-1"
                            htmlFor="tipoDoc"
                        >
                            Tipo de Documento
                        </label>
                        <select
                            id="tipoDoc"
                            name="tipoDoc"
                            value={formData.tipoDoc}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out bg-white"
                            required
                        >
                            <option value="" disabled>
                                Seleccione un tipo...
                            </option>
                            <option value="dni">DNI</option>
                            <option value="le">LE</option>
                            <option value="lc">LC</option>
                        </select>
                    </div>

                    {/* Número de Documento */}
                    <FormInput
                        label="Número de Documento"
                        name="nroDoc"
                        value={formData.nroDoc}
                        onChange={handleChange}
                        errorText={formErrors.nroDoc}
                        type="text"
                        required
                    />

                    {/* Fecha de Nacimiento */}
                    <FormInput
                        label="Fecha de Nacimiento"
                        name="fechaNacimiento"
                        value={formData.fechaNacimiento}
                        onChange={handleChange}
                        errorText={formErrors.fechaNacimiento}
                        type="date"
                        required
                    />

                    {/* Nacionalidad */}
                    <FormInput
                        label="Nacionalidad"
                        name="nacionalidad"
                        value={formData.nacionalidad}
                        onChange={handleChange}
                        errorText={formErrors.nacionalidad}
                        type="text"
                        required
                    />

                    {/* Ocupación */}
                    <FormInput
                        label="Ocupación"
                        name="ocupacion"
                        value={formData.ocupacion}
                        onChange={handleChange}
                        errorText={formErrors.ocupacion}
                        type="text"
                        required
                    />

                    {/* Posición IVA */}
                    <FormInput
                        label="Posición IVA"
                        name="posIva"
                        value={formData.posIva}
                        onChange={handleChange}
                        errorText={formErrors.posIva}
                        type="text"
                        required
                    />
                </div>

                {/* --- Separador y Sección de Contacto --- */}
                <hr className="my-8 border-gray-200" />
                <h2 className="text-xl font-semibold text-indigo-600 border-l-4 border-indigo-600 pl-3 py-1 bg-indigo-50/50">
                    Datos de Contacto y Domicilio
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Email */}
                    <FormInput
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        errorText={formErrors.email}
                        type="email"
                        required
                    />

                    {/* Teléfono */}
                    <FormInput
                        label="Teléfono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        errorText={formErrors.telefono}
                        type="text"
                        required
                    />

                    {/* Domicilio (Ocupa toda la fila en md+) */}
                    <div className="md:col-span-2">
                        <FormInput
                            label="Domicilio"
                            name="domicilio"
                            value={formData.domicilio}
                            onChange={handleChange}
                            errorText={formErrors.domicilio}
                            type="text"
                            required
                        />
                    </div>

                    {/* País */}
                    <FormInput
                        label="País"
                        name="pais"
                        value={formData.pais}
                        onChange={handleChange}
                        errorText={formErrors.pais}
                        type="text"
                        required
                    />

                    {/* Localidad */}
                    <FormInput
                        label="Localidad"
                        name="localidad"
                        value={formData.localidad}
                        onChange={handleChange}
                        errorText={formErrors.localidad}
                        type="text"
                        required
                    />

                    {/* Campo oculto pero importante para el payload */}
                    <input
                        type="hidden"
                        name="contactoId"
                        value={formData.contactoId}
                    />
                </div>

                {/* --- Botón de Submit --- */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading} // Deshabilitar el botón durante la carga
                        className="w-full md:w-auto bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-[1.01] disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? "Guardando..." : "Modificar Huésped"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Huesped;

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    name: keyof FormData;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errorText?: string;
}

const FormInput: React.FC<FormInputProps> = ({
    label,
    name,
    value,
    onChange,
    errorText,
    type = "text",
    required = false,
    ...props
}) => (
    <div>
        <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor={name}
        >
            {label}
        </label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange as any} // 'as any' para simplificar la prop de onChange que es más genérica en el padre
            className={`w-full p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition duration-150 ease-in-out border ${
                errorText
                    ? "border-red-500 focus:ring-red-200 bg-red-50 text-red-900"
                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            }`}
            required={required}
            {...props}
        />
        {errorText && (
            <span className="text-xs text-red-600 font-semibold mt-1">
                {errorText}
            </span>
        )}
    </div>
);
