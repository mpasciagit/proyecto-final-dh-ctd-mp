package com.dh.ctd.mp.proyecto_final.service.impl;

import com.dh.ctd.mp.proyecto_final.dto.CaracteristicaDTO;
import com.dh.ctd.mp.proyecto_final.entity.Caracteristica;
import com.dh.ctd.mp.proyecto_final.exception.InvalidDataException;
import com.dh.ctd.mp.proyecto_final.exception.ResourceNotFoundException;
import com.dh.ctd.mp.proyecto_final.mapper.CaracteristicaMapper;
import com.dh.ctd.mp.proyecto_final.repository.CaracteristicaRepository;
import com.dh.ctd.mp.proyecto_final.service.ICaracteristicaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CaracteristicaServiceImpl implements ICaracteristicaService {

    @Autowired
    private CaracteristicaRepository caracteristicaRepository;

    @Override
    public CaracteristicaDTO save(CaracteristicaDTO dto) {
        if (dto.getNombre() == null || dto.getNombre().isBlank()) {
            throw new InvalidDataException("El nombre de la característica es obligatorio.");
        }
        Caracteristica entity = CaracteristicaMapper.toEntity(dto);
        Caracteristica saved = caracteristicaRepository.save(entity);
        return CaracteristicaMapper.toDTO(saved);
    }

    @Override
    public CaracteristicaDTO findById(Long id) {
        return caracteristicaRepository.findById(id)
                .map(CaracteristicaMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Característica con id " + id + " no encontrada"));
    }

    @Override
    public List<CaracteristicaDTO> findAll() {
        return caracteristicaRepository.findAll().stream()
                .map(CaracteristicaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(Long id) {
        if (!caracteristicaRepository.existsById(id)) {
            throw new ResourceNotFoundException("No se puede eliminar. Característica con id " + id + " no encontrada");
        }
        caracteristicaRepository.deleteById(id);
    }

    @Override
    public CaracteristicaDTO update(CaracteristicaDTO dto) {
        Caracteristica entity = caracteristicaRepository.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Característica con id " + dto.getId() + " no encontrada"));

        if (dto.getNombre() == null || dto.getNombre().isBlank()) {
            throw new InvalidDataException("El nombre de la característica es obligatorio.");
        }

        entity.setNombre(dto.getNombre());
        entity.setDescripcion(dto.getDescripcion());
        entity.setIconoUrl(dto.getIconoUrl());
        Caracteristica actualizada = caracteristicaRepository.save(entity);
        return CaracteristicaMapper.toDTO(actualizada);
    }
}
