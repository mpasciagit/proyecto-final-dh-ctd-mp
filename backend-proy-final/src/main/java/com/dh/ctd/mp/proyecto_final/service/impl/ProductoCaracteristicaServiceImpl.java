package com.dh.ctd.mp.proyecto_final.service.impl;

import com.dh.ctd.mp.proyecto_final.dto.ProductoCaracteristicaDTO;
import com.dh.ctd.mp.proyecto_final.entity.ProductoCaracteristica;
import com.dh.ctd.mp.proyecto_final.mapper.ProductoCaracteristicaMapper;
import com.dh.ctd.mp.proyecto_final.repository.ProductoCaracteristicaRepository;
import com.dh.ctd.mp.proyecto_final.service.IProductoCaracteristicaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductoCaracteristicaServiceImpl implements IProductoCaracteristicaService {

    @Autowired
    private ProductoCaracteristicaRepository repository;

    @Autowired
    private ProductoCaracteristicaMapper mapper;

    @Override
    public List<ProductoCaracteristicaDTO> findAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ProductoCaracteristicaDTO findById(Long id) {
        ProductoCaracteristica entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("ProductoCaracteristica no encontrado"));
        return mapper.toDto(entity);
    }

    @Override
    public ProductoCaracteristicaDTO save(ProductoCaracteristicaDTO dto) {
        ProductoCaracteristica entity = mapper.toEntity(dto);
        ProductoCaracteristica savedEntity = repository.save(entity);
        return mapper.toDto(savedEntity);
    }

    @Override
    public ProductoCaracteristicaDTO update(ProductoCaracteristicaDTO dto) {
        if (!repository.existsById(dto.getId())) {
            throw new RuntimeException("ProductoCaracteristica no encontrado");
        }
        ProductoCaracteristica entity = mapper.toEntity(dto);
        ProductoCaracteristica updatedEntity = repository.save(entity);
        return mapper.toDto(updatedEntity);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("ProductoCaracteristica no encontrado");
        }
        repository.deleteById(id);
    }
}
