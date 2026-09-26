var cuponAplicado = false;
function mostrarCarrito() {
    var carrito = leerCarrito();
    var vacio = carrito.length === 0;
    document.getElementById('carritoVacio').classList.toggle('d-none', !vacio);
    document.getElementById('carritoLleno').classList.toggle('d-none', vacio);
    if (vacio) {
        return;
    }
    document.getElementById('tablaCarrito').innerHTML = carrito.map(crearFilaCarrito).join('');

    calcularResumen();
}
function crearFilaCarrito(item) {
    var producto = buscarProducto(item.id);
    var subtotal = producto.precio * item.cantidad;
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
function cambiarCantidad(id, cambio) {
    var producto = buscarProducto(id);
    var carrito = leerCarrito();
    var item = carrito.find(function (elemento) { return elemento.id === id; });
    if (!item) {
        return;
    }

    var nuevaCantidad = item.cantidad + cambio;
    if (nuevaCantidad > producto.stock) {
        return;
    }
    if (nuevaCantidad <= 0) {
        eliminarDelCarrito(id);
        return;
    }

    item.cantidad = nuevaCantidad;
    guardarCarrito(carrito);
    mostrarCarrito();
}
function eliminarDelCarrito(id) {
    var carrito = leerCarrito().filter(function (elemento) {
        return elemento.id !== id;
    });
    guardarCarrito(carrito);
    mostrarCarrito();
}
function vaciarCarrito() {
    cuponAplicado = false;
    guardarCarrito([]);
    mostrarCarrito();
}
function calcularResumen() {
    var carrito = leerCarrito();
    var cantidadTotal = 0;
    var precioRegular = 0;
    var totalOfertas = 0;

    carrito.forEach(function (item) {
        var producto = buscarProducto(item.id);
        var regular = producto.precioAnterior ? producto.precioAnterior : producto.precio;
        cantidadTotal += item.cantidad;
        precioRegular += regular * item.cantidad;
        totalOfertas += producto.precio * item.cantidad;
    });
    var descuentoCupon = cuponAplicado ? totalOfertas * 0.10 : 0;
    var total = totalOfertas - descuentoCupon;

    document.getElementById('resumenCantidad').textContent = cantidadTotal;
    document.getElementById('resumenRegular').textContent = formatearPrecio(precioRegular);
    document.getElementById('resumenDescuento').textContent = '- ' + formatearPrecio(precioRegular - totalOfertas);
    document.getElementById('resumenCupon').textContent = '- ' + formatearPrecio(descuentoCupon);
    document.getElementById('filaCupon').classList.toggle('d-none', !cuponAplicado);
    document.getElementById('resumenTotal').textContent = formatearPrecio(total);
}
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
async function finalizarCompra() {
    var carrito = leerCarrito();
    var ids = [];
    carrito.forEach(function (item) {
        for (var cantidad = 0; cantidad < item.cantidad; cantidad++) {
            ids.push(item.id);
        }
    });

    if (ids.length === 0) {
        return;
    }

    try {
        var respuesta = await fetch('/api/v1/compras/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ suscripcionIds: ids })
        });
        if (!respuesta.ok) {
            throw new Error('No se pudo registrar la compra.');
        }

        var pedido = await respuesta.json();
        actualizarStockDespuesDeCompra(pedido.suscripciones);
        document.getElementById('numeroPedido').textContent = pedido.pedidoId;
        bootstrap.Modal.getOrCreateInstance(document.getElementById('modalCompra')).show();
        vaciarCarrito();
    } catch (error) {
        window.alert(error.message);
    }
}
function actualizarStockDespuesDeCompra(suscripcionesCompradas) {
    suscripcionesCompradas.forEach(function (suscripcionComprada) {
        var producto = buscarProducto(suscripcionComprada.id);
        if (producto) {
            producto.stock = Math.max(0, producto.stock - 1);
        }
    });
}
document.addEventListener('DOMContentLoaded', mostrarCarrito);
