import { useEffect, useRef, useState, useCallback } from 'react';

// Hook para monitorear el rendimiento de componentes
export const usePerformanceMonitor = (componentName) => {
  const renderStart = useRef(performance.now());
  const mountTime = useRef(null);
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    mountTime: 0,
    renderCount: 0
  });

  useEffect(() => {
    // Tiempo de montaje
    mountTime.current = performance.now() - renderStart.current;
    
    setMetrics(prev => ({
      ...prev,
      mountTime: mountTime.current,
      renderCount: prev.renderCount + 1
    }));

    // Log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 ${componentName} mounted in ${mountTime.current.toFixed(2)}ms`);
    }
  }, [componentName]);

  useEffect(() => {
    // Tiempo de render
    const renderTime = performance.now() - renderStart.current;
    setMetrics(prev => ({
      ...prev,
      renderTime: renderTime
    }));

    renderStart.current = performance.now();
  });

  return metrics;
};

// Hook para monitorear intersección (útil para lazy loading)
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState(null);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        setEntry(entry);
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [options]);

  return [elementRef, isIntersecting, entry];
};

// Hook para detectar imágenes lazy
export const useLazyImage = (src) => {
  const [imageSrc, setImageSrc] = useState('');
  const [imageRef, isIntersecting] = useIntersectionObserver();

  useEffect(() => {
    if (isIntersecting && src) {
      setImageSrc(src);
    }
  }, [src, isIntersecting]);

  return [imageRef, imageSrc];
};

// Hook para medir Web Vitals
export const useWebVitals = () => {
  const [vitals, setVitals] = useState({});

  useEffect(() => {
    // Medir FCP (First Contentful Paint)
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          setVitals(prev => ({
            ...prev,
            fcp: entry.startTime
          }));
        }
      }
    });

    observer.observe({ entryTypes: ['paint'] });

    // Medir LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      setVitals(prev => ({
        ...prev,
        lcp: lastEntry.startTime
      }));
    });

    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // Medir CLS (Cumulative Layout Shift)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          setVitals(prev => ({
            ...prev,
            cls: clsValue
          }));
        }
      }
    });

    clsObserver.observe({ entryTypes: ['layout-shift'] });

    return () => {
      observer.disconnect();
      lcpObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  return vitals;
};

// Hook para medir memoria
export const useMemoryMonitor = () => {
  const [memory, setMemory] = useState({});

  useEffect(() => {
    const updateMemory = () => {
      if ('memory' in performance) {
        setMemory({
          usedJSHeapSize: (performance.memory.usedJSHeapSize / 1048576).toFixed(2),
          totalJSHeapSize: (performance.memory.totalJSHeapSize / 1048576).toFixed(2),
          jsHeapSizeLimit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2)
        });
      }
    };

    updateMemory();
    const interval = setInterval(updateMemory, 5000);

    return () => clearInterval(interval);
  }, []);

  return memory;
};

// Componente para mostrar métricas de rendimiento
export const PerformanceMonitor = ({ show = false }) => {
  const vitals = useWebVitals();
  const memory = useMemoryMonitor();

  if (!show || process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs font-mono z-50">
      <h3 className="font-bold mb-2">Performance Metrics</h3>
      
      {/* Web Vitals */}
      <div className="mb-2">
        <div>FCP: {vitals.fcp ? `${vitals.fcp.toFixed(2)}ms` : 'N/A'}</div>
        <div>LCP: {vitals.lcp ? `${vitals.lcp.toFixed(2)}ms` : 'N/A'}</div>
        <div>CLS: {vitals.cls ? vitals.cls.toFixed(4) : 'N/A'}</div>
      </div>

      {/* Memory */}
      {Object.keys(memory).length > 0 && (
        <div>
          <div>Heap: {memory.usedJSHeapSize}MB / {memory.totalJSHeapSize}MB</div>
          <div>Limit: {memory.jsHeapSizeLimit}MB</div>
        </div>
      )}
    </div>
  );
};

// Utilidades de rendimiento
export const performanceUtils = {
  // Marcar el inicio de una operación
  mark: (name) => {
    performance.mark(`${name}-start`);
  },

  // Marcar el final y medir
  measure: (name) => {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name)[0];
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${name}: ${measure.duration.toFixed(2)}ms`);
    }
    
    return measure.duration;
  },

  // Obtener métricas de navegación
  getNavigationMetrics: () => {
    const navigation = performance.getEntriesByType('navigation')[0];
    return {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      totalLoadTime: navigation.loadEventEnd - navigation.fetchStart
    };
  },

  // Obtener métricas de recursos
  getResourceMetrics: () => {
    const resources = performance.getEntriesByType('resource');
    const totalSize = resources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0);
    
    return {
      totalResources: resources.length,
      totalSize: (totalSize / 1024).toFixed(2) + ' KB',
      slowestResource: resources.reduce((slowest, resource) => 
        (resource.duration > (slowest?.duration || 0)) ? resource : slowest, null
      )
    };
  }
};

export default {
  usePerformanceMonitor,
  useIntersectionObserver,
  useLazyImage,
  useWebVitals,
  useMemoryMonitor,
  PerformanceMonitor,
  performanceUtils
};