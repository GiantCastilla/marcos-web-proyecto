package com.utp.tienda_licencias_ai.model;

import java.time.LocalDate;

public class SuscripcionActiva {
    private String suscripcionId;
    private String nombre;
    private LocalDate fechaInicio;
    private LocalDate fechaVencimiento;
    private long diasRestantes;
    private String estado;

    public SuscripcionActiva(String suscripcionId, String nombre, LocalDate fechaInicio,
            LocalDate fechaVencimiento, long diasRestantes, String estado) {
        this.suscripcionId = suscripcionId;
        this.nombre = nombre;
        this.fechaInicio = fechaInicio;
        this.fechaVencimiento = fechaVencimiento;
        this.diasRestantes = diasRestantes;
        this.estado = estado;
    }

    public String getSuscripcionId() { return suscripcionId; }
    public String getNombre() { return nombre; }
    public LocalDate getFechaInicio() { return fechaInicio; }
    public LocalDate getFechaVencimiento() { return fechaVencimiento; }
    public long getDiasRestantes() { return diasRestantes; }
    public String getEstado() { return estado; }
}
