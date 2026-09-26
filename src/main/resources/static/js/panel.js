document.addEventListener('DOMContentLoaded', cargarPanel);

async function cargarPanel() {
    var pagina = document.querySelector('main[data-suscripciones-url]');
    var endpoint = pagina.dataset.suscripcionesUrl;
    var tabla = document.getElementById('tablaSuscripciones');
    var vacio = document.getElementById('panelVacio');
    var error = document.getElementById('panelError');

    try {
        var respuesta = await fetch(endpoint, { credentials: 'same-origin' });
        if (!respuesta.ok) {
            if (respuesta.status === 401) {
                throw new Error('La sesión no está activa. Inicia sesión para consultar tus compras.');
            }
            throw new Error('No se pudo cargar el panel. Código: ' + respuesta.status);
        }
        var suscripciones = await respuesta.json();
        document.getElementById('totalSuscripciones').textContent = suscripciones.length;
        document.getElementById('totalActivas').textContent = suscripciones.filter(function (item) {
            return item.estado === 'ACTIVA' || item.estado === 'POR_VENCER';
        }).length;

        if (suscripciones.length === 0) {
            vacio.classList.remove('d-none');
            return;
        }

        vacio.classList.add('d-none');
        tabla.innerHTML = suscripciones.map(crearFilaSuscripcion).join('');
    } catch (exception) {
        error.textContent = exception.message;
        error.classList.remove('d-none');
    }
}

function crearFilaSuscripcion(suscripcion) {
    var claseEstado = suscripcion.estado === 'ACTIVA' ? 'success'
        : suscripcion.estado === 'POR_VENCER' ? 'warning' : 'danger';
    var dias = suscripcion.diasRestantes < 0
        ? 'Vencida hace ' + Math.abs(suscripcion.diasRestantes) + ' dias'
        : suscripcion.diasRestantes + ' dias restantes';

    return '<tr>'
        + '<td class="fw-semibold">' + suscripcion.nombre + '</td>'
        + '<td>' + suscripcion.fechaInicio + '</td>'
        + '<td>' + suscripcion.fechaVencimiento + '</td>'
        + '<td>' + dias + '</td>'
        + '<td><span class="badge text-bg-' + claseEstado + '">' + suscripcion.estado + '</span></td>'
        + '</tr>';
}
