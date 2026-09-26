var textoBusqueda = new URLSearchParams(window.location.search).get('q') || '';
function crearFiltroModelo() {
    var conteo = {};
    PRODUCTOS.forEach(function (producto) {
        conteo[producto.modelo] = (conteo[producto.modelo] || 0) + 1;
    });
    var html = crearOpcionModelo('todos', 'Todos', PRODUCTOS.length, true);
    Object.keys(conteo).forEach(function (modelo) {
        html += crearOpcionModelo(modelo, modelo, conteo[modelo], false);
    });

    document.getElementById('filtroModelo').innerHTML = html;
}
function crearOpcionModelo(valor, texto, cantidad, marcado) {
    var id = 'modelo-' + valor.toLowerCase().replace(/ /g, '-');
    return `
        <div class="form-check">
            <input class="form-check-input" type="radio" name="modelo" id="${id}" value="${valor}" ${marcado ? 'checked' : ''} onchange="mostrarProductos()">
            <label class="form-check-label d-flex justify-content-between w-100" for="${id}">
                <span>${texto}</span>
                <span class="badge rounded-pill text-bg-light border">${cantidad}</span>
            </label>
        </div>`;
}
function modeloSeleccionado() {
    var marcado = document.querySelector('input[name="modelo"]:checked');
    return marcado ? marcado.value : 'todos';
}
function mostrarProductos() {
    var modelo = modeloSeleccionado();
    var orden = document.getElementById('filtroOrden').value;
    var busqueda = textoBusqueda.toLowerCase();
    var lista = PRODUCTOS.filter(function (producto) {
        var cumpleModelo = modelo === 'todos' || producto.modelo === modelo;
        var cumpleBusqueda = busqueda === '' ||
            producto.nombre.toLowerCase().includes(busqueda) ||
            producto.modelo.toLowerCase().includes(busqueda);
        return cumpleModelo && cumpleBusqueda;
    });
    if (orden === 'precio-asc') {
        lista.sort(function (a, b) { return a.precio - b.precio; });
    } else if (orden === 'precio-desc') {
        lista.sort(function (a, b) { return b.precio - a.precio; });
    } else {
        lista.sort(function (a, b) { return b.ventas - a.ventas; });
    }
    document.getElementById('gridProductos').innerHTML = lista.map(crearTarjeta).join('');
    document.getElementById('contadorResultados').textContent = lista.length + (lista.length === 1 ? ' artículo' : ' artículos');
    document.getElementById('sinResultados').classList.toggle('d-none', lista.length > 0);

    mostrarBusquedaActiva();
}
function crearTarjeta(producto) {
    var descuento = calcularDescuento(producto);
    var etiquetaDescuento = descuento > 0
        ? `<span class="badge bg-danger position-absolute top-0 start-0 m-2">-${descuento}%</span>`
        : '';
    var precioAnterior = producto.precioAnterior
        ? `<span class="small text-secondary text-decoration-line-through">${formatearPrecio(producto.precioAnterior)}</span>`
        : '<span class="small">&nbsp;</span>';
    var botonAgregar = producto.stock > 0
        ? `<button type="button" class="btn btn-primary btn-sm" onclick="agregarAlCarrito('${producto.id}')"><i class="bi bi-cart-plus me-1"></i>Añadir al carrito</button>`
        : `<button type="button" class="btn btn-secondary btn-sm" disabled><i class="bi bi-x-circle me-1"></i>Agotado</button>`;
    return `
        <div class="col">
            <div class="card h-100 border-0 shadow-sm tarjeta-producto">
                <div class="portada position-relative d-flex flex-column align-items-center justify-content-center text-white">
                    ${etiquetaDescuento}
                    <img class="w-100 h-100 object-fit-cover" src="${producto.imagenUrl}" alt="${producto.nombre}">
                </div>
                <div class="card-body d-flex flex-column">
                    <h3 class="card-title h6 fw-bold mb-1">${producto.nombre}</h3>
                    <p class="small text-secondary mb-2">${producto.tipo} · ${producto.duracion}</p>
                    ${crearTextoStock(producto.stock)}
                    <div class="mt-auto">
                        ${precioAnterior}
                        <div class="fs-5 fw-bold text-primary mb-2">${formatearPrecio(producto.precio)}</div>
                        <div class="d-grid gap-2">
                            ${botonAgregar}
                            <a href="/catalogo/detalles/${encodeURIComponent(producto.id)}" onclick="window.location.assign(this.href); return false;" class="btn btn-outline-primary btn-sm">
                                <i class="bi bi-arrow-up-right me-1"></i>Ver detalle
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
}
function crearTextoStock(stock) {
    if (stock === 0) {
        return '<p class="small fw-semibold text-danger mb-2"><i class="bi bi-x-circle me-1"></i>Agotado</p>';
    }
    if (stock <= 5) {
        return `<p class="small fw-semibold text-warning mb-2"><i class="bi bi-exclamation-triangle me-1"></i>¡Solo quedan ${stock}!</p>`;
    }
    return `<p class="small fw-semibold text-success mb-2"><i class="bi bi-box-seam me-1"></i>Stock: ${stock} disponibles</p>`;
}
function mostrarBusquedaActiva() {
    var contenedor = document.getElementById('busquedaActiva');
    if (textoBusqueda === '') {
        contenedor.innerHTML = '';
        return;
    }
    contenedor.innerHTML = `
        <span class="badge text-bg-primary d-inline-flex align-items-center gap-2 py-2 px-3">
            Resultados para: "${textoBusqueda}"
            <button type="button" class="btn-close btn-close-white" aria-label="Quitar búsqueda" onclick="quitarBusqueda()"></button>
        </span>`;
}
function quitarBusqueda() {
    textoBusqueda = '';
    history.replaceState(null, '', window.location.pathname);
    mostrarProductos();
}
function limpiarFiltros() {
    document.getElementById('filtroOrden').value = 'relevancia';
    document.getElementById('modelo-todos').checked = true;
    quitarBusqueda();
}
function filtrarDesdeBanner(modelo) {
    var id = 'modelo-' + modelo.toLowerCase().replace(/ /g, '-');
    document.getElementById(id).checked = true;
    mostrarProductos();
    document.getElementById('gridProductos').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
document.addEventListener('DOMContentLoaded', cargarProductosDesdeApi);

async function cargarProductosDesdeApi() {
    var pagina = document.querySelector('main[data-suscripciones-url]');
    var endpoint = pagina.dataset.suscripcionesUrl;
    try {
        var respuesta = await fetch(endpoint, { credentials: 'same-origin' });
        if (!respuesta.ok) {
            throw new Error('No se pudieron cargar las suscripciones del servidor.');
        }
        var suscripciones = await respuesta.json();
        PRODUCTOS = PRODUCTOS.map(function (productoLocal) {
            var suscripcion = suscripciones.find(function (item) {
                return item.id === productoLocal.id;
            });
            if (!suscripcion || !suscripcion.imagenUrl) {
                throw new Error('La suscripción ' + productoLocal.id + ' no tiene imagen definida en Java.');
            }
            return Object.assign({}, productoLocal, suscripcion, {
                precio: Number(suscripcion.precio),
                stock: suscripcion.stock,
                imagenUrl: suscripcion.imagenUrl
            });
        });
        document.querySelectorAll('[data-banner-id]').forEach(function (banner) {
            var suscripcion = suscripciones.find(function (item) {
                return item.id === banner.dataset.bannerId;
            });
            var imagen = banner.querySelector('[data-banner-image]');
            if (suscripcion && imagen) {
                imagen.src = suscripcion.imagenUrl;
                imagen.alt = suscripcion.nombre;
            }
        });
        actualizarBanners();
    } catch (error) {
        document.getElementById('errorCatalogo').textContent = error.message;
        document.getElementById('errorCatalogo').classList.remove('d-none');
        return;
    }
    crearFiltroModelo();
    mostrarProductos();
}

function actualizarBanners() {
    var disponibles = PRODUCTOS.filter(function (producto) {
        return producto.stock > 0 && producto.precioAnterior;
    }).sort(function (a, b) {
        return calcularDescuento(b) - calcularDescuento(a);
    });
    var restantes = PRODUCTOS.filter(function (producto) {
        return producto.stock > 0 && !disponibles.some(function (oferta) {
            return oferta.id === producto.id;
        });
    }).sort(function (a, b) { return b.ventas - a.ventas; });
    disponibles = disponibles.concat(restantes).slice(0, 3);

    document.querySelectorAll('[data-banner-id]').forEach(function (banner, indice) {
        var producto = disponibles[indice];
        if (!producto) {
            banner.classList.add('d-none');
            return;
        }
        banner.classList.remove('d-none');
        banner.dataset.bannerId = producto.id;
        banner.href = '/catalogo/detalles/' + encodeURIComponent(producto.id);
        banner.querySelector('h2').textContent = producto.nombre
            + (producto.precioAnterior ? ' con ' + calcularDescuento(producto) + '% de descuento' : '');
        banner.querySelector('p').textContent = producto.descripcion;
        var imagen = banner.querySelector('[data-banner-image]');
        imagen.src = producto.imagenUrl;
        imagen.alt = producto.nombre;
    });
}
