package com.dh.ctd.mp.proyecto_final.service;

import com.dh.ctd.mp.proyecto_final.dto.ProductoCaracteristicaDTO;

import java.util.List;

public interface IProductoCaracteristicaService {
    List<ProductoCaracteristicaDTO> findAll();
    ProductoCaracteristicaDTO findById(Long id);
    ProductoCaracteristicaDTO save(ProductoCaracteristicaDTO dto);
    ProductoCaracteristicaDTO update(ProductoCaracteristicaDTO dto);
    void delete(Long id);
}