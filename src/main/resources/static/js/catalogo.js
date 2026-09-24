// Lógica de la página de Catálogo: dibuja las tarjetas, aplica los 2
// filtros (orden por precio/relevancia y modelo de IA), el buscador del
// navbar y el modal de "Ver detalles".
// Necesita que productos.js y carrito.js se hayan cargado antes.

// Texto que vino del buscador del navbar (/catalogo?q=texto).
// URLSearchParams lee los parámetros de la URL; si no hay "q" queda ''.
var textoBusqueda = new URLSearchParams(window.location.search).get('q') || '';

// ------------------------------------------------------------------
// FILTRO DE MODELO: crea los radio buttons a partir de los productos
// ------------------------------------------------------------------
function crearFiltroModelo() {
    // Cuenta cuántos planes tiene cada modelo, ej: { ChatGPT: 3, Claude: 3, ... }
    var conteo = {};
    PRODUCTOS.forEach(function (producto) {
        conteo[producto.modelo] = (conteo[producto.modelo] || 0) + 1;
    });

    // Primera opción: "Todos" (marcada por defecto con checked)
    var html = crearOpcionModelo('todos', 'Todos', PRODUCTOS.length, true);

    // Una opción por cada modelo encontrado
    Object.keys(conteo).forEach(function (modelo) {
        html += crearOpcionModelo(modelo, modelo, conteo[modelo], false);
    });

    document.getElementById('filtroModelo').innerHTML = html;
}

// Devuelve el HTML de UNA opción del filtro de modelo.
// form-check       -> contenedor de radio/checkbox de Bootstrap
// form-check-input -> el circulito del radio con estilo de Bootstrap
// form-check-label -> el texto al lado del circulito
// d-flex justify-content-between w-100 -> nombre a la izquierda y número a la derecha
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

// Devuelve el modelo elegido en los radio buttons ('todos' si no hay ninguno)
function modeloSeleccionado() {
    var marcado = document.querySelector('input[name="modelo"]:checked');
    return marcado ? marcado.value : 'todos';
}

// ------------------------------------------------------------------
// DIBUJAR LAS TARJETAS según los filtros actuales
// ------------------------------------------------------------------
function mostrarProductos() {
    var modelo = modeloSeleccionado();
    var orden = document.getElementById('filtroOrden').value;
    var busqueda = textoBusqueda.toLowerCase();

    // 1) Filtrar: nos quedamos solo con los productos que cumplen el modelo y la búsqueda
    var lista = PRODUCTOS.filter(function (producto) {
        var cumpleModelo = modelo === 'todos' || producto.modelo === modelo;
        var cumpleBusqueda = busqueda === '' ||
            producto.nombre.toLowerCase().includes(busqueda) ||
            producto.modelo.toLowerCase().includes(busqueda);
        return cumpleModelo && cumpleBusqueda;
    });

    // 2) Ordenar: sort() recibe una función que compara 2 productos (a y b)
    if (orden === 'precio-asc') {
        lista.sort(function (a, b) { return a.precio - b.precio; });   // más barato primero
    } else if (orden === 'precio-desc') {
        lista.sort(function (a, b) { return b.precio - a.precio; });   // más caro primero
    } else {
        lista.sort(function (a, b) { return b.ventas - a.ventas; });   // relevancia = más vendidos primero
    }

    // 3) Dibujar: juntamos el HTML de todas las tarjetas y lo metemos en la grilla
    document.getElementById('gridProductos').innerHTML = lista.map(crearTarjeta).join('');

    // Texto "X artículos" arriba de la grilla
    document.getElementById('contadorResultados').textContent = lista.length + (lista.length === 1 ? ' artículo' : ' artículos');

    // Si no quedó ningún producto, mostramos el mensaje de "sin resultados" (quitando d-none)
    document.getElementById('sinResultados').classList.toggle('d-none', lista.length > 0);

    mostrarBusquedaActiva();
}

