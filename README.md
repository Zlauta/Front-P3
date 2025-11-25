# 🖥️ Documentación Técnica - Frontend 

## 1\. Visión General

El cliente es una **Single Page Application (SPA)** desarrollada con **React.js** y **Vite**. Su objetivo es proveer una interfaz interactiva y responsiva para los usuarios finales (reservas, menú, reseñas) y un panel de administración protegido para la gestión del negocio.

La aplicación implementa patrones de diseño modernos como **HOCs (Higher Order Components)** para protección de rutas, interceptores de Axios para manejo global de errores y una estructura de enrutamiento modular.

## 2\. Stack Tecnológico y Dependencias

El núcleo del cliente utiliza las siguientes librerías clave definidas en `package.json`:

  * **Core:**
      * `react` (^19.1.1): Librería principal de UI.
      * `vite` (^7.1.7): Build tool y entorno de desarrollo rápido.
      * `react-router-dom` (^7.8.0): Manejo de rutas declarativas.
  * **Interfaz de Usuario (UI):**
      * `react-bootstrap` (^2.10.10) & `bootstrap`: Componentes base y grillas.
      * `sweetalert2` (^11.26.3): Alertas modales personalizadas.
      * `react-icons` (^5.5.0): Iconografía vectorial.
      * `aos` (^2.3.4): Animaciones al hacer scroll.
  * **Gestión de Estado y Datos:**
      * `axios` (^1.12.2): Cliente HTTP.
      * `react-hook-form` (^7.62.0): Manejo eficiente de formularios.
  * **Integraciones:**
      * `@emailjs/browser`: Envío de correos desde el cliente.
      * `firebase`: Servicios backend (posiblemente para auth o storage).

## 3\. Instalación y Ejecución

### Requisitos

  * Node.js v16+
  * Backend corriendo (generalmente en puerto 3000 o 8080).

### Pasos

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```
2.  **Configuración de Entorno:**
    Asegúrate de configurar la URL base de la API en tu archivo `src/api/clientAxios.js`.
3.  **Ejecución:**
      * **Modo Desarrollo:**
        ```bash
        npm run dev
        ```
      * **Producción (Build):**
        ```bash
        npm run build
        npm run preview
        ```

## 4\. Arquitectura de Enrutamiento

El sistema de rutas está centralizado en `Index.jsx` y dividido en módulos para mejor mantenimiento.

```text
src/
├── routes/
│   ├── Index.jsx           # Router Principal (BrowserRouter)
│   ├── AdminRoute.jsx      # Sub-rutas del Panel de Admin
│   ├── PublicRoute.jsx     # Sub-rutas públicas
│   └── ProtectedRoute.jsx  # Guardián de seguridad
```

### Estrategia de Rutas

1.  **Envoltorio Global:** Todas las rutas están envueltas por `<AxiosInterceptor>`, asegurando que cualquier error de red en cualquier página sea capturado.
2.  **Rutas Públicas (`/*`):** Manejadas por `PublicRoute`. Incluye Home, Carta, Login, Registro, etc. Si la ruta no existe, renderiza `NotFound`.
3.  **Rutas Admin (`/admin/*`):** Manejadas por `AdminRoute`. Renderizan un `AdminLayout` (Sidebar + Content). Estas rutas están protegidas.
4.  **Ruta 404:** Se define explícitamente `/404` y también un comodín `*` en cada sub-router para capturar navegación errónea.

## 5\. Seguridad y Protección

### ProtectedRoute

Componente que verifica la autenticación antes de renderizar contenido sensible.

  * **Verificación 1:** Existencia de `token` en `localStorage`.
  * **Verificación 2:** Rol de usuario en `sessionStorage`. Debe ser estrictamente `"admin"`.
  * **Acción:** Si no cumple, redirige a `/login` o al Home `/` según corresponda.

### Axios Interceptor

Mecanismo centralizado para interceptar respuestas HTTP.

  * **Errores de Conexión:** Si el servidor no responde, muestra un SweetAlert de "Error de Conexión".
  * **401 (Unauthorized):** Limpia `localStorage` y `sessionStorage`, y fuerza la redirección al Login.
  * **403 (Forbidden):** Muestra alerta de "Acceso Restringido" (Permisos insuficientes).
  * **404 (Not Found):** Redirige automáticamente a la página `/404`.
  * **500 (Server Error):** Notifica al usuario con un mensaje amigable sobre problemas internos.

## 6\. Estructura de Componentes Clave

### Panel de Administración (`AdminRoute`)

Gestiona los recursos principales del sistema a través de rutas anidadas bajo `/admin`:

  * `/admin/usuarios`
  * `/admin/menu` (Carta/Productos)
  * `/admin/pedidos`
  * `/admin/reservas`
  * `/admin/resenias`
  * `/admin/contacto`

### Vistas Públicas (`PublicRoute`)

Interfaz accesible para clientes:

  * `/carta`: Catálogo de productos.
  * `/reservas`: Formulario para solicitar mesa.
  * `/login` & `/register`: Autenticación de usuarios.

-----

## 7\. Decisiones de Diseño Destacadas

1.  **Manejo de Errores UX:** Se evita que la aplicación "se rompa" silenciosamente. El interceptor asegura que el usuario siempre reciba feedback visual (Alertas o Redirecciones) ante fallos de la API.
2.  **Layouts Separados:** Se distingue claramente el `AdminLayout` (con Sidebar) del layout público, facilitando la gestión de estilos y componentes compartidos específicos para cada rol.
3.  **Seguridad en Cliente:** Aunque la seguridad real está en el Backend, el `ProtectedRoute` mejora la experiencia de usuario evitando que acceda a rutas vacías o prohibidas sin estar logueado.
