package com.utp.tienda_licencias_ai.controller;

import com.utp.tienda_licencias_ai.model.SolicitudCompra;
import com.utp.tienda_licencias_ai.model.LoginRequest;
import com.utp.tienda_licencias_ai.model.Suscripcion;
import com.utp.tienda_licencias_ai.model.SuscripcionActiva;
import com.utp.tienda_licencias_ai.model.Usuario;
import com.utp.tienda_licencias_ai.service.AuthService;
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
    private final AuthService authService;

    public TiendaRestController(AuthService authService) {
        this.authService = authService;
    }

    private final List<Suscripcion> suscripciones = List.of(
            new Suscripcion("chatgpt-plus", "ChatGPT Plus", "ChatGPT", "Cuenta personal", "1 mes", new BigDecimal("59.90"), "Accede a modelos avanzados para redactar, estudiar, programar y resolver tareas complejas. Incluye generación de imágenes, análisis de archivos, navegación web y prioridad cuando hay mucha demanda.", "https://images.ctfassets.net/jdtwqhzvc2n1/QLHx5uoJuTAU5XLQydSn2/093557922f9ef503c917611ac3528401/Untitled-design-78.png"),
            new Suscripcion("chatgpt-team", "ChatGPT Team", "ChatGPT", "Invitación a espacio de equipo", "1 mes", new BigDecimal("105.00"), "Un espacio de trabajo compartido para equipos que necesitan colaborar con inteligencia artificial. Incluye administración centralizada, proyectos compartidos, límites superiores y protección de los datos del equipo.", "https://institutobaikal.com/wp-content/uploads/2023/02/Banners-1.png"),
            new Suscripcion("chatgpt-pro", "ChatGPT Pro", "ChatGPT", "Cuenta personal", "1 mes", new BigDecimal("699.00"), "La opción para quienes utilizan IA de forma intensiva en investigación, programación y análisis. Ofrece mayor capacidad de uso, razonamiento extendido, acceso anticipado a funciones nuevas y soporte prioritario.", "https://miro.medium.com/1*zYseZ689O21AHz3DyTWxXA.png"),
            new Suscripcion("claude-pro", "Claude Pro", "Claude", "Cuenta personal", "1 mes", new BigDecimal("62.00"), "Un asistente especializado en redacción, análisis y programación. Permite trabajar con documentos largos, organizar proyectos propios y obtener respuestas más amplias que en el plan gratuito.", "https://cdn.mos.cms.futurecdn.net/2SDL9AfTXNC6yKnAZzKrgD.jpg"),
            new Suscripcion("claude-max-5x", "Claude Max 5x", "Claude", "Cuenta personal", "1 mes", new BigDecimal("369.00"), "Pensado para personas que trabajan con IA durante todo el día. Incluye cinco veces el uso de Claude Pro, prioridad en horas punta, acceso preferente a nuevas funciones y soporte prioritario.", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIKZXgMsY2-b34_pGX6x5LG06dXOXCoyIirWtcW9cGMeYTXW_4PGp7aHw&s=10"),
            new Suscripcion("claude-team", "Claude Team", "Claude", "Espacio de equipo", "1 mes", new BigDecimal("112.00"), "Una solución colaborativa para equipos que necesitan analizar información y crear contenido juntos. Incluye proyectos compartidos, gestión de usuarios, administración centralizada y mayor capacidad que el plan individual.", "https://i.ytimg.com/vi/YrYQ_IMlOsM/maxresdefault.jpg"),
            new Suscripcion("gemini-pro", "Gemini Pro", "Gemini", "Cuenta personal", "1 mes", new BigDecimal("55.00"), "Disfruta los modelos avanzados de Google para escribir, investigar y resolver problemas. Se integra con Gmail y Docs e incluye 2 TB de almacenamiento para centralizar tus archivos y proyectos.", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDluyXPcVx3VR94zSiC_VjjX8I47y8m3amhz029q3tTKTm52TuHPwIqYo&s=10"),
            new Suscripcion("gemini-ultra", "Gemini Ultra", "Gemini", "Cuenta personal", "1 mes", new BigDecimal("899.00"), "El plan más completo de Google para tareas exigentes. Ofrece los límites más altos, generación de video, acceso anticipado a modelos experimentales y 30 TB de almacenamiento para proyectos profesionales.", "https://i0.wp.com/imgs.hipertextual.com/wp-content/uploads/2025/04/Gemini-2.jpg?fit=1200%2C762&quality=70&strip=all&ssl=1"),
            new Suscripcion("midjourney-basic", "Midjourney Basic", "Midjourney", "Cuenta personal", "1 mes", new BigDecimal("35.00"), "Una forma sencilla de empezar a crear imágenes con inteligencia artificial a partir de descripciones de texto. Es ideal para explorar estilos, conceptos visuales y proyectos personales con una clave de activación.", "https://media.licdn.com/dms/image/v2/D4D12AQEgzjjkR88XGg/article-cover_image-shrink_720_1280/B4DZachJMgGgAM-/0/1746382656773?e=2147483647&v=beta&t=ELRTR3xLOfF2qVEmQI_fkm6k_zvNEuY3X3w8hVeXGMk"),
            new Suscripcion("midjourney-standard", "Midjourney Standard", "Midjourney", "Cuenta personal", "1 mes", new BigDecimal("99.00"), "El plan más popular para crear imágenes con mayor frecuencia. Incluye 15 horas de generación rápida, modo relajado ilimitado, uso comercial y una clave de activación enviada al correo.", "https://storage.ghost.io/c/12/7b/127b828b-bdc2-4972-9cf2-de857df9c324/content/images/size/w2000/format/webp/2024/10/How-to-use-Midjourney.webp"),
            new Suscripcion("midjourney-pro", "Midjourney Pro", "Midjourney", "Cuenta personal", "1 mes", new BigDecimal("219.00"), "Diseñado para diseñadores y agencias que necesitan producir muchas imágenes. Incluye más horas rápidas, modo sigiloso para mantener los trabajos privados y hasta 12 tareas en paralelo.", "https://images.yourstory.com/cs/2/07f6d7f0ed8e11ed819979969b4b51e2/Yourparagraphtext1-1772797109628.png?mode=crop&crop=faces&ar=2%3A1&format=auto&w=1920&q=75"),
            new Suscripcion("copilot-pro", "Copilot Pro", "Copilot", "Cuenta personal", "1 mes", new BigDecimal("36.00"), "Acelera tu trabajo de programación con autocompletado inteligente y chat dentro de VS Code, IntelliJ y otros editores. Incluye uso amplio para escribir, explicar, refactorizar y depurar código.", "https://static0.xdaimages.com/wordpress/wp-content/uploads/2024/01/copilot_pro_hero_static_lockup_1920x1280.png"),
            new Suscripcion("copilot-pro-plus", "Copilot Pro Plus", "Copilot", "Cuenta personal", "1 mes", new BigDecimal("145.00"), "La experiencia más completa de Copilot para profesionales. Incluye todo lo del plan Pro, acceso a todos los modelos disponibles y una cuota superior de solicitudes premium para tareas complejas.", "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSFT-Laptop-with-Copilot-logo-and-colorful-bloom-RW1kfOs?scl=1&fmt=png-alpha"),
            new Suscripcion("perplexity-pro", "Perplexity Pro", "Perplexity", "Cuenta personal", "1 mes", new BigDecimal("49.00"), "Investiga cualquier tema con respuestas generadas por IA y fuentes citadas. El plan Pro permite realizar búsquedas más profundas, elegir entre varios modelos, subir archivos y obtener información actualizada.", "https://substackcdn.com/image/fetch/$s_!FOoe!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fb3c1a3da-cf6d-4385-88e4-1cb65fb559ef_960x720.jpeg")
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
        Usuario usuario = authService.autenticar(identidad, password);
        if (usuario == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Credenciales invalidas."));
        }

        session.setAttribute("usuarioId", usuario.getId());
        session.setAttribute("usuarioNombre", usuario.getNombre());
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
