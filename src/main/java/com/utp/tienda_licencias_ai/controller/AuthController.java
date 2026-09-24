package com.utp.tienda_licencias_ai.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

// Controlador que procesa el envío del formulario de login. Todavía no
// hay base de datos conectada al proyecto, así que por ahora se compara
// contra un solo usuario de prueba fijo (hardcodeado). Cuando se conecte
// una base de datos real, esta comparación se reemplaza por una consulta
// a la tabla de usuarios.
@Controller
public class AuthController {

    private static final String CORREO_VALIDO = "admin@tienda.com";
    private static final String CLAVE_VALIDA = "admin123";

    @PostMapping("/login")
    public String procesarLogin(@RequestParam String email, @RequestParam String password, RedirectAttributes redirectAttributes) {

        if (CORREO_VALIDO.equals(email) && CLAVE_VALIDA.equals(password)) {
            return "redirect:/dashboard";
        }

        // addFlashAttribute guarda el mensaje solo para la SIGUIENTE
        // petición (la del redirect a "/"), así no se queda pegado si
        // el usuario recarga la página después
        redirectAttributes.addFlashAttribute("error", "Correo o contraseña incorrectos.");
        return "redirect:/";
    }
}
