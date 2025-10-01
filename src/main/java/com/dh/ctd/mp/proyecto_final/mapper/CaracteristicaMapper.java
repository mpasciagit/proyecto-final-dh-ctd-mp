package com.dh.ctd.mp.proyecto_final.mapper;

    import com.dh.ctd.mp.proyecto_final.dto.CaracteristicaDTO;
    import com.dh.ctd.mp.proyecto_final.entity.Caracteristica;

    public class CaracteristicaMapper {
        public static CaracteristicaDTO toDTO(Caracteristica entity) {
            if (entity == null) return null;
            return CaracteristicaDTO.builder()
                    .id(entity.getId())
                    .nombre(entity.getNombre())
                    .descripcion(entity.getDescripcion())
                    .iconoUrl(entity.getIconoUrl())
                    .build();
        }

        public static Caracteristica toEntity(CaracteristicaDTO dto) {
            if (dto == null) return null;
            return Caracteristica.builder()
                    .id(dto.getId())
                    .nombre(dto.getNombre())
                    .descripcion(dto.getDescripcion())
                    .iconoUrl(dto.getIconoUrl())
                    .build();
        }
    }