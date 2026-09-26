package com.utp.tienda_licencias_ai.controller;

import com.utp.tienda_licencias_ai.model.SolicitudCompra;
import com.utp.tienda_licencias_ai.model.LoginRequest;
import com.utp.tienda_licencias_ai.model.Suscripcion;
import com.utp.tienda_licencias_ai.model.SuscripcionActiva;
import com.utp.tienda_licencias_ai.model.Usuario;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import jakarta.servlet.http.HttpSession;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/v1")
public class TiendaRestController {

    private final List<Suscripcion> suscripciones = List.of(
            new Suscripcion("chatgpt-plus", "ChatGPT Plus", "ChatGPT", "Cuenta personal", "1 mes", new BigDecimal("59.90"), "Accede a modelos avanzados para redactar, estudiar, programar y resolver tareas complejas. Incluye generación de imágenes, análisis de archivos, navegación web y prioridad cuando hay mucha demanda.", "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&auto=format&fit=crop"),
            new Suscripcion("chatgpt-team", "ChatGPT Team", "ChatGPT", "Invitación a espacio de equipo", "1 mes", new BigDecimal("105.00"), "Un espacio de trabajo compartido para equipos que necesitan colaborar con inteligencia artificial. Incluye administración centralizada, proyectos compartidos, límites superiores y protección de los datos del equipo.", "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=900&auto=format&fit=crop"),
            new Suscripcion("chatgpt-pro", "ChatGPT Pro", "ChatGPT", "Cuenta personal", "1 mes", new BigDecimal("699.00"), "La opción para quienes utilizan IA de forma intensiva en investigación, programación y análisis. Ofrece mayor capacidad de uso, razonamiento extendido, acceso anticipado a funciones nuevas y soporte prioritario.", "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=900&auto=format&fit=crop"),
            new Suscripcion("claude-pro", "Claude Pro", "Claude", "Cuenta personal", "1 mes", new BigDecimal("62.00"), "Un asistente especializado en redacción, análisis y programación. Permite trabajar con documentos largos, organizar proyectos propios y obtener respuestas más amplias que en el plan gratuito.", "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop"),
            new Suscripcion("claude-max-5x", "Claude Max 5x", "Claude", "Cuenta personal", "1 mes", new BigDecimal("369.00"), "Pensado para personas que trabajan con IA durante todo el día. Incluye cinco veces el uso de Claude Pro, prioridad en horas punta, acceso preferente a nuevas funciones y soporte prioritario.", "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&auto=format&fit=crop"),
            new Suscripcion("claude-team", "Claude Team", "Claude", "Espacio de equipo", "1 mes", new BigDecimal("112.00"), "Una solución colaborativa para equipos que necesitan analizar información y crear contenido juntos. Incluye proyectos compartidos, gestión de usuarios, administración centralizada y mayor capacidad que el plan individual.", "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=900&auto=format&fit=crop"),
            new Suscripcion("gemini-pro", "Gemini Pro", "Gemini", "Cuenta personal", "1 mes", new BigDecimal("55.00"), "Disfruta los modelos avanzados de Google para escribir, investigar y resolver problemas. Se integra con Gmail y Docs e incluye 2 TB de almacenamiento para centralizar tus archivos y proyectos.", "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&auto=format&fit=crop"),
            new Suscripcion("gemini-ultra", "Gemini Ultra", "Gemini", "Cuenta personal", "1 mes", new BigDecimal("899.00"), "El plan más completo de Google para tareas exigentes. Ofrece los límites más altos, generación de video, acceso anticipado a modelos experimentales y 30 TB de almacenamiento para proyectos profesionales.", "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=900&auto=format&fit=crop"),
            new Suscripcion("midjourney-basic", "Midjourney Basic", "Midjourney", "Cuenta personal", "1 mes", new BigDecimal("35.00"), "Una forma sencilla de empezar a crear imágenes con inteligencia artificial a partir de descripciones de texto. Es ideal para explorar estilos, conceptos visuales y proyectos personales con una clave de activación.", "https://images.unsplash.com/photo-1549490349-8643362247b5?w=900&auto=format&fit=crop"),
            new Suscripcion("midjourney-standard", "Midjourney Standard", "Midjourney", "Cuenta personal", "1 mes", new BigDecimal("99.00"), "El plan más popular para crear imágenes con mayor frecuencia. Incluye 15 horas de generación rápida, modo relajado ilimitado, uso comercial y una clave de activación enviada al correo.", "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=900&auto=format&fit=crop"),
            new Suscripcion("midjourney-pro", "Midjourney Pro", "Midjourney", "Cuenta personal", "1 mes", new BigDecimal("219.00"), "Diseñado para diseñadores y agencias que necesitan producir muchas imágenes. Incluye más horas rápidas, modo sigiloso para mantener los trabajos privados y hasta 12 tareas en paralelo.", "https://images.unsplash.com/photo-1633412802994-5c058f151b66?w=900&auto=format&fit=crop"),
            new Suscripcion("copilot-pro", "Copilot Pro", "Copilot", "Cuenta personal", "1 mes", new BigDecimal("36.00"), "Acelera tu trabajo de programación con autocompletado inteligente y chat dentro de VS Code, IntelliJ y otros editores. Incluye uso amplio para escribir, explicar, refactorizar y depurar código.", "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop"),
            new Suscripcion("copilot-pro-plus", "Copilot Pro Plus", "Copilot", "Cuenta personal", "1 mes", new BigDecimal("145.00"), "La experiencia más completa de Copilot para profesionales. Incluye todo lo del plan Pro, acceso a todos los modelos disponibles y una cuota superior de solicitudes premium para tareas complejas.", "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?w=900&auto=format&fit=crop"),
            new Suscripcion("perplexity-pro", "Perplexity Pro", "Perplexity", "Cuenta personal", "1 mes", new BigDecimal("49.00"), "Investiga cualquier tema con respuestas generadas por IA y fuentes citadas. El plan Pro permite realizar búsquedas más profundas, elegir entre varios modelos, subir archivos y obtener información actualizada.", "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=900&auto=format&fit=crop")
    );

