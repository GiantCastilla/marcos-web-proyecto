document.addEventListener('DOMContentLoaded', cargarDetalle);

async function cargarDetalle() {
    var id = window.location.pathname.split('/').pop();
    var respuesta = await fetch('/api/v1/suscripciones/' + encodeURIComponent(id));
    if (!respuesta.ok) {
        document.getElementById('detalleContenido').innerHTML = '<div class="alert alert-danger">Suscripcion no encontrada.</div>';
        return;
    }
    var suscripcion = await respuesta.json();
    document.getElementById('detalleImagen').src = suscripcion.imagenUrl;
    document.getElementById('detalleImagen').alt = suscripcion.nombre;
    document.getElementById('detalleNombre').textContent = suscripcion.nombre;
    document.getElementById('detalleDescripcion').textContent = suscripcion.descripcion;
    document.getElementById('detalleCategoria').textContent = suscripcion.categoria;
    document.getElementById('detalleTipo').textContent = suscripcion.tipo;
    document.getElementById('detalleDuracion').textContent = suscripcion.duracion;
    document.getElementById('detallePrecio').textContent = 'S/ ' + Number(suscripcion.precio).toFixed(2);
    document.getElementById('detalleStock').textContent = 'Stock disponible: ' + suscripcion.stock;
    document.getElementById('detalleComprar').onclick = function () {
        if (suscripcion.stock > 0) {
            agregarAlCarrito(suscripcion.id);
            window.location.href = '/carrito';
        }
    };
    document.getElementById('detalleContenido').classList.remove('d-none');
}
