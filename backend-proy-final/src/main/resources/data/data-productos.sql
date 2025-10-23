-- Productos de vehículos por categoría
-- A=Económico(25), B=SUV(5), C=Lujo(5), D=Pickup(5) = 40 total

-- CATEGORÍA A - Económico (25 productos para probar scroll)
INSERT INTO PRODUCTOS (nombre, descripcion, precio, reservable, cantidad_total, categoria_id) VALUES
('Producto-A1', 'Vehículo económico ideal para ciudad', 35.00, true, 3, 1),
('Producto-A2', 'Vehículo económico ideal para ciudad', 38.00, true, 2, 1),
('Producto-A3', 'Vehículo económico ideal para ciudad', 40.00, true, 4, 1),
('Producto-A4', 'Vehículo económico ideal para ciudad', 42.00, true, 2, 1),
('Producto-A5', 'Vehículo económico ideal para ciudad', 36.00, true, 3, 1),
('Producto-A6', 'Vehículo económico ideal para ciudad', 39.00, true, 2, 1),
('Producto-A7', 'Vehículo económico ideal para ciudad', 41.00, true, 3, 1),
('Producto-A8', 'Vehículo económico ideal para ciudad', 37.00, true, 4, 1),
('Producto-A9', 'Vehículo económico ideal para ciudad', 43.00, true, 2, 1),
('Producto-A10', 'Vehículo económico ideal para ciudad', 38.50, true, 3, 1),
('Producto-A11', 'Vehículo económico ideal para ciudad', 40.50, true, 2, 1),
('Producto-A12', 'Vehículo económico ideal para ciudad', 36.50, true, 4, 1),
('Producto-A13', 'Vehículo económico ideal para ciudad', 42.50, true, 3, 1),
('Producto-A14', 'Vehículo económico ideal para ciudad', 39.50, true, 2, 1),
('Producto-A15', 'Vehículo económico ideal para ciudad', 41.50, true, 3, 1),
('Producto-A16', 'Vehículo económico ideal para ciudad', 37.50, true, 2, 1),
('Producto-A17', 'Vehículo económico ideal para ciudad', 43.50, true, 4, 1),
('Producto-A18', 'Vehículo económico ideal para ciudad', 35.50, true, 3, 1),
('Producto-A19', 'Vehículo económico ideal para ciudad', 44.00, true, 2, 1),
('Producto-A20', 'Vehículo económico ideal para ciudad', 33.00, true, 3, 1),
('Producto-A21', 'Vehículo económico ideal para ciudad', 45.00, true, 2, 1),
('Producto-A22', 'Vehículo económico ideal para ciudad', 34.00, true, 4, 1),
('Producto-A23', 'Vehículo económico ideal para ciudad', 46.00, true, 3, 1),
('Producto-A24', 'Vehículo económico ideal para ciudad', 32.00, true, 2, 1),
('Producto-A25', 'Vehículo económico ideal para ciudad', 47.00, true, 3, 1),

-- CATEGORÍA B - SUV (5 productos)
('Producto-B1', 'SUV familiar con excelente capacidad', 75.00, true, 2, 2),
('Producto-B2', 'SUV familiar con excelente capacidad', 80.00, true, 3, 2),
('Producto-B3', 'SUV familiar con excelente capacidad', 85.00, true, 2, 2),
('Producto-B4', 'SUV familiar con excelente capacidad', 78.00, true, 3, 2),
('Producto-B5', 'SUV familiar con excelente capacidad', 82.00, true, 2, 2),

-- CATEGORÍA C - Lujo (5 productos)
('Producto-C1', 'Vehículo de lujo con tecnología premium', 150.00, true, 1, 3),
('Producto-C2', 'Vehículo de lujo con tecnología premium', 160.00, true, 2, 3),
('Producto-C3', 'Vehículo de lujo con tecnología premium', 170.00, true, 1, 3),
('Producto-C4', 'Vehículo de lujo con tecnología premium', 155.00, true, 2, 3),
('Producto-C5', 'Vehículo de lujo con tecnología premium', 165.00, true, 1, 3),

-- CATEGORÍA D - Pickup (5 productos)
('Producto-D1', 'Camioneta robusta para trabajo y aventura', 95.00, true, 2, 4),
('Producto-D2', 'Camioneta robusta para trabajo y aventura', 100.00, true, 3, 4),
('Producto-D3', 'Camioneta robusta para trabajo y aventura', 105.00, true, 2, 4),
('Producto-D4', 'Camioneta robusta para trabajo y aventura', 98.00, true, 3, 4),
('Producto-D5', 'Camioneta robusta para trabajo y aventura', 102.00, true, 2, 4);