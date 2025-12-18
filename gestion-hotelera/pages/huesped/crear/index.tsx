import { useState } from "react";
import { useRouter } from "next/router";
import React from "react";
import { validateHuespedForm } from "@/utils/validations";

// --- Definiciones de Tipos (Mantenidas) ---

interface HuespedData {
    id: number | null;
    posIva: string;
    nacionalidad: string;
    ocupacion: string;
    fechaNacimiento: string;
    mediosDeContacto: {
        id: number | null;
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

const transformToNewHuespedData = (data: FormData): Partial<HuespedData> => {
    return {
        posIva: data.posIva,
        nacionalidad: data.nacionalidad,
        ocupacion: data.ocupacion,
        fechaNacimiento: data.fechaNacimiento,
        mediosDeContacto: {
            id: null,
            telefono: data.telefono,
            correo: data.email,
            domicilio: data.domicilio,
            pais: data.pais,
            localidad: data.localidad,
        },
        nombre: data.nombre,
        apellido: data.apellido,
        docIdentidad: data.nroDoc,
        tipoDoc: data.tipoDoc,
    };
};

function CrearHuesped() {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (successMessage) setSuccessMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setFormErrors({});
        setError(null);
        setSuccessMessage(null);

        const validationErrors = validateHuespedForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setFormErrors(validationErrors);
            return;
        }

        setFormErrors({});
        const huespedPayLoad = transformToNewHuespedData(formData);
        setLoading(true);

        try {
            const res = await fetch(`http://localhost:8080/api/huesped`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(huespedPayLoad),
            });

            if (!res.ok) {
                const errorBody = await res
                    .json()
                    .catch(() => ({
                        message: "Error desconocido del servidor.",
                    }));
                throw new Error(
                    errorBody.message ||
                        `Error al crear el huésped. Estado: ${res.status}`
                );
            }

            const newHuesped = await res.json();

            setFormData(initialFormData);
            setSuccessMessage(
                `Huésped "${newHuesped.nombre} ${newHuesped.apellido}" creado con éxito. ID: ${newHuesped.id}`
            );

            router.push(`/huesped/${newHuesped.id}`);
        } catch (err: any) {
            console.error("Error en la petición POST:", err.message);
            setError(`Error al crear el huésped: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const LoadingState = () => (
        <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="ml-3 text-md text-indigo-600">Procesando...</p>
        </div>
    );

    const Alert = ({
        message,
        type,
    }: {
        message: string;
        type: "error" | "success";
    }) => {
        const baseClasses = "px-4 py-3 rounded relative mb-4";
        const errorClasses = "bg-red-100 border border-red-400 text-red-700";
        const successClasses =
            "bg-green-100 border border-green-400 text-green-700";

        return (
            <div
                className={`${baseClasses} ${
                    type === "error" ? errorClasses : successClasses
                }`}
                role="alert"
            >
                <strong className="font-bold">
                    {type === "error" ? "¡Error!" : "¡Éxito!"}
                </strong>
                <span className="block sm:inline ml-2">{message}</span>
            </div>
        );
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl bg-white shadow-xl rounded-lg my-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-6 border-b pb-2">
                Cargar Nuevo Huésped
            </h1>

            {successMessage && (
                <Alert message={successMessage} type="success" />
            )}
            {error && <Alert message={error} type="error" />}

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
                        type="text"
                        errorText={formErrors.nombre}
                        required
                    />

                    <FormInput
                        label="Apellido"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        type="text"
                        errorText={formErrors.apellido}
                        required
                    />

                    <div>
                        
                        <FormSelect
                            label="Tipo de Documento"
                            id="tipoDoc"
                            name="tipoDoc"
                            value={formData.tipoDoc}
                            onChange={handleChange}
                            errorText={formErrors.tipoDoc}
                            required
                        >
                            <option value="" disabled>
                                Seleccione un tipo...
                            </option>
                            <option value="DNI">DNI</option>{" "}
                            <option value="LE">LE</option>
                            <option value="LC">LC</option>
                        </FormSelect>
                    </div>

                    <FormInput
                        label="Número de Documento"
                        name="nroDoc"
                        value={formData.nroDoc}
                        onChange={handleChange}
                        errorText={formErrors.nroDoc}
                        type="text"
                        required
                    />

                    <FormInput
                        label="Fecha de Nacimiento"
                        name="fechaNacimiento"
                        value={formData.fechaNacimiento}
                        onChange={handleChange}
                        errorText={formErrors.fechaNacimiento}
                        type="date"
                        required
                    />

                    <FormInput
                        label="Nacionalidad"
                        name="nacionalidad"
                        value={formData.nacionalidad}
                        onChange={handleChange}
                        errorText={formErrors.nacionalidad}
                        type="text"
                        required
                    />

                    <FormInput
                        label="Ocupación"
                        name="ocupacion"
                        value={formData.ocupacion}
                        onChange={handleChange}
                        errorText={formErrors.ocupacion}
                        type="text"
                        required
                    />

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

                <hr className="my-8 border-gray-200" />
                <h2 className="text-xl font-semibold text-indigo-600 border-l-4 border-indigo-600 pl-3 py-1 bg-indigo-50/50">
                    Datos de Contacto y Domicilio
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <FormInput
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        errorText={formErrors.email}
                        type="email"
                        required
                    />

                    <FormInput
                        label="Teléfono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        errorText={formErrors.telefono}
                        type="text"
                        required
                    />

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

                    <FormInput
                        label="País"
                        name="pais"
                        value={formData.pais}
                        onChange={handleChange}
                        errorText={formErrors.pais}
                        type="text"
                        required
                    />

                    <FormInput
                        label="Localidad"
                        name="localidad"
                        value={formData.localidad}
                        onChange={handleChange}
                        errorText={formErrors.localidad}
                        type="text"
                        required
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-[1.01] disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? <LoadingState /> : "Crear Huésped"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="w-full md:w-auto ml-0 mt-2 md:mt-0 md:ml-4 bg-gray-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-600 transition duration-300 ease-in-out"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CrearHuesped;

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
            onChange={onChange as any}
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

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    name: keyof FormData;
    errorText?: string;
    children: React.ReactNode;
}

const FormSelect: React.FC<FormSelectProps> = ({
    label,
    name,
    value,
    onChange,
    errorText,
    children,
    required = false,
    ...props
}) => (
    <div className="flex flex-col gap-1">
        <label
            className="block text-sm font-medium text-gray-700"
            htmlFor={name}
        >
            {label}
        </label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className={`w-full p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition duration-150 ease-in-out border bg-white ${
                errorText
                    ? "border-red-500 focus:ring-red-200 text-red-900"
                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            }`}
            {...props}
        >
            {children}
        </select>
        {errorText && (
            <span className="text-xs text-red-600 font-semibold mt-1">
                {errorText}
            </span>
        )}
    </div>
);