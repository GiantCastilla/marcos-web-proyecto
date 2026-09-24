// Funciones del carrito que se usan en TODAS las páginas (catálogo,
// carrito, sobre nosotros...). Necesita que productos.js se haya cargado
// antes, porque usa buscarProducto() para revisar el stock.
//
// El carrito se guarda en localStorage (memoria del navegador) para que
// no se pierda al cambiar de página. Se guarda como texto JSON con esta
// forma: [ { id: 'chatgpt-plus', cantidad: 2 }, { id: 'claude-pro', cantidad: 1 } ]
// Más adelante, con el backend, esto puede pasar a guardarse en la base de datos.

// Nombre de la "llave" con la que se guarda el carrito en localStorage
var CLAVE_CARRITO = 'carritoTiendaIA';

// Lee el carrito guardado. Si no hay nada (o el texto está dañado),
// devuelve una lista vacía para que la página no se rompa.
function leerCarrito() {
    try {
        var texto = localStorage.getItem(CLAVE_CARRITO);
        return texto ? JSON.parse(texto) : [];
    } catch (error) {
        return [];
    }
}

// Guarda la lista del carrito (convertida a texto JSON) y actualiza el
// numerito rojo del ícono del carrito en el navbar
function guardarCarrito(carrito) {
    try {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    } catch (error) {
        // Si el navegador bloquea localStorage, simplemente no se guarda
    }
    actualizarContadorCarrito();
}

// Dice cuántas unidades de un producto ya están en el carrito (0 si ninguna)
function cantidadEnCarrito(id) {
    var item = leerCarrito().find(function (elemento) {
        return elemento.id === id;
    });
    return item ? item.cantidad : 0;
}

// Agrega 1 unidad de un producto al carrito, sin pasarse del stock.
// Devuelve true si se pudo agregar y false si ya no hay más stock.
function agregarAlCarrito(id) {
    var producto = buscarProducto(id);
    var carrito = leerCarrito();
    var item = carrito.find(function (elemento) {
        return elemento.id === id;
    });

    // Cuántas tendría el carrito después de sumar esta
    var cantidadNueva = item ? item.cantidad + 1 : 1;
    if (!producto || cantidadNueva > producto.stock) {
        mostrarAviso('No hay más stock disponible de ' + (producto ? producto.nombre : 'este producto') + '.', false);
        return false;
    }

    if (item) {
        item.cantidad = cantidadNueva;
    } else {
        carrito.push({ id: id, cantidad: 1 });
    }
    guardarCarrito(carrito);
    mostrarAviso(producto.nombre + ' se añadió a tu carrito.', true);
    return true;
}

// Suma todas las cantidades del carrito y pone ese número en el badge
// rojo del navbar (id="contadorCarrito"). Si el carrito está vacío, el
// badge se oculta con la clase d-none de Bootstrap.
function actualizarContadorCarrito() {
    var badge = document.getElementById('contadorCarrito');
    if (!badge) {
        return;
    }
    var total = leerCarrito().reduce(function (suma, item) {
        return suma + item.cantidad;
    }, 0);
    badge.textContent = total;
    if (total > 0) {
        badge.classList.remove('d-none');
    } else {
        badge.classList.add('d-none');
    }
}

// Muestra el aviso flotante de abajo a la derecha. Usa el componente
// Toast REAL de Bootstrap (bootstrap.Toast), que está en el footer
// compartido (fragments/layout.html). "exito" decide el color del ícono.
function mostrarAviso(mensaje, exito) {
    var toast = document.getElementById('avisoCarrito');
    if (!toast) {
        return;
    }
    document.getElementById('avisoCarritoTexto').textContent = mensaje;

    var icono = document.getElementById('avisoCarritoIcono');
    icono.className = exito ? 'bi bi-check-circle-fill text-success fs-5' : 'bi bi-exclamation-circle-fill text-danger fs-5';

    // getOrCreateInstance crea el Toast la primera vez y lo reutiliza después
    bootstrap.Toast.getOrCreateInstance(toast).show();
}

// Apenas carga la página, pinta el número del carrito en el navbar
document.addEventListener('DOMContentLoaded', actualizarContadorCarrito);
