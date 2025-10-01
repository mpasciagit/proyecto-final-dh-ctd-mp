package com.dh.ctd.mp.proyecto_final.service.impl;

import com.dh.ctd.mp.proyecto_final.dto.ProductoDTO;
import com.dh.ctd.mp.proyecto_final.entity.Caracteristica;
import com.dh.ctd.mp.proyecto_final.entity.Producto;
import com.dh.ctd.mp.proyecto_final.entity.ProductoCaracteristica;
import com.dh.ctd.mp.proyecto_final.mapper.ProductoMapper;
import com.dh.ctd.mp.proyecto_final.repository.CaracteristicaRepository;
import com.dh.ctd.mp.proyecto_final.repository.ProductoRepository;
import com.dh.ctd.mp.proyecto_final.service.IProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Set;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductoServiceImpl implements IProductoService {

    private final ProductoRepository productoRepository;
    private final CaracteristicaRepository caracteristicaRepository;

    @Autowired
    public ProductoServiceImpl(ProductoRepository productoRepository,
                               CaracteristicaRepository caracteristicaRepository) {
        this.productoRepository = productoRepository;
        this.caracteristicaRepository = caracteristicaRepository;
    }

    // 1️⃣ Guardar producto
    @Override
    public ProductoDTO save(ProductoDTO productoDTO) {
        Producto producto = ProductoMapper.toEntity(productoDTO);

        // Resolver las características existentes en la BD
        Set<ProductoCaracteristica> relaciones = producto.getProductoCaracteristicas().stream()
                .map(pc -> {
                    Caracteristica caracteristica = caracteristicaRepository.findById(pc.getCaracteristica().getId())
                            .orElseThrow(() -> new RuntimeException(
                                    "Característica no encontrada: " + pc.getCaracteristica().getId()
                            ));
                    pc.setCaracteristica(caracteristica);
                    pc.setProducto(producto);
                    return pc;
                })
                .collect(Collectors.toSet());

        producto.setProductoCaracteristicas(relaciones);

        Producto saved = productoRepository.save(producto);
        return ProductoMapper.toDTO(saved);
    }

    // 2️⃣ Buscar por ID
    @Override
    public Optional<ProductoDTO> findById(Long id) {
        return productoRepository.findById(id)
                .map(ProductoMapper::toDTO);
    }

    // 3️⃣ Listar todos
    @Override
    public List<ProductoDTO> findAll() {
        return productoRepository.findAll()
                .stream()
                .map(ProductoMapper::toDTO)
                .collect(Collectors.toList());
    }

    // 4️⃣ Actualizar
    @Override
    public ProductoDTO update(Long id, ProductoDTO productoDTO) throws Exception {
        if (productoRepository.existsById(id)) {
            Producto producto = ProductoMapper.toEntity(productoDTO);
            producto.setId(id); // aseguramos mantener el ID
            Producto actualizado = productoRepository.save(producto);
            return ProductoMapper.toDTO(actualizado);
        } else {
            throw new Exception("Producto no encontrado con id: " + id);
        }
    }

    // 5️⃣ Eliminar
    @Override
    public void delete(Long id) {
        productoRepository.deleteById(id);
    }

    // 6️⃣ Buscar por nombre
    @Override
    public List<ProductoDTO> findByNombre(String nombre) {
        return productoRepository.findByNombreContainingIgnoreCase(nombre)
                .stream()
                .map(ProductoMapper::toDTO)
                .collect(Collectors.toList());
    }

    // 7️⃣ Buscar por categoría
    @Override
    public List<ProductoDTO> findByCategoria(Long categoriaId) {
        return productoRepository.findByCategoriaId(categoriaId)
                .stream()
                .map(ProductoMapper::toDTO)
                .collect(Collectors.toList());
    }

    // 8️⃣ Buscar reservables
    @Override
    public List<ProductoDTO> findReservables() {
        return productoRepository.findByReservableTrue()
                .stream()
                .map(ProductoMapper::toDTO)
                .collect(Collectors.toList());
    }

    // 9️⃣ Buscar con stock disponible
    @Override
    public List<ProductoDTO> findConStockDisponible() {
        return productoRepository.findByCantidadTotalGreaterThan(0)
                .stream()
                .map(ProductoMapper::toDTO)
                .collect(Collectors.toList());
    }

    // 🔟 Lógica adicional: verificar disponibilidad
    @Override
    public boolean verificarDisponibilidad(Long productoId, int cantidadSolicitada) {
        Optional<Producto> productoOpt = productoRepository.findById(productoId);
        return productoOpt.map(producto -> producto.getCantidadTotal() >= cantidadSolicitada)
                .orElse(false);
    }
}

