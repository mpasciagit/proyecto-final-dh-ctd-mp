package com.dh.ctd.mp.proyecto_final.service.impl;

import com.dh.ctd.mp.proyecto_final.dto.CategoriaDTO;
import com.dh.ctd.mp.proyecto_final.entity.Categoria;
import com.dh.ctd.mp.proyecto_final.exception.DuplicateResourceException;
import com.dh.ctd.mp.proyecto_final.exception.InvalidDataException;
import com.dh.ctd.mp.proyecto_final.exception.ResourceNotFoundException;
import com.dh.ctd.mp.proyecto_final.mapper.CategoriaMapper;
import com.dh.ctd.mp.proyecto_final.repository.CategoriaRepository;
import com.dh.ctd.mp.proyecto_final.service.ICategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoriaServiceImpl implements ICategoriaService {

    private final CategoriaRepository categoriaRepository;

    @Autowired
    public CategoriaServiceImpl(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @Override
    public CategoriaDTO save(CategoriaDTO dto) {
        if (dto.getNombre() == null || dto.getNombre().isBlank()) {
            throw new InvalidDataException("El nombre de la categoría es obligatorio.");
        }
        if (categoriaRepository.existsByNombre(dto.getNombre())) {
            throw new DuplicateResourceException("Ya existe una categoría con el nombre: " + dto.getNombre());
        }
        Categoria categoria = CategoriaMapper.toEntity(dto);
        Categoria saved = categoriaRepository.save(categoria);
        return CategoriaMapper.toDTO(saved);
    }

    @Override
    public CategoriaDTO findById(Long id) {
        return categoriaRepository.findById(id)
                .map(CategoriaMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría con id " + id + " no encontrada"));
    }

    @Override
    public List<CategoriaDTO> findAll() {
        return categoriaRepository.findAll().stream()
                .map(CategoriaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CategoriaDTO update(CategoriaDTO dto) {
        Categoria entity = categoriaRepository.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría con id " + dto.getId() + " no encontrada"));

        if (dto.getNombre() == null || dto.getNombre().isBlank()) {
            throw new InvalidDataException("El nombre de la categoría es obligatorio.");
        }
        if (categoriaRepository.existsByNombre(dto.getNombre())
                && !entity.getNombre().equals(dto.getNombre())) {
            throw new DuplicateResourceException("Ya existe otra categoría con el nombre: " + dto.getNombre());
        }

        entity.setNombre(dto.getNombre());
        entity.setDescripcion(dto.getDescripcion());
        Categoria updated = categoriaRepository.save(entity);
        return CategoriaMapper.toDTO(updated);
    }

    @Override
    public void delete(Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new ResourceNotFoundException("No se puede eliminar. Categoría con id " + id + " no encontrada");
        }
        categoriaRepository.deleteById(id);
    }
}
