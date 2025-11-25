package com.dh.ctd.mp.proyecto_final.mapper;

import com.dh.ctd.mp.proyecto_final.dto.ProductoCaracteristicaDTO;
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
            List<ProductoCaracteristicaDTO> productoCaracteristicas = producto.getProductoCaracteristicas().stream()
                    .map(pc -> ProductoCaracteristicaDTO.builder()
                            .id(pc.getId())
                            .productoId(pc.getProducto().getId())
                            .caracteristicaId(pc.getCaracteristica().getId())
                            .caracteristicaNombre(pc.getCaracteristica().getNombre())
                            .caracteristicaIconoUrl(pc.getCaracteristica().getIconoUrl())
                            .valor(pc.getValor())
                            .build())
                    .toList();
            dto.setProductoCaracteristica(productoCaracteristicas);
        } else {
            dto.setProductoCaracteristica(new ArrayList<>());
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

    // ProductoDTO -> Producto
    public static Producto toEntity(ProductoDTO dto, Categoria categoria) {
        if (dto == null) return null;

        Producto producto = new Producto();
        producto.setId(dto.getId());
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecio(dto.getPrecio());
        producto.setReservable(dto.getReservable());
        producto.setCantidadTotal(dto.getCantidadTotal());

        // Asignar la categoría recuperada
        producto.setCategoria(categoria);

        if (dto.getProductoCaracteristica() != null) {
            Set<ProductoCaracteristica> productoCaracteristicas = dto.getProductoCaracteristica().stream()
                    .map(pcDTO -> {
                        ProductoCaracteristica pc = new ProductoCaracteristica();
                        pc.setProducto(producto);

                        Caracteristica caracteristica = new Caracteristica();
                        caracteristica.setId(pcDTO.getCaracteristicaId());
                        pc.setCaracteristica(caracteristica);

                        pc.setValor(pcDTO.getValor());
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