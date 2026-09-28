package com.utp.tienda_licencias_ai.model;

import java.util.List;

public class SolicitudCompra {
    private Long usuarioId;
    private List<String> suscripcionIds;

    public SolicitudCompra() {
    }

    public Long getUsuarioId() { return usuarioId; }
    public List<String> getSuscripcionIds() { return suscripcionIds; }
    public void setSuscripcionIds(List<String> suscripcionIds) { this.suscripcionIds = suscripcionIds; }
}
