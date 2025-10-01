package com.dh.ctd.mp.proyecto_final.service.impl;

import com.dh.ctd.mp.proyecto_final.dto.RolDTO;
import com.dh.ctd.mp.proyecto_final.entity.Rol;
import com.dh.ctd.mp.proyecto_final.exception.DuplicateResourceException;
import com.dh.ctd.mp.proyecto_final.exception.ResourceNotFoundException;
import com.dh.ctd.mp.proyecto_final.mapper.RolMapper;
import com.dh.ctd.mp.proyecto_final.repository.RolRepository;
import com.dh.ctd.mp.proyecto_final.service.IRolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RolServiceImpl implements IRolService {

    @Autowired
    private RolRepository rolRepository;

    // 1️⃣ Guardar rol
    @Override
    public RolDTO save(RolDTO rolDTO) {
        // Verificar duplicado por nombre
        rolRepository.findByNombre(rolDTO.getNombre()).ifPresent(r ->
                { throw new DuplicateResourceException("Rol con nombre '" + rolDTO.getNombre() + "' ya existe"); }
        );

        Rol rol = RolMapper.toEntity(rolDTO);
        Rol saved = rolRepository.save(rol);
        return RolMapper.toDTO(saved);
    }

    // 2️⃣ Buscar por ID
    @Override
    public RolDTO findById(Long id) {
        return rolRepository.findById(id)
                .map(RolMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado con id: " + id));
    }

    // 3️⃣ Listar todos
    @Override
    public List<RolDTO> findAll() {
        return rolRepository.findAll()
                .stream()
                .map(RolMapper::toDTO)
                .collect(Collectors.toList());
    }

    // 4️⃣ Actualizar rol
    @Override
    public RolDTO update(Long id, RolDTO rolDTO) {
        Rol existente = rolRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado con id: " + id));

        // Verificar duplicado en nombre (excluyendo el propio)
        rolRepository.findByNombre(rolDTO.getNombre())
                .filter(r -> !r.getId().equals(id))
                .ifPresent(r -> { throw new DuplicateResourceException("Rol con nombre '" + rolDTO.getNombre() + "' ya existe"); });

        Rol rol = RolMapper.toEntity(rolDTO);
        rol.setId(id);
        Rol actualizado = rolRepository.save(rol);
        return RolMapper.toDTO(actualizado);
    }

    // 5️⃣ Eliminar rol
    @Override
    public void delete(Long id) {
        if (!rolRepository.existsById(id)) {
            throw new ResourceNotFoundException("Rol no encontrado con id: " + id);
        }
        rolRepository.deleteById(id);
    }

    // 6️⃣ Buscar por nombre
    @Override
    public RolDTO findByNombre(String nombre) {
        return rolRepository.findByNombre(nombre)
                .map(RolMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado con nombre: " + nombre));
    }
}
