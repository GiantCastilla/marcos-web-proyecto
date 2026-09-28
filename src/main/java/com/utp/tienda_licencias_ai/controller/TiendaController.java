package com.utp.tienda_licencias_ai.controller;

import com.utp.tienda_licencias_ai.model.CarritoItem;
import com.utp.tienda_licencias_ai.model.SolicitudCompra;
import com.utp.tienda_licencias_ai.model.Suscripcion;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.ui.Model;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import jakarta.servlet.http.HttpSession;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Controller
public class TiendaController {
    private static final String CARRITO = "carrito";
    private final TiendaRestController tiendaRestController;

    public TiendaController(TiendaRestController tiendaRestController) {
        this.tiendaRestController = tiendaRestController;
    }

    @GetMapping("/carrito")
    public String carrito(HttpSession session, Model model) {
        List<CarritoItem> items = obtenerItems(session);
        int cantidadTotal = items.stream().mapToInt(CarritoItem::getCantidad).sum();
        var total = items.stream().map(CarritoItem::getSubtotal).reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
        model.addAttribute("carritoItems", items);
        model.addAttribute("cantidadTotal", cantidadTotal);
        model.addAttribute("totalCarrito", total);
        model.addAttribute("carritoVacio", items.isEmpty());
        return "carrito";
    }

    @PostMapping("/carrito/agregar")
    public String agregar(@RequestParam String id,
            @RequestParam(defaultValue = "/catalogo") String returnUrl,
            @RequestParam(defaultValue = "") String anchor,
            HttpSession session, RedirectAttributes redirectAttributes) {
        Suscripcion suscripcion = tiendaRestController.obtenerSuscripcionPorId(id);
        if (suscripcion == null || suscripcion.getStock() == 0) {
            redirectAttributes.addFlashAttribute("errorCarrito", "La suscripcion no esta disponible.");
            return redireccionar(returnUrl, anchor);
        }
        Map<String, Integer> carrito = obtenerCarrito(session);
        int cantidad = carrito.getOrDefault(id, 0) + 1;
        if (cantidad > suscripcion.getStock()) {
            redirectAttributes.addFlashAttribute("errorCarrito", "No hay suficiente stock disponible.");
        } else {
            carrito.put(id, cantidad);
            guardarCarrito(session, carrito);
        }
        return redireccionar(returnUrl, anchor);
    }

    private String redireccionar(String returnUrl, String anchor) {
        String destino = returnUrl != null && returnUrl.startsWith("/") ? returnUrl : "/catalogo";
        return anchor == null || anchor.isBlank() ? "redirect:" + destino : "redirect:" + destino + "#" + anchor;
    }

    @PostMapping("/carrito/cantidad")
    public String cambiarCantidad(@RequestParam String id, @RequestParam int cambio, HttpSession session) {
        Map<String, Integer> carrito = obtenerCarrito(session);
        Suscripcion suscripcion = tiendaRestController.obtenerSuscripcionPorId(id);
        int cantidad = carrito.getOrDefault(id, 0) + cambio;
        if (cantidad <= 0 || suscripcion == null) carrito.remove(id);
        else if (cantidad <= suscripcion.getStock()) carrito.put(id, cantidad);
        guardarCarrito(session, carrito);
        return "redirect:/carrito";
    }

    @PostMapping("/carrito/eliminar")
    public String eliminar(@RequestParam String id, HttpSession session) {
        Map<String, Integer> carrito = obtenerCarrito(session);
        carrito.remove(id);
        guardarCarrito(session, carrito);
        return "redirect:/carrito";
    }

    @PostMapping("/carrito/vaciar")
    public String vaciar(HttpSession session) {
        guardarCarrito(session, new LinkedHashMap<>());
        return "redirect:/carrito";
    }

    @PostMapping("/carrito/comprar")
    public String comprar(HttpSession session, RedirectAttributes redirectAttributes) {
        List<String> ids = new ArrayList<>();
        obtenerItems(session).forEach(item -> {
            for (int i = 0; i < item.getCantidad(); i++) ids.add(item.getSuscripcion().getId());
        });
        if (ids.isEmpty()) return "redirect:/carrito";
        SolicitudCompra solicitud = new SolicitudCompra();
        solicitud.setSuscripcionIds(ids);
        var respuesta = tiendaRestController.checkout(solicitud, session);
        if (!respuesta.getStatusCode().is2xxSuccessful()) {
            redirectAttributes.addFlashAttribute("errorCarrito", "No se pudo registrar la compra. Verifica tu sesión y el stock.");
            return "redirect:/carrito";
        }
        guardarCarrito(session, new LinkedHashMap<>());
        if (respuesta.getBody() instanceof Map<?, ?> pedido) {
            redirectAttributes.addFlashAttribute("pedidoId", pedido.get("pedidoId"));
        }
        return "redirect:/carrito";
    }

    @GetMapping("/dashboard")
    public String dashboard(HttpSession session, Model model) {
        var suscripciones = tiendaRestController.obtenerSuscripcionesDelUsuario(session);
        model.addAttribute("suscripciones", suscripciones);
        model.addAttribute("totalSuscripciones", suscripciones.size());
        model.addAttribute("totalActivas", suscripciones.stream().filter(item -> "ACTIVA".equals(item.getEstado()) || "POR_VENCER".equals(item.getEstado())).count());
        return "dashboard";
    }

    @SuppressWarnings("unchecked")
    private Map<String, Integer> obtenerCarrito(HttpSession session) {
        Object valor = session.getAttribute(CARRITO);
        return valor instanceof Map<?, ?> mapa ? new LinkedHashMap<>((Map<String, Integer>) mapa) : new LinkedHashMap<>();
    }

    private void guardarCarrito(HttpSession session, Map<String, Integer> carrito) {
        session.setAttribute(CARRITO, carrito);
        session.setAttribute("carritoCantidad", carrito.values().stream().mapToInt(Integer::intValue).sum());
    }

    private List<CarritoItem> obtenerItems(HttpSession session) {
        return obtenerCarrito(session).entrySet().stream()
                .map(entrada -> new CarritoItem(tiendaRestController.obtenerSuscripcionPorId(entrada.getKey()), entrada.getValue()))
                .filter(item -> item.getSuscripcion() != null)
                .toList();
    }

    @GetMapping("/nosotros")
    public String nosotros() {
        return "nosotros";
    }
}