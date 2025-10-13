package com.dh.ctd.mp.proyecto_final.service;

import com.dh.ctd.mp.proyecto_final.dto.CategoriaDTO;
import java.util.List;

public interface ICategoriaService {

    CategoriaDTO save(CategoriaDTO dto);

    CategoriaDTO findById(Long id); // lanza ResourceNotFoundException si no existe

    List<CategoriaDTO> findAll();

    CategoriaDTO update(CategoriaDTO dto); // lanza ResourceNotFoundException o InvalidDataException

    void delete(Long id); // lanza ResourceNotFoundException si no existe
}
