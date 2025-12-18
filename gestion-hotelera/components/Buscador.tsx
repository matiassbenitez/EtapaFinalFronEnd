import { useState } from "react";

interface Props {
  onBuscar: (nombre: string, apellido: string) => void;
}

export default function Buscador({ onBuscar }: Props) {
  const [nombre, setNombre] = useState<string>("");
  const [apellido, setApellido] = useState<string>("");

  return (
    <div className="flex gap-2 mb-6">
	<input
        className="border rounded px-3 py-2 w-40"
        placeholder="Nombre"
        onChange={(e) => (setNombre(e.target.value))}
      />
      <input
        className="border rounded px-3 py-2 w-40"
        placeholder="Apellido"
        onChange={(e) => (setApellido(e.target.value))}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={() => onBuscar(nombre, apellido)}
      >
        Buscar
      </button>
    </div>
  );
}
