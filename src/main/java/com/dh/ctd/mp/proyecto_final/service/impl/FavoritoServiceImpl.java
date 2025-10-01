package com.dh.ctd.mp.proyecto_final.service.impl;

import com.dh.ctd.mp.proyecto_final.dto.FavoritoDTO;
import com.dh.ctd.mp.proyecto_final.entity.Favorito;
import com.dh.ctd.mp.proyecto_final.entity.Producto;
import com.dh.ctd.mp.proyecto_final.entity.Usuario;
import com.dh.ctd.mp.proyecto_final.mapper.FavoritoMapper;
import com.dh.ctd.mp.proyecto_final.repository.FavoritoRepository;
import com.dh.ctd.mp.proyecto_final.repository.ProductoRepository;
import com.dh.ctd.mp.proyecto_final.repository.UsuarioRepository;
import com.dh.ctd.mp.proyecto_final.service.IFavoritoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FavoritoServiceImpl implements IFavoritoService {

    @Autowired
    private FavoritoRepository favoritoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Override
    public FavoritoDTO save(FavoritoDTO favoritoDTO) {
        Favorito favorito = FavoritoMapper.toEntity(favoritoDTO);

        if (favoritoDTO.getUsuarioId() != null) {
            Optional<Usuario> usuario = usuarioRepository.findById(favoritoDTO.getUsuarioId());
            usuario.ifPresent(favorito::setUsuario);
        }
        if (favoritoDTO.getProductoId() != null) {
            Optional<Producto> producto = productoRepository.findById(favoritoDTO.getProductoId());
            producto.ifPresent(favorito::setProducto);
        }

        // Asignar fecha de creación si está nula
        if (favorito.getFechaCreacion() == null) {
            favorito.setFechaCreacion(LocalDateTime.now());
        }

        Favorito saved = favoritoRepository.save(favorito);
        return FavoritoMapper.toDTO(saved);
    }

    @Override
    public Optional<FavoritoDTO> findById(Long id) {
        return favoritoRepository.findById(id)
                .map(FavoritoMapper::toDTO);
    }

    @Override
    public List<FavoritoDTO> findAll() {
        return favoritoRepository.findAll()
                .stream()
                .map(FavoritoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(Long id) {
        favoritoRepository.deleteById(id);
    }

    @Override
    public List<FavoritoDTO> findByUsuarioId(Long usuarioId) {
        return favoritoRepository.findByUsuarioId(usuarioId)
                .stream()
                .map(FavoritoMapper::toDTO)
                .collect(Collectors.toList());
    }
}