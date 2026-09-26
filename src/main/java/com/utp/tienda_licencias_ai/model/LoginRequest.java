package com.utp.tienda_licencias_ai.model;

public class LoginRequest {
    private String email;
    private String usuario;
    private String password;

    public LoginRequest() {
    }

    public String getEmail() { return email; }
    public String getUsuario() { return usuario; }
    public String getPassword() { return password; }
}
