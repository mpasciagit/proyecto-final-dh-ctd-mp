package com.dh.ctd.mp.proyecto_final.service;

import com.dh.ctd.mp.proyecto_final.dto.CategoriaDTO;

import java.util.List;
import java.util.Optional;

public interface ICategoriaService {
    CategoriaDTO save(CategoriaDTO categoriaDTO);
    Optional<CategoriaDTO> findById(Long id);
    List<CategoriaDTO> findAll();
    CategoriaDTO update(CategoriaDTO categoriaDTO) throws Exception;
    void delete(Long id);
}