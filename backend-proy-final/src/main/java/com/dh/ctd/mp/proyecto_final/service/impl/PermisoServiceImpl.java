package com.dh.ctd.mp.proyecto_final.service.impl;

import com.dh.ctd.mp.proyecto_final.entity.Permiso;
import com.dh.ctd.mp.proyecto_final.repository.PermisoRepository;
import com.dh.ctd.mp.proyecto_final.service.IPermisoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PermisoServiceImpl implements IPermisoService {

    private final PermisoRepository permisoRepository;

    @Autowired
    public PermisoServiceImpl(PermisoRepository permisoRepository) {
        this.permisoRepository = permisoRepository;
    }

    @Override
    public Permiso guardar(Permiso permiso) {
        return permisoRepository.save(permiso);
    }

    @Override
    public Optional<Permiso> buscarPorId(Long id) {
        return permisoRepository.findById(id);
    }

    @Override
    public Optional<Permiso> buscarPorNombre(String nombre) {
        return permisoRepository.findByNombre(nombre);
    }

    @Override
    public List<Permiso> listarTodos() {
        return permisoRepository.findAll();
    }

    @Override
    public void eliminarPorId(Long id) {
        permisoRepository.deleteById(id);
    }
}
