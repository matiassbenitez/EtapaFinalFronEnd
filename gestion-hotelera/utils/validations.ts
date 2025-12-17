
export const REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  soloNumeros: /^\d+$/,
  telefono: /^[0-9\s+\-()]{7,20}$/,
  soloLetras: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
};

export const validateHuespedForm = (data: any) => {
  const errors: Record<string, string> = {};

  if (!data.nombre.trim()) {
    errors.nombre = "El nombre es obligatorio";
  } else if (!REGEX.soloLetras.test(data.nombre)) {
    errors.nombre = "El nombre solo puede contener letras";
  }

  if (!data.apellido.trim()) {
    errors.apellido = "El apellido es obligatorio";
  }else if (!REGEX.soloLetras.test(data.apellido)) {
    errors.apellido = "El apellido solo puede contener letras";
  }

  if (!data.nacionalidad.trim()) {
    errors.nacionalidad = "La nacionalidad es obligatoria";
  }else if (!REGEX.soloLetras.test(data.nacionalidad)) {
    errors.nacionalidad = "La nacionalidad solo puede contener letras";
  }

  if (!data.ocupacion.trim()) {
    errors.ocupacion = "La ocupacion es obligatoria";
  }else if (!REGEX.soloLetras.test(data.ocupacion)) {
    errors.ocupacion = "La ocupacion solo puede contener letras";
  }

  if (data.email && !REGEX.email.test(data.email)) {
    errors.email = "El formato de email no es válido";
  }
  
  if (!data.telefono.trim()) {
    errors.telefono = "El teléfono es obligatorio";
  } else if (!REGEX.telefono.test(data.telefono)) {
    errors.telefono = "El formato de teléfono no es válido";
  }

  if (!data.tipoDoc.trim()) {
    errors.tipoDoc = "El tipo de documento es obligatorio";
  }

  if (!data.domicilio.trim()) {
    errors.domicilio = "El domicilio es obligatorio";
  }

  if (!data.nroDoc.trim()) {
    errors.nroDoc = "El número de documento es obligatorio";
  } else if (data.nroDoc.length < 6 || data.nroDoc.length > 10) {
    errors.nroDoc = "El número de documento debe tener entre 6 y 10 dígitos";
  } else if (!REGEX.soloNumeros.test(data.nroDoc)) {
    errors.nroDoc = "El documento debe contener solo números";
  }


  if (!data.fechaNacimiento) {
    errors.fechaNacimiento = "La fecha de nacimiento es obligatoria";
  } else {
    const fecha = new Date(data.fechaNacimiento);
    const hoy = new Date();
    if (fecha > hoy) {
      errors.fechaNacimiento = "La fecha no puede ser futura";
    }
  }

  if (!data.posIva.trim()) {
    errors.posIva = "La posición frente al IVA es obligatoria";
  }

  if (!data.pais.trim()) {
    errors.pais = "El país es obligatorio";
  }else if (!REGEX.soloLetras.test(data.pais)) {
    errors.pais = "El país solo puede contener letras";
  }

   
  if (!data.localidad.trim()) {
    errors.localidad = "La localidad es obligatoria";
  }else if (!REGEX.soloLetras.test(data.localidad)) {
    errors.localidad = "La localidad solo puede contener letras";
  }

  return errors;
};