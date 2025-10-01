package com.dh.ctd.mp.proyecto_final.service.impl;

import com.dh.ctd.mp.proyecto_final.dto.ImagenDTO;
import com.dh.ctd.mp.proyecto_final.entity.Imagen;
import com.dh.ctd.mp.proyecto_final.entity.Producto;
import com.dh.ctd.mp.proyecto_final.exception.InvalidDataException;
import com.dh.ctd.mp.proyecto_final.exception.ResourceNotFoundException;
import com.dh.ctd.mp.proyecto_final.mapper.ImagenMapper;
import com.dh.ctd.mp.proyecto_final.repository.ImagenRepository;
import com.dh.ctd.mp.proyecto_final.repository.ProductoRepository;
import com.dh.ctd.mp.proyecto_final.service.IImagenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ImagenServiceImpl implements IImagenService {

    @Autowired
    private ImagenRepository imagenRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Override
    public ImagenDTO save(ImagenDTO imagenDTO) {
        if (imagenDTO.getUrl() == null || imagenDTO.getUrl().isBlank()) {
            throw new InvalidDataException("La URL de la imagen no puede estar vacía");
        }

        Producto producto = null;
        if (imagenDTO.getProductoId() != null) {
            producto = productoRepository.findById(imagenDTO.getProductoId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Producto no encontrado con id: " + imagenDTO.getProductoId()));
        }

        Imagen imagen = ImagenMapper.toEntity(imagenDTO, producto);
        Imagen saved = imagenRepository.save(imagen);
        return ImagenMapper.toDTO(saved);
    }

    @Override
    public ImagenDTO findById(Long id) {
        return imagenRepository.findById(id)
                .map(ImagenMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Imagen no encontrada con id: " + id));
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
        if (!imagenRepository.existsById(id)) {
            throw new ResourceNotFoundException("No se puede eliminar, la imagen con id " + id + " no existe");
        }
        imagenRepository.deleteById(id);
    }

    @Override
    public List<ImagenDTO> findByProductoId(Long productoId) {
        if (!productoRepository.existsById(productoId)) {
            throw new ResourceNotFoundException("Producto no encontrado con id: " + productoId);
        }
        return imagenRepository.findByProductoId(productoId)
                .stream()
                .map(ImagenMapper::toDTO)
                .collect(Collectors.toList());
    }
}
