package com.utp.tienda_licencias_ai.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

// Usamos @Controller (no @RestController) porque los métodos de abajo NO
// devuelven datos (JSON), devuelven el NOMBRE de una plantilla HTML. Spring
// agarra ese nombre, busca el archivo correspondiente dentro de
// src/main/resources/templates/ y usa Thymeleaf para convertirlo en la
// página final que ve el usuario.
@Controller
public class PaginaController {

    // Cuando alguien entra a http://localhost:8080/ , Spring ejecuta este
    // método. Como devuelve "autenticacion", busca el archivo
    // templates/autenticacion.html
    @GetMapping("/")
    public String autenticacion() {
        return "autenticacion";
    }

    // http://localhost:8080/dashboard -> templates/dashboard.html
    @GetMapping("/dashboard")
    public String dashboard() {
        return "dashboard";
    }

    // http://localhost:8080/catalogo -> templates/catalogo.html
    @GetMapping("/catalogo")
    public String catalogo() {
        return "catalogo";
    }

    // http://localhost:8080/solicitudes -> templates/solicitudes.html
    @GetMapping("/solicitudes")
    public String solicitudes() {
        return "solicitudes";
    }

    // http://localhost:8080/soporte -> templates/soporte.html
    @GetMapping("/soporte")
    public String soporte() {
        return "soporte";
    }
}
