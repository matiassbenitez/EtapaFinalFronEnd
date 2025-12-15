import React from "react";

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
  if (!mostrar) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHuesped({
      ...huesped,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    onConfirmar(huesped);
    setHuesped({ nombre: '', apellido: '', contacto: '' });
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl mb-4">Información del Huésped</h2>
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
          <button onClick={onCancelar} className="mr-2 px-4 py-2 bg-gray-300 rounded">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalHuesped;