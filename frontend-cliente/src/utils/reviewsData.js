// Sistema de reseñas y comentarios
export const reviews = [
  {
    id: 1,
    productId: 1, // Toyota Corolla
    userId: 2,
    userName: "María González",
    userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b044?q=80&w=100",
    rating: 5,
    title: "Excelente vehículo para la ciudad",
    comment: "Muy cómodo y económico. Perfecto para moverse por Buenos Aires. El aire acondicionado funciona perfectamente y el consumo es realmente bajo. Lo recomiendo totalmente.",
    date: "2024-09-15",
    verified: true, // Usuario que completó una reserva
    helpful: 12,
    photos: []
  },
  {
    id: 2,
    productId: 1,
    userId: 3,
    userName: "Carlos Mendez",
    userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100",
    rating: 4,
    title: "Buena relación calidad-precio",
    comment: "El vehículo estaba en buen estado. Solo le faltaba GPS pero por el precio está bien. La entrega fue puntual y el proceso muy sencillo.",
    date: "2024-09-10",
    verified: true,
    helpful: 8,
    photos: []
  },
  {
    id: 3,
    productId: 2, // Honda Civic
    userId: 4,
    userName: "Ana Silva",
    userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100",
    rating: 5,
    title: "Increíble eficiencia y comodidad",
    comment: "El sistema híbrido es fantástico. Recorrí más de 500km con muy poco combustible. El GPS funciona perfecto y los asientos son muy cómodos para viajes largos.",
    date: "2024-09-20",
    verified: true,
    helpful: 15,
    photos: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=300"
    ]
  },
  {
    id: 4,
    productId: 2,
    userId: 5,
    userName: "Roberto Castro",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100",
    rating: 4,
    title: "Muy buen vehículo híbrido",
    comment: "Primera vez que manejo un híbrido y quedé impresionado. Muy silencioso y el consumo es increíblemente bajo. Único detalle: el maletero es un poco pequeño.",
    date: "2024-09-18",
    verified: true,
    helpful: 6,
    photos: []
  },
  {
    id: 5,
    productId: 3, // Toyota Camry
    userId: 6,
    userName: "Patricia Morales",
    userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100",
    rating: 5,
    title: "Lujo y comodidad excepcional",
    comment: "Los asientos de cuero son increíbles y el techo solar hace que los viajes sean una experiencia única. Perfecto para ocasiones especiales. El servicio fue impecable.",
    date: "2024-09-25",
    verified: true,
    helpful: 11,
    photos: [
      "https://images.unsplash.com/photo-1616788874313-95c6de7d91d4?q=80&w=300",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=300"
    ]
  },
  {
    id: 6,
    productId: 5, // Toyota RAV4
    userId: 7,
    userName: "Diego Fernandez",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100",
    rating: 5,
    title: "Perfecto para aventuras familiares",
    comment: "Excelente para viajes en familia. El 4x4 nos permitió ir a lugares increíbles. Muy espacioso y seguro. Los niños viajaron cómodamente en la tercera fila.",
    date: "2024-09-22",
    verified: true,
    helpful: 9,
    photos: []
  },
  {
    id: 7,
    productId: 8, // BMW Z4
    userId: 8,
    userName: "Valentina Torres",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100",
    rating: 5,
    title: "Una experiencia de manejo única",
    comment: "¡Qué increíble experiencia! El convertible es espectacular, especialmente por la costanera. El motor suena hermoso y la respuesta es inmediata. Totalmente recomendado para una escapada romántica.",
    date: "2024-09-28",
    verified: true,
    helpful: 13,
    photos: [
      "https://images.unsplash.com/photo-1603384696015-871af6a62b49?q=80&w=300"
    ]
  },
  {
    id: 8,
    productId: 4, // Volkswagen Gol
    userId: 9,
    userName: "Jorge Ruiz",
    userAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100",
    rating: 4,
    title: "Económico y práctico",
    comment: "Para el precio que tiene está muy bien. Ideal para uso urbano. No tiene muchas comodidades pero cumple perfectamente su función. Muy fácil de estacionar.",
    date: "2024-09-12",
    verified: true,
    helpful: 5,
    photos: []
  }
];

// Función para obtener reseñas por producto
export const getReviewsByProduct = (productId) => {
  return reviews.filter(review => review.productId === parseInt(productId));
};

// Función para calcular estadísticas de reseñas
export const getReviewStats = (productId) => {
  const productReviews = getReviewsByProduct(productId);
  
  if (productReviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      verifiedCount: 0
    };
  }

  const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / productReviews.length;
  
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  productReviews.forEach(review => {
    distribution[review.rating]++;
  });

  const verifiedCount = productReviews.filter(review => review.verified).length;

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews: productReviews.length,
    distribution,
    verifiedCount
  };
};

// Función para obtener si un usuario puede hacer reseña
export const canUserReview = (userId, productId) => {
  // Verificar si el usuario ha completado una reserva para este producto
  const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
  const userReservations = reservations.filter(r => 
    r.userId === userId && 
    r.vehicleId === productId && 
    r.status === 'confirmed' &&
    new Date(r.endDate) < new Date() // Reserva completada
  );

  // Verificar si ya hizo una reseña
  const existingReview = reviews.find(r => 
    r.userId === userId && r.productId === productId
  );

  return userReservations.length > 0 && !existingReview;
};

// Función para agregar nueva reseña
export const addReview = (reviewData) => {
  const newReview = {
    id: Date.now(),
    productId: reviewData.productId,
    userId: reviewData.userId,
    userName: reviewData.userName,
    userAvatar: reviewData.userAvatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100",
    rating: reviewData.rating,
    title: reviewData.title,
    comment: reviewData.comment,
    date: new Date().toISOString().split('T')[0],
    verified: canUserReview(reviewData.userId, reviewData.productId),
    helpful: 0,
    photos: reviewData.photos || []
  };

  reviews.unshift(newReview); // Agregar al principio
  
  // En una app real, esto se guardaría en el backend
  // Por ahora solo actualizamos el array en memoria
  
  return newReview;
};

// Función para marcar reseña como útil
export const markReviewHelpful = (reviewId) => {
  const review = reviews.find(r => r.id === reviewId);
  if (review) {
    review.helpful += 1;
  }
  return review;
};