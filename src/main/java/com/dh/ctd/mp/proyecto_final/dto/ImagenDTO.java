package com.dh.ctd.mp.proyecto_final.dto;

public class ImagenDTO {
    private Long id;
    private String url;
    private String textoAlternativo;
    private Integer orden;
    private Long productoId;

    public ImagenDTO() {}

    public ImagenDTO(Long id, String url, String textoAlternativo, Integer orden, Long productoId) {
        this.id = id;
        this.url = url;
        this.textoAlternativo = textoAlternativo;
        this.orden = orden;
        this.productoId = productoId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getTextoAlternativo() { return textoAlternativo; }
    public void setTextoAlternativo(String textoAlternativo) { this.textoAlternativo = textoAlternativo; }

    public Integer getOrden() { return orden; }
    public void setOrden(Integer orden) { this.orden = orden; }

    public Long getProductoId() { return productoId; }
    public void setProductoId(Long productoId) { this.productoId = productoId; }
}
