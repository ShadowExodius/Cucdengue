import { useNavigate } from '../NavigationContext.tsx';
import Incio from '../../imports/Incio/Incio.tsx';

function getDataName(el: Element | null): string {
  if (!el) return '';
  return el.getAttribute('data-name') || '';
}

function getTextContent(el: Element | null): string {
  if (!el) return '';
  return el.textContent?.trim() || '';
}

function findAncestorWithDataName(el: Element | null): { dataName: string; element: Element } | null {
  let current = el;
  while (current) {
    const dn = current.getAttribute('data-name');
    if (dn) return { dataName: dn, element: current };
    current = current.parentElement;
  }
  return null;
}

export default function PageIncio() {
  const navigate = useNavigate();

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const target = e.target as Element;
    const ancestor = findAncestorWithDataName(target);
    if (!ancestor) return;

    const { dataName, element } = ancestor;
    const text = getTextContent(element);

    if (dataName === 'Link') {
      if (text === 'Mapa de Riesgo') {
        e.preventDefault();
        navigate('/mapa-de-riesgo');
        return;
      }
      if (text === 'Reportar Riesgo') {
        e.preventDefault();
        navigate('/reporte-de-riesgos');
        return;
      }
      if (text === 'Iniciar Reporte') {
        e.preventDefault();
        navigate('/reporte-de-riesgos');
        return;
      }
      if (text === 'Ver Guía') {
        e.preventDefault();
        alert(
          'Guía de Síntomas del Dengue\n\n' +
          '• Fiebre alta (mayor a 38°C) repentina\n' +
          '• Dolor de cabeza intenso\n' +
          '• Dolor detrás de los ojos\n' +
          '• Dolores musculares y articulares severos\n' +
          '• Náuseas y vómitos\n' +
          '• Erupción cutánea (sarpullido)\n' +
          '• Sangrado leve de nariz o encías\n\n' +
          'Si presenta estos síntomas, consulte a un médico de inmediato.'
        );
        return;
      }
      if (text === 'Ver Checklist') {
        e.preventDefault();
        alert(
          'Checklist Diario de Prevención del Dengue\n\n' +
          '✓ Eliminar agua estancada en macetas y recipientes\n' +
          '✓ Limpiar canaletas y desagües\n' +
          '✓ Cubrir tinacos y depósitos de agua\n' +
          '✓ Usar repelente de insectos al salir\n' +
          '✓ Instalar mosquiteros en ventanas y puertas\n' +
          '✓ Usar ropa de manga larga en zonas de riesgo\n' +
          '✓ Revisar llantas y objetos que acumulen agua\n' +
          '✓ Reportar criaderos de mosquitos a las autoridades'
        );
        return;
      }
      if (text === 'Ver Tablero') {
        e.preventDefault();
        alert(
          'Tablero de Estadísticas — Dengue Barranquilla\n\n' +
          '📊 Casos confirmados este mes: 1,240\n' +
          '📈 Variación vs mes anterior: +12%\n' +
          '🗺️ Zonas en alerta crítica: 2\n' +
          '🦟 Criaderos reportados: 847\n' +
          '💉 Fumigaciones realizadas: 18 de 28 programadas\n' +
          '🏥 Hospitalizaciones activas: 34\n\n' +
          'Fuente: Sistema Nacional de Vigilancia Epidemiológica'
        );
        return;
      }
      // Generic footer links
      if (text === 'Sobre nosotros' || text === 'Contacto' || text === 'Privacidad' || text === 'Condiciones' || text === 'Inicio') {
        if (text === 'Inicio') {
          e.preventDefault();
          navigate('/');
          return;
        }
        e.preventDefault();
        alert(`Sección "${text}" — Próximamente disponible.`);
        return;
      }
    }

    if (dataName === 'Button') {
      if (text === 'Ver Mapa de Riesgo') {
        e.preventDefault();
        navigate('/mapa-de-riesgo');
        return;
      }
      if (text === 'Guía de Prevención') {
        e.preventDefault();
        alert(
          'Guía de Prevención del Dengue\n\n' +
          '1. ELIMINA criaderos: vacía, tapa o desecha recipientes con agua.\n' +
          '2. PROTÉGETE: usa repelente, ropa larga y mosquiteros.\n' +
          '3. REPORTA: si ves agua estancada o criaderos, repórtalo.\n' +
          '4. CONSULTA: ante síntomas de fiebre, ve al médico.\n' +
          '5. INFORMA: comparte esta guía con tu familia y vecinos.\n\n' +
          'Juntos podemos erradicar el dengue de Barranquilla.'
        );
        return;
      }
      if (text === 'Descargar Reporte') {
        e.preventDefault();
        alert('📄 Descargando reporte epidemiológico...\n\nEl reporte mensual de dengue en Barranquilla se está generando. El archivo estará disponible en unos segundos.');
        return;
      }
      if (text === 'Leer Guía Completa') {
        e.preventDefault();
        alert(
          'Guía Completa de Prevención y Control del Dengue\n\n' +
          'CAPÍTULO 1: ¿Qué es el dengue?\n' +
          'El dengue es una enfermedad viral transmitida por el mosquito Aedes aegypti.\n\n' +
          'CAPÍTULO 2: Síntomas\n' +
          'Fiebre alta, dolor de cabeza, dolor muscular, erupción cutánea.\n\n' +
          'CAPÍTULO 3: Prevención\n' +
          'Eliminar criaderos, usar repelente, instalar mosquiteros.\n\n' +
          'CAPÍTULO 4: ¿Qué hacer si te contagias?\n' +
          'Acude inmediatamente al médico. No te automediques.\n\n' +
          'Para la versión completa en PDF, visita la página del Ministerio de Salud.'
        );
        return;
      }
      if (text === 'EMERGENCIA' || text === 'Emergencia') {
        e.preventDefault();
        if (confirm('¿Está seguro de que desea llamar a emergencias?\n\nEsto contactará al servicio de emergencias médicas.')) {
          alert('🚨 EMERGENCIAS: Llame al 123\n\nLínea de emergencias médicas disponible las 24 horas.\nDescribe tu ubicación y síntomas claramente.');
        }
        return;
      }
    }
  }

  return (
    <div style={{ width: '100%', height: '100vh', overflowY: 'auto' }}>
      <div style={{ width: '100%', position: 'relative', minHeight: '1800px' }} onClick={handleClick}>
        <Incio />
      </div>
    </div>
  );
}
