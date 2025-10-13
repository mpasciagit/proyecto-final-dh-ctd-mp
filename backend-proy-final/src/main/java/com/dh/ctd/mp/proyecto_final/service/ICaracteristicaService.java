package com.dh.ctd.mp.proyecto_final.service;

import com.dh.ctd.mp.proyecto_final.dto.CaracteristicaDTO;
import java.util.List;

public interface ICaracteristicaService {

    CaracteristicaDTO save(CaracteristicaDTO dto);

    CaracteristicaDTO findById(Long id); // ahora lanza ResourceNotFoundException si no existe

    List<CaracteristicaDTO> findAll();

    CaracteristicaDTO update(CaracteristicaDTO dto); // lanza ResourceNotFoundException o InvalidDataException

    void delete(Long id); // lanza ResourceNotFoundException si no existe
}
