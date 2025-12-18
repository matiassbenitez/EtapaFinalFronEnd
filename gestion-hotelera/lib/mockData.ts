import { Reserva } from "@/types/reserva";

export const RESERVAS_MOCK: Reserva[] = [
  {
    "id": 1,
    "estado": "ACTIVA",
    "fechaInicio": "2025-12-16T00:00:00",
    "fechaFin": "2025-12-22T00:00:00",
    "huespedes": [
      { "id": 1, "nombre": "MATIAS", "apellido": "TROSSERO", "docIdentidad": "39504880", "tipoDoc": "DNI" },
      { "id": 3, "nombre": "NICOLAS", "apellido": "FRANCHUTE CASTALDI", "docIdentidad": "38987654", "tipoDoc": "DNI" }
    ],
    "nombre": "MATIAS",
    "apellido": "TROSSERO",
    "contacto": "3420000000",
    "habitacionesIds": [1],
    "estadias": [
      {
        "id": 1,
        "fechaIngreso": "2025-12-17T12:33:14.988045",
        "fechaEgreso": "2025-12-22T00:00:00",
        "reservaId": 1,
        "habitacionId": 1,
        "huespedes": [
          { "id": 1, "nombre": "MATIAS", "apellido": "TROSSERO", "docIdentidad": "39504880", "tipoDoc": "DNI" },
          { "id": 3, "nombre": "NICOLAS", "apellido": "FRANCHUTE CASTALDI", "docIdentidad": "38987654", "tipoDoc": "DNI" }
        ],
        "servicios": [
          {
            "id": 1,
            "estadiaId": 1,
            "servicioId": 1,
            "incluido": false,
            "servicio": {
              "id": 1,
              "tipoServicio": "NOCHES",
              "costoTotal": 304800
            }
          }
        ]
      }
    ]
  },
  {
    "id": 2,
    "estado": "ACTIVA",
    "fechaInicio": "2025-12-15T00:00:00",
    "fechaFin": "2025-12-17T00:00:00",
    "huespedes": [
        { "id": 2, "nombre": "MATIAS", "apellido": "BENITEZ", "docIdentidad": "40123456", "tipoDoc": "DNI" }
    ],
    "nombre": "MATIAS",
    "apellido": "BENITEZ",
    "contacto": "3420000000",
    "habitacionesIds": [2],
    "estadias": [
      {
        "id": 2,
        "fechaIngreso": "2025-12-17T12:33:15.050531",
        "fechaEgreso": "2025-12-17T00:00:00",
        "reservaId": 2,
        "habitacionId": 2,
        "huespedes": [
          { "id": 2, "nombre": "MATIAS", "apellido": "BENITEZ", "docIdentidad": "40123456", "tipoDoc": "DNI" }
        ],
        "servicios": [
          {
            "id": 2,
            "estadiaId": 2,
            "servicioId": 2,
            "incluido": false,
            "servicio": {
              "id": 2,
              "tipoServicio": "NOCHES",
              "costoTotal": 101600
            }
          }
        ]
      }
    ]
  },
  {
    "id": 3,
    "estado": "ACTIVA",
    "fechaInicio": "2025-12-13T00:00:00",
    "fechaFin": "2025-12-19T00:00:00",
    "huespedes": [
        { "id": 3, "nombre": "NICOLAS", "apellido": "FRANCHUTE CASTALDI", "docIdentidad": "38987654", "tipoDoc": "DNI" }
    ],
    "nombre": "FRANCHUTE",
    "apellido": "CASTALDI",
    "contacto": "3420000000",
    "habitacionesIds": [3],
    "estadias": [
      {
        "id": 3,
        "fechaIngreso": "2025-12-17T12:33:15.050531",
        "fechaEgreso": "2025-12-19T00:00:00",
        "reservaId": 3,
        "habitacionId": 3,
        "huespedes": [
          { "id": 3, "nombre": "NICOLAS", "apellido": "FRANCHUTE CASTALDI", "docIdentidad": "38987654", "tipoDoc": "DNI" }
        ],
        "servicios": [
          {
            "id": 3,
            "estadiaId": 3,
            "servicioId": 3,
            "incluido": false,
            "servicio": {
              "id": 3,
              "tipoServicio": "NOCHES",
              "costoTotal": 304800
            }
          }
        ]
      }
    ]
  }
];