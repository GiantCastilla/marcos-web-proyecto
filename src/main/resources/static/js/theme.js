// Controla el cambio entre modo claro y modo oscuro (atributo
// data-bs-theme del <html>, el que usa Bootstrap 5 de forma nativa).
// Este archivo se carga ANTES de los <link> de Bootstrap en el <head>
// de cada página, para que el tema guardado se aplique antes de que
// se pinte algo en pantalla y así evitar el parpadeo de un tema
// cambiando a otro.

// Lee el tema guardado en localStorage (si el usuario ya lo cambió
// antes) y lo aplica de una vez. Si todavía no hay nada guardado, se
// queda con "dark", que es el tema por defecto del proyecto.
(function aplicarTemaGuardado() {
    var temaGuardado = localStorage.getItem('tema');
    var tema = temaGuardado ? temaGuardado : 'dark';
    document.documentElement.setAttribute('data-bs-theme', tema);
})();

// Cambia entre modo claro y oscuro, actualiza el ícono del botón y
// guarda la elección en localStorage para que se recuerde la próxima
// vez que el usuario entre a la página
function alternarTema() {
    var temaActual = document.documentElement.getAttribute('data-bs-theme');
    var temaNuevo = temaActual === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-bs-theme', temaNuevo);
    localStorage.setItem('tema', temaNuevo);
    actualizarIconoTema(temaNuevo);
}

// Pone el ícono de sol cuando el tema actual es oscuro (invitando a
// pasar a claro) y el de luna cuando el tema actual es claro
function actualizarIconoTema(tema) {
    var icono = document.getElementById('themeToggleIcon');
    if (!icono) {
        return;
    }
    if (tema === 'dark') {
        icono.classList.remove('bi-moon-stars');
        icono.classList.add('bi-sun');
    } else {
        icono.classList.remove('bi-sun');
        icono.classList.add('bi-moon-stars');
    }
}

// Apenas el HTML del botón ya existe en la página, sincroniza su
// ícono con el tema que quedó aplicado por aplicarTemaGuardado()
document.addEventListener('DOMContentLoaded', function () {
    var temaActual = document.documentElement.getAttribute('data-bs-theme');
    actualizarIconoTema(temaActual);
});
