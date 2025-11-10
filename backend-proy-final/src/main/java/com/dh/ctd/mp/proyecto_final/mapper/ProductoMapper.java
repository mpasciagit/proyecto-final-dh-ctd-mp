package com.dh.ctd.mp.proyecto_final.mapper;

     import com.dh.ctd.mp.proyecto_final.dto.ProductoDTO;
     import com.dh.ctd.mp.proyecto_final.dto.CaracteristicaDTO;
     import com.dh.ctd.mp.proyecto_final.entity.Producto;
     import com.dh.ctd.mp.proyecto_final.entity.Caracteristica;
     import com.dh.ctd.mp.proyecto_final.entity.ProductoCaracteristica;
     import com.dh.ctd.mp.proyecto_final.entity.Categoria;
     import com.dh.ctd.mp.proyecto_final.dto.ImagenDTO;
     import com.dh.ctd.mp.proyecto_final.entity.Imagen;

     import java.util.List;
     import java.util.Set;
     import java.util.stream.Collectors;
     import java.util.ArrayList;
     import java.util.HashSet;

public class ProductoMapper {

    // Producto -> ProductoDTO
    public static ProductoDTO toDTO(Producto producto) {
        if (producto == null) return null;

        ProductoDTO dto = ProductoDTO.builder()
                .id(producto.getId())
                .nombre(producto.getNombre())
                .descripcion(producto.getDescripcion())
                .precio(producto.getPrecio())
                .reservable(producto.getReservable())
                .cantidadTotal(producto.getCantidadTotal())
                .build();

        if (producto.getCategoria() != null) {
            dto.setCategoriaId(producto.getCategoria().getId());
            dto.setCategoriaNombre(producto.getCategoria().getNombre());
        }

        if (producto.getProductoCaracteristicas() != null) {
            List<CaracteristicaDTO> caracteristicas = producto.getProductoCaracteristicas().stream()
                    .map(pc -> CaracteristicaMapper.toDTO(pc.getCaracteristica()))
                    .collect(Collectors.toList());
            dto.setCaracteristicas(caracteristicas);
        } else {
            dto.setCaracteristicas(new ArrayList<>());
        }

        if (producto.getImagenes() != null) {
            List<ImagenDTO> imagenes = producto.getImagenes().stream()
                .map(ImagenMapper::toDTO)
                .collect(Collectors.toList());
            dto.setImagenes(imagenes);
        } else {
            dto.setImagenes(new ArrayList<>());
        }

        return dto;
    }

    // ProductoDTO -> Producto (solo setea ID de característica)
    public static Producto toEntity(ProductoDTO dto) {
        if (dto == null) return null;

        Producto producto = new Producto();
        producto.setId(dto.getId());
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecio(dto.getPrecio());
        producto.setReservable(dto.getReservable());
        producto.setCantidadTotal(dto.getCantidadTotal());

        if (dto.getCategoriaId() != null) {
            Categoria categoria = new Categoria();
            categoria.setId(dto.getCategoriaId());
            categoria.setNombre(dto.getCategoriaNombre());
            producto.setCategoria(categoria);
        }

        if (dto.getCaracteristicas() != null) {
            Set<ProductoCaracteristica> productoCaracteristicas = dto.getCaracteristicas().stream()
                    .map(caracteristicaDTO -> {
                        ProductoCaracteristica pc = new ProductoCaracteristica();
                        pc.setProducto(producto);

                        // Solo referenciamos ID
                        Caracteristica caracteristica = new Caracteristica();
                        caracteristica.setId(caracteristicaDTO.getId());
                        pc.setCaracteristica(caracteristica);

                        return pc;
                    })
                    .collect(Collectors.toSet());
            producto.setProductoCaracteristicas(productoCaracteristicas);
        } else {
            producto.setProductoCaracteristicas(new HashSet<>());
        }

        return producto;
    }
}
