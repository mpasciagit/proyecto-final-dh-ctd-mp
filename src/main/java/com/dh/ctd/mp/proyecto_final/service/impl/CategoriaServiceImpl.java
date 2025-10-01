package com.dh.ctd.mp.proyecto_final.service.impl;

import com.dh.ctd.mp.proyecto_final.dto.CategoriaDTO;
import com.dh.ctd.mp.proyecto_final.entity.Categoria;
import com.dh.ctd.mp.proyecto_final.mapper.CategoriaMapper;
import com.dh.ctd.mp.proyecto_final.repository.CategoriaRepository;
import com.dh.ctd.mp.proyecto_final.service.ICategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoriaServiceImpl implements ICategoriaService {

    private final CategoriaRepository categoriaRepository;

    @Autowired
    public CategoriaServiceImpl(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @Override
    public CategoriaDTO save(CategoriaDTO categoriaDTO) {
        Categoria categoria = CategoriaMapper.toEntity(categoriaDTO);
        return CategoriaMapper.toDTO(categoriaRepository.save(categoria));
    }

    @Override
    public Optional<CategoriaDTO> findById(Long id) {
        return categoriaRepository.findById(id).map(CategoriaMapper::toDTO);
    }

    @Override
    public List<CategoriaDTO> findAll() {
        return categoriaRepository.findAll().stream()
                .map(CategoriaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CategoriaDTO update(CategoriaDTO categoriaDTO) throws Exception {
        if (categoriaRepository.existsById(categoriaDTO.getId())) {
            Categoria categoria = CategoriaMapper.toEntity(categoriaDTO);
            return CategoriaMapper.toDTO(categoriaRepository.save(categoria));
        } else {
            throw new Exception("No se pudo actualizar la categoría con id: " + categoriaDTO.getId());
        }
    }

    @Override
    public void delete(Long id) {
        categoriaRepository.deleteById(id);
    }
}