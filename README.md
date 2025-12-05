TOOLCRIB – Backend

Backend del sistema de catálogo, administración de inventario y solicitudes internas para el área de mantenimiento y producción.
Desarrollado en Node.js, Express, PostgreSQL y JWT para autenticación.

1. Requerimientos Previos

Antes de ejecutar el proyecto asegúrate de tener instalado:

Node.js (versión 18+ recomendada)

PostgreSQL / pgAdmin

Git

Postman (para pruebas)

Clona el repositorio:

git clone https://github.com/TBSewtech/CatalogoToolCrib-Backend.git
cd CatalogoToolCrib-Backend


Instala dependencias:

npm install

2. Variables de entorno (.env)

Crea un archivo .env en el directorio raíz del backend con la siguiente estructura:

DB_USER=postgres
DB_HOST=localhost
DB_NAME=CatalogoTOOLCRIB
DB_PASSWORD=tecsanpedro
DB_PORT=5432

PORT=3000

MASTER_KEY=TOOLCRIB1
JWT_SECRET=TOOL1


MASTER_KEY permite crear nuevos administradores.
JWT_SECRET se usa para firmar los tokens de autenticación.

3. Ejecutar el Backend

Modo desarrollo:

npm run dev


Modo producción:

npm start


El backend correrá en:

http://localhost:3000

4. Endpoints del Sistema
4.1 Piezas (Inventario)
Obtener todas las piezas (con filtros opcionales)
GET /piezas


Parámetros opcionales:
q, categoria, stock, limit, offset.

Obtener una pieza por ID
GET /piezas/:id

Crear una pieza (solo admin)
POST /piezas


Headers:

Authorization: Bearer TOKEN

Editar una pieza (solo admin)
PUT /piezas/:id

Eliminar una pieza (solo admin)
DELETE /piezas/:id

4.2 Administradores
Iniciar sesión (genera token)
POST /admin/login


Body:

{
  "correo": "example@mail.com",
  "contrasena": "1234"
}


Respuesta:

Token JWT válido por 8 horas.

Crear nuevo administrador
POST /admin/crear


Headers:

x-master-key: TOOLCRIB1


Body:

{
  "nombre": "Nuevo Admin",
  "correo": "nuevo@mail.com",
  "contrasena": "clave123"
}

4.3 Solicitudes (Carrito)
Crear una nueva solicitud
POST /solicitudes


Body:

{
  "nombre_empleado": "Juan Pérez",
  "carrito": [
    { "id_pieza": "50010", "cantidad": 2 },
    { "id_pieza": "70001", "cantidad": 1 }
  ]
}

Listar solicitudes (solo admin)
GET /solicitudes


Headers:

Authorization: Bearer TOKEN

Ver detalle de una solicitud
GET /solicitudes/:id

Actualizar estado (admin)
PUT /solicitudes/:id/estado


Body:

{ "estado": "aprobada" }


Estados válidos:
pendiente, aprobada, entregada

5. Historial (Automático)

El sistema registra automáticamente acciones importantes en la tabla historial:

Creación, actualización y eliminación de piezas

Creación de solicitudes

Actualización de estado de solicitud

No requiere llamadas externas; funciona con triggers de PostgreSQL incluidos en el proyecto.

6. Postman Collection

Dentro del repositorio se incluye:

TOOLCRIB Backend.postman_collection.json


Esta colección contiene todos los endpoints listos para probar.

7. Estructura del Proyecto
Backend/
│ .env
│ index.js
│ db.js
│ package.json
│
├── rutas/
│   ├── piezas.js
│   ├── admin.js
│   └── solicitudes.js
│
├── middleware/
│   └── auth.js
│
└── sql/
    └── triggers_historial.sql   (opcional)

8. Tecnologías Utilizadas

Node.js

Express

PostgreSQL

JSON Web Tokens (JWT)

Bcrypt

CORS

pg (node-postgres)

9. Autor

Proyecto desarrollado por Abby Huerta,
para el catálogo interno TOOLCRIB.

10. Notas Finales

Este backend ya es completamente funcional.

El frontend puede consumir todos los endpoints sin modificaciones.

Se recomienda desplegar el backend en Render o Railway usando las mismas variables de entorno.