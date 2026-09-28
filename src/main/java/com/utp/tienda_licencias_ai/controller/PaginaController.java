package com.utp.tienda_licencias_ai.controller;

import com.utp.tienda_licencias_ai.model.Suscripcion;
import org.springframework.ui.Model;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import jakarta.servlet.http.HttpSession;

import java.util.Comparator;
import java.util.List;

@Controller
public class PaginaController {
    private final TiendaRestController tiendaRestController;

    public PaginaController(TiendaRestController tiendaRestController) {
        this.tiendaRestController = tiendaRestController;
    }

    @GetMapping("/")
    public String autenticacion() {
        return "autenticacion";
    }
    @GetMapping("/catalogo")
    public String catalogo(@RequestParam(defaultValue = "") String q,
            @RequestParam(defaultValue = "todos") String modelo,
            @RequestParam(defaultValue = "relevancia") String orden,
            Model model) {
        List<Suscripcion> suscripciones = tiendaRestController.obtenerSuscripciones().stream()
                .filter(suscripcion -> modelo.equals("todos") || suscripcion.getCategoria().equals(modelo))
                .filter(suscripcion -> q.isBlank()
                        || suscripcion.getNombre().toLowerCase().contains(q.toLowerCase())
                        || suscripcion.getDescripcion().toLowerCase().contains(q.toLowerCase()))
                .sorted(comparador(orden))
                .toList();
        model.addAttribute("suscripciones", suscripciones);
        model.addAttribute("ofertas", tiendaRestController.obtenerSuscripciones().stream()
            .filter(suscripcion -> suscripcion.getStock() > 0 && suscripcion.getPorcentajeDescuento() > 0)
            .sorted(Comparator.comparing(Suscripcion::getPorcentajeDescuento).reversed())
            .limit(3)
            .toList());
        model.addAttribute("todasSuscripciones", tiendaRestController.obtenerSuscripciones());
        model.addAttribute("modelos", tiendaRestController.obtenerSuscripciones().stream()
            .map(Suscripcion::getCategoria)
            .distinct()
            .toList());
        model.addAttribute("busqueda", q);
        model.addAttribute("modeloSeleccionado", modelo);
        model.addAttribute("ordenSeleccionado", orden);
        return "catalogo";
    }

    @GetMapping("/catalogo/detalles/{id}")
    public String detalleCatalogo(@PathVariable String id, Model model) {
        Suscripcion suscripcion = tiendaRestController.obtenerSuscripciones().stream()
                .filter(item -> item.getId().equalsIgnoreCase(id))
                .findFirst()
                .orElse(null);
        model.addAttribute("suscripcion", suscripcion);
        return "catalogo-detalle";
    }

    private Comparator<Suscripcion> comparador(String orden) {
        if ("precio-asc".equals(orden)) {
            return Comparator.comparing(Suscripcion::getPrecio);
        }
        if ("precio-desc".equals(orden)) {
            return Comparator.comparing(Suscripcion::getPrecio).reversed();
        }
        return Comparator.comparing(Suscripcion::getNombre);
    }
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/";
    }
}
