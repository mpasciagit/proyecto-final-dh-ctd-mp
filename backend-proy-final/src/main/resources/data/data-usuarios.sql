-- Usuarios del sistema
-- 3 usuarios con diferentes roles: SUPER_ADMIN, ADMIN, USER
-- Passwords están encriptadas con BCrypt (todas son "123456")

INSERT INTO USUARIOS (email, password, nombre, apellido, rol_id) VALUES
-- SUPER_ADMIN - Miguel (asumiendo que el rol 1 es SUPER_ADMIN)
('miguel.admin@vehiculos.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTUDm5DgpM9/jGJl.Do3SZh3pF.6xgKW', 'Miguel', 'SuperAdmin', 1),

-- ADMIN - Juan (asumiendo que el rol 2 es ADMIN)
('juan.admin@vehiculos.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTUDm5DgpM9/jGJl.Do3SZh3pF.6xgKW', 'Juan', 'Administrador', 2),

-- USER - Ana (asumiendo que el rol 3 es USER)
('ana.cliente@vehiculos.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTUDm5DgpM9/jGJl.Do3SZh3pF.6xgKW', 'Ana', 'Cliente', 3);