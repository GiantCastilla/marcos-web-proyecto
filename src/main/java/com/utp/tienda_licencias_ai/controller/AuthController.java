package com.utp.tienda_licencias_ai.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import jakarta.servlet.http.HttpSession;
@Controller
public class AuthController {

    private static final String CORREO_VALIDO = "admin@tienda.com";
    private static final String CLAVE_VALIDA = "admin123";

    @PostMapping("/login")
    public String procesarLogin(@RequestParam String email, @RequestParam String password, RedirectAttributes redirectAttributes, HttpSession session) {

        if (CORREO_VALIDO.equals(email) && CLAVE_VALIDA.equals(password)) {
            session.setAttribute("usuarioId", 1L);
            return "redirect:/dashboard";
        }
        redirectAttributes.addFlashAttribute("error", "Correo o contraseña incorrectos.");
        return "redirect:/";
    }
}
