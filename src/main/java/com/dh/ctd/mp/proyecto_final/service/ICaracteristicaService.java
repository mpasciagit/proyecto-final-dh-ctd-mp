package com.dh.ctd.mp.proyecto_final.service;

import com.dh.ctd.mp.proyecto_final.dto.CaracteristicaDTO;
import java.util.List;
import java.util.Optional;

public interface ICaracteristicaService {
    CaracteristicaDTO save(CaracteristicaDTO dto);
    Optional<CaracteristicaDTO> findById(Long id);
    List<CaracteristicaDTO> findAll();
    void delete(Long id);
    Optional<CaracteristicaDTO> update(CaracteristicaDTO dto);
}