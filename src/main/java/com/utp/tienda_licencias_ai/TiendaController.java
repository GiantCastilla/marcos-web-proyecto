package com.utp.tienda_licencias_ai;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

// Controlador de las páginas NUEVAS de la tienda (carrito y sobre nosotros).
// Va separado de PaginaController para no tocar las rutas que ya existían
// (/catalogo sigue saliendo de PaginaController, solo cambió su HTML).
// @Controller le dice a Spring que esta clase atiende páginas web.
@Controller
public class TiendaController {

    // Cuando el navegador entra a http://localhost:8080/carrito
    // Spring devuelve la plantilla templates/carrito.html
    @GetMapping("/carrito")
    public String carrito() {
        return "carrito";
    }

    // http://localhost:8080/nosotros -> templates/nosotros.html
    @GetMapping("/nosotros")
    public String nosotros() {
        return "nosotros";
    }
}
