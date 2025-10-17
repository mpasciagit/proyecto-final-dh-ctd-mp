// Script para agregar reservas de prueba al localStorage
// Este archivo puede ejecutarse en la consola del navegador para poblar datos de prueba

const createMockReservations = () => {
  const mockReservations = [
    {
      id: 1001,
      userId: 1,
      vehicleId: 1, // Toyota Corolla
      vehicleName: "Toyota Corolla",
      vehicleImage: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=400",
      startDate: "2025-10-20T00:00:00.000Z",
      endDate: "2025-10-23T00:00:00.000Z",
      pickupLocation: "Buenos Aires",
      dropoffLocation: "Buenos Aires",
      totalDays: 3,
      dailyPrice: 45,
      totalPrice: 135,
      customerInfo: {
        firstName: "Juan",
        lastName: "Pérez",
        email: "juan@example.com",
        phone: "+54911123456",
        driverLicense: "12345678",
        emergencyContact: "María Pérez +54911987654"
      },
      additionalServices: [],
      specialRequests: "",
      status: "confirmed",
      createdAt: "2025-10-15T10:00:00.000Z",
      confirmationCode: "CR15012345"
    },
    {
      id: 1002,
      userId: 2,
      vehicleId: 1, // Toyota Corolla
      vehicleName: "Toyota Corolla",
      vehicleImage: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=400",
      startDate: "2025-10-25T00:00:00.000Z",
      endDate: "2025-10-28T00:00:00.000Z",
      pickupLocation: "Buenos Aires",
      dropoffLocation: "Buenos Aires",
      totalDays: 3,
      dailyPrice: 45,
      totalPrice: 135,
      customerInfo: {
        firstName: "Ana",
        lastName: "García",
        email: "ana@example.com",
        phone: "+54911234567",
        driverLicense: "87654321",
        emergencyContact: "Carlos García +54911876543"
      },
      additionalServices: [],
      specialRequests: "",
      status: "confirmed",
      createdAt: "2025-10-16T14:30:00.000Z",
      confirmationCode: "CR16012346"
    },
    {
      id: 1003,
      userId: 1,
      vehicleId: 5, // Toyota RAV4
      vehicleName: "Toyota RAV4",
      vehicleImage: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=400",
      startDate: "2025-10-30T00:00:00.000Z",
      endDate: "2025-11-02T00:00:00.000Z",
      pickupLocation: "Buenos Aires",
      dropoffLocation: "Buenos Aires",
      totalDays: 3,
      dailyPrice: 80,
      totalPrice: 240,
      customerInfo: {
        firstName: "Admin",
        lastName: "User",
        email: "admin@carrent.com",
        phone: "+1234567890",
        driverLicense: "ADMIN123",
        emergencyContact: "Emergency Contact +1234567890"
      },
      additionalServices: [
        { id: 'gps', name: 'GPS', price: 5 }
      ],
      specialRequests: "Necesito GPS para viaje a Córdoba",
      status: "confirmed",
      createdAt: "2025-10-17T09:15:00.000Z",
      confirmationCode: "CR17012347"
    }
  ];

  // Guardar reservas para cada usuario
  mockReservations.forEach(reservation => {
    const userId = reservation.userId;
    const key = `user_reservations_${userId}`;
    
    let existingReservations = [];
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        existingReservations = JSON.parse(stored);
      }
    } catch (e) {
      console.log('Error reading existing reservations:', e);
    }

    // Verificar si la reserva ya existe
    const reservationExists = existingReservations.some(r => r.id === reservation.id);
    if (!reservationExists) {
      existingReservations.push(reservation);
      localStorage.setItem(key, JSON.stringify(existingReservations));
    }
  });

  console.log('Mock reservations created successfully!');
  console.log('Reservations for vehicle 1 (Toyota Corolla):', mockReservations.filter(r => r.vehicleId === 1));
  console.log('Reservations for vehicle 5 (Toyota RAV4):', mockReservations.filter(r => r.vehicleId === 5));
};

// Auto-ejecutar cuando se carga el script
if (typeof window !== 'undefined') {
  createMockReservations();
}

export default createMockReservations;