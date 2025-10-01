package com.dh.ctd.mp.proyecto_final.service.impl;

import com.dh.ctd.mp.proyecto_final.dto.RolDTO;
import com.dh.ctd.mp.proyecto_final.entity.Rol;
import com.dh.ctd.mp.proyecto_final.repository.RolRepository;
import com.dh.ctd.mp.proyecto_final.service.IRolService;
import com.dh.ctd.mp.proyecto_final.mapper.RolMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RolServiceImpl implements IRolService {

    @Autowired
    private RolRepository rolRepository;

    // 1️⃣ Guardar rol
    @Override
    public RolDTO save(RolDTO rolDTO) {
        Rol rol = RolMapper.toEntity(rolDTO);
        Rol saved = rolRepository.save(rol);
        return RolMapper.toDTO(saved);
    }

    // 2️⃣ Buscar por ID
    @Override
    public Optional<RolDTO> findById(Long id) {
        return rolRepository.findById(id)
                .map(RolMapper::toDTO);
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
    public RolDTO update(Long id, RolDTO rolDTO) throws Exception {
        Optional<Rol> existente = rolRepository.findById(id);
        if (existente.isEmpty()) {
            throw new Exception("Rol no encontrado con id: " + id);
        }
        Rol rol = RolMapper.toEntity(rolDTO);
        rol.setId(id); // aseguramos mantener el ID
        Rol actualizado = rolRepository.save(rol);
        return RolMapper.toDTO(actualizado);
    }

    // 5️⃣ Eliminar rol
    @Override
    public void delete(Long id) {
        rolRepository.deleteById(id);
    }

    // 6️⃣ Buscar por nombre
    @Override
    public Optional<RolDTO> findByNombre(String nombre) {
        return rolRepository.findByNombre(nombre)
                .map(RolMapper::toDTO);
    }
}


