var CLAVE_CARRITO = 'carritoTiendaIA';
function leerCarrito() {
    try {
        var texto = localStorage.getItem(CLAVE_CARRITO);
        return texto ? JSON.parse(texto) : [];
    } catch (error) {
        return [];
    }
}
function guardarCarrito(carrito) {
    try {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    } catch (error) {
    }
    actualizarContadorCarrito();
}
function cantidadEnCarrito(id) {
    var item = leerCarrito().find(function (elemento) {
        return elemento.id === id;
    });
    return item ? item.cantidad : 0;
}
function agregarAlCarrito(id) {
    var producto = buscarProducto(id);
    var carrito = leerCarrito();
    var item = carrito.find(function (elemento) {
        return elemento.id === id;
    });
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
function mostrarAviso(mensaje, exito) {
    var toast = document.getElementById('avisoCarrito');
    if (!toast) {
        return;
    }
    document.getElementById('avisoCarritoTexto').textContent = mensaje;

    var icono = document.getElementById('avisoCarritoIcono');
    icono.className = exito ? 'bi bi-check-circle-fill text-success fs-5' : 'bi bi-exclamation-circle-fill text-danger fs-5';
    bootstrap.Toast.getOrCreateInstance(toast).show();
}
document.addEventListener('DOMContentLoaded', actualizarContadorCarrito);
