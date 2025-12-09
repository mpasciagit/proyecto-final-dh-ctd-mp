package com.dh.ctd.mp.proyecto_final.service.impl;

import com.dh.ctd.mp.proyecto_final.dto.PermisosPorRolDTO;
import com.dh.ctd.mp.proyecto_final.dto.RolPermisoDTO;
import com.dh.ctd.mp.proyecto_final.entity.Permiso;
import com.dh.ctd.mp.proyecto_final.entity.Rol;
import com.dh.ctd.mp.proyecto_final.entity.RolPermiso;
import com.dh.ctd.mp.proyecto_final.mapper.RolPermisoMapper;
import com.dh.ctd.mp.proyecto_final.mapper.PermisosPorRolMapper;
import com.dh.ctd.mp.proyecto_final.repository.PermisoRepository;
import com.dh.ctd.mp.proyecto_final.repository.RolPermisoRepository;
import com.dh.ctd.mp.proyecto_final.repository.RolRepository;
import com.dh.ctd.mp.proyecto_final.service.IRolPermisoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RolPermisoServiceImpl implements IRolPermisoService {

    @Autowired
    private RolPermisoRepository rolPermisoRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PermisoRepository permisoRepository;

    @Autowired
    private RolPermisoMapper rolPermisoMapper;

    @Autowired
    private PermisosPorRolMapper permisosPorRolMapper;

    @Override
    public List<RolPermisoDTO> listarTodos() {
        return rolPermisoRepository.findAll()
                .stream()
                .map(rolPermisoMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public PermisosPorRolDTO obtenerRolConPermisos(Long rolId) {
        Rol rol = rolRepository.findById(rolId)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado con ID: " + rolId));

        List<Permiso> permisos = permisoRepository.findAllByRolesId(rolId);

        PermisosPorRolDTO permisosPorRolDTO = new PermisosPorRolDTO();
        permisosPorRolDTO.setRol(permisosPorRolMapper.toRolDto(rol));
        permisosPorRolDTO.setPermisos(permisos.stream()
                .map(permisosPorRolMapper::toPermisoDto)
                .collect(Collectors.toList()));

        return permisosPorRolDTO;
    }

    @Override
    public boolean tienePermisoAdmin(Long rolId) {
        return rolPermisoRepository.existsByRol_IdAndPermiso_Nombre(rolId, "ADMIN");
    }

    @Override
    @Transactional
    public RolPermisoDTO asignarPermiso(RolPermisoDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Payload vacío");
        }

        Long rolId = dto.getRolId();
        Long permisoId = dto.getPermisoId();

        if (rolId == null || permisoId == null) {
            throw new IllegalArgumentException("rolId y permisoId son requeridos");
        }

        Rol rol = rolRepository.findById(rolId)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado con ID: " + rolId));

        Permiso permiso = permisoRepository.findById(permisoId)
                .orElseThrow(() -> new RuntimeException("Permiso no encontrado con ID: " + permisoId));

        if (rolPermisoRepository.existsByRolIdAndPermisoId(rolId, permisoId)) {
            throw new IllegalStateException("La relación rol-permiso ya existe");
        }

        RolPermiso rp = new RolPermiso();
        rp.setRol(rol);
        rp.setPermiso(permiso);

        return rolPermisoMapper.toDto(rolPermisoRepository.save(rp));
    }

    @Override
    @Transactional
    public void quitarPermiso(Long rolId, Long permisoId) {
        if (rolId == null || permisoId == null) {
            throw new IllegalArgumentException("rolId y permisoId son requeridos");
        }

        boolean exists = rolPermisoRepository.existsByRolIdAndPermisoId(rolId, permisoId);
        if (!exists) {
            throw new RuntimeException("Relación rol-permiso no encontrada para eliminación");
        }

        rolPermisoRepository.deleteByRolIdAndPermisoId(rolId, permisoId);
    }
}