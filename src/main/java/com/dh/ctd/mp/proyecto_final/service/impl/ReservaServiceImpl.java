package com.dh.ctd.mp.proyecto_final.service.impl;

import com.dh.ctd.mp.proyecto_final.dto.ReservaDTO;
import com.dh.ctd.mp.proyecto_final.entity.EstadoReserva;
import com.dh.ctd.mp.proyecto_final.entity.Producto;
import com.dh.ctd.mp.proyecto_final.entity.Reserva;
import com.dh.ctd.mp.proyecto_final.entity.Usuario;
import com.dh.ctd.mp.proyecto_final.mapper.ReservaMapper;
import com.dh.ctd.mp.proyecto_final.repository.ProductoRepository;
import com.dh.ctd.mp.proyecto_final.repository.ReservaRepository;
import com.dh.ctd.mp.proyecto_final.repository.UsuarioRepository;
import com.dh.ctd.mp.proyecto_final.service.IReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReservaServiceImpl implements IReservaService {

    private final ReservaRepository reservaRepository;

    @Autowired
    public ReservaServiceImpl(ReservaRepository reservaRepository) {
        this.reservaRepository = reservaRepository;
    }

    @Autowired
    private ProductoRepository productoRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public ReservaDTO save(ReservaDTO reservaDTO) {
        if (reservaDTO.getProductoId() == null || reservaDTO.getUsuarioId() == null) {
            throw new IllegalArgumentException("Producto y Usuario son obligatorios");
        }
        Producto producto = productoRepository.findById(reservaDTO.getProductoId())
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));
        Usuario usuario = usuarioRepository.findById(reservaDTO.getUsuarioId())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        Reserva reserva = ReservaMapper.toEntity(reservaDTO);
        reserva.setProducto(producto);
        reserva.setUsuario(usuario);

        return ReservaMapper.toDTO(reservaRepository.save(reserva));
    }

    @Override
    public Optional<ReservaDTO> findById(Long id) {
        return reservaRepository.findById(id).map(ReservaMapper::toDTO);
    }

    @Override
    public List<ReservaDTO> findAll() {
        return reservaRepository.findAll().stream()
                .map(ReservaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ReservaDTO update(ReservaDTO reservaDTO) throws Exception {
        if (reservaRepository.existsById(reservaDTO.getId())) {
            Reserva reserva = ReservaMapper.toEntity(reservaDTO);
            return ReservaMapper.toDTO(reservaRepository.save(reserva));
        } else {
            throw new Exception("No se pudo actualizar la reserva con id: " + reservaDTO.getId());
        }
    }

    @Override
    public void delete(Long id) {
        reservaRepository.deleteById(id);
    }

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