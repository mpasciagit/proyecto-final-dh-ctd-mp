package com.dh.ctd.mp.proyecto_final.service;

import com.dh.ctd.mp.proyecto_final.dto.ProductoDTO;

import java.util.List;

public interface IProductoService {

    // CRUD genérico usando DTO
    ProductoDTO save(ProductoDTO productoDTO);
    ProductoDTO findById(Long id);
    List<ProductoDTO> findAll();
    ProductoDTO update(Long id, ProductoDTO productoDTO);
    void delete(Long id);

    // Búsquedas específicas
    List<ProductoDTO> findByNombre(String nombre);
    List<ProductoDTO> findByCategoria(Long categoriaId);
    List<ProductoDTO> findReservables();
    List<ProductoDTO> findConStockDisponible();

    // Lógica adicional
    boolean verificarDisponibilidad(Long productoId, int cantidadSolicitada);
}