    private final Map<Long, List<SuscripcionActiva>> suscripcionesPorUsuario = new ConcurrentHashMap<>();

    @GetMapping("/suscripciones")
    public ResponseEntity<List<Suscripcion>> listarSuscripciones(
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String busqueda) {
        String categoriaNormalizada = normalizar(categoria);
        String busquedaNormalizada = normalizar(busqueda);

        List<Suscripcion> resultado = suscripciones.stream()
                .filter(suscripcion -> categoriaNormalizada.isBlank()
                        || normalizar(suscripcion.getCategoria()).equals(categoriaNormalizada))
                .filter(suscripcion -> busquedaNormalizada.isBlank()
                        || normalizar(suscripcion.getNombre()).contains(busquedaNormalizada)
                        || normalizar(suscripcion.getDescripcion()).contains(busquedaNormalizada))
                .toList();

        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/suscripciones/{id}")
    public ResponseEntity<?> obtenerSuscripcion(@PathVariable String id) {
        return suscripciones.stream()
                .filter(suscripcion -> suscripcion.getId().equalsIgnoreCase(id))
                .findFirst()
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpSession session) {
        String identidad = request == null ? "" : primerValor(request.getEmail(), request.getUsuario());
        String password = request == null || request.getPassword() == null ? "" : request.getPassword();
        boolean credencialesValidas = ("admin@tienda.com".equalsIgnoreCase(identidad) || "admin".equalsIgnoreCase(identidad))
                && (password.isBlank() || "admin123".equals(password));
        if (!credencialesValidas) {
            return ResponseEntity.status(401).body(Map.of("error", "Credenciales invalidas."));
        }

        Usuario usuario = new Usuario(1L, "Administrador", identidad);
        session.setAttribute("usuarioId", usuario.getId());
        return ResponseEntity.ok(Map.of("mensaje", "Login exitoso", "usuario", usuario));
    }

    @PostMapping("/compras/checkout")
    public ResponseEntity<?> checkout(@RequestBody SolicitudCompra request, HttpSession session) {
        Object usuarioEnSesion = session.getAttribute("usuarioId");
        if (!(usuarioEnSesion instanceof Long usuarioId)) {
            return ResponseEntity.status(401).body(Map.of("error", "Debe iniciar sesion antes de comprar."));
        }
        if (request == null
                || request.getSuscripcionIds() == null || request.getSuscripcionIds().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "suscripcionIds es obligatorio."));
        }

