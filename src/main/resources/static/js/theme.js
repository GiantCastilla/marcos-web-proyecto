(function aplicarTemaGuardado() {
    var temaGuardado = localStorage.getItem('tema');
    var tema = temaGuardado ? temaGuardado : 'dark';
    document.documentElement.setAttribute('data-bs-theme', tema);
})();
function alternarTema() {
    var temaActual = document.documentElement.getAttribute('data-bs-theme');
    var temaNuevo = temaActual === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-bs-theme', temaNuevo);
    localStorage.setItem('tema', temaNuevo);
    actualizarIconoTema(temaNuevo);
}
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
document.addEventListener('DOMContentLoaded', function () {
    var temaActual = document.documentElement.getAttribute('data-bs-theme');
    actualizarIconoTema(temaActual);
});
