// Archivo de configuración de idioma español para react-date-range
import { es } from 'date-fns/locale';
// Clonamos el objeto para no mutar el original
const esDomingo = {
	...es,
	options: {
		...es.options,
		weekStartsOn: 0 // 0 = domingo, 1 = lunes
	}
};

export default esDomingo;
