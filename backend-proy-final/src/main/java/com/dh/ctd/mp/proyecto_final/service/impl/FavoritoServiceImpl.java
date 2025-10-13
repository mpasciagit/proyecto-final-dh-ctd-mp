package com.dh.ctd.mp.proyecto_final.service.impl;

import com.dh.ctd.mp.proyecto_final.dto.FavoritoDTO;
import com.dh.ctd.mp.proyecto_final.entity.Favorito;
import com.dh.ctd.mp.proyecto_final.entity.Producto;
import com.dh.ctd.mp.proyecto_final.entity.Usuario;
import com.dh.ctd.mp.proyecto_final.exception.DuplicateResourceException;
import com.dh.ctd.mp.proyecto_final.exception.ResourceNotFoundException;
import com.dh.ctd.mp.proyecto_final.mapper.FavoritoMapper;
import com.dh.ctd.mp.proyecto_final.repository.FavoritoRepository;
import com.dh.ctd.mp.proyecto_final.repository.ProductoRepository;
import com.dh.ctd.mp.proyecto_final.repository.UsuarioRepository;
import com.dh.ctd.mp.proyecto_final.service.IFavoritoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavoritoServiceImpl implements IFavoritoService {

    private final FavoritoRepository favoritoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;

    @Autowired
    public FavoritoServiceImpl(FavoritoRepository favoritoRepository,
                               UsuarioRepository usuarioRepository,
                               ProductoRepository productoRepository) {
        this.favoritoRepository = favoritoRepository;
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
    }

    // 🔹 Crear favorito
    @Override
    @Transactional
    public FavoritoDTO save(FavoritoDTO favoritoDTO) {
        Usuario usuario = usuarioRepository.findById(favoritoDTO.getUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + favoritoDTO.getUsuarioId()));

        Producto producto = productoRepository.findById(favoritoDTO.getProductoId())
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + favoritoDTO.getProductoId()));

        // Validar duplicado
        boolean exists = favoritoRepository.existsByUsuarioAndProducto(usuario, producto);
        if (exists) {
            throw new DuplicateResourceException("El usuario ya marcó este producto como favorito.");
        }

        Favorito favorito = FavoritoMapper.toEntity(favoritoDTO);
        favorito.setUsuario(usuario);
        favorito.setProducto(producto);

        if (favorito.getFechaCreacion() == null) {
            favorito.setFechaCreacion(LocalDateTime.now());
        }

        Favorito saved = favoritoRepository.save(favorito);
        return FavoritoMapper.toDTO(saved);
    }

    // 🔹 Buscar por ID
    @Override
    @Transactional(readOnly = true)
    public FavoritoDTO findById(Long id) {
        return favoritoRepository.findById(id)
                .map(FavoritoMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Favorito no encontrado con id: " + id));
    }

    // 🔹 Listar todos
    @Override
    @Transactional(readOnly = true)
    public List<FavoritoDTO> findAll() {
        return favoritoRepository.findAll()
                .stream()
                .map(FavoritoMapper::toDTO)
                .collect(Collectors.toList());
    }

    // 🔹 Eliminar
    @Override
    @Transactional
    public void delete(Long id) {
        if (!favoritoRepository.existsById(id)) {
            throw new ResourceNotFoundException("No se pudo eliminar. Favorito no encontrado con id: " + id);
        }
        favoritoRepository.deleteById(id);
    }

    // 🔹 Listar por usuario
    @Override
    @Transactional(readOnly = true)
    public List<FavoritoDTO> findByUsuarioId(Long usuarioId) {
        return favoritoRepository.findByUsuarioId(usuarioId)
                .stream()
                .map(FavoritoMapper::toDTO)
                .collect(Collectors.toList());
    }
}
