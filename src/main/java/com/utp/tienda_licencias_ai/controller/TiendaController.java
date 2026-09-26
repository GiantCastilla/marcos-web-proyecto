package com.utp.tienda_licencias_ai.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class TiendaController {

    @GetMapping("/carrito")
    public String carrito() {
        return "carrito";
    }

    @GetMapping("/nosotros")
    public String nosotros() {
        return "nosotros";
    }
}