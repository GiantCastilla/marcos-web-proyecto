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
var IMAGENES_PRODUCTOS = {
    'chatgpt-plus': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&auto=format&fit=crop',
    'chatgpt-team': 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=900&auto=format&fit=crop',
    'chatgpt-pro': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=900&auto=format&fit=crop',
    'claude-pro': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop',
    'claude-max-5x': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&auto=format&fit=crop',
    'claude-team': 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=900&auto=format&fit=crop',
    'gemini-pro': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&auto=format&fit=crop',
    'gemini-ultra': 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=900&auto=format&fit=crop',
    'midjourney-basic': 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=900&auto=format&fit=crop',
    'midjourney-standard': 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=900&auto=format&fit=crop',
    'midjourney-pro': 'https://images.unsplash.com/photo-1633412802994-5c058f151b66?w=900&auto=format&fit=crop',
    'copilot-pro': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop',
    'copilot-pro-plus': 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?w=900&auto=format&fit=crop',
    'perplexity-pro': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=900&auto=format&fit=crop'
};
PRODUCTOS.forEach(function (producto) {
    producto.imagenUrl = IMAGENES_PRODUCTOS[producto.id];
});
function buscarProducto(id) {
    return PRODUCTOS.find(function (producto) {
        return producto.id === id;
    });
}
function formatearPrecio(numero) {
    return 'S/ ' + numero.toFixed(2);
}
function calcularDescuento(producto) {
    if (!producto.precioAnterior) {
        return 0;
    }
    return Math.round((1 - producto.precio / producto.precioAnterior) * 100);
}
function clasePortada(modelo) {
    return 'portada-' + modelo.toLowerCase().replace(/ /g, '-');
}
