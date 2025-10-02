package com.dh.ctd.mp.proyecto_final.controller;

import com.dh.ctd.mp.proyecto_final.dto.ProductoDTO;
import com.dh.ctd.mp.proyecto_final.service.IProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final IProductoService productoService;

    @Autowired
    public ProductoController(IProductoService productoService) {
        this.productoService = productoService;
    }

    // ----------------- CREAR -----------------
    @PostMapping
    public ResponseEntity<ProductoDTO> crearProducto(@RequestBody ProductoDTO productoDTO) {
        ProductoDTO nuevoProducto = productoService.save(productoDTO);
        return ResponseEntity.ok(nuevoProducto);
    }

    // ----------------- OBTENER POR ID -----------------
    @GetMapping("/{id}")
    public ResponseEntity<ProductoDTO> obtenerProductoPorId(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.findById(id));
    }

    // ----------------- LISTAR TODOS -----------------
    @GetMapping
    public ResponseEntity<List<ProductoDTO>> listarTodos() {
        return ResponseEntity.ok(productoService.findAll());
    }

    // ----------------- ACTUALIZAR -----------------
    @PutMapping("/{id}")
    public ResponseEntity<ProductoDTO> actualizarProducto(@PathVariable Long id,
                                                          @RequestBody ProductoDTO productoDTO) {
        ProductoDTO actualizado = productoService.update(id, productoDTO);
        return ResponseEntity.ok(actualizado);
    }

    // ----------------- ELIMINAR -----------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        productoService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ----------------- BUSCAR POR NOMBRE -----------------
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<List<ProductoDTO>> buscarPorNombre(@PathVariable String nombre) {
        return ResponseEntity.ok(productoService.findByNombre(nombre));
    }

    // ----------------- BUSCAR POR CATEGORÍA -----------------
    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<ProductoDTO>> buscarPorCategoria(@PathVariable Long categoriaId) {
        return ResponseEntity.ok(productoService.findByCategoria(categoriaId));
    }

    // ----------------- LISTAR RESERVABLES -----------------
    @GetMapping("/reservables")
    public ResponseEntity<List<ProductoDTO>> listarReservables() {
        return ResponseEntity.ok(productoService.findReservables());
    }

    // ----------------- LISTAR CON STOCK -----------------
    @GetMapping("/disponibles")
    public ResponseEntity<List<ProductoDTO>> listarConStockDisponible() {
        return ResponseEntity.ok(productoService.findConStockDisponible());
    }

    // ----------------- VERIFICAR DISPONIBILIDAD -----------------
    @GetMapping("/{id}/disponibilidad/{cantidad}")
    public ResponseEntity<Boolean> verificarDisponibilidad(@PathVariable Long id,
                                                           @PathVariable int cantidad) {
        boolean disponible = productoService.verificarDisponibilidad(id, cantidad);
        return ResponseEntity.ok(disponible);
    }
}
