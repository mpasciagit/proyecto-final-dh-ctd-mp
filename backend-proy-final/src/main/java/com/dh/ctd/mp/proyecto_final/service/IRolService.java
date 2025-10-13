package com.dh.ctd.mp.proyecto_final.service;

import com.dh.ctd.mp.proyecto_final.dto.RolDTO;
import java.util.List;

public interface IRolService {

    RolDTO save(RolDTO rolDTO);

    RolDTO findById(Long id);

    List<RolDTO> findAll();

    RolDTO update(Long id, RolDTO rolDTO);

    void delete(Long id);

    RolDTO findByNombre(String nombre);
}
