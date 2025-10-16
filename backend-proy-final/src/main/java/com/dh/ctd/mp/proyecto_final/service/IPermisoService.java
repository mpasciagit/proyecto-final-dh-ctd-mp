package com.dh.ctd.mp.proyecto_final.service;

import com.dh.ctd.mp.proyecto_final.entity.Permiso;

import java.util.List;
import java.util.Optional;

public interface IPermisoService {
    Permiso guardar(Permiso permiso);
    Optional<Permiso> buscarPorId(Long id);
    Optional<Permiso> buscarPorNombre(String nombre);
    List<Permiso> listarTodos();
    void eliminarPorId(Long id);
}