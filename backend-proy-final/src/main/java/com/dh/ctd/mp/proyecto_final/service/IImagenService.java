package com.dh.ctd.mp.proyecto_final.service;

import com.dh.ctd.mp.proyecto_final.dto.ImagenDTO;

import java.util.List;

public interface IImagenService {
    ImagenDTO save(ImagenDTO imagenDTO);
    ImagenDTO findById(Long id);
    List<ImagenDTO> findAll();
    void delete(Long id);
    List<ImagenDTO> findByProductoId(Long productoId);
}
