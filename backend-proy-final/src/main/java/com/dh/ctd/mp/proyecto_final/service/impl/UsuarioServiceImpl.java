package com.dh.ctd.mp.proyecto_final.service.impl;

import com.dh.ctd.mp.proyecto_final.dto.UsuarioDTO;
import com.dh.ctd.mp.proyecto_final.entity.Usuario;
import com.dh.ctd.mp.proyecto_final.exception.DuplicateResourceException;
import com.dh.ctd.mp.proyecto_final.exception.ResourceNotFoundException;
import com.dh.ctd.mp.proyecto_final.mapper.UsuarioMapper;
import com.dh.ctd.mp.proyecto_final.repository.RolRepository;
import com.dh.ctd.mp.proyecto_final.repository.UsuarioRepository;
import com.dh.ctd.mp.proyecto_final.service.IUsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioServiceImpl implements IUsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioMapper usuarioMapper;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 1️⃣ Guardar usuario
    @Override
    public UsuarioDTO save(UsuarioDTO usuarioDTO) {
        // Verificar email duplicado
        if (usuarioRepository.existsByEmail(usuarioDTO.getEmail())) {
            throw new DuplicateResourceException("Email ya registrado: " + usuarioDTO.getEmail());
        }

        Usuario usuario = usuarioMapper.toEntity(usuarioDTO);

        // Resolver el rol desde la BD
        if (usuarioDTO.getRol() != null && usuarioDTO.getRol().getId() != null) {
            var rol = rolRepository.findById(usuarioDTO.getRol().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado con id: " + usuarioDTO.getRol().getId()));
            usuario.setRol(rol);
        }

        Usuario saved = usuarioRepository.save(usuario);
        return usuarioMapper.toDTO(saved);
    }

    // 2️⃣ Buscar por ID
    @Override
    public UsuarioDTO findById(Long id) {
        return usuarioRepository.findById(id)
                .map(usuarioMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));
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
    public UsuarioDTO update(UsuarioDTO usuarioDTO) {
        if (usuarioDTO.getId() == null) {
            throw new IllegalArgumentException("El id del usuario no puede ser nulo");
        }

        Usuario existente = usuarioRepository.findById(usuarioDTO.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + usuarioDTO.getId()));

        // Verificar email duplicado si se cambia
        if (!existente.getEmail().equals(usuarioDTO.getEmail()) &&
                usuarioRepository.existsByEmail(usuarioDTO.getEmail())) {
            throw new DuplicateResourceException("Email ya registrado: " + usuarioDTO.getEmail());
        }

        Usuario usuario = usuarioMapper.toEntity(usuarioDTO);

        // Conservar el password actual si no está presente en el DTO
        usuario.setPassword(existente.getPassword());

        usuario.setId(existente.getId());
        Usuario actualizado = usuarioRepository.save(usuario);
        return usuarioMapper.toDTO(actualizado);
    }

    // 5️⃣ Eliminar
    @Override
    public void delete(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuario no encontrado con id: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    // 6️⃣ Buscar por email
    @Override
    public UsuarioDTO findByEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .map(usuarioMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con email: " + email));
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

    // 9️⃣ Resetear password (flujo normal o usuario)
    @Override
    public void resetPassword(Long userId, String newPassword) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + userId));

        usuario.setPassword(passwordEncoder.encode(newPassword));
        usuarioRepository.save(usuario);
    }

    // 🔟 Reset administrativo (genera una temporal)
    @Override
    public void resetPasswordByAdmin(Long userId) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + userId));

        String tempPassword = generarPasswordTemporal();
        usuario.setPassword(passwordEncoder.encode(tempPassword));
        usuarioRepository.save(usuario);

        // ⚙️ Podés agregar: envío de email, logging o auditoría
        System.out.println("🔐 Password temporal generada para usuario " + usuario.getEmail() + ": " + tempPassword);
    }

    // Utilidad privada para generar passwords temporales seguras
    private String generarPasswordTemporal() {
        final String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 10; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
