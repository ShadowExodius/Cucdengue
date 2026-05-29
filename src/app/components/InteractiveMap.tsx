import { useState } from 'react';

interface Zone {
  id: number;
  name: string;
  risk: 'high' | 'medium' | 'low';
  x: number;
  y: number;
  cases: number;
  trend: string;
  lastUpdate: string;
}

const zones: Zone[] = [
  { id: 1, name: 'Rebolo', risk: 'high', x: 28, y: 62, cases: 342, trend: '+18% esta semana', lastUpdate: 'Hace 2 horas' },
  { id: 2, name: 'Centro Histórico', risk: 'medium', x: 48, y: 48, cases: 156, trend: '+5% esta semana', lastUpdate: 'Hace 4 horas' },
  { id: 3, name: 'Riomar Norte', risk: 'low', x: 64, y: 24, cases: 23, trend: '-3% esta semana', lastUpdate: 'Hace 6 horas' },
  { id: 4, name: 'Metropolitano Sur', risk: 'medium', x: 68, y: 68, cases: 189, trend: '+8% esta semana', lastUpdate: 'Hace 3 horas' },
  { id: 5, name: 'La Paz', risk: 'high', x: 53, y: 78, cases: 287, trend: '+22% esta semana', lastUpdate: 'Hace 1 hora' },
  { id: 6, name: 'El Prado', risk: 'low', x: 44, y: 22, cases: 17, trend: '-6% esta semana', lastUpdate: 'Hace 8 horas' },
  { id: 7, name: 'Boston', risk: 'medium', x: 40, y: 42, cases: 134, trend: '+2% esta semana', lastUpdate: 'Hace 5 horas' },
];

const riskColors = {
  high: '#ba1a1a',
  medium: '#c79c16',
  low: '#006a60',
};

const riskLabels = {
  high: 'Alto',
  medium: 'Medio',
  low: 'Bajo',
};

const riskBadgeStyles = {
  high: 'bg-[#ffdad6] text-[#93000a]',
  medium: 'bg-[#fff3cd] text-[#765b00]',
  low: 'bg-[#d4f5f0] text-[#003d38]',
};


export default function InteractiveMap() {
  console.log("¡Mapa cargado! Datos de las zonas actuales:", zones);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  return (
    <div
      className="relative w-full h-full border border-[#bbcac6] rounded-[12px] overflow-hidden"
      style={{ background: '#e8f0ef' }}
    >
      {/* Grid pattern background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#006a60" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Barranquilla outline */}
      <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
        <ellipse cx="50" cy="55" rx="38" ry="35" fill="none" stroke="#006a60" strokeWidth="0.8" strokeDasharray="2,1" />
        <ellipse cx="50" cy="55" rx="28" ry="26" fill="rgba(0,106,96,0.05)" stroke="none" />
      </svg>

      {/* Zone markers */}
      {zones.map((zone) => (
        <div
          key={zone.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
          style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedZone(selectedZone?.id === zone.id ? null : zone);
          }}
        >
          {/* Pulse animation for high risk */}
          {zone.risk === 'high' && (
            <>
              <div
                className="absolute rounded-full animate-ping opacity-40"
                style={{
                  backgroundColor: riskColors[zone.risk],
                  width: '36px',
                  height: '36px',
                  top: '-10px',
                  left: '-10px',
                }}
              />
              <div
                className="absolute rounded-full animate-pulse opacity-20"
                style={{
                  backgroundColor: riskColors[zone.risk],
                  width: '48px',
                  height: '48px',
                  top: '-16px',
                  left: '-16px',
                }}
              />
            </>
          )}

          {/* Zone circle with number */}
          <div
            className="relative flex items-center justify-center rounded-full shadow-lg border-2 border-white font-bold text-white text-[12px] transition-transform hover:scale-110"
            style={{
              backgroundColor: riskColors[zone.risk],
              width: '28px',
              height: '28px',
              fontSize: '11px',
            }}
          >
            {zone.id}
          </div>

          {/* Zone label */}
          <div
            className="absolute top-[30px] left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 rounded px-[6px] py-[2px] text-[10px] font-semibold whitespace-nowrap shadow pointer-events-none"
            style={{ color: riskColors[zone.risk] }}
          >
            {zone.name}
          </div>
        </div>
      ))}

      {/* Info popup */}
      {selectedZone && (
        <div
          className="absolute z-20 bg-white rounded-[12px] shadow-xl border border-[#bbcac6] p-[16px] w-[220px]"
          style={{
            left: selectedZone.x > 60 ? `${selectedZone.x - 25}%` : `${selectedZone.x + 5}%`,
            top: selectedZone.y > 60 ? `${selectedZone.y - 45}%` : `${selectedZone.y + 5}%`,
            transform: 'translateX(-50%)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            className="absolute top-[8px] right-[8px] text-[#6b7280] hover:text-[#191c1e] text-[16px] font-bold leading-none"
            onClick={() => setSelectedZone(null)}
          >
            ×
          </button>

          <div className="pr-[16px]">
            <h3 className="font-bold text-[14px] text-[#191c1e] mb-[8px]">{selectedZone.name}</h3>

            <span
              className={`inline-block text-[11px] font-semibold px-[8px] py-[2px] rounded-full mb-[10px] ${riskBadgeStyles[selectedZone.risk]}`}
            >
              Riesgo {riskLabels[selectedZone.risk]}
            </span>

            <div className="space-y-[6px] text-[12px]">
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Casos:</span>
                <span className="font-semibold text-[#191c1e]">{selectedZone.cases}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Tendencia:</span>
                <span
                  className="font-semibold"
                  style={{ color: selectedZone.trend.startsWith('+') ? '#ba1a1a' : '#006a60' }}
                >
                  {selectedZone.trend}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Actualizado:</span>
                <span className="text-[#3c4947]">{selectedZone.lastUpdate}</span>
              </div>
            </div>

            <div className="mt-[12px] pt-[10px] border-t border-[#bbcac6] flex gap-[8px]">
              <button
                className="flex-1 text-[11px] font-semibold text-white bg-[#006a60] rounded-full py-[5px] hover:bg-[#004d46] transition-colors"
                onClick={() => alert(`Ver detalles de ${selectedZone.name}`)}
              >
                Ver detalles
              </button>
              <button
                className="flex-1 text-[11px] font-semibold text-[#1a60a3] border border-[#1a60a3] rounded-full py-[5px] hover:bg-[#e8f0ff] transition-colors"
                onClick={() => alert(`Reportar riesgo en ${selectedZone.name}`)}
              >
                Reportar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click to close popup */}
      {selectedZone && (
        <div className="absolute inset-0 z-0" onClick={() => setSelectedZone(null)} />
      )}

      {/* Legend overlay */}
      <div className="absolute bottom-[17px] left-[17px] bg-white bg-opacity-90 backdrop-blur-sm rounded-[8px] border border-[#bbcac6] p-[14px] shadow-lg z-10">
        <p className="font-semibold text-[14px] text-[#191c1e] mb-[8px]">Nivel de Riesgo</p>
        <div className="space-y-[6px]">
          <div className="flex items-center gap-[8px]">
            <div className="w-[12px] h-[12px] rounded-full flex-shrink-0" style={{ backgroundColor: '#ba1a1a' }} />
            <span className="text-[12px] text-[#3c4947]">Crítico (Brote activo)</span>
          </div>
          <div className="flex items-center gap-[8px]">
            <div className="w-[12px] h-[12px] rounded-full flex-shrink-0" style={{ backgroundColor: '#c79c16' }} />
            <span className="text-[12px] text-[#3c4947]">Medio (Focos detectados)</span>
          </div>
          <div className="flex items-center gap-[8px]">
            <div className="w-[12px] h-[12px] rounded-full flex-shrink-0" style={{ backgroundColor: '#006a60' }} />
            <span className="text-[12px] text-[#3c4947]">Bajo (Bajo control)</span>
          </div>
        </div>
      </div>

      {/* Map title */}
      <div className="absolute top-[12px] left-[50%] transform -translate-x-1/2 bg-white bg-opacity-80 rounded-full px-[14px] py-[4px] text-[12px] font-semibold text-[#3c4947] shadow z-10 whitespace-nowrap">
        Barranquilla, Colombia — Zonas de Riesgo Dengue
      </div>
    </div>
  );
}
