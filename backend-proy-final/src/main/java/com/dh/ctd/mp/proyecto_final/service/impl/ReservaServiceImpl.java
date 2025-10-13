package com.dh.ctd.mp.proyecto_final.service.impl;

import com.dh.ctd.mp.proyecto_final.dto.ReservaDTO;
import com.dh.ctd.mp.proyecto_final.entity.EstadoReserva;
import com.dh.ctd.mp.proyecto_final.entity.Producto;
import com.dh.ctd.mp.proyecto_final.entity.Reserva;
import com.dh.ctd.mp.proyecto_final.entity.Usuario;
import com.dh.ctd.mp.proyecto_final.exception.BusinessRuleException;
import com.dh.ctd.mp.proyecto_final.exception.InvalidDataException;
import com.dh.ctd.mp.proyecto_final.exception.ResourceNotFoundException;
import com.dh.ctd.mp.proyecto_final.mapper.ReservaMapper;
import com.dh.ctd.mp.proyecto_final.repository.ProductoRepository;
import com.dh.ctd.mp.proyecto_final.repository.ReservaRepository;
import com.dh.ctd.mp.proyecto_final.repository.UsuarioRepository;
import com.dh.ctd.mp.proyecto_final.service.IReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservaServiceImpl implements IReservaService {

    private final ReservaRepository reservaRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;

    @Autowired
    public ReservaServiceImpl(ReservaRepository reservaRepository,
                              ProductoRepository productoRepository,
                              UsuarioRepository usuarioRepository) {
        this.reservaRepository = reservaRepository;
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public ReservaDTO save(ReservaDTO reservaDTO) {
        if (reservaDTO.getProductoId() == null || reservaDTO.getUsuarioId() == null) {
            throw new InvalidDataException("Producto y Usuario son obligatorios");
        }
        if (reservaDTO.getFechaInicio() == null || reservaDTO.getFechaFin() == null
                || reservaDTO.getFechaFin().isBefore(reservaDTO.getFechaInicio())) {
            throw new InvalidDataException("Fechas inválidas: fin debe ser >= inicio");
        }

        Producto producto = productoRepository.findById(reservaDTO.getProductoId())
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
        Usuario usuario = usuarioRepository.findById(reservaDTO.getUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        // Validación de regla de negocio: producto ya reservado en esas fechas
        boolean reservado = reservaRepository.existsByProductoIdAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(
                producto.getId(), reservaDTO.getFechaFin(), reservaDTO.getFechaInicio());
        if (reservado) {
            throw new BusinessRuleException("Producto ya reservado en las fechas indicadas");
        }

        Reserva reserva = ReservaMapper.toEntity(reservaDTO);
        reserva.setProducto(producto);
        reserva.setUsuario(usuario);

        return ReservaMapper.toDTO(reservaRepository.save(reserva));
    }

    @Override
    public ReservaDTO findById(Long id) {
        return reservaRepository.findById(id)
                .map(ReservaMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada con id: " + id));
    }

    @Override
    public List<ReservaDTO> findAll() {
        return reservaRepository.findAll().stream()
                .map(ReservaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ReservaDTO update(ReservaDTO reservaDTO) {
        Reserva existente = reservaRepository.findById(reservaDTO.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada con id: " + reservaDTO.getId()));

        if (reservaDTO.getFechaInicio() == null || reservaDTO.getFechaFin() == null
                || reservaDTO.getFechaFin().isBefore(reservaDTO.getFechaInicio())) {
            throw new InvalidDataException("Fechas inválidas: fin debe ser >= inicio");
        }

        Reserva reserva = ReservaMapper.toEntity(reservaDTO);
        reserva.setId(existente.getId());
        return ReservaMapper.toDTO(reservaRepository.save(reserva));
    }

    @Override
    public void delete(Long id) {
        if (!reservaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Reserva no encontrada con id: " + id);
        }
        reservaRepository.deleteById(id);
    }

    // --- Métodos específicos ---
    @Override
    public List<ReservaDTO> findByUsuario(Long usuarioId) {
        return reservaRepository.findByUsuarioId(usuarioId).stream()
                .map(ReservaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReservaDTO> findByProducto(Long productoId) {
        return reservaRepository.findByProductoId(productoId).stream()
                .map(ReservaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReservaDTO> findByFechaInicioBetween(LocalDate desde, LocalDate hasta) {
        return reservaRepository.findByFechaInicioBetween(desde, hasta).stream()
                .map(ReservaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReservaDTO> findByEstado(EstadoReserva estado) {
        return reservaRepository.findByEstado(estado).stream()
                .map(ReservaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReservaDTO> findByUsuarioAndEstado(Long usuarioId, EstadoReserva estado) {
        return reservaRepository.findByUsuarioIdAndEstado(usuarioId, estado).stream()
                .map(ReservaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReservaDTO> findByProductoAndEstado(Long productoId, EstadoReserva estado) {
        return reservaRepository.findByProductoIdAndEstado(productoId, estado).stream()
                .map(ReservaMapper::toDTO)
                .collect(Collectors.toList());
    }
}
