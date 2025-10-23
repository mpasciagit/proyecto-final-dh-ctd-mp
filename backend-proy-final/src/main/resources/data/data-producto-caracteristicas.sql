-- Vincular características con productos
-- Cada producto tendrá las 3 características básicas con valores variados

-- CATEGORÍA A - Económico (productos 1-25)
-- Transmisión Manual/Automático, 4-5 Pasajeros, 2-4 Equipajes
INSERT INTO PRODUCTO_CARACTERISTICAS (producto_id, caracteristica_id, valor) VALUES
-- Producto-A1
(1, 1, 'Manual'), (1, 2, '5'), (1, 3, '3'),
-- Producto-A2  
(2, 1, 'Manual'), (2, 2, '4'), (2, 3, '2'),
-- Producto-A3
(3, 1, 'Automático'), (3, 2, '5'), (3, 3, '4'),
-- Producto-A4
(4, 1, 'Manual'), (4, 2, '4'), (4, 3, '3'),
-- Producto-A5
(5, 1, 'Automático'), (5, 2, '5'), (5, 3, '3'),
-- Producto-A6
(6, 1, 'Manual'), (6, 2, '4'), (6, 3, '2'),
-- Producto-A7
(7, 1, 'Automático'), (7, 2, '5'), (7, 3, '4'),
-- Producto-A8
(8, 1, 'Manual'), (8, 2, '4'), (8, 3, '3'),
-- Producto-A9
(9, 1, 'Automático'), (9, 2, '5'), (9, 3, '3'),
-- Producto-A10
(10, 1, 'Manual'), (10, 2, '4'), (10, 3, '2'),
-- Producto-A11
(11, 1, 'Automático'), (11, 2, '5'), (11, 3, '4'),
-- Producto-A12
(12, 1, 'Manual'), (12, 2, '4'), (12, 3, '3'),
-- Producto-A13
(13, 1, 'Automático'), (13, 2, '5'), (13, 3, '3'),
-- Producto-A14
(14, 1, 'Manual'), (14, 2, '4'), (14, 3, '2'),
-- Producto-A15
(15, 1, 'Automático'), (15, 2, '5'), (15, 3, '4'),
-- Producto-A16
(16, 1, 'Manual'), (16, 2, '4'), (16, 3, '3'),
-- Producto-A17
(17, 1, 'Automático'), (17, 2, '5'), (17, 3, '3'),
-- Producto-A18
(18, 1, 'Manual'), (18, 2, '4'), (18, 3, '2'),
-- Producto-A19
(19, 1, 'Automático'), (19, 2, '5'), (19, 3, '4'),
-- Producto-A20
(20, 1, 'Manual'), (20, 2, '4'), (20, 3, '3'),
-- Producto-A21
(21, 1, 'Automático'), (21, 2, '5'), (21, 3, '3'),
-- Producto-A22
(22, 1, 'Manual'), (22, 2, '4'), (22, 3, '2'),
-- Producto-A23
(23, 1, 'Automático'), (23, 2, '5'), (23, 3, '4'),
-- Producto-A24
(24, 1, 'Manual'), (24, 2, '4'), (24, 3, '3'),
-- Producto-A25
(25, 1, 'Automático'), (25, 2, '5'), (25, 3, '3'),

-- CATEGORÍA B - SUV (productos 26-30)
-- Automático, 7 Pasajeros, 6-8 Equipajes
(26, 1, 'Automático'), (26, 2, '7'), (26, 3, '6'),
(27, 1, 'Automático'), (27, 2, '7'), (27, 3, '7'),
(28, 1, 'Automático'), (28, 2, '7'), (28, 3, '8'),
(29, 1, 'Automático'), (29, 2, '7'), (29, 3, '6'),
(30, 1, 'Automático'), (30, 2, '7'), (30, 3, '7'),

-- CATEGORÍA C - Lujo (productos 31-35)
-- Automático, 4-5 Pasajeros, 3-4 Equipajes
(31, 1, 'Automático'), (31, 2, '4'), (31, 3, '3'),
(32, 1, 'Automático'), (32, 2, '5'), (32, 3, '4'),
(33, 1, 'Automático'), (33, 2, '4'), (33, 3, '3'),
(34, 1, 'Automático'), (34, 2, '5'), (34, 3, '4'),
(35, 1, 'Automático'), (35, 2, '4'), (35, 3, '3'),

-- CATEGORÍA D - Pickup (productos 36-40)
-- Manual/Automático, 5 Pasajeros, 4-6 Equipajes
(36, 1, 'Manual'), (36, 2, '5'), (36, 3, '4'),
(37, 1, 'Automático'), (37, 2, '5'), (37, 3, '6'),
(38, 1, 'Manual'), (38, 2, '5'), (38, 3, '5'),
(39, 1, 'Automático'), (39, 2, '5'), (39, 3, '6'),
(40, 1, 'Manual'), (40, 2, '5'), (40, 3, '4');