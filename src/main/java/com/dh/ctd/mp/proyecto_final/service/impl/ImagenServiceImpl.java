package com.dh.ctd.mp.proyecto_final.service.impl;

import com.dh.ctd.mp.proyecto_final.dto.ImagenDTO;
import com.dh.ctd.mp.proyecto_final.entity.Imagen;
import com.dh.ctd.mp.proyecto_final.entity.Producto;
import com.dh.ctd.mp.proyecto_final.mapper.ImagenMapper;
import com.dh.ctd.mp.proyecto_final.repository.ImagenRepository;
import com.dh.ctd.mp.proyecto_final.repository.ProductoRepository;
import com.dh.ctd.mp.proyecto_final.service.IImagenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ImagenServiceImpl implements IImagenService {

    @Autowired
    private ImagenRepository imagenRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Override
    public ImagenDTO save(ImagenDTO imagenDTO) {
        Producto producto = null;
        if (imagenDTO.getProductoId() != null) {
            producto = productoRepository.findById(imagenDTO.getProductoId()).orElse(null);
        }
        Imagen imagen = ImagenMapper.toEntity(imagenDTO, producto);
        Imagen saved = imagenRepository.save(imagen);
        return ImagenMapper.toDTO(saved);
    }

    @Override
    public Optional<ImagenDTO> findById(Long id) {
        return imagenRepository.findById(id)
                .map(ImagenMapper::toDTO);
    }

    @Override
    public List<ImagenDTO> findAll() {
        return imagenRepository.findAll()
                .stream()
                .map(ImagenMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(Long id) {
        imagenRepository.deleteById(id);
    }

    @Override
    public List<ImagenDTO> findByProductoId(Long productoId) {
        return imagenRepository.findByProductoId(productoId)
                .stream()
                .map(ImagenMapper::toDTO)
                .collect(Collectors.toList());
    }
}
