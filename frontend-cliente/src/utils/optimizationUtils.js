import { useState, useRef, useEffect, useCallback } from 'react';

// HOC para memorizar componentes
export const withMemoization = (Component, areEqual = null) => {
  return memo(Component, areEqual);
};

// Hook personalizado para memorizar valores
export const useStableMemo = (factory, deps) => {
  return useMemo(factory, deps);
};

// Hook personalizado para memorizar callbacks
export const useStableCallback = (callback, deps) => {
  return useCallback(callback, deps);
};

// Comparadores personalizados para React.memo
export const comparators = {
  // Comparador superficial para props
  shallow: (prevProps, nextProps) => {
    const prevKeys = Object.keys(prevProps);
    const nextKeys = Object.keys(nextProps);
    
    if (prevKeys.length !== nextKeys.length) {
      return false;
    }
    
    for (const key of prevKeys) {
      if (prevProps[key] !== nextProps[key]) {
        return false;
      }
    }
    
    return true;
  },

  // Comparador específico para productos
  product: (prevProps, nextProps) => {
    return (
      prevProps.product?.id === nextProps.product?.id &&
      prevProps.product?.disponible === nextProps.product?.disponible &&
      prevProps.isFavorite === nextProps.isFavorite &&
      prevProps.onClick === nextProps.onClick
    );
  },

  // Comparador para filtros
  filters: (prevProps, nextProps) => {
    return (
      prevProps.filters === nextProps.filters &&
      prevProps.onFiltersChange === nextProps.onFiltersChange &&
      prevProps.loading === nextProps.loading
    );
  },

  // Comparador para elementos de lista
  listItem: (prevProps, nextProps) => {
    return (
      prevProps.item?.id === nextProps.item?.id &&
      prevProps.index === nextProps.index &&
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.onClick === nextProps.onClick
    );
  }
};

// Utilidades para optimización
export const optimizationUtils = {
  // Debounce para funciones
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle para funciones
  throttle: (func, limit) => {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Verificar si un objeto es profundamente igual
  deepEqual: (obj1, obj2) => {
    if (obj1 === obj2) return true;
    
    if (typeof obj1 !== 'object' || obj1 === null || 
        typeof obj2 !== 'object' || obj2 === null) {
      return false;
    }
    
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) return false;
    
    for (const key of keys1) {
      if (!keys2.includes(key)) return false;
      if (!optimizationUtils.deepEqual(obj1[key], obj2[key])) return false;
    }
    
    return true;
  }
};

// Hook para usar debounce con estado
export const useDebouncedValue = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook para usar throttle con estado
export const useThrottledValue = (value, limit) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
};

// Hook para prevenir re-renders innecesarios
export const useShallowMemo = (value) => {
  const ref = useRef(value);
  
  if (!optimizationUtils.deepEqual(ref.current, value)) {
    ref.current = value;
  }
  
  return ref.current;
};

export default {
  withMemoization,
  useStableMemo,
  useStableCallback,
  comparators,
  optimizationUtils,
  useDebouncedValue,
  useThrottledValue,
  useShallowMemo
};