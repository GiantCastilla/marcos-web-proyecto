// Lista de suscripciones que vende la tienda. Por ahora está escrita a
// mano aquí (datos de ejemplo); más adelante esto vendrá del backend
// (Spring Boot + base de datos) en vez de estar "hardcodeado".
// Cada objeto es UNA tarjeta del catálogo.
//
// Campos de cada producto:
//   id             -> identificador único (lo usa el carrito)
//   nombre         -> título que se ve en la tarjeta
//   modelo         -> marca/modelo de IA; es lo que usa el filtro "Modelo de IA"
//   tipo           -> tipo de entrega (cuenta, clave, invitación...)
//   duracion       -> cuánto dura la suscripción
//   precio         -> precio actual en soles
//   precioAnterior -> precio antes de la oferta (null si no tiene oferta)
//   stock          -> cuántas quedan disponibles (0 = agotado)
//   ventas         -> cuántas se vendieron; se usa para ordenar por "Relevancia"
//   icono          -> clase de Bootstrap Icons que se dibuja en la portada
//   descripcion    -> texto largo del modal "Ver detalles"
//   incluye        -> lista de beneficios del modal "Ver detalles"
var PRODUCTOS = [
    {
        id: 'chatgpt-plus',
        nombre: 'ChatGPT Plus',
        modelo: 'ChatGPT',
        tipo: 'Cuenta personal',
        duracion: '1 mes',
        precio: 59.90,
        precioAnterior: 75.00,
        stock: 18,
        ventas: 540,
        icono: 'bi-chat-dots-fill',
        descripcion: 'Acceso prioritario a los modelos más recientes de OpenAI, con más mensajes por día, generación de imágenes y navegación web.',
        incluye: ['Modelos avanzados de OpenAI', 'Generación de imágenes', 'Análisis de archivos y datos', 'Activación en menos de 24 horas']
    },
    {
        id: 'chatgpt-team',
        nombre: 'ChatGPT Team',
        modelo: 'ChatGPT',
        tipo: 'Invitación a espacio de equipo',
        duracion: '1 mes · 1 usuario',
        precio: 105.00,
        precioAnterior: null,
        stock: 7,
        ventas: 120,
        icono: 'bi-people-fill',
        descripcion: 'Espacio de trabajo compartido para equipos, con consola de administración y datos que no se usan para entrenar modelos.',
        incluye: ['Espacio de trabajo compartido', 'Consola de administración', 'Límites de uso más altos que Plus', 'Facturación a nombre de empresa']
    },
    {
        id: 'chatgpt-pro',
        nombre: 'ChatGPT Pro',
        modelo: 'ChatGPT',
        tipo: 'Cuenta personal',
        duracion: '1 mes',
        precio: 699.00,
        precioAnterior: 750.00,
        stock: 3,
        ventas: 45,
        icono: 'bi-lightning-charge-fill',
        descripcion: 'El plan más completo de OpenAI, pensado para uso intensivo: investigación, programación y análisis a gran escala.',
        incluye: ['Uso casi ilimitado', 'Modo de razonamiento extendido', 'Acceso anticipado a funciones nuevas', 'Soporte prioritario']
    },
    {
        id: 'claude-pro',
        nombre: 'Claude Pro',
        modelo: 'Claude',
        tipo: 'Cuenta personal',
        duracion: '1 mes',
        precio: 62.00,
        precioAnterior: 75.00,
        stock: 15,
        ventas: 410,
        icono: 'bi-stars',
        descripcion: 'Asistente de Anthropic ideal para redactar, analizar documentos largos y programar, con más uso que el plan gratuito.',
        incluye: ['Más uso que el plan gratuito', 'Proyectos con documentos propios', 'Ideal para código y análisis', 'Activación en menos de 24 horas']
    },
    {
        id: 'claude-max-5x',
        nombre: 'Claude Max 5x',
        modelo: 'Claude',
        tipo: 'Cuenta personal',
        duracion: '1 mes',
        precio: 369.00,
        precioAnterior: null,
        stock: 5,
        ventas: 90,
        icono: 'bi-rocket-takeoff-fill',
        descripcion: 'Cinco veces más uso que Claude Pro, para personas que trabajan con IA todo el día.',
        incluye: ['5 veces el uso de Pro', 'Acceso prioritario en horas pico', 'Funciones nuevas antes que nadie', 'Soporte prioritario']
    },
    {
        id: 'claude-team',
        nombre: 'Claude Team',
        modelo: 'Claude',
        tipo: 'Invitación a espacio de equipo',
        duracion: '1 mes · 1 usuario',
        precio: 112.00,
        precioAnterior: 120.00,
        stock: 0,
        ventas: 60,
        icono: 'bi-people-fill',
        descripcion: 'Plan para equipos con administración centralizada y proyectos compartidos entre los miembros.',
        incluye: ['Proyectos compartidos', 'Administración de usuarios', 'Más uso que Pro', 'Facturación a nombre de empresa']
    },
    {
        id: 'gemini-pro',
        nombre: 'Google AI Pro (Gemini)',
        modelo: 'Gemini',
        tipo: 'Cuenta personal',
        duracion: '1 mes',
        precio: 55.00,
        precioAnterior: 75.00,
        stock: 22,
        ventas: 380,
        icono: 'bi-gem',
        descripcion: 'Gemini con los modelos más avanzados de Google, integrado con Gmail, Docs y 2 TB de almacenamiento.',
        incluye: ['Modelos avanzados de Gemini', 'Integración con Gmail y Docs', '2 TB de almacenamiento', 'Activación inmediata']
    },
    {
        id: 'gemini-ultra',
        nombre: 'Google AI Ultra (Gemini)',
        modelo: 'Gemini',
        tipo: 'Cuenta personal',
        duracion: '1 mes',
        precio: 899.00,
        precioAnterior: 940.00,
        stock: 2,
        ventas: 25,
        icono: 'bi-gem',
        descripcion: 'El plan más alto de Google: límites máximos, generación de video y acceso anticipado a los modelos experimentales.',
        incluye: ['Límites de uso máximos', 'Generación de video', 'Modelos experimentales', '30 TB de almacenamiento']
    },
    {
        id: 'midjourney-basic',
        nombre: 'Midjourney Basic',
        modelo: 'Midjourney',
        tipo: 'Clave de activación',
        duracion: '1 mes',
        precio: 35.00,
        precioAnterior: 38.00,
        stock: 30,
        ventas: 260,
        icono: 'bi-palette-fill',
        descripcion: 'Generación de imágenes con IA a partir de texto. Plan de entrada ideal para probar Midjourney.',
        incluye: ['Unas 200 imágenes al mes', 'Uso comercial de las imágenes', 'Galería personal', 'Clave enviada al correo']
    },
    {
        id: 'midjourney-standard',
        nombre: 'Midjourney Standard',
        modelo: 'Midjourney',
        tipo: 'Clave de activación',
        duracion: '1 mes',
        precio: 99.00,
        precioAnterior: 113.00,
        stock: 12,
        ventas: 300,
        icono: 'bi-palette-fill',
        descripcion: 'El plan más popular de Midjourney: 15 horas de generación rápida y modo relajado ilimitado.',
        incluye: ['15 horas de generación rápida', 'Modo relajado ilimitado', 'Uso comercial', 'Clave enviada al correo']
    },
    {
        id: 'midjourney-pro',
        nombre: 'Midjourney Pro',
        modelo: 'Midjourney',
        tipo: 'Clave de activación',
        duracion: '1 mes',
        precio: 219.00,
        precioAnterior: null,
        stock: 4,
        ventas: 70,
        icono: 'bi-palette-fill',
        descripcion: 'Para diseñadores y agencias: más horas de generación rápida y modo sigiloso para que tus imágenes no sean públicas.',
        incluye: ['30 horas de generación rápida', 'Modo sigiloso (imágenes privadas)', '12 trabajos en paralelo', 'Clave enviada al correo']
    },
    {
        id: 'copilot-pro',
        nombre: 'GitHub Copilot Pro',
        modelo: 'GitHub Copilot',
        tipo: 'Clave de activación',
        duracion: '1 mes',
        precio: 36.00,
        precioAnterior: 38.00,
        stock: 25,
        ventas: 350,
        icono: 'bi-code-slash',
        descripcion: 'Autocompletado de código con IA dentro de VS Code, IntelliJ y otros editores.',
        incluye: ['Autocompletado ilimitado', 'Chat dentro del editor', 'Compatible con VS Code e IntelliJ', 'Clave enviada al correo']
    },
    {
        id: 'copilot-pro-plus',
        nombre: 'GitHub Copilot Pro+',
        modelo: 'GitHub Copilot',
        tipo: 'Clave de activación',
        duracion: '1 mes',
        precio: 145.00,
        precioAnterior: null,
        stock: 9,
        ventas: 80,
        icono: 'bi-terminal-fill',
        descripcion: 'Todo lo de Copilot Pro más acceso a todos los modelos disponibles y más solicitudes premium.',
        incluye: ['Todo lo de Copilot Pro', 'Acceso a todos los modelos', 'Más solicitudes premium', 'Clave enviada al correo']
    },
    {
        id: 'perplexity-pro',
        nombre: 'Perplexity Pro',
        modelo: 'Perplexity',
        tipo: 'Cuenta personal',
        duracion: '1 mes',
        precio: 49.00,
        precioAnterior: 75.00,
        stock: 14,
        ventas: 200,
        icono: 'bi-search',
        descripcion: 'Buscador con IA que responde con fuentes citadas; el plan Pro permite elegir entre varios modelos.',
        incluye: ['Búsquedas Pro ilimitadas', 'Elección de modelo de IA', 'Subida de archivos', 'Activación inmediata']
    }
];

// Busca un producto por su id dentro de la lista de arriba.
// Devuelve el objeto del producto, o undefined si no existe.
function buscarProducto(id) {
    return PRODUCTOS.find(function (producto) {
        return producto.id === id;
    });
}

// Convierte un número al formato de precio en soles, por ejemplo
// 59.9 -> "S/ 59.90" (toFixed(2) siempre deja 2 decimales)
function formatearPrecio(numero) {
    return 'S/ ' + numero.toFixed(2);
}

// Calcula el % de descuento de un producto en oferta, redondeado.
// Ejemplo: de 75 a 59.90 -> 20 (%). Si no tiene oferta devuelve 0.
function calcularDescuento(producto) {
    if (!producto.precioAnterior) {
        return 0;
    }
    return Math.round((1 - producto.precio / producto.precioAnterior) * 100);
}

// Devuelve la clase CSS del color de portada según el modelo de IA.
// Ejemplo: 'GitHub Copilot' -> 'portada-github-copilot' (todo en
// minúsculas y los espacios cambiados por guiones). Esas clases están
// definidas en styles.css.
function clasePortada(modelo) {
    return 'portada-' + modelo.toLowerCase().replace(/ /g, '-');
}