        List<Suscripcion> compradas = new ArrayList<>();
        Map<String, Long> cantidades = request.getSuscripcionIds().stream()
                .collect(java.util.stream.Collectors.groupingBy(String::toLowerCase, java.util.stream.Collectors.counting()));
        for (String id : request.getSuscripcionIds()) {
            Suscripcion suscripcion = buscarPorId(id);
            if (suscripcion == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Suscripcion no encontrada: " + id));
            }
            if (cantidades.get(id.toLowerCase()) > suscripcion.getStock()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Stock insuficiente para: " + id));
            }
            compradas.add(suscripcion);
        }

        cantidades.forEach((id, cantidad) -> buscarPorId(id).reducirStock(cantidad.intValue()));

        LocalDate inicio = LocalDate.now();
        LocalDate vencimiento = inicio.plusMonths(1);
        List<SuscripcionActiva> activas = compradas.stream()
                .map(suscripcion -> crearSuscripcionActiva(suscripcion, inicio, vencimiento))
                .toList();
        suscripcionesPorUsuario.computeIfAbsent(usuarioId, ignored -> new ArrayList<>()).addAll(activas);
        session.setAttribute("suscripcionesCompradas", new ArrayList<>(suscripcionesPorUsuario.get(usuarioId)));

        BigDecimal total = compradas.stream().map(Suscripcion::getPrecio).reduce(BigDecimal.ZERO, BigDecimal::add);
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("pedidoId", UUID.randomUUID().toString());
        respuesta.put("usuarioId", usuarioId);
        respuesta.put("suscripciones", compradas);
        respuesta.put("total", total);
        respuesta.put("estado", "CONFIRMADA");
        respuesta.put("fechaCompra", inicio);
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/usuarios/suscripciones")
    public ResponseEntity<?> suscripcionesDelUsuario(HttpSession session) {
        Object usuarioId = session.getAttribute("usuarioId");
        if (!(usuarioId instanceof Long id)) {
            return ResponseEntity.status(401).body(Map.of("error", "Debe iniciar sesion."));
        }
        Object comprasEnSesion = session.getAttribute("suscripcionesCompradas");
        List<SuscripcionActiva> activasGuardadas = comprasEnSesion instanceof List<?> lista
            ? lista.stream().filter(SuscripcionActiva.class::isInstance).map(SuscripcionActiva.class::cast).toList()
            : suscripcionesPorUsuario.getOrDefault(id, Collections.emptyList());
        List<SuscripcionActiva> activas = activasGuardadas.stream()
                .map(this::actualizarEstado)
                .toList();
        return ResponseEntity.ok(activas);
    }

    private SuscripcionActiva crearSuscripcionActiva(Suscripcion suscripcion, LocalDate inicio, LocalDate vencimiento) {
        return new SuscripcionActiva(suscripcion.getId(), suscripcion.getNombre(), inicio, vencimiento,
                ChronoUnit.DAYS.between(inicio, vencimiento), "ACTIVA");
    }

    private SuscripcionActiva actualizarEstado(SuscripcionActiva suscripcion) {
        long diasRestantes = ChronoUnit.DAYS.between(LocalDate.now(), suscripcion.getFechaVencimiento());
        String estado = diasRestantes < 0 ? "EXPIRADA" : diasRestantes <= 7 ? "POR_VENCER" : "ACTIVA";
        return new SuscripcionActiva(suscripcion.getSuscripcionId(), suscripcion.getNombre(), suscripcion.getFechaInicio(),
                suscripcion.getFechaVencimiento(), diasRestantes, estado);
    }

    private Suscripcion buscarPorId(String id) {
        if (id == null) {
            return null;
        }
        return suscripciones.stream().filter(suscripcion -> suscripcion.getId().equalsIgnoreCase(id)).findFirst().orElse(null);
    }

    private String primerValor(String primero, String segundo) {
        return primero != null && !primero.isBlank() ? primero.trim() : segundo == null ? "" : segundo.trim();
    }

    private String normalizar(String valor) {
        return valor == null ? "" : valor.trim().toLowerCase();
    }
}
