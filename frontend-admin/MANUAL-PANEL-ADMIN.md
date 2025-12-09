# Manual del Panel Admin

00. Introducción
01. Login 
02. Olvidé mi contraseña
03. RBAC (Control de Acceso Basado en Roles)
04. Categorías
05. Productos
06. Características
07. Imágenes
08. Favoritos
09. Reservas
10. Reviews
11. Usuarios
12. Crear nuevo USER
13. Cambiar contraseña
14. Roles
15. Permisos
16. Permisos por Rol
17. Contacto o soporte

---
## Introducción
Bienvenido al manual del Panel de Administración. Aquí encontrarás toda la información necesaria para gestionar la plataforma de forma eficiente.

## Login
1. El usuario ingresa email y contraseña.
2. El frontend hace un POST a /api/auth/authenticate.
3. Si las credenciales son válidas, guarda el token y roles en localStorage.
4. Luego, consulta al backend si el rol del usuario tiene permiso "ADMIN"   
(http://localhost:8080/api/rol-permiso/rol/{rolId}/permiso/admin).
Endpoint en RolPermisoController, con token, se espera respuesta T/F.
5. Si el usuario NO tiene permiso "ADMIN", muestra el mensaje:
"No tiene permiso para acceder al panel de administración."
6. Si tiene permiso, navega al panel

## Olvidé mi contraseña
1. El usuario ingresa su correo electrónico en el formulario de "Olvidé mi contraseña".
2. El frontend envía una petición GET a /api/usuarios/email-rol/{email} para verificar si el usuario existe y obtener su rol.
3. Si el usuario no existe, se muestra un mensaje de error: "No se encontró un usuario registrado con ese correo electrónico."
4. Si el usuario existe, el frontend obtiene el rolId del usuario.
5. El frontend envía una petición GET al endpoint público /api/rol-permiso/public/rol/{rolId}/permiso/admin para verificar si el rol tiene permiso ADMIN.
6. Si el rol no tiene permiso ADMIN, se muestra un mensaje de error: "No es posible recuperar la contraseña por este medio. Si tienes dudas, contacta al administrador."
7. Si el usuario tiene permiso ADMIN, el frontend envía una petición POST a /api/auth/forgot-password con el JSON { email, origin: "ADMIN" }.
8. El backend procesa la solicitud y, si todo es correcto, envía un correo de recuperación al usuario.
9. El frontend muestra un mensaje de éxito: "Revisá tu correo para continuar con la recuperación."

## RBAC (Control Acceso Basado en Roles)
- El sistema implementa un esquema de control de acceso basado en Roles y Permisos (RBAC — Role Based Access Control) utilizando Spring Security + JWT.
- Cada usuario posee un Rol (por ejemplo: USER, ADMIN, SUPER_ADMIN).
- Cada Rol cuenta con una lista de Permisos, que determinan qué acciones pueden realizarse dentro de la plataforma.
- Los Permisos no están codificados de forma rígida en el backend; pueden ampliarse y administrarse dinámicamente.
### Flujo de Autenticación
- El usuario se registra o inicia sesión mediante /api/auth/**.
- El sistema valida credenciales y genera un JWT.
- En cada solicitud posterior, el cliente debe incluir el token en el encabezado Authorization: Bearer <token>.
### Autorización por Roles y Permisos
- Spring Security valida que el usuario tenga:
- Un rol apropiado para acceder al recurso.
- Y además, los permisos asociados a ese rol para ejecutar la acción.
- Esto permite una arquitectura flexible donde, por ejemplo, un SUPER_ADMIN puede otorgar permisos temporales a otros roles sin modificar código.
### En síntesis:
“El proyecto implementa seguridad basada en JWT y RBAC. Los roles y permisos se inicializan automáticamente al arrancar la aplicación y se asignan dinámicamente en base a tablas, permitiendo ampliar permisos sin modificar código. Esto reduce acoplamiento y hace que la arquitectura sea escalable.”
...
## Categorías
Listado de Categorías.
Modo editable que permite modificar y eliminar una Categoría.
Accesible por un usuario con Rol = ADMIN y SUPER_ADMIN
...
## Productos
Listado de Productos.
Modo editable que permite modificar y eliminar un Producto.
Accesible por un usuario con Rol = ADMIN y SUPER_ADMIN
...
## Características
Listado de Características.
Modo editable que permite modificar y eliminar una Característica.
Accesible por un usuario con Rol = ADMIN y SUPER_ADMIN
...
## Imágenes
Listado de Imágenes.
Modo editable que permite modificar y eliminar una Imagen.
Accesible por un usuario con Rol = ADMIN y SUPER_ADMIN
...
## Favoritos
Listado de Permisos.
Modo editable que permite modificar y eliminar un Favorito.
Solo accesible por un usuario con Rol = SUPER_ADMIN
...
## Reservas
Listado de Reservas.
Modo editable que permite modificar y eliminar una Reserva.
Accesible por un usuario con Rol = ADMIN y SUPER_ADMIN
Para que un usuario autenticado en la App de Clientes, pueda generar un Review, el "estado" de la Reserva debe ser "FINALIZADA"
...
## Reviews
Listado de Reviews.
Modo editable que solo permite eliminar un Review.
Solo accesible por un usuario con Rol = SUPER_ADMIN
Para que un usuario autenticado en la App de Clientes, pueda generar un Review, el "estado" de la Reserva debe ser "FINALIZADA"
...
## Usuarios
Listado de Usuarios.
Modo editable que permite modificar y eliminar un Usuario.
Solo accesible por un usuario con Rol = SUPER_ADMIN
...
## Crear nuevo USER
Formulario para crear un usuario. Un ADMIN puede crear un nuevo usuario. Por defecto es creado con Rol = USER. Para cambiar el Rol a un usuario en particular, ir a Usuarios > Editar Items, solo un SUPER_ADMIN puede cambiar el Rol.
...
## Cambiar contraseña
Formulario para cambiar la contraseña.
...
## Roles
Listado de Roles.
Modo editable que permite modificar y eliminar un Rol.
Solo accesible por un usuario con Rol = SUPER_ADMIN
...
## Permisos
Listado de Permisos.
Modo editable que permite modificar y eliminar un Permiso.
Formulario para crear un Rol
Solo accesible por un usuario con Rol = SUPER_ADMIN
...
## Permisos por Rol
Listado de Permisos por Rol.
Formulario para asignar múltiples Permisos para un mismo Rol
Modo editable que permite eliminar un Rol-Permiso.
Solo accesible por un usuario con Rol = SUPER_ADMIN
...
## Contacto o soporte
Enviar correo a: mpasciaroni@outlook.com