import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from '../NavigationContext.tsx';
import MapaDeRiesgo from '../../imports/MapaDeRiesgo/MapaDeRiesgo.tsx';
import InteractiveMap from './InteractiveMap.tsx';

function findAncestorWithDataName(el: Element | null): { dataName: string; element: Element } | null {
  let current = el;
  while (current) {
    const dn = current.getAttribute('data-name');
    if (dn) return { dataName: dn, element: current };
    current = current.parentElement;
  }
  return null;
}

function getTextContent(el: Element | null): string {
  if (!el) return '';
  return el.textContent?.trim() || '';
}

export default function PageMapaDeRiesgo() {
  const navigate = useNavigate();
  const [portalTarget, setPortalTarget] = useState<Element | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Find the "Mapa interactivo" element and its parent container
    const mapaInteractivo = containerRef.current.querySelector('[data-name="Mapa interactivo"]');
    if (mapaInteractivo) {
      // Hide the static image
      (mapaInteractivo as HTMLElement).style.display = 'none';
      const parent = mapaInteractivo.parentElement;
      if (parent) {
        setPortalTarget(parent);
      }
    }
  }, []);

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const target = e.target as Element;
    const ancestor = findAncestorWithDataName(target);
    if (!ancestor) return;

    const { dataName, element } = ancestor;
    const text = getTextContent(element);

    if (dataName === 'Link') {
      if (text === 'Inicio') {
        e.preventDefault();
        navigate('/');
        return;
      }
      if (text === 'Reportar Riesgo') {
        e.preventDefault();
        navigate('/reporte-de-riesgos');
        return;
      }
      if (text === 'Mapa de Riesgo') {
        e.preventDefault();
        // Already on this page
        return;
      }
      if (text === 'Sobre nosotros' || text === 'Contacto' || text === 'Privacidad' || text === 'Condiciones') {
        e.preventDefault();
        alert(`Sección "${text}" — Próximamente disponible.`);
        return;
      }
    }

    if (dataName === 'Button') {
      if (text === 'Emergencia' || text === 'EMERGENCIA') {
        e.preventDefault();
        if (confirm('¿Está seguro de que desea llamar a emergencias?\n\nEsto contactará al servicio de emergencias médicas.')) {
          alert('🚨 EMERGENCIAS: Llame al 123\n\nLínea de emergencias médicas disponible las 24 horas.\nDescribe tu ubicación y síntomas claramente.');
        }
        return;
      }
      if (text === 'Radio de Proximidad') {
        e.preventDefault();
        alert('Filtro: Radio de Proximidad\n\nMostrando zonas de riesgo en un radio de 5km de tu ubicación actual.\n\nZonas cercanas encontradas: 3');
        return;
      }
      if (text === 'Historial 30 días') {
        e.preventDefault();
        alert('Filtro: Historial 30 días\n\nMostrando datos acumulados de los últimos 30 días.\n\nTotal casos reportados: 1,240\nIncremento mensual: +12%');
        return;
      }
      if (text === 'Criaderos Reportados') {
        e.preventDefault();
        alert('Filtro: Criaderos Reportados\n\nMostrando ubicaciones de criaderos de mosquitos reportados por ciudadanos.\n\nCriaderos activos: 847\nEliminar en las próximas 48 horas: 156');
        return;
      }
      if (text === 'Ver historial completo') {
        e.preventDefault();
        alert(
          'Historial de Alertas\n\n' +
          '🔴 Hace 2 horas — Brote detectado en Sector 4 (Rebolo)\n' +
          '🟡 Hace 6 horas — Condiciones climáticas de riesgo: lluvias intensas\n' +
          '🔴 Hace 1 día — Nuevo foco en La Paz, 45 casos nuevos\n' +
          '🟡 Hace 2 días — Criadero masivo en Centro Histórico\n' +
          '🟢 Hace 3 días — Fumigación exitosa en El Prado\n' +
          '🔴 Hace 4 días — Brote confirmado en Metropolitano Sur\n' +
          '🟢 Hace 5 días — Riomar Norte bajo control tras intervención'
        );
        return;
      }
    }
  }

  return (
    <div style={{ width: '100%', height: '100vh', overflowY: 'auto' }}>
      <div ref={containerRef} style={{ width: '100%', position: 'relative', minHeight: '1250px' }} onClick={handleClick}>
        <MapaDeRiesgo />
      </div>
      {portalTarget &&
        createPortal(
          <div style={{ position: 'absolute', inset: 0, zIndex: 5 }}>
            <InteractiveMap />
          </div>,
          portalTarget
        )}
    </div>
  );
}