// Devuelve el HTML de UNA tarjeta de producto
function crearTarjeta(producto) {
    var descuento = calcularDescuento(producto);

    // Etiqueta roja de descuento (solo si el producto está en oferta).
    // badge bg-danger -> etiqueta roja
    // position-absolute top-0 start-0 m-2 -> esquina superior izquierda de la portada
    var etiquetaDescuento = descuento > 0
        ? `<span class="badge bg-danger position-absolute top-0 start-0 m-2">-${descuento}%</span>`
        : '';

    // Precio anterior tachado (text-decoration-line-through). Si no hay oferta,
    // dejamos un espacio vacío (&nbsp;) para que todas las tarjetas queden alineadas
    var precioAnterior = producto.precioAnterior
        ? `<span class="small text-secondary text-decoration-line-through">${formatearPrecio(producto.precioAnterior)}</span>`
        : '<span class="small">&nbsp;</span>';

    // El botón de añadir se desactiva (disabled) si el producto está agotado
    var botonAgregar = producto.stock > 0
        ? `<button type="button" class="btn btn-primary btn-sm" onclick="agregarAlCarrito('${producto.id}')"><i class="bi bi-cart-plus me-1"></i>Añadir al carrito</button>`
        : `<button type="button" class="btn btn-secondary btn-sm" disabled><i class="bi bi-x-circle me-1"></i>Agotado</button>`;

    // card h-100            -> tarjeta de Bootstrap que ocupa todo el alto de su columna (todas iguales)
    // border-0 shadow-sm    -> sin borde y con sombra suave
    // tarjeta-producto      -> clase nuestra: efecto al pasar el mouse (styles.css)
    // portada + portada-xxx -> recuadro de color de la marca (styles.css)
    // card-body d-flex flex-column -> contenido en columna, para poder empujar precio y botones al fondo con mt-auto
    // d-grid gap-2          -> los 2 botones ocupan todo el ancho, uno debajo del otro
    return `
        <div class="col">
            <div class="card h-100 border-0 shadow-sm tarjeta-producto">
                <div class="portada ${clasePortada(producto.modelo)} position-relative d-flex flex-column align-items-center justify-content-center text-white">
                    ${etiquetaDescuento}
                    <span class="badge text-bg-light position-absolute top-0 end-0 m-2">GLOBAL</span>
                    <i class="bi ${producto.icono} display-5"></i>
                    <span class="fw-semibold small mt-1">${producto.modelo}</span>
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
                            <button type="button" class="btn btn-outline-primary btn-sm" onclick="verDetalles('${producto.id}')">
                                <i class="bi bi-eye me-1"></i>Ver detalles
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
}

// Texto del stock con un color según cuántas quedan:
// text-success (verde) = hay bastante, text-warning (ámbar) = quedan pocas, text-danger (rojo) = agotado
function crearTextoStock(stock) {
    if (stock === 0) {
        return '<p class="small fw-semibold text-danger mb-2"><i class="bi bi-x-circle me-1"></i>Agotado</p>';
    }
    if (stock <= 5) {
        return `<p class="small fw-semibold text-warning mb-2"><i class="bi bi-exclamation-triangle me-1"></i>¡Solo quedan ${stock}!</p>`;
    }
    return `<p class="small fw-semibold text-success mb-2"><i class="bi bi-box-seam me-1"></i>Stock: ${stock} disponibles</p>`;
}

// Si se buscó algo en el navbar, muestra "Resultados para: texto" con una X para quitar la búsqueda
function mostrarBusquedaActiva() {
    var contenedor = document.getElementById('busquedaActiva');
    if (textoBusqueda === '') {
        contenedor.innerHTML = '';
        return;
    }
    // badge text-bg-primary -> etiqueta azul; btn-close btn-close-white -> X blanca pequeña
    contenedor.innerHTML = `
        <span class="badge text-bg-primary d-inline-flex align-items-center gap-2 py-2 px-3">
            Resultados para: "${textoBusqueda}"
            <button type="button" class="btn-close btn-close-white" aria-label="Quitar búsqueda" onclick="quitarBusqueda()"></button>
        </span>`;
}

// Quita el texto de búsqueda y vuelve a dibujar todo
function quitarBusqueda() {
    textoBusqueda = '';
    // history.replaceState cambia la URL a /catalogo sin recargar la página
    history.replaceState(null, '', window.location.pathname);
    mostrarProductos();
}

// Botón "Limpiar": vuelve a "Relevancia", a "Todos" y quita la búsqueda
function limpiarFiltros() {
    document.getElementById('filtroOrden').value = 'relevancia';
    document.getElementById('modelo-todos').checked = true;
    quitarBusqueda();
}

// Botón "Ver oferta" del banner: marca ese modelo en el filtro y baja hasta los productos
function filtrarDesdeBanner(modelo) {
    var id = 'modelo-' + modelo.toLowerCase().replace(/ /g, '-');
    document.getElementById(id).checked = true;
    mostrarProductos();
    // scrollIntoView baja la página hasta la grilla con una animación suave
    document.getElementById('gridProductos').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ------------------------------------------------------------------
// MODAL "VER DETALLES"
// ------------------------------------------------------------------
function verDetalles(id) {
    var producto = buscarProducto(id);

    // Portada: se reemplazan las clases para poner el color de la marca
    document.getElementById('detallePortada').className =
        'col-md-5 portada-detalle d-flex flex-column align-items-center justify-content-center text-white p-4 ' + clasePortada(producto.modelo);
    document.getElementById('detalleIcono').className = 'bi display-1 ' + producto.icono;
    document.getElementById('detalleModelo').textContent = producto.modelo;

    // Textos principales
    document.getElementById('detalleNombre').textContent = producto.nombre;
    document.getElementById('detalleDescripcion').textContent = producto.descripcion;

    // Etiquetas: text-bg-light border -> etiqueta gris clara con borde
    document.getElementById('detalleEtiquetas').innerHTML = `
        <span class="badge text-bg-light border"><i class="bi bi-tag me-1"></i>${producto.tipo}</span>
        <span class="badge text-bg-light border"><i class="bi bi-calendar-event me-1"></i>${producto.duracion}</span>
        <span class="badge text-bg-light border"><i class="bi bi-globe me-1"></i>GLOBAL</span>`;

    // Lista de beneficios, cada uno con un check verde
    document.getElementById('detalleIncluye').innerHTML = producto.incluye.map(function (beneficio) {
        return `<li><i class="bi bi-check-circle-fill text-success me-2"></i>${beneficio}</li>`;
    }).join('');

    // Stock (reutiliza la misma función de las tarjetas)
    document.getElementById('detalleStock').innerHTML = crearTextoStock(producto.stock);

    // Precios
    document.getElementById('detallePrecio').textContent = formatearPrecio(producto.precio);
    document.getElementById('detallePrecioAnterior').textContent =
        producto.precioAnterior ? formatearPrecio(producto.precioAnterior) : '';

    // Botón de añadir: se desactiva si está agotado; si no, agrega y cierra el modal
    var boton = document.getElementById('detalleBotonAgregar');
    boton.disabled = producto.stock === 0;
    boton.onclick = function () {
        if (agregarAlCarrito(producto.id)) {
            bootstrap.Modal.getInstance(document.getElementById('modalDetalle')).hide();
        }
    };

    // Abre el modal con el JS de Bootstrap
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalDetalle')).show();
}

// ------------------------------------------------------------------
// Al cargar la página: crear el filtro de modelo y dibujar los productos
// ------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    crearFiltroModelo();
    mostrarProductos();
});
