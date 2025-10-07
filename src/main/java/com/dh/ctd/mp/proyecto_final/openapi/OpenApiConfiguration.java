package com.dh.ctd.mp.proyecto_final.openapi;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.tags.Tag;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Configuration
public class OpenApiConfiguration {

    private static final String SECURITY_SCHEME_NAME = "bearerAuth";

    // 🔒 Configuración principal de la documentación
    @Bean
    public OpenAPI proyectoFinalOpenAPI() {

        // 🌐 Servidor local
        Server localServer = new Server()
                .url("http://localhost:8080/api")
                .description("Servidor local de desarrollo");

        // ☁️ Servidor remoto (Railway)
        Server productionServer = new Server()
                .url("https://miapp-production.up.railway.app/api")
                .description("Servidor desplegado en producción");

        return new OpenAPI()
                .addServersItem(localServer)
                .addServersItem(productionServer)
                .info(new Info()
                        .title("Proyecto Final DH CTD")
                        .version("1.0.0")
                        .description("""
                                API REST de Reservas - Proyecto Final de Digital House.

                                🔐 **Autenticación JWT:**\n
                                1️⃣ Hacer login en `/api/auth/login`
                                2️⃣ Copiar el token JWT de la respuesta
                                3️⃣ Presionar **Authorize** arriba a la derecha
                                4️⃣ Pegar el token así:
                                   `Bearer <tu_token>`

                                ⚙️ Endpoints públicos:
                                - `/api/auth/**`
                                - `/h2-console/**`
                                - `/swagger-ui/**`
                                - `/v3/api-docs/**`
                                """)
                        .contact(new Contact()
                                .name("Miguel Pasciaroni")
                                .email("miguel.pasciaroni@digitalhouse.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("http://springdoc.org")))
                // 🔒 Seguridad global JWT
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME,
                                new SecurityScheme()
                                        .name(SECURITY_SCHEME_NAME)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Introduce el token JWT con el prefijo **Bearer** seguido de un espacio")
                        )
                );
    }

    // 🧰 Personalización del texto del cuadro de autorización
    @Bean
    public OpenApiCustomizer bearerAuthCustomiser() {
        return openApi -> openApi.getComponents()
                .getSecuritySchemes()
                .forEach((name, scheme) -> {
                    if (SECURITY_SCHEME_NAME.equals(name)) {
                        scheme.setDescription("Introduce tu token JWT con el prefijo **Bearer**. Ejemplo: `Bearer <tu_token>`");
                    }
                });
    }

    // 📑 Ordenar los tags (grupos de controladores) en Swagger UI
    @Bean
    public OpenApiCustomizer sortTagsCustomizer() {
        // Mapa de orden deseado
        Map<String, Integer> tagOrder = Map.of(
                "auth", 1,
                "admin", 2,
                "productos", 3,
                "reservas", 4,
                "usuarios", 5,
                "roles", 6
        );
        return openApi -> {
            if (openApi.getTags() != null) {
                List<Tag> sortedTags = openApi.getTags().stream()
                        .sorted(Comparator.comparingInt(tag ->
                                tagOrder.getOrDefault(tag.getName().toLowerCase(), 100)
                        ))
                        .toList();
                openApi.setTags(sortedTags);
            }
        };
    }
}