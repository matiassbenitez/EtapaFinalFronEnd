export const REGEX = {
  telefono: /^[0-9\s+\-()]{7,20}$/,
  soloLetras: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
};

export const validateHuespedForm = (data: any): string | null => {
  // Validación de Nombre
  if (!data.nombre.trim()) return "El nombre es obligatorio";
  if (!REGEX.soloLetras.test(data.nombre)) return "El nombre solo puede contener letras";

  // Validación de Apellido
  if (!data.apellido.trim()) return "El apellido es obligatorio";
  if (!REGEX.soloLetras.test(data.apellido)) return "El apellido solo puede contener letras";
  
  // Validación de Contacto
  if (!data.contacto.trim()) return "El teléfono es obligatorio";
  if (!REGEX.telefono.test(data.contacto)) return "El formato del contacto telefónico no es válido";

  return null; // Si pasa todas las validaciones
};