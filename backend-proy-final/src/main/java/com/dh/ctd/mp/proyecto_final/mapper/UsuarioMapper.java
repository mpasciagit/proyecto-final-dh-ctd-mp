package com.dh.ctd.mp.proyecto_final.mapper;

import com.dh.ctd.mp.proyecto_final.dto.UsuarioDTO;
import com.dh.ctd.mp.proyecto_final.entity.Rol;
import com.dh.ctd.mp.proyecto_final.entity.Usuario;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper {

    // Convierte Usuario -> UsuarioDTO
    public UsuarioDTO toDTO(Usuario usuario) {
        if (usuario == null) return null;

        return UsuarioDTO.builder()
                .id(usuario.getId())
                .email(usuario.getEmail())
                .nombre(usuario.getNombre())
                .apellido(usuario.getApellido())
                .password(usuario.getPassword())
                .rol(
                        UsuarioDTO.RolDTO.builder()
                                .id(usuario.getRol().getId())
                                .nombre(usuario.getRol().getNombre())
                                .build()
                )
                .build();
    }

    // Convierte UsuarioDTO -> Usuario
    public Usuario toEntity(UsuarioDTO usuarioDTO) {
        if (usuarioDTO == null) return null;

        Usuario usuario = new Usuario();
        usuario.setId(usuarioDTO.getId());
        usuario.setEmail(usuarioDTO.getEmail());
        usuario.setNombre(usuarioDTO.getNombre());
        usuario.setApellido(usuarioDTO.getApellido());
        usuario.setPassword(usuarioDTO.getPassword());

        if (usuarioDTO.getRol() != null) {
            Rol rol = new Rol();
            rol.setId(usuarioDTO.getRol().getId());
            rol.setNombre(usuarioDTO.getRol().getNombre());
            usuario.setRol(rol);
        }

        return usuario;
    }
}

