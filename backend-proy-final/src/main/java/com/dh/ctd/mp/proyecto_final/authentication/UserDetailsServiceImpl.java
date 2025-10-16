package com.dh.ctd.mp.proyecto_final.authentication;

import com.dh.ctd.mp.proyecto_final.entity.Permiso;
import com.dh.ctd.mp.proyecto_final.entity.Rol;
import com.dh.ctd.mp.proyecto_final.entity.Usuario;
import com.dh.ctd.mp.proyecto_final.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + email));

        Set<GrantedAuthority> authorities = new HashSet<>();

        Rol rol = usuario.getRol();
        if (rol != null) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + rol.getNombre().toUpperCase()));

            for (Permiso permiso : rol.getPermisos()) {
                authorities.add(new SimpleGrantedAuthority(permiso.getNombre().toUpperCase()));
            }
        }
        return new UserDetailsImpl(usuario, authorities);
    }

}