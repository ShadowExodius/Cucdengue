import { useState } from 'react';
import { useNavigate } from '../NavigationContext.tsx';
import imgMapa from '../../imports/ReporteDeRiesgos/eacbd903b113cf56cceeb64cd7c8ad079312e839.png';

type Urgencia = 'Baja' | 'Media' | 'Alta';

export default function PageReporteDeRiesgos() {
  const navigate = useNavigate();

  const [tipoRiesgo, setTipoRiesgo] = useState('Criadero de mosquitos');
  const [urgencia, setUrgencia] = useState<Urgencia>('Media');
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState('');

  function handleEmergencia() {
    if (confirm('¿Está seguro de que desea llamar a emergencias?\n\nEsto contactará al servicio de emergencias médicas.')) {
      alert('🚨 EMERGENCIAS: Llame al 123\n\nLínea de emergencias médicas disponible las 24 horas.\nDescribe tu ubicación y síntomas claramente.');
    }
  }

  function handleCancelar() {
    if (confirm('¿Desea cancelar el reporte? Los datos ingresados se perderán.')) {
      navigate('/');
    }
  }

  function handleEnviar() {
    if (!descripcion.trim()) {
      alert('⚠️ Por favor ingresa una descripción del riesgo antes de enviar el reporte.');
      return;
    }
    alert(
      '✅ Reporte enviado exitosamente\n\n' +
      `Tipo de riesgo: ${tipoRiesgo}\n` +
      `Nivel de urgencia: ${urgencia}\n` +
      `Descripción: ${descripcion}\n` +
      `Ubicación: ${ubicacion || 'No especificada'}\n\n` +
      'Un equipo de respuesta revisará tu reporte en las próximas 2 horas.\n' +
      'Gracias por contribuir a la prevención del dengue.'
    );
    setTipoRiesgo('Criadero de mosquitos');
    setUrgencia('Media');
    setDescripcion('');
    setUbicacion('');
    setTimeout(() => navigate('/'), 500);
  }

  const urgenciaChipClass = (level: Urgencia) => {
    if (level === urgencia) {
      if (level === 'Baja') return 'bg-[#19b5a5] text-[#00403a] border border-transparent';
      if (level === 'Media') return 'bg-[#d3e4ff] border-2 border-[#1a60a3] text-[#001c38]';
      if (level === 'Alta') return 'bg-[#ffdad6] text-[#93000a] border border-transparent';
    }
    return 'bg-white border border-[#bbcac6] text-[#3c4947]';
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: 'rgb(251,249,248)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

      {/* Top Nav Bar */}
      <header
        className="bg-white border-b border-[#bbcac6] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex-shrink-0"
        style={{ position: 'sticky', top: 0, zIndex: 100 }}
      >
        <div className="max-w-[1280px] mx-auto px-[64px] py-[16px] flex items-center justify-between">
          {/* Logo */}
          <span
            className="font-extrabold text-[24px] text-[#006a60] cursor-pointer"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
            onClick={() => navigate('/')}
          >
            Prevención Dengue
          </span>

          {/* Nav links */}
          <nav className="flex gap-[48px] items-center">
            <button
              className="text-[14px] font-medium text-[#3c4947] hover:text-[#006a60] transition-colors bg-transparent border-none cursor-pointer"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
              onClick={() => navigate('/')}
            >
              Inicio
            </button>
            <button
              className="text-[14px] font-medium text-[#3c4947] hover:text-[#006a60] transition-colors bg-transparent border-none cursor-pointer"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
              onClick={() => navigate('/mapa-de-riesgo')}
            >
              Mapa de Riesgo
            </button>
            <div className="relative pb-[6px]">
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#006a60]" />
              <span
                className="text-[14px] font-bold text-[#006a60]"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                Reportar Riesgo
              </span>
            </div>
          </nav>

          {/* Emergencia button */}
          <button
            className="bg-[#ba1a1a] text-white font-bold text-[14px] rounded-full px-[24px] py-[8px] cursor-pointer hover:bg-[#8b0000] transition-colors border-none"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
            onClick={handleEmergencia}
          >
            Emergencia
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-[1280px] mx-auto w-full px-[48px] pt-[24px] pb-[40px]">
        <div className="flex gap-[24px] items-start">

          {/* Left sidebar */}
          <aside className="w-[296px] flex-shrink-0 flex flex-col gap-[24px]">

            {/* "¿Por qué reportar?" card */}
            <div
              className="bg-[#f6f3f2] border border-[#bbcac6] rounded-[12px] p-[25px]"
            >
              <h2
                className="font-semibold text-[24px] text-[#006a60] mb-[12px]"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                ¿Por qué reportar?
              </h2>
              <p
                className="text-[#3c4947] text-[16px] mb-[16px] leading-[24px]"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                Tu participación es fundamental para el control del dengue. Cada reporte activa protocolos de respuesta inmediata y ayuda a mapear zonas de riesgo con precisión.
              </p>
              <ul className="flex flex-col gap-[10px]">
                {[
                  'Acción rápida garantizada',
                  'Geolocalización precisa',
                  'Reporte 100% confidencial',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-[10px]">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                      <circle cx="8" cy="8" r="8" fill="#1a60a3" />
                      <path d="M5 8.5L7 10.5L11 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span
                      className="text-[#1b1c1c] text-[14px] font-semibold tracking-[0.7px]"
                      style={{ fontFamily: "'Open Sans', sans-serif" }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* "PROTOCOLO DE SALUD" card */}
            <div
              className="bg-white border-t-4 border-[#c79c16] rounded-[12px] p-[24px] shadow-sm"
            >
              <h3
                className="uppercase text-[#483600] text-[14px] font-bold tracking-[0.7px] mb-[10px]"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                PROTOCOLO DE SALUD
              </h3>
              <p
                className="italic text-[#3c4947] text-[16px] leading-[24px]"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                "Si presentas fiebre alta, dolor de cabeza intenso o erupción en la piel, acude de inmediato a un centro de salud. No esperes a que los síntomas empeoren."
              </p>
            </div>
          </aside>

          {/* Right form area */}
          <div className="flex-1 min-w-0">
            <div
              className="bg-white border border-[#bbcac6] rounded-[12px] shadow-sm px-[41px] pt-[41px] pb-[57px]"
            >
              {/* Form header */}
              <div className="border-b border-[#bbcac6] pb-[25px] mb-[40px]">
                <h1
                  className="font-bold text-[32px] text-[#1b1c1c] mb-[8px]"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Formulario de Reporte
                </h1>
                <p
                  className="text-[#3c4947] text-[16px]"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  Complete el formulario con la información del riesgo detectado. Su reporte será atendido en menos de 2 horas.
                </p>
              </div>

              {/* Form */}
              <form
                className="flex flex-col gap-[40px]"
                onSubmit={(e) => { e.preventDefault(); handleEnviar(); }}
              >

                {/* Section 1: Tipo de Riesgo + Nivel de Urgencia */}
                <div className="grid grid-cols-2 gap-[24px]">

                  {/* Tipo de Riesgo */}
                  <div>
                    <label
                      className="block text-[#3c4947] font-semibold text-[14px] tracking-[0.7px] uppercase mb-[8px]"
                      style={{ fontFamily: "'Open Sans', sans-serif" }}
                    >
                      Tipo de Riesgo
                    </label>
                    <div className="relative">
                      <select
                        value={tipoRiesgo}
                        onChange={(e) => setTipoRiesgo(e.target.value)}
                        className="bg-[#fbf9f8] border border-[#bbcac6] rounded-[8px] w-full py-[13px] pl-[13px] pr-[40px] text-[16px] text-[#1b1c1c] appearance-none cursor-pointer focus:outline-none focus:border-[#006a60]"
                        style={{ fontFamily: "'Open Sans', sans-serif" }}
                      >
                        <option value="Criadero de mosquitos">Criadero de mosquitos</option>
                        <option value="Agua estancada">Agua estancada</option>
                        <option value="Caso sospechoso">Caso sospechoso</option>
                        <option value="Brote confirmado">Brote confirmado</option>
                        <option value="Otro">Otro</option>
                      </select>
                      {/* Custom arrow */}
                      <div className="pointer-events-none absolute right-[12px] top-1/2 -translate-y-1/2">
                        <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                          <path d="M1 1L8 9L15 1" stroke="#3c4947" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Nivel de Urgencia */}
                  <div>
                    <label
                      className="block text-[#3c4947] font-semibold text-[14px] tracking-[0.7px] uppercase mb-[8px]"
                      style={{ fontFamily: "'Open Sans', sans-serif" }}
                    >
                      Nivel de Urgencia
                    </label>
                    <div className="flex gap-[8px] flex-wrap">
                      {(['Baja', 'Media', 'Alta'] as Urgencia[]).map((level) => (
                        <button
                          key={level}
                          type="button"
                          className={`rounded-full px-[12px] py-[4px] text-[14px] font-semibold cursor-pointer transition-all border-none ${urgenciaChipClass(level)}`}
                          style={{ fontFamily: "'Open Sans', sans-serif" }}
                          onClick={() => setUrgencia(level)}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section 2: Descripción */}
                <div>
                  <label
                    className="block text-[#3c4947] font-semibold text-[14px] tracking-[0.7px] uppercase mb-[8px]"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  >
                    Descripción del Riesgo
                  </label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Describa brevemente lo observado (ej. acumulación de agua estancada, llantas abandonadas...)"
                    className="bg-[#fbf9f8] border border-[#bbcac6] rounded-[8px] w-full min-h-[130px] p-[17px] text-[16px] text-[#1b1c1c] resize-none focus:outline-none focus:border-[#006a60] placeholder-[#6b7280]"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  />
                </div>

                {/* Section 3: Ubicación */}
                <div>
                  <label
                    className="block text-[#3c4947] font-semibold text-[14px] tracking-[0.7px] uppercase mb-[8px]"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  >
                    Ubicación exacta
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={ubicacion}
                      onChange={(e) => setUbicacion(e.target.value)}
                      placeholder="Calle, número, colonia o referencias visuales"
                      className="bg-[#fbf9f8] border border-[#bbcac6] rounded-[8px] w-full py-[14px] pl-[13px] pr-[41px] text-[16px] text-[#1b1c1c] focus:outline-none focus:border-[#006a60] placeholder-[#6b7280]"
                      style={{ fontFamily: "'Open Sans', sans-serif" }}
                    />
                    {/* Location icon */}
                    <div className="pointer-events-none absolute right-[12px] top-1/2 -translate-y-1/2">
                      <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                        <path
                          d="M8 0C4.13 0 1 3.13 1 7c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5C6.62 9.5 5.5 8.38 5.5 7S6.62 4.5 8 4.5 10.5 5.62 10.5 7 9.38 9.5 8 9.5z"
                          fill="#1a60a3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Section 4: Map confirmation */}
                <div>
                  <label
                    className="block text-[#3c4947] font-semibold text-[14px] tracking-[0.7px] uppercase mb-[8px]"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  >
                    Confirmación en Mapa
                  </label>
                  <div className="bg-[#e4e2e1] h-[256px] rounded-[12px] overflow-clip relative">
                    <img
                      src={imgMapa}
                      alt="Mapa de ubicación"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Overlay */}
                    <div
                      className="absolute inset-px flex items-center justify-center"
                      style={{ background: 'rgba(0,106,96,0.1)' }}
                    >
                      <div className="bg-white border border-[#006a60] rounded-full px-[17px] py-[9px] flex gap-[8px] items-center shadow-lg">
                        {/* Pin icon */}
                        <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
                          <path
                            d="M7 0C3.69 0 1 2.69 1 6c0 4.5 6 12 6 12s6-7.5 6-12c0-3.31-2.69-6-6-6zm0 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
                            fill="#006a60"
                          />
                        </svg>
                        <span
                          className="font-semibold text-[14px] text-[#1b1c1c]"
                          style={{ fontFamily: "'Open Sans', sans-serif" }}
                        >
                          Ubicación Seleccionada
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-[#bbcac6] pt-[25px] flex gap-[24px] items-center justify-end">
                  <button
                    type="button"
                    className="text-[#1a60a3] font-semibold text-[16px] px-[16px] py-[8px] cursor-pointer hover:underline bg-transparent border-none"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                    onClick={handleCancelar}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-[#006a60] text-white font-bold text-[16px] rounded-full px-[32px] py-[12px] shadow-lg cursor-pointer hover:bg-[#004d46] transition-colors border-none"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  >
                    Enviar Reporte
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#eae8e7] border-t border-[#bbcac6] flex-shrink-0 mt-auto">
        <div className="max-w-[1280px] mx-auto px-[48px] py-[40px] flex items-center justify-between gap-[40px]">
          <div className="flex flex-col gap-[8px]">
            <span
              className="font-extrabold text-[32px] text-[#006a60]"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Prevención
            </span>
            <p
              className="text-[#3c4947] text-[16px] max-w-[384px]"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              Sistema Nacional de Vigilancia Epidemiológica coordinado por el Ministerio de Salud.
            </p>
          </div>

          <div className="flex gap-[48px]">
            <div className="flex flex-col gap-[8px]">
              <span
                className="font-bold text-[14px] text-[#191c1e]"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                Recursos
              </span>
              {['Sobre nosotros', 'Contacto'].map((link) => (
                <button
                  key={link}
                  className="font-semibold text-[14px] text-[#3c4947] hover:text-[#006a60] bg-transparent border-none cursor-pointer text-left p-0"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                  onClick={() => alert(`Sección "${link}" — Próximamente disponible.`)}
                >
                  {link}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-[8px]">
              <span
                className="font-bold text-[14px] text-[#191c1e]"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                Legal
              </span>
              {['Privacidad', 'Condiciones'].map((link) => (
                <button
                  key={link}
                  className="font-semibold text-[14px] text-[#3c4947] hover:text-[#006a60] bg-transparent border-none cursor-pointer text-left p-0"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                  onClick={() => alert(`Sección "${link}" — Próximamente disponible.`)}
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-[64px] pb-[24px] pt-[25px] border-t border-[rgba(187,202,198,0.3)]">
          <p
            className="italic text-[#3c4947] text-[16px] opacity-70"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            © 2024 Sistema Nacional de Salud. Vigilancia Epidemiológica del Dengue.
          </p>
        </div>
      </footer>
    </div>
  );
}
