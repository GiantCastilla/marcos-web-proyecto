// Lógica SOLO de la página del Carrito: dibuja la tabla, cambia
// cantidades, elimina productos, calcula el resumen y aplica el cupón.
// Necesita productos.js y carrito.js cargados antes.

// Guarda si el usuario ya aplicó el cupón UTP10 (true/false)
var cuponAplicado = false;

// ------------------------------------------------------------------
// DIBUJAR EL CARRITO
// ------------------------------------------------------------------
function mostrarCarrito() {
    var carrito = leerCarrito();

    // Si está vacío, mostramos el bloque "carrito vacío" y ocultamos el otro
    var vacio = carrito.length === 0;
    document.getElementById('carritoVacio').classList.toggle('d-none', !vacio);
    document.getElementById('carritoLleno').classList.toggle('d-none', vacio);
    if (vacio) {
        return;
    }

    // Una fila <tr> por cada producto del carrito
    document.getElementById('tablaCarrito').innerHTML = carrito.map(crearFilaCarrito).join('');

    calcularResumen();
}

// Devuelve el HTML de UNA fila de la tabla del carrito
function crearFilaCarrito(item) {
    var producto = buscarProducto(item.id);
    var subtotal = producto.precio * item.cantidad;

    // portada-mini -> cuadradito de color de la marca (styles.css)
    // input-group input-group-sm -> los botones - y + pegados al número, en tamaño pequeño
    // grupo-cantidad -> ancho fijo del grupo (styles.css)
    // disabled en "+" -> no deja pasar del stock disponible
    return `
        <tr>
            <td class="ps-4 py-3">
                <div class="d-flex align-items-center gap-3">
                    <div class="portada-mini ${clasePortada(producto.modelo)} d-flex align-items-center justify-content-center text-white rounded-3">
                        <i class="bi ${producto.icono} fs-5"></i>
                    </div>
                    <div>
                        <div class="fw-semibold">${producto.nombre}</div>
                        <div class="small text-secondary">${producto.tipo} · ${producto.duracion}</div>
                        <div class="small text-secondary">Stock disponible: ${producto.stock}</div>
                    </div>
                </div>
            </td>
            <td class="text-nowrap">${formatearPrecio(producto.precio)}</td>
            <td>
                <div class="input-group input-group-sm grupo-cantidad mx-auto">
                    <button class="btn btn-outline-secondary" type="button" onclick="cambiarCantidad('${producto.id}', -1)" aria-label="Quitar uno">
                        <i class="bi bi-dash"></i>
                    </button>
                    <input type="text" class="form-control text-center" value="${item.cantidad}" readonly aria-label="Cantidad">
                    <button class="btn btn-outline-secondary" type="button" onclick="cambiarCantidad('${producto.id}', 1)" ${item.cantidad >= producto.stock ? 'disabled' : ''} aria-label="Agregar uno">
                        <i class="bi bi-plus"></i>
                    </button>
                </div>
            </td>
            <td class="fw-semibold text-nowrap">${formatearPrecio(subtotal)}</td>
            <td class="pe-4 text-end">
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="eliminarDelCarrito('${producto.id}')" aria-label="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>`;
}

// ------------------------------------------------------------------
// ACCIONES SOBRE EL CARRITO
// ------------------------------------------------------------------

// Suma (+1) o resta (-1) una unidad. Si llega a 0, se elimina el producto.
function cambiarCantidad(id, cambio) {
    var producto = buscarProducto(id);
    var carrito = leerCarrito();
    var item = carrito.find(function (elemento) { return elemento.id === id; });
    if (!item) {
        return;
    }

    var nuevaCantidad = item.cantidad + cambio;
    if (nuevaCantidad > producto.stock) {
        return;   // no deja pasar del stock
    }
    if (nuevaCantidad <= 0) {
        eliminarDelCarrito(id);
        return;
    }

    item.cantidad = nuevaCantidad;
    guardarCarrito(carrito);
    mostrarCarrito();
}

// Quita un producto completo del carrito (filter se queda con todos menos ese)
function eliminarDelCarrito(id) {
    var carrito = leerCarrito().filter(function (elemento) {
        return elemento.id !== id;
    });
    guardarCarrito(carrito);
    mostrarCarrito();
}

// Vacía todo el carrito
function vaciarCarrito() {
    cuponAplicado = false;
    guardarCarrito([]);
    mostrarCarrito();
}

// ------------------------------------------------------------------
// RESUMEN DEL PEDIDO
// ------------------------------------------------------------------
function calcularResumen() {
    var carrito = leerCarrito();
    var cantidadTotal = 0;
    var precioRegular = 0;   // lo que costaría sin ofertas
    var totalOfertas = 0;    // lo que cuesta con los precios de oferta

    carrito.forEach(function (item) {
        var producto = buscarProducto(item.id);
        // Si no tiene precio anterior, su precio regular es el mismo precio actual
        var regular = producto.precioAnterior ? producto.precioAnterior : producto.precio;
        cantidadTotal += item.cantidad;
        precioRegular += regular * item.cantidad;
        totalOfertas += producto.precio * item.cantidad;
    });

    // El cupón UTP10 descuenta 10% sobre el total que ya tiene las ofertas
    var descuentoCupon = cuponAplicado ? totalOfertas * 0.10 : 0;
    var total = totalOfertas - descuentoCupon;

    document.getElementById('resumenCantidad').textContent = cantidadTotal;
    document.getElementById('resumenRegular').textContent = formatearPrecio(precioRegular);
    document.getElementById('resumenDescuento').textContent = '- ' + formatearPrecio(precioRegular - totalOfertas);
    document.getElementById('resumenCupon').textContent = '- ' + formatearPrecio(descuentoCupon);
    document.getElementById('filaCupon').classList.toggle('d-none', !cuponAplicado);
    document.getElementById('resumenTotal').textContent = formatearPrecio(total);
}

// Revisa el cupón escrito. trim() quita espacios y toUpperCase() lo pasa a mayúsculas,
// así "utp10 " también funciona.
function aplicarCupon() {
    var codigo = document.getElementById('inputCupon').value.trim().toUpperCase();
    var mensaje = document.getElementById('mensajeCupon');

    if (codigo === 'UTP10') {
        cuponAplicado = true;
        mensaje.className = 'small mb-3 text-success';
        mensaje.textContent = 'Cupón aplicado: 10% de descuento.';
    } else {
        cuponAplicado = false;
        mensaje.className = 'small mb-3 text-danger';
        mensaje.textContent = 'Ese cupón no es válido.';
    }
    calcularResumen();
}

// ------------------------------------------------------------------
// FINALIZAR COMPRA (simulado: todavía no hay pasarela de pago)
// ------------------------------------------------------------------
function finalizarCompra() {
    // Número de pedido inventado con la fecha actual en milisegundos (últimos 6 dígitos)
    document.getElementById('numeroPedido').textContent = '#TL-' + String(Date.now()).slice(-6);

    // Mostramos el modal de "Compra realizada" y vaciamos el carrito
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalCompra')).show();
    vaciarCarrito();
}

// Al cargar la página, dibujamos el carrito
document.addEventListener('DOMContentLoaded', mostrarCarrito);
