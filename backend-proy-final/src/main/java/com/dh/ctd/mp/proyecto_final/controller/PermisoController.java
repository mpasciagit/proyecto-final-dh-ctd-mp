package com.dh.ctd.mp.proyecto_final.controller;

import com.dh.ctd.mp.proyecto_final.dto.PermisoDTO;
import com.dh.ctd.mp.proyecto_final.mapper.PermisoMapper;
import com.dh.ctd.mp.proyecto_final.service.IPermisoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/permisos")
public class PermisoController {

    private final IPermisoService permisoService;
    private final PermisoMapper permisoMapper;

    @Autowired
    public PermisoController(IPermisoService permisoService, PermisoMapper permisoMapper) {
        this.permisoService = permisoService;
        this.permisoMapper = permisoMapper;
    }

    @PreAuthorize("hasAuthority('PERMISO:CREAR')")
    @PostMapping
    public PermisoDTO crear(@RequestBody PermisoDTO permisoDTO) {
        return permisoMapper.toDTO(permisoService.crear(permisoMapper.toEntity(permisoDTO)));
    }

    @PreAuthorize("hasAuthority('PERMISO:BUSCAR')")
    @GetMapping("/{id}")
    public PermisoDTO buscarPorId(@PathVariable Long id) {
        return permisoService.buscarPorId(id)
                .map(permiso -> permisoMapper.toDTO(permiso))
                .orElseThrow(() -> new RuntimeException("Permiso no encontrado"));
    }

    @PreAuthorize("hasAuthority('PERMISO:LISTAR')")
    @GetMapping
    public List<PermisoDTO> listarTodos() {
        return permisoService.listarTodos()
                .stream()
                .map(permiso -> permisoMapper.toDTO(permiso))
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasAuthority('PERMISO:MODIFICAR')")
    @PutMapping("/{id}")
    public PermisoDTO modificarPorId(@PathVariable Long id, @RequestBody PermisoDTO permisoDTO) {
        return permisoService.buscarPorId(id)
                .map(permisoExistente -> {
                    permisoDTO.setId(id);
                    return permisoMapper.toDTO(permisoService.crear(permisoMapper.toEntity(permisoDTO)));
                })
                .orElseThrow(() -> new RuntimeException("Permiso no encontrado"));
    }

    @PreAuthorize("hasAuthority('PERMISO:ELIMINAR')")
    @DeleteMapping("/{id}")
    public void eliminarPorId(@PathVariable Long id) {
        permisoService.eliminarPorId(id);
    }
}