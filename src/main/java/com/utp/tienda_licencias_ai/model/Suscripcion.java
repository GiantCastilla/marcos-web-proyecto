package com.utp.tienda_licencias_ai.model;

import java.math.BigDecimal;

public class Suscripcion {
    private String id;
    private String nombre;
    private String categoria;
    private String tipo;
    private String duracion;
    private BigDecimal precio;
    private String descripcion;
    private String imagenUrl;
    private int stock;
    private BigDecimal precioAnterior;

    public Suscripcion() {
    }

        public Suscripcion(String id, String nombre, String categoria, String tipo, String duracion,
            BigDecimal precio, String descripcion, String imagenUrl) {
        this.id = id;
        this.nombre = nombre;
        this.categoria = categoria;
        this.tipo = tipo;
        this.duracion = duracion;
        this.precio = precio;
        this.descripcion = descripcion;
        this.imagenUrl = imagenUrl;
        this.stock = switch (id) {
            case "chatgpt-plus" -> 18;
            case "chatgpt-team" -> 7;
            case "chatgpt-pro" -> 3;
            case "claude-pro" -> 15;
            case "claude-max-5x" -> 5;
            case "claude-team" -> 0;
            case "gemini-pro" -> 22;
            case "gemini-ultra" -> 2;
            case "midjourney-basic" -> 30;
            case "midjourney-standard" -> 12;
            case "midjourney-pro" -> 4;
            case "copilot-pro" -> 25;
            case "copilot-pro-plus" -> 9;
            case "perplexity-pro" -> 14;
            default -> 0;
        };
        this.precioAnterior = switch (id) {
            case "chatgpt-plus", "claude-pro", "gemini-pro", "perplexity-pro" -> new BigDecimal("75.00");
            case "chatgpt-pro" -> new BigDecimal("750.00");
            case "claude-team" -> new BigDecimal("120.00");
            case "gemini-ultra" -> new BigDecimal("940.00");
            case "midjourney-basic" -> new BigDecimal("38.00");
            case "midjourney-standard" -> new BigDecimal("113.00");
            case "copilot-pro" -> new BigDecimal("38.00");
            default -> null;
        };
    }

    public String getId() { return id; }
    public String getNombre() { return nombre; }
    public String getCategoria() { return categoria; }
    public String getTipo() { return tipo; }
    public String getDuracion() { return duracion; }
    public BigDecimal getPrecio() { return precio; }
    public String getDescripcion() { return descripcion; }
    public String getImagenUrl() { return imagenUrl; }
    public int getStock() { return stock; }
    public BigDecimal getPrecioAnterior() { return precioAnterior; }
    public int getPorcentajeDescuento() {
        if (precioAnterior == null || precioAnterior.signum() == 0) {
            return 0;
        }
        return precioAnterior.subtract(precio).multiply(BigDecimal.valueOf(100))
                .divide(precioAnterior, 0, java.math.RoundingMode.HALF_UP).intValue();
    }
    public void reducirStock(int cantidad) { stock = Math.max(0, stock - cantidad); }
}
