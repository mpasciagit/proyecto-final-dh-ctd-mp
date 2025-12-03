import { useState, useCallback } from "react";
import reservationService from "../services/reservationService";

export default function useProductAvailability() {
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null); // null = sin consulta
  const [error, setError] = useState(null);

  const checkAvailability = useCallback(async (productId, startDate, endDate) => {
    setIsChecking(true);
    setError(null);
    setIsAvailable(null);
    try {
      const available = await reservationService.checkProductAvailability(productId, startDate, endDate);
      setIsAvailable(!!available);
    } catch (err) {
      setError("No se pudo consultar disponibilidad");
      setIsAvailable(null);
    } finally {
      setIsChecking(false);
    }
  }, []);

  return { isChecking, isAvailable, error, checkAvailability };
}
