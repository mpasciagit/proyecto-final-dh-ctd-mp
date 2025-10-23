package com.dh.ctd.mp.proyecto_final.config;

import com.dh.ctd.mp.proyecto_final.entity.Categoria;
import com.dh.ctd.mp.proyecto_final.entity.Producto;
import com.dh.ctd.mp.proyecto_final.entity.Caracteristica;
import com.dh.ctd.mp.proyecto_final.entity.Imagen;
import com.dh.ctd.mp.proyecto_final.entity.ProductoCaracteristica;
import com.dh.ctd.mp.proyecto_final.repository.CategoriaRepository;
import com.dh.ctd.mp.proyecto_final.repository.ProductoRepository;
import com.dh.ctd.mp.proyecto_final.repository.CaracteristicaRepository;
import com.dh.ctd.mp.proyecto_final.repository.ImagenRepository;
import com.dh.ctd.mp.proyecto_final.repository.ProductoCaracteristicaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;
    private final CaracteristicaRepository caracteristicaRepository;
    private final ImagenRepository imagenRepository;
    private final ProductoCaracteristicaRepository productoCaracteristicaRepository;

    public DataInitializer(
        CategoriaRepository categoriaRepository,
        ProductoRepository productoRepository,
        CaracteristicaRepository caracteristicaRepository,
        ImagenRepository imagenRepository,
        ProductoCaracteristicaRepository productoCaracteristicaRepository
    ) {
        this.categoriaRepository = categoriaRepository;
        this.productoRepository = productoRepository;
        this.caracteristicaRepository = caracteristicaRepository;
        this.imagenRepository = imagenRepository;
        this.productoCaracteristicaRepository = productoCaracteristicaRepository;
    }

    @Override
    public void run(String... args) {
        if (caracteristicaRepository.count() == 0) {
            caracteristicaRepository.save(new Caracteristica(null, "Transmisión", "Tipo de caja de cambios del vehículo", "https://cdn-icons-png.flaticon.com/32/3774/3774278.png"));
            caracteristicaRepository.save(new Caracteristica(null, "Pasajeros", "Cantidad máxima de pasajeros", "https://cdn-icons-png.flaticon.com/32/1077/1077114.png"));
            caracteristicaRepository.save(new Caracteristica(null, "Equipaje", "Capacidad de equipaje en maletas", "https://cdn-icons-png.flaticon.com/32/2089/2089697.png"));
        }

        if (categoriaRepository.count() == 0) {
            Categoria economico = categoriaRepository.save(new Categoria(null, "Económico", "Vehículos económicos para uso urbano y familiar", "https://picsum.photos/400/300?random=1"));
            Categoria suv = categoriaRepository.save(new Categoria(null, "SUV", "Vehículos utilitarios deportivos para toda la familia", "https://picsum.photos/400/300?random=2"));
            Categoria lujo = categoriaRepository.save(new Categoria(null, "Lujo", "Vehículos de alta gama y lujo premium", "https://picsum.photos/400/300?random=3"));
            Categoria pickup = categoriaRepository.save(new Categoria(null, "Pickup", "Camionetas para trabajo y aventura", "https://picsum.photos/400/300?random=4"));

            if (productoRepository.count() == 0) {
                Producto[] productos = new Producto[40];
                // Económico (25 productos)
                productos[0] = productoRepository.save(new Producto(null, "Producto-A1", "Vehículo económico ideal para ciudad", 35.00, true, 3, economico));
                productos[1] = productoRepository.save(new Producto(null, "Producto-A2", "Vehículo económico ideal para ciudad", 38.00, true, 2, economico));
                productos[2] = productoRepository.save(new Producto(null, "Producto-A3", "Vehículo económico ideal para ciudad", 40.00, true, 4, economico));
                productos[3] = productoRepository.save(new Producto(null, "Producto-A4", "Vehículo económico ideal para ciudad", 42.00, true, 2, economico));
                productos[4] = productoRepository.save(new Producto(null, "Producto-A5", "Vehículo económico ideal para ciudad", 36.00, true, 3, economico));
                productos[5] = productoRepository.save(new Producto(null, "Producto-A6", "Vehículo económico ideal para ciudad", 39.00, true, 2, economico));
                productos[6] = productoRepository.save(new Producto(null, "Producto-A7", "Vehículo económico ideal para ciudad", 41.00, true, 3, economico));
                productos[7] = productoRepository.save(new Producto(null, "Producto-A8", "Vehículo económico ideal para ciudad", 37.00, true, 4, economico));
                productos[8] = productoRepository.save(new Producto(null, "Producto-A9", "Vehículo económico ideal para ciudad", 43.00, true, 2, economico));
                productos[9] = productoRepository.save(new Producto(null, "Producto-A10", "Vehículo económico ideal para ciudad", 38.50, true, 3, economico));
                productos[10] = productoRepository.save(new Producto(null, "Producto-A11", "Vehículo económico ideal para ciudad", 40.50, true, 2, economico));
                productos[11] = productoRepository.save(new Producto(null, "Producto-A12", "Vehículo económico ideal para ciudad", 36.50, true, 4, economico));
                productos[12] = productoRepository.save(new Producto(null, "Producto-A13", "Vehículo económico ideal para ciudad", 42.50, true, 3, economico));
                productos[13] = productoRepository.save(new Producto(null, "Producto-A14", "Vehículo económico ideal para ciudad", 39.50, true, 2, economico));
                productos[14] = productoRepository.save(new Producto(null, "Producto-A15", "Vehículo económico ideal para ciudad", 41.50, true, 3, economico));
                productos[15] = productoRepository.save(new Producto(null, "Producto-A16", "Vehículo económico ideal para ciudad", 37.50, true, 2, economico));
                productos[16] = productoRepository.save(new Producto(null, "Producto-A17", "Vehículo económico ideal para ciudad", 43.50, true, 4, economico));
                productos[17] = productoRepository.save(new Producto(null, "Producto-A18", "Vehículo económico ideal para ciudad", 35.50, true, 3, economico));
                productos[18] = productoRepository.save(new Producto(null, "Producto-A19", "Vehículo económico ideal para ciudad", 44.00, true, 2, economico));
                productos[19] = productoRepository.save(new Producto(null, "Producto-A20", "Vehículo económico ideal para ciudad", 33.00, true, 3, economico));
                productos[20] = productoRepository.save(new Producto(null, "Producto-A21", "Vehículo económico ideal para ciudad", 45.00, true, 2, economico));
                productos[21] = productoRepository.save(new Producto(null, "Producto-A22", "Vehículo económico ideal para ciudad", 34.00, true, 4, economico));
                productos[22] = productoRepository.save(new Producto(null, "Producto-A23", "Vehículo económico ideal para ciudad", 46.00, true, 3, economico));
                productos[23] = productoRepository.save(new Producto(null, "Producto-A24", "Vehículo económico ideal para ciudad", 32.00, true, 2, economico));
                productos[24] = productoRepository.save(new Producto(null, "Producto-A25", "Vehículo económico ideal para ciudad", 47.00, true, 3, economico));
                // SUV (5 productos)
                productos[25] = productoRepository.save(new Producto(null, "Producto-B1", "SUV familiar con excelente capacidad", 75.00, true, 2, suv));
                productos[26] = productoRepository.save(new Producto(null, "Producto-B2", "SUV familiar con excelente capacidad", 80.00, true, 3, suv));
                productos[27] = productoRepository.save(new Producto(null, "Producto-B3", "SUV familiar con excelente capacidad", 85.00, true, 2, suv));
                productos[28] = productoRepository.save(new Producto(null, "Producto-B4", "SUV familiar con excelente capacidad", 78.00, true, 3, suv));
                productos[29] = productoRepository.save(new Producto(null, "Producto-B5", "SUV familiar con excelente capacidad", 82.00, true, 2, suv));
                // Lujo (5 productos)
                productos[30] = productoRepository.save(new Producto(null, "Producto-C1", "Vehículo de lujo con tecnología premium", 150.00, true, 1, lujo));
                productos[31] = productoRepository.save(new Producto(null, "Producto-C2", "Vehículo de lujo con tecnología premium", 160.00, true, 2, lujo));
                productos[32] = productoRepository.save(new Producto(null, "Producto-C3", "Vehículo de lujo con tecnología premium", 170.00, true, 1, lujo));
                productos[33] = productoRepository.save(new Producto(null, "Producto-C4", "Vehículo de lujo con tecnología premium", 155.00, true, 2, lujo));
                productos[34] = productoRepository.save(new Producto(null, "Producto-C5", "Vehículo de lujo con tecnología premium", 165.00, true, 1, lujo));
                // Pickup (5 productos)
                productos[35] = productoRepository.save(new Producto(null, "Producto-D1", "Camioneta robusta para trabajo y aventura", 95.00, true, 2, pickup));
                productos[36] = productoRepository.save(new Producto(null, "Producto-D2", "Camioneta robusta para trabajo y aventura", 100.00, true, 3, pickup));
                productos[37] = productoRepository.save(new Producto(null, "Producto-D3", "Camioneta robusta para trabajo y aventura", 105.00, true, 2, pickup));
                productos[38] = productoRepository.save(new Producto(null, "Producto-D4", "Camioneta robusta para trabajo y aventura", 98.00, true, 3, pickup));
                productos[39] = productoRepository.save(new Producto(null, "Producto-D5", "Camioneta robusta para trabajo y aventura", 102.00, true, 2, pickup));

                // Imágenes para cada producto
                String[] urls = {
                    "https://picsum.photos/800/600?random=101","https://picsum.photos/800/600?random=102","https://picsum.photos/800/600?random=103","https://picsum.photos/800/600?random=104","https://picsum.photos/800/600?random=105",
                    "https://picsum.photos/800/600?random=106","https://picsum.photos/800/600?random=107","https://picsum.photos/800/600?random=108","https://picsum.photos/800/600?random=109","https://picsum.photos/800/600?random=110",
                    "https://picsum.photos/800/600?random=111","https://picsum.photos/800/600?random=112","https://picsum.photos/800/600?random=113","https://picsum.photos/800/600?random=114","https://picsum.photos/800/600?random=115",
                    "https://picsum.photos/800/600?random=116","https://picsum.photos/800/600?random=117","https://picsum.photos/800/600?random=118","https://picsum.photos/800/600?random=119","https://picsum.photos/800/600?random=120",
                    "https://picsum.photos/800/600?random=121","https://picsum.photos/800/600?random=122","https://picsum.photos/800/600?random=123","https://picsum.photos/800/600?random=124","https://picsum.photos/800/600?random=125",
                    "https://picsum.photos/800/600?random=201","https://picsum.photos/800/600?random=202","https://picsum.photos/800/600?random=203","https://picsum.photos/800/600?random=204","https://picsum.photos/800/600?random=205",
                    "https://picsum.photos/800/600?random=301","https://picsum.photos/800/600?random=302","https://picsum.photos/800/600?random=303","https://picsum.photos/800/600?random=304","https://picsum.photos/800/600?random=305",
                    "https://picsum.photos/800/600?random=401","https://picsum.photos/800/600?random=402","https://picsum.photos/800/600?random=403","https://picsum.photos/800/600?random=404","https://picsum.photos/800/600?random=405"
                };
                String[] textos = {
                    "Producto-A1","Producto-A2","Producto-A3","Producto-A4","Producto-A5","Producto-A6","Producto-A7","Producto-A8","Producto-A9","Producto-A10",
                    "Producto-A11","Producto-A12","Producto-A13","Producto-A14","Producto-A15","Producto-A16","Producto-A17","Producto-A18","Producto-A19","Producto-A20",
                    "Producto-A21","Producto-A22","Producto-A23","Producto-A24","Producto-A25",
                    "Producto-B1","Producto-B2","Producto-B3","Producto-B4","Producto-B5",
                    "Producto-C1","Producto-C2","Producto-C3","Producto-C4","Producto-C5",
                    "Producto-D1","Producto-D2","Producto-D3","Producto-D4","Producto-D5"
                };
                for (int i = 0; i < productos.length; i++) {
                    imagenRepository.save(new Imagen(null, urls[i], textos[i], 1, productos[i]));
                }

                // Características de cada producto
                Caracteristica transmision = caracteristicaRepository.findByNombre("Transmisión").orElseThrow();
                Caracteristica pasajeros = caracteristicaRepository.findByNombre("Pasajeros").orElseThrow();
                Caracteristica equipaje = caracteristicaRepository.findByNombre("Equipaje").orElseThrow();

                // Datos de características por producto (según tu SQL)
                String[][] valores = {
                    // Económico (25)
                    {"Manual","5","3"},{"Manual","4","2"},{"Automático","5","4"},{"Manual","4","3"},{"Automático","5","3"},
                    {"Manual","4","2"},{"Automático","5","4"},{"Manual","4","3"},{"Automático","5","3"},{"Manual","4","2"},
                    {"Automático","5","4"},{"Manual","4","3"},{"Automático","5","3"},{"Manual","4","2"},{"Automático","5","4"},
                    {"Manual","4","3"},{"Automático","5","3"},{"Manual","4","2"},{"Automático","5","4"},{"Manual","4","3"},
                    {"Automático","5","3"},{"Manual","4","2"},{"Automático","5","4"},{"Manual","4","3"},{"Automático","5","3"},
                    // SUV (5)
                    {"Automático","7","6"},{"Automático","7","7"},{"Automático","7","8"},{"Automático","7","6"},{"Automático","7","7"},
                    // Lujo (5)
                    {"Automático","4","3"},{"Automático","5","4"},{"Automático","4","3"},{"Automático","5","4"},{"Automático","4","3"},
                    // Pickup (5)
                    {"Manual","5","4"},{"Automático","5","6"},{"Manual","5","5"},{"Automático","5","6"},{"Manual","5","4"}
                };
                for (int i = 0; i < productos.length; i++) {
                    productoCaracteristicaRepository.save(new ProductoCaracteristica(null, productos[i], transmision, valores[i][0]));
                    productoCaracteristicaRepository.save(new ProductoCaracteristica(null, productos[i], pasajeros, valores[i][1]));
                    productoCaracteristicaRepository.save(new ProductoCaracteristica(null, productos[i], equipaje, valores[i][2]));
                }
            }
        }
    }
}