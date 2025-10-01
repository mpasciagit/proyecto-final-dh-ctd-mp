package com.dh.ctd.mp.proyecto_final.service;

import com.dh.ctd.mp.proyecto_final.dto.ImagenDTO;

import java.util.List;
import java.util.Optional;

public interface IImagenService {
    ImagenDTO save(ImagenDTO imagenDTO);
    Optional<ImagenDTO> findById(Long id);
    List<ImagenDTO> findAll();
    void delete(Long id);
    List<ImagenDTO> findByProductoId(Long productoId);
}