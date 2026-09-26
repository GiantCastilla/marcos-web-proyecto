package com.utp.tienda_licencias_ai.controller;

import com.utp.tienda_licencias_ai.model.Usuario;
import com.utp.tienda_licencias_ai.service.AuthService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import jakarta.servlet.http.HttpSession;
@Controller
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public String procesarLogin(@RequestParam String email, @RequestParam String password, RedirectAttributes redirectAttributes, HttpSession session) {

        Usuario usuario = authService.autenticar(email, password);
        if (usuario != null) {
            session.setAttribute("usuarioId", usuario.getId());
            session.setAttribute("usuarioNombre", usuario.getNombre());
            return "redirect:/dashboard";
        }
        redirectAttributes.addFlashAttribute("error", "Correo o contraseña incorrectos.");
        return "redirect:/";
    }

    @PostMapping("/register")
    public String registrar(@RequestParam String nombre, @RequestParam String email,
            @RequestParam String password, RedirectAttributes redirectAttributes, HttpSession session) {
        Usuario usuario = authService.registrar(nombre, email, password);
        if (usuario == null) {
            redirectAttributes.addFlashAttribute("errorRegistro", "El correo ya está registrado o los datos son inválidos.");
            return "redirect:/";
        }
        session.setAttribute("usuarioId", usuario.getId());
        session.setAttribute("usuarioNombre", usuario.getNombre());
        return "redirect:/dashboard";
    }
}
