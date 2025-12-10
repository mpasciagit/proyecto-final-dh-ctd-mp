# DriveNow - Tu alquiler ideal

## Descripción general del proyecto
DriveNow es una plataforma completa de alquiler de vehículos desarrollada como Proyecto Final del curso Professional Developer de Digital House.
El sistema incluye backend, panel administrativo y frontend para clientes, integrando autenticación, reservas, gestión de productos, roles y permisos, y más.

## Tecnologías utilizadas
### Backend: 
Java 21, Spring Boot 3.5.6, Spring Security, Spring Data JPA, H2 Database, Lombok, Maven. Seguridad: JWT (JSON Web Tokens)
### Frontend Cliente:
React, Vite, Redux Toolkit, React Router, Tailwind CSS 4  
### Frontend Admin:
React, Vite  
### Extras:
Mailtrap, JWT, RBAC (Roles & Permissions)

## Estructura del proyecto
Proyecto-Final/
├─ backend-proy-final/    -> API REST
├─ frontend-admin/        -> Panel Administrativo
├─ frontend-cliente/      -> App pública para usuarios finales
└─ README.md              -> Este archivo

## Características principales
- Sistema de autenticación y autorización basada en JWT  
- Registro y login de usuarios  
- Sistema RBAC con roles y permisos  
- Gestión de productos desde el panel admin  
- Reservas con control de disponibilidad desde el backend  
- Calificaciones y reseñas, para reservas FINALIZADAS  
- Envío de mails (para confirmación de registro y de reserva)  
- H2 no persistente para portabilidad (BD se reinicia en cada arranque) 
- Swagger para documentación de API

