package com.utp.tienda_licencias_ai.model;

import java.math.BigDecimal;

public class CarritoItem {
    private final Suscripcion suscripcion;
    private final int cantidad;

    public CarritoItem(Suscripcion suscripcion, int cantidad) {
        this.suscripcion = suscripcion;
        this.cantidad = cantidad;
    }

    public Suscripcion getSuscripcion() { return suscripcion; }
    public int getCantidad() { return cantidad; }
    public BigDecimal getSubtotal() { return suscripcion.getPrecio().multiply(BigDecimal.valueOf(cantidad)); }
}