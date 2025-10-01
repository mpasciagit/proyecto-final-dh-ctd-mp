package com.dh.ctd.mp.proyecto_final.service;

import com.dh.ctd.mp.proyecto_final.dto.RolDTO;

import java.util.List;
import java.util.Optional;

public interface IRolService {

    RolDTO save(RolDTO rolDTO);

    Optional<RolDTO> findById(Long id);

    List<RolDTO> findAll();

    RolDTO update(Long id, RolDTO rolDTO) throws Exception;

    void delete(Long id);

    Optional<RolDTO> findByNombre(String nombre);
}
