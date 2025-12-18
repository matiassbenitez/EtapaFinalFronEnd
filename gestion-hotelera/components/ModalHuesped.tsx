import React from "react";
import { useState } from "react";
import { validateHuespedForm } from "@/utils/validarHuesped";

interface huespedData {
  nombre: string;
  apellido: string;
  contacto: string;
}

interface ModalHuespedProps {
  mostrar: boolean;
  onConfirmar: (huespedData: huespedData) => void;
  onCancelar: () => void;
}

const ModalHuesped: React.FC<ModalHuespedProps> = ({ mostrar, onConfirmar, onCancelar }) => {
  const [huesped, setHuesped] = React.useState<huespedData>({
    nombre: '',
    apellido: '',
    contacto: '',
  });
  const [errorMsj, setErrorMsj] = useState<string>();
  if (!mostrar) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHuesped({
      ...huesped,
      [e.target.name]: e.target.value,
    });
  };

  const handleLimpiarYSalir = () => {
    setErrorMsj(null);
    setHuesped({ nombre: '', apellido: '', contacto: '' });
    onCancelar();
  };

  const handleSubmit = () => {
    const errors = validateHuespedForm(huesped);
    if (errors) {
    setErrorMsj(errors);
    return;
  }
    setErrorMsj('');
    onConfirmar(huesped);
    setHuesped({ nombre: '', apellido: '', contacto: '' });
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl mb-4">Información del Huésped</h2>
        {errorMsj && (
          <p className="bg-red-100 text-red-700 p-2 text-sm rounded mb-4 border border-red-200">
            {errorMsj}
          </p>
        )}
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={huesped.nombre}
          onChange={handleChange}
          className="w-full mb-2 p-2 border"
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={huesped.apellido}
          onChange={handleChange}
          className="w-full mb-2 p-2 border"
        />
        <input
          type="text"
          name="contacto"
          placeholder="Contacto"
          value={huesped.contacto}
          onChange={handleChange}
          className="w-full mb-4 p-2 border"
        />
        <div className="flex justify-end">
          <button 
            onClick={handleLimpiarYSalir}
            className="mr-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded transition"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSubmit} 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition shadow-md"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalHuesped;