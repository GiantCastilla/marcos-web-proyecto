package com.utp.tienda_licencias_ai.service;

import com.utp.tienda_licencias_ai.model.Usuario;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class AuthService {
    private final Map<String, Cuenta> cuentas = new ConcurrentHashMap<>();
    private final AtomicLong siguienteId = new AtomicLong(2L);

    public AuthService() {
        cuentas.put("admin@tienda.com", new Cuenta(1L, "Johnny Depp", "admin@tienda.com", "admin123"));
    }

    public Usuario autenticar(String identidad, String password) {
        Cuenta cuenta = cuentas.get(normalizar(identidad));
        if (cuenta == null || !cuenta.password().equals(password)) {
            return null;
        }
        return cuenta.usuario();
    }

    public Usuario registrar(String nombre, String email, String password) {
        String correo = normalizar(email);
        if (nombre == null || nombre.isBlank() || correo.isBlank() || password == null || password.isBlank()) {
            return null;
        }
        Cuenta cuenta = new Cuenta(siguienteId.getAndIncrement(), nombre.trim(), correo, password);
        return cuentas.putIfAbsent(correo, cuenta) == null ? cuenta.usuario() : null;
    }

    private String normalizar(String valor) {
        return valor == null ? "" : valor.trim().toLowerCase(Locale.ROOT);
    }

    private record Cuenta(Long id, String nombre, String email, String password) {
        private Usuario usuario() {
            return new Usuario(id, nombre, email);
        }
    }
}
