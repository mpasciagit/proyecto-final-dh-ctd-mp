package com.dh.ctd.mp.proyecto_final.service.impl;

import com.dh.ctd.mp.proyecto_final.dto.UsuarioDTO;
import com.dh.ctd.mp.proyecto_final.entity.Usuario;
import com.dh.ctd.mp.proyecto_final.repository.RolRepository;
import com.dh.ctd.mp.proyecto_final.repository.UsuarioRepository;
import com.dh.ctd.mp.proyecto_final.service.IUsuarioService;
import com.dh.ctd.mp.proyecto_final.mapper.UsuarioMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioServiceImpl implements IUsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioMapper usuarioMapper;

    @Autowired
    private RolRepository rolRepository;

    // 1️⃣ Guardar usuario
    @Override
    public UsuarioDTO save(UsuarioDTO usuarioDTO) {
        Usuario usuario = usuarioMapper.toEntity(usuarioDTO);

        // Resolver el rol desde la BD
        if (usuarioDTO.getRol() != null && usuarioDTO.getRol().getId() != null) {
            var rol = rolRepository.findById(usuarioDTO.getRol().getId())
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado con id " + usuarioDTO.getRol().getId()));
            usuario.setRol(rol);
        }

        Usuario saved = usuarioRepository.save(usuario);
        return usuarioMapper.toDTO(saved);
    }

    // 2️⃣ Buscar por ID
    @Override
    public Optional<UsuarioDTO> findById(Long id) {
        return usuarioRepository.findById(id)
                .map(usuarioMapper::toDTO);
    }

    // 3️⃣ Listar todos
    @Override
    public List<UsuarioDTO> findAll() {
        return usuarioRepository.findAll()
                .stream()
                .map(usuarioMapper::toDTO)
                .collect(Collectors.toList());
    }

    // 4️⃣ Actualizar usuario
    @Override
    public UsuarioDTO update(UsuarioDTO usuarioDTO) throws Exception {
        if (usuarioDTO.getId() == null) {
            throw new Exception("El id del usuario no puede ser nulo");
        }

        Optional<Usuario> existente = usuarioRepository.findById(usuarioDTO.getId());
        if (existente.isEmpty()) {
            throw new Exception("Usuario no encontrado con id: " + usuarioDTO.getId());
        }

        Usuario usuario = usuarioMapper.toEntity(usuarioDTO);
        Usuario actualizado = usuarioRepository.save(usuario);
        return usuarioMapper.toDTO(actualizado);
    }


    // 5️⃣ Eliminar
    @Override
    public void delete(Long id) {
        usuarioRepository.deleteById(id);
    }

    // 6️⃣ Buscar por email
    @Override
    public Optional<UsuarioDTO> findByEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .map(usuarioMapper::toDTO);
    }

    // 7️⃣ Buscar por rol
    @Override
    public List<UsuarioDTO> findByRol(String nombreRol) {
        return usuarioRepository.findByRolNombre(nombreRol)
                .stream()
                .map(usuarioMapper::toDTO)
                .collect(Collectors.toList());
    }

    // 8️⃣ Buscar por nombre
    @Override
    public List<UsuarioDTO> findByNombre(String nombre) {
        return usuarioRepository.findByNombreContainingIgnoreCase(nombre)
                .stream()
                .map(usuarioMapper::toDTO)
                .collect(Collectors.toList());
    }
}