## Seguridad — RBAC (Role-Based Access Control)
El sistema implementa un esquema de control de acceso basado en Roles y Permisos (RBAC — Role Based Access Control) utilizando Spring Security + JWT.
Cada usuario posee un Rol (por ejemplo: USER, ADMIN, SUPER_ADMIN).
Cada Rol cuenta con una lista de Permisos, que determinan qué acciones pueden realizarse dentro de la plataforma.
Los permisos no están codificados de forma rígida en el backend; pueden ampliarse y administrarse dinámicamente.
- Flujo de Autenticación
El usuario se registra o inicia sesión mediante /api/auth/**.
El sistema valida credenciales y genera un JWT.
En cada solicitud posterior, el cliente debe incluir el token en el encabezado Authorization: Bearer <token>.
- Autorización por Roles y Permisos
Spring Security valida que el usuario tenga:
Un rol apropiado para acceder al recurso.
Y además, los permisos asociados a ese rol para ejecutar la acción.
Esto permite una arquitectura flexible donde, por ejemplo, un SUPER_ADMIN puede otorgar permisos temporales a otros roles sin modificar código.
En síntesis:
“El proyecto implementa seguridad basada en JWT y RBAC. Los roles y permisos se inicializan automáticamente al arrancar la aplicación y se asignan dinámicamente en base a tablas, permitiendo ampliar permisos sin modificar código. Esto reduce acoplamiento y hace que la arquitectura sea escalable.”


## Instalación local
Requisitos previos
- Java 21
- Maven 3.9+
- Node 18+ / 20+
- IDE recomendado: IntelliJ IDEA (pero funciona con cualquier editor)

## Instalación general
1. Clonar el repositorio: git clone <URL_DEL_REPO>
2. Configurar el archivo `.env` basado en `.env.example`  
3. Iniciar el backend desde IntelliJ IDEA (Spring Boot)  
4. Ejecutar los frontends con `npm install` + `npm run dev`  

## Base de datos
- Motor: H2  
- Configuración manejada desde application.properties:
- No persistente en archivo
- Consola disponible en http://localhost:8080/h2-console
- Hibernate ddl-auto = update

- Para evitar una carga manual inicial, desarrollamos un sistema de bootstrap de seguridad: primero se crean roles y permisos, luego se generan usuarios con diferentes perfiles. Esto nos garantiza un entorno listo para pruebas desde el primer arranque de la aplicación, sin afectar los despliegues posteriores.

### Inicialización automática de Roles y Permisos
Al iniciar la aplicación, se ejecuta el componente RolPermisoInitializer (implementacón de CommandLineRunner), encargado de:
✔ Crear los roles base del sistema si no existen: SUPER_ADMIN, ADMIN, USER
✔ Crear dinámicamente todos los permisos declarados en la tabla interna del inicializador.
✔ Asignar los permisos correspondientes a cada rol según los requerimientos del proyecto.

### Inicialización de Usuarios por Defecto
Para facilitar la evaluación y las pruebas del sistema, el proyecto incluye un componente de arranque (UserInitializer) que crea automáticamente usuarios predeterminados, SOLO si la base de datos no contiene usuarios.
Esto permite:
✔ Validar el sistema de autenticación con JWT
✔ Probar los diferentes niveles de permisos según el rol
✔ Acceder al panel administrativo sin configuraciones adicionales

Usuarios creados automáticamente
Rol         Nombre        Email                Contraseña    Acceso
SUPER_ADMIN Alicia Perez  super_admin@test.com superadmin123 Acceso total al sistema
ADMIN       Leo Ricci     admin@test.com       admin123      Gestión operativa
USER        Valeria Galli user@test.com        user123       Reservas, reviews y favoritos

⚠ Estos usuarios se generan únicamente cuando la tabla usuarios está vacía.

### Inicialización automática de datos de catálogo
El proyecto incluye un Data Seeder (DataInitializer) que precarga información de catálogo para que la aplicación esté totalmente funcional desde el primer arranque, sin necesidad de cargar productos de manera manual.
Esto optimiza la experiencia de testing y la comprensión del negocio desde el primer uso.
Datos insertados automáticamente
El seeder crea:
Entidad        Cantidad inicial Descripción
Características	           3    Propiedades de los vehículos (Transmisión, Pasajeros, Equipaje)
Categorías	               4    Económico, SUV, Lujo y Pickup
Productos                 40    Distribuidos por categoría (25 Económicos, 5 SUV, 5 Lujo, 5 Pickup)
Imágenes	                40    1 imagen por producto (cada una con URL y texto descriptivo)
Producto–Característica  120    Cada vehículo se asocia a sus 3 características c/valores dinámicos

Los datos se insertan solo si las tablas se encuentran vacías, lo que permite mantener integridad tras un despliegue posterior y evita duplicación.
Valor agregado al proyecto
Este seeder permite:
✔ disponer de un catálogo completo para búsqueda y reservas desde el primer inicio
✔ tener variedad suficiente para evidenciar scroll infinito, filtros y paginación en el frontend
✔ simular un catálogo realista con diferencias de precios, imágenes y capacidades

#### Flujo de inicialización (orden de ejecución)
Orden               Componente          Función
@Order(1)	        RolPermisoInitializer Crea roles y permisos y los asigna
@Order(2)	        UserInitializer       Crea usuarios y les asigna un rol existente
Sin orden explícito DataInitializer     Carga características, categorías, productos e imágenes

Con esto se asegura que los usuarios se generen solo después de que los roles y permisos estén creados.

“El objetivo fue entregar un backend listo para ser probado en producción sin prerequisitos manuales. Por eso desarrollamos tres inicializadores: uno para seguridad (roles-permisos), uno para usuarios con credenciales reales de prueba, y uno para el catálogo completo de vehículos. De esta forma la plataforma es utilizable desde el minuto 0 del despliegue.”

## Envío de correos electrónicos

El proyecto utiliza **Mailtrap** como servicio SMTP en entorno de desarrollo, 
permitiendo validar el envío de emails sin utilizar cuentas reales.

## Variables de entorno del backend (.env)
Estas credenciales deben configurarse localmente y no se incluyen en el repositorio por seguridad.
/backend-proy-final
 ├─ src/
 ├─ .env          ➜ archivo local (NO incluido en el repositorio) 
 ├─ .env.example  ➜ archivo de ejemplo (incluido en el repositorio). 
 
⚠️ Para ejecutar el proyecto:
1. Copiar `.env.example`
2. Renombrarlo a `.env`
3. Completar los valores reales

Para habilitar el envío de correos, configurar las siguientes variables:

MAIL_HOST=sandbox.smtp.mailtrap.io  
MAIL_PORT=2525  
MAIL_USERNAME=**************  
MAIL_PASSWORD=**************

Variable de entorno utilizada por el backend para definir los orígenes (dominios/hosts) permitidos en las solicitudes CORS.
Permite autorizar conexiones desde el frontend, incluyendo accesos desde la red local (por ejemplo, dispositivos móviles o tablets en la misma red WiFi).
Ejemplo de valor:
ALLOWED_ORIGINS=http://192.168.x.y:5173
 
## Variables de entorno del frontend
No tiene.

## Ejecución y uso
1. Ejecutar el backend-proy-final
Desde IntelliJ IDEA → Run
Desde Bash          → mvn spring-boot:run
El backend quedará disponible en: http://localhost:8080

2. Ejecutar el frontend-client
Desde Bash → npm run dev
La app quedará disponible en: http://localhost:5173

3. Ejecutar el frontend-admin
Desde Bash → npm run dev
El 'panel administrativo' quedará disponible en: http://localhost:5174

4. Ejecución frontend-cliente desde dispositivos móviles.
La aplicación puede ser accedida desde dispositivos móviles (tablet/celulares) utilizando la IP local del equipo que ejecuta el backend y el frontend, siempre que ambos estén conectados a la misma red.
El frontend utiliza Vite y está configurado para permitir acceso desde otros dispositivos en la red local (vite.config.js):
server: { host: '0.0.0.0', port: 5173, proxy:... }
Ejemplo al ejecutar: npm run dev
➜  Local:   http://localhost:5173/      (desktop)
➜  Network: http://192.168.0.xxx:5173/  (tablet/celulares en la misma red WiFi)


## Endpoints principales del API
La API expone endpoints REST organizados por recursos.
Los principales módulos son:

- Autenticación (`/api/auth`)
- Usuarios (`/api/usuarios`)
- Roles (`/api/roles`)
- Permisos (`/api/permisos`)
- Asignación Rol–Permiso (`/api/rol-permiso`)
- Productos / Vehículos (`/api/productos`)
- Categorías (`/api/categorias`)
- Reservas (`/api/reservas`)
- Reseñas (`/api/reviews`)
- Favoritos (`/api/favoritos`)
- Características (`/api/caracteristicas`)
- Imágenes (`/api/imagenes`)

Para una lista completa de endpoints y ejemplos de uso, ver la colección de Postman incluida en este repositorio.

## Diagrama de la Base de Datos
El proyecto incluye un diagrama del modelo de datos realizado con PlantUML, disponible en el repositorio en formato .svg.
Este diagrama puede visualizarse directamente desde VS Code (con la extensión de PlantUML) o desde el repositorio sin necesidad de herramientas adicionales (proyecto-final/diagrama-entidades/). 
⚠️ Nota:
El diagrama representa la estructura conceptual del sistema.
Es una referencia arquitectónica para comprender la estructura general de la base de datos.

## Documentación API y endpoints
Swagger UI disponible en:  
`http://localhost:8080/swagger-ui/index.html`

## Demo / Links (deploy, API docs, videos, postman) si 
El proyecto incluye una colección de Postman con todos los endpoints probados. Nombre del archivo:
/postman
  ├── DriveNow_API.postman_collection.json
  └── DriveNow_Local.postman_environment.json

## Deploy (link de Backend / Frontend)
No disponibles

## Conciencia de seguridad:
Durante el desarrollo se habilitó acceso sin autenticación a /h2-console/** y a endpoints de documentación (/swagger-ui/**, /v3/api-docs/**) únicamente con fines de testing.
En un entorno productivo estos endpoints se encontrarán protegidos o deshabilitados.

## Testing
Actualmente el proyecto cuenta con pruebas unitarias enfocadas en la capa de controladores, utilizando Mockito para simular dependencias y Spring Boot Starter Test.
Ruta de acceso:
backend-proy-final/src/test/java/com/dh/ctd/mp/proyecto_final/controller/
El objetivo principal fue validar el comportamiento de los endpoints REST.

## Autores
- Miguel Pasciaroni (Alumno)

## Licencia
Este proyecto es solo para fines educativos.
