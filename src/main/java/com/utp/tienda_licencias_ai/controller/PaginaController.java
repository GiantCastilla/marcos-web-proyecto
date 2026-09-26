package com.utp.tienda_licencias_ai.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import jakarta.servlet.http.HttpSession;
@Controller
public class PaginaController {
    @GetMapping("/")
    public String autenticacion() {
        return "autenticacion";
    }
    @GetMapping("/dashboard")
    public String dashboard() {
        return "dashboard";
    }
    @GetMapping("/catalogo")
    public String catalogo() {
        return "catalogo";
    }

    @GetMapping({"/catalogo/detalles/{id}"})
    public String detalleCatalogo() {
        return "catalogo-detalle";
    }
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/";
    }
}
