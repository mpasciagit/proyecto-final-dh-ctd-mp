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
import com.dh.ctd.mp.proyecto_final.service.EmailService;
import com.dh.ctd.mp.proyecto_final.service.IReservaService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservaServiceImpl implements IReservaService {

    private static final Logger logger = LoggerFactory.getLogger(ReservaServiceImpl.class);

    private final ReservaRepository reservaRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;

    private void validarFechas(LocalDate fechaInicio, LocalDate fechaFin) {
        if (fechaInicio == null || fechaFin == null || fechaFin.isBefore(fechaInicio)) {
            throw new InvalidDataException("Fechas inválidas: fin debe ser >= inicio");
        }
    }

    @Override
    public ReservaDTO save(ReservaDTO reservaDTO) {
        if (reservaDTO.getProductoId() == null || reservaDTO.getUsuarioId() == null) {
            throw new InvalidDataException("Producto y Usuario son obligatorios");
        }

        validarFechas(reservaDTO.getFechaInicio(), reservaDTO.getFechaFin());

        Producto producto = productoRepository.findById(reservaDTO.getProductoId())
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));

        Usuario usuario = usuarioRepository.findById(reservaDTO.getUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        // Validación de negocio: producto ya reservado en esas fechas
        boolean reservado = reservaRepository.existsByProductoIdAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(
                producto.getId(), reservaDTO.getFechaFin(), reservaDTO.getFechaInicio());
        if (reservado) {
            throw new BusinessRuleException("Producto ya reservado en las fechas indicadas");
        }

        Reserva reserva = ReservaMapper.toEntity(reservaDTO);
        reserva.setProducto(producto);
        reserva.setUsuario(usuario);

        // Guardar reserva
        Reserva reservaGuardada = reservaRepository.save(reserva);

        // ✅ Enviar correo de confirmación al usuario
        try {
            emailService.sendReservationConfirmationEmail(
                    usuario.getEmail(),
                    usuario.getNombre(),
                    producto.getNombre(),
                    reservaGuardada.getFechaInicio().toString(),
                    reservaGuardada.getFechaFin().toString()
            );
        } catch (Exception e) {
            logger.warn("No se pudo enviar el correo de confirmación a {}: {}", usuario.getEmail(), e.getMessage());
        }

        return ReservaMapper.toDTO(reservaGuardada);
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

        validarFechas(reservaDTO.getFechaInicio(), reservaDTO.getFechaFin());

        Reserva reserva = ReservaMapper.toEntity(reservaDTO);
        reserva.setId(existente.getId());

        return ReservaMapper.toDTO(reservaRepository.save(reserva));
    }

    @Override
    public void delete(Long id) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada con id: " + id));
        if (reserva.getReview() != null) {
            reserva.setReview(null);
            reservaRepository.save(reserva);
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
