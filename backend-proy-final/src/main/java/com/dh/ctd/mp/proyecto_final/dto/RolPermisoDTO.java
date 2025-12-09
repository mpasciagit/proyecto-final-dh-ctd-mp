// java
    package com.dh.ctd.mp.proyecto_final.dto;

    import lombok.Data;
    import lombok.NoArgsConstructor;
    import lombok.AllArgsConstructor;
    import lombok.Builder;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public class RolPermisoDTO {
        private Long id;
        private String rol;
        private String permiso;
        private Long rolId;
        private Long permisoId;
    }