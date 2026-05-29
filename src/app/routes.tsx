import { createHashRouter } from 'react-router';
import PageIncio from './components/PageIncio';
import PageMapaDeRiesgo from './components/PageMapaDeRiesgo';
import PageReporteDeRiesgos from './components/PageReporteDeRiesgos';

export const router = createHashRouter([
  {
    path: '/',
    Component: PageIncio,
  },
  {
    path: '/mapa-de-riesgo',
    Component: PageMapaDeRiesgo,
  },
  {
    path: '/reporte-de-riesgos',
    Component: PageReporteDeRiesgos,
  },
]);
