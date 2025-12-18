"use client";

interface Props {
  onBuscar: (nombre: string, apellido: string) => void;
}

export default function Buscador({ onBuscar }: Props) {
  let nombre = "";
  let apellido = "";

  return (
    <div className="flex gap-2 mb-6">
	<input
        className="border rounded px-3 py-2 w-40"
        placeholder="Nombre"
        onChange={(e) => (nombre = e.target.value)}
      />
      <input
        className="border rounded px-3 py-2 w-40"
        placeholder="Apellido"
        onChange={(e) => (apellido = e.target.value)}
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
