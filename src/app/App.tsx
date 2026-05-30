import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import emailjs from '@emailjs/browser';
import InteractiveMap from './components/InteractiveMap.tsx';

// ── EmailJS config — reemplaza con tus datos de emailjs.com ──────────────────
// 1. Recogemos los datos que escribe el usuario en la app
// (Asegúrate de cambiar "tu_estado_..." por las variables reales que estás usando en tu formulario)
// Pega esto justo arriba de "const templateParams = {"
const EMAILJS_SERVICE_ID = 'service_zmbn7dd';
const EMAILJS_TEMPLATE_ID = 'template_inji1ae';
const EMAILJS_PUBLIC_KEY = 'keKsdOOdRKoXx1leeC';
// Agarra automáticamente los datos del formulario HTML
const formData = new FormData(e.currentTarget);

const templateParams = {
  tipo_riesgo: formData.get('tipo_riesgo') || formData.get('tipoRiesgo') || '',
  urgencia: formData.get('urgencia') || '',
  descripcion: formData.get('descripcion') || '',
  ubicacion: formData.get('ubicacion') || '',
  correo_reportante: formData.get('correo') || formData.get('correo_reportante') || ''
};

// 2. Se lo enviamos a EmailJS usando .send (en vez de sendForm)
emailjs.send(
  EMAILJS_SERVICE_ID, 
  EMAILJS_TEMPLATE_ID, 
  templateParams, 
  EMAILJS_PUBLIC_KEY
)
.then((response) => {
   alert("¡Reporte enviado con éxito!");
   console.log('ÉXITO!', response.status, response.text);
})
.catch((err) => {
   alert("Error al enviar el reporte. Verifica tu conexión e intenta de nuevo.");
   console.error('ERROR:', err);
});

// ── Navigation ────────────────────────────────────────────────────────────────

type AppPage = '/' | '/mapa-de-riesgo' | '/reporte-de-riesgos';
const NavCtx = createContext<(p: AppPage) => void>(() => {});
function useNav() { return useContext(NavCtx); }

// ── Shared Nav Bar ────────────────────────────────────────────────────────────

function TopNav({ active }: { active: AppPage }) {
  const nav = useNav();
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff', borderBottom: '1px solid #bbcac6', boxShadow: '0px 1px 1px rgba(0,0,0,0.05)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span onClick={() => nav('/')} style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, fontSize: 24, color: '#006a60', cursor: 'pointer' }}>
          DengueCUC
        </span>
        <nav style={{ display: 'flex', gap: 48, alignItems: 'center' }}>
          {([['/', 'Inicio'], ['/mapa-de-riesgo', 'Mapa de Riesgo'], ['/reporte-de-riesgos', 'Reportar Riesgo']] as [AppPage, string][]).map(([path, label]) => (
            <button key={path} onClick={() => nav(path)} style={{ fontFamily: 'Open Sans,sans-serif', fontSize: 14, fontWeight: active === path ? 700 : 500, color: active === path ? '#006a60' : '#3c4947', background: 'none', border: 'none', cursor: 'pointer', borderBottom: active === path ? '2px solid #006a60' : '2px solid transparent', paddingBottom: 4 }}>
              {label}
            </button>
          ))}
        </nav>
        <button onClick={() => { if (confirm('¿Llamar a emergencias médicas?')) alert('🚨 EMERGENCIAS: Llame al 123'); }} style={{ fontFamily: 'Open Sans,sans-serif', fontWeight: 700, fontSize: 14, color: '#fff', background: '#ba1a1a', border: 'none', borderRadius: 9999, padding: '8px 24px', cursor: 'pointer' }}>
          Emergencia
        </button>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{ background: '#eae8e7', borderTop: '1px solid #bbcac6', marginTop: 'auto' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 40 }}>
        <div>
          <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, fontSize: 32, color: '#006a60' }}>Prevención</div>
          <p style={{ fontFamily: 'Open Sans,sans-serif', fontSize: 16, color: '#3c4947', maxWidth: 384, marginTop: 8 }}>Sistema Nacional de Vigilancia Epidemiológica coordinado por el Ministerio de Salud.</p>
        </div>
        <div style={{ display: 'flex', gap: 48 }}>
          {[['Recursos', 'Sobre nosotros', 'Contacto'], ['Legal', 'Privacidad', 'Condiciones']].map(([title, ...links]) => (
            <div key={title} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontFamily: 'Open Sans,sans-serif', fontWeight: 700, fontSize: 14, color: '#191c1e' }}>{title}</span>
              {links.map(l => <button key={l} onClick={() => alert(`Sección "${l}" — Próximamente.`)} style={{ fontFamily: 'Open Sans,sans-serif', fontSize: 14, color: '#3c4947', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>{l}</button>)}
            </div>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 64px', borderTop: '1px solid #d4dcda' }}>
        <p style={{ fontFamily: 'Open Sans,sans-serif', fontSize: 16, color: '#3c4947', opacity: 0.7, fontStyle: 'italic' }}>© 2024 Sistema Nacional de Salud. Vigilancia Epidemiológica del Dengue.</p>
      </div>
    </footer>
  );
}

// ── PageIncio ─────────────────────────────────────────────────────────────────

function PageIncio() {
  const nav = useNav();

  const stats = [
    { label: 'Casos este mes', value: '1,240', delta: '+12%', color: '#ba1a1a' },
    { label: 'Zonas de alerta', value: '7', delta: 'activas', color: '#c79c16' },
    { label: 'Criaderos reportados', value: '847', delta: 'este mes', color: '#1a60a3' },
    { label: 'Fumigaciones', value: '18/28', delta: 'programadas', color: '#006a60' },
  ];

  const tips = [
    { icon: '🪣', title: 'Elimina criaderos', desc: 'Vacía, tapa o desecha cualquier recipiente que acumule agua estancada.' },
    { icon: '🛡️', title: 'Protégete', desc: 'Usa repelente de insectos, ropa de manga larga y mosquiteros en casa.' },
    { icon: '📢', title: 'Reporta focos', desc: 'Si detectas criaderos o casos sospechosos, repórtalos de inmediato.' },
    { icon: '🏥', title: 'Consulta al médico', desc: 'Ante fiebre alta y dolores musculares, busca atención médica urgente.' },
  ];

  return (
    <div style={{ width: '100%', height: '100vh', overflowY: 'auto', background: '#fbf9f8' }}>
      <TopNav active="/" />

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#006a60 0%,#004d46 100%)', padding: '80px 64px', textAlign: 'center', color: '#fff' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', borderRadius: 9999, padding: '6px 16px', fontSize: 13, fontFamily: 'Open Sans,sans-serif', marginBottom: 24 }}>Salud Pública · Barranquilla 2024</div>
          <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, fontSize: 48, lineHeight: 1.15, marginBottom: 20 }}>
            Prevención y Control<br />del <span style={{ color: '#a8eddf' }}>Dengue</span>
          </h1>
          <p style={{ fontFamily: 'Open Sans,sans-serif', fontSize: 18, lineHeight: 1.6, opacity: 0.9, marginBottom: 40 }}>
            Monitorea zonas de riesgo, reporta focos y protege tu comunidad en Barranquilla.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => nav('/mapa-de-riesgo')} style={{ fontFamily: 'Open Sans,sans-serif', fontWeight: 700, fontSize: 16, color: '#006a60', background: '#fff', border: 'none', borderRadius: 9999, padding: '14px 32px', cursor: 'pointer' }}>Ver Mapa de Riesgo</button>
            <button onClick={() => nav('/reporte-de-riesgos')} style={{ fontFamily: 'Open Sans,sans-serif', fontWeight: 700, fontSize: 16, color: '#fff', background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.6)', borderRadius: 9999, padding: '14px 32px', cursor: 'pointer' }}>Iniciar Reporte</button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: '#fff', border: '1px solid #bbcac6', borderRadius: 12, padding: '24px 20px', borderTop: `4px solid ${s.color}` }}>
              <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, fontSize: 36, color: s.color }}>{s.value}</div>
              <div style={{ fontFamily: 'Open Sans,sans-serif', fontSize: 14, color: '#6b7280', marginTop: 4 }}>{s.label}</div>
              <div style={{ fontFamily: 'Open Sans,sans-serif', fontSize: 13, fontWeight: 600, color: s.color, marginTop: 8 }}>{s.delta}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ background: '#006a60', borderRadius: 16, padding: 40, color: '#fff', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: 40 }}>🗺️</div>
            <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 28 }}>Mapa de Riesgo</h2>
            <p style={{ fontFamily: 'Open Sans,sans-serif', fontSize: 16, opacity: 0.9, lineHeight: 1.6 }}>Visualiza las zonas de riesgo en tiempo real. Identifica criaderos y áreas con alta incidencia de dengue en Barranquilla.</p>
            <button onClick={() => nav('/mapa-de-riesgo')} style={{ fontFamily: 'Open Sans,sans-serif', fontWeight: 700, fontSize: 15, color: '#006a60', background: '#fff', border: 'none', borderRadius: 9999, padding: '12px 28px', cursor: 'pointer', alignSelf: 'flex-start', marginTop: 8 }}>Ver Mapa →</button>
          </div>
          <div style={{ background: '#1a60a3', borderRadius: 16, padding: 40, color: '#fff', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: 40 }}>📋</div>
            <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 28 }}>Reportar Riesgo</h2>
            <p style={{ fontFamily: 'Open Sans,sans-serif', fontSize: 16, opacity: 0.9, lineHeight: 1.6 }}>Reporta focos de mosquitos, agua estancada o casos sospechosos. Tu reporte activa protocolos de respuesta inmediata.</p>
            <button onClick={() => nav('/reporte-de-riesgos')} style={{ fontFamily: 'Open Sans,sans-serif', fontWeight: 700, fontSize: 15, color: '#1a60a3', background: '#fff', border: 'none', borderRadius: 9999, padding: '12px 28px', cursor: 'pointer', alignSelf: 'flex-start', marginTop: 8 }}>Iniciar Reporte →</button>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px 48px' }}>
        <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 28, color: '#1b1c1c', marginBottom: 24 }}>Guía de Prevención</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {tips.map(t => (
            <div key={t.title} style={{ background: '#fff', border: '1px solid #bbcac6', borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{t.icon}</div>
              <h3 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 16, color: '#1b1c1c', marginBottom: 8 }}>{t.title}</h3>
              <p style={{ fontFamily: 'Open Sans,sans-serif', fontSize: 14, color: '#3c4947', lineHeight: 1.6 }}>{t.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <button onClick={() => alert('Guía completa:\n1. Elimina criaderos de agua\n2. Usa repelente\n3. Instala mosquiteros\n4. Reporta focos\n5. Consulta al médico ante fiebre')} style={{ fontFamily: 'Open Sans,sans-serif', fontWeight: 700, fontSize: 15, color: '#fff', background: '#006a60', border: 'none', borderRadius: 9999, padding: '14px 36px', cursor: 'pointer' }}>
            Leer Guía Completa
          </button>
        </div>
      </section>

      {/* Alert */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px 64px' }}>
        <div style={{ background: '#fff3cd', border: '1px solid #c79c16', borderLeft: '6px solid #c79c16', borderRadius: 12, padding: '24px 28px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 28, flexShrink: 0 }}>⚠️</span>
          <div>
            <h3 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 18, color: '#765b00', marginBottom: 6 }}>PROTOCOLO DE SALUD</h3>
            <p style={{ fontFamily: 'Open Sans,sans-serif', fontSize: 16, color: '#483600', lineHeight: 1.6, fontStyle: 'italic' }}>
              "Si presentas fiebre alta, dolor de cabeza intenso o erupción en la piel, acude de inmediato a un centro de salud. No esperes a que los síntomas empeoren."
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// ── PageMapaDeRiesgo ──────────────────────────────────────────────────────────

function PageMapaDeRiesgo() {
  const nav = useNav();

  const alerts = [
    { level: 'high', zona: 'Rebolo', msg: 'Brote activo — 342 casos', time: 'Hace 2h' },
    { level: 'high', zona: 'La Paz', msg: 'Foco nuevo — 287 casos', time: 'Hace 1h' },
    { level: 'medium', zona: 'Centro', msg: 'Criadero reportado', time: 'Hace 4h' },
    { level: 'medium', zona: 'Metropolitano Sur', msg: 'Monitoreo activo', time: 'Hace 3h' },
    { level: 'low', zona: 'El Prado', msg: 'Bajo control', time: 'Hace 8h' },
    { level: 'low', zona: 'Riomar Norte', msg: 'Sin incidencias', time: 'Hace 6h' },
  ];

  const levelColor: Record<string, string> = { high: '#ba1a1a', medium: '#c79c16', low: '#006a60' };
  const levelBg: Record<string, string> = { high: '#ffdad6', medium: '#fff3cd', low: '#d4f5f0' };
  const levelLabel: Record<string, string> = { high: 'Alto', medium: 'Medio', low: 'Bajo' };

  return (
    <div style={{ width: '100%', height: '100vh', overflowY: 'auto', background: '#f7f9fb' }}>
      <TopNav active="/mapa-de-riesgo" />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 48px 64px', display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* Map area */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {['Radio de Proximidad', 'Historial 30 días', 'Criaderos Reportados'].map(f => (
              <button key={f} onClick={() => alert(`Filtro "${f}" aplicado.`)} style={{ fontFamily: 'Open Sans,sans-serif', fontSize: 13, fontWeight: 600, color: '#006a60', background: '#e6f4f2', border: '1px solid #006a60', borderRadius: 9999, padding: '6px 16px', cursor: 'pointer' }}>{f}</button>
            ))}
          </div>

          <div style={{ background: '#fff', border: '1px solid #bbcac6', borderRadius: 16, overflow: 'hidden', height: 520 }}>
            <InteractiveMap />
          </div>

          <div style={{ marginTop: 16, background: '#fff', border: '1px solid #bbcac6', borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 24, alignItems: 'center' }}>
            {Object.entries(levelLabel).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: levelColor[k] }} />
                <span style={{ fontFamily: 'Open Sans,sans-serif', fontSize: 13, color: '#3c4947' }}>Riesgo {v}</span>
              </div>
            ))}
            <span style={{ fontFamily: 'Open Sans,sans-serif', fontSize: 13, color: '#6b7280', marginLeft: 'auto' }}>Haz clic en una zona para ver detalles</span>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ width: 320, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Summary card */}
          <div style={{ background: '#fff', border: '1px solid #bbcac6', borderRadius: 12, padding: 24 }}>
            <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 18, color: '#1b1c1c', marginBottom: 16 }}>Resumen de Alertas</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[{ label: 'Zonas críticas', value: '2', color: '#ba1a1a' }, { label: 'Zonas medias', value: '3', color: '#c79c16' }, { label: 'Bajo control', value: '2', color: '#006a60' }].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'Open Sans,sans-serif', fontSize: 14, color: '#3c4947' }}>{r.label}</span>
                  <span style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 18, color: r.color }}>{r.value}</span>
                </div>
              ))}
            </div>
            <button onClick={() => nav('/reporte-de-riesgos')} style={{ fontFamily: 'Open Sans,sans-serif', fontWeight: 700, fontSize: 14, color: '#fff', background: '#006a60', border: 'none', borderRadius: 9999, padding: '10px 20px', cursor: 'pointer', width: '100%', marginTop: 20 }}>
              Reportar Riesgo
            </button>
          </div>

          {/* Alerts list */}
          <div style={{ background: '#fff', border: '1px solid #bbcac6', borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 16, color: '#1b1c1c', marginBottom: 16 }}>Alertas Recientes</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {alerts.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', paddingBottom: 12, borderBottom: i < alerts.length - 1 ? '1px solid #f0eeee' : 'none' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: levelColor[a.level], flexShrink: 0, marginTop: 4 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Open Sans,sans-serif', fontWeight: 600, fontSize: 13, color: '#1b1c1c' }}>{a.zona}</div>
                    <div style={{ fontFamily: 'Open Sans,sans-serif', fontSize: 12, color: '#6b7280' }}>{a.msg}</div>
                  </div>
                  <span style={{ fontFamily: 'Open Sans,sans-serif', fontSize: 11, color: '#9ca3af', flexShrink: 0 }}>{a.time}</span>
                </div>
              ))}
            </div>
            <button onClick={() => alert('Historial completo:\n🔴 Hace 2h — Brote en Rebolo\n🟡 Hace 4h — Criadero en Centro\n🔴 Hace 1d — Foco en La Paz\n🟢 Hace 3d — Fumigación en El Prado')} style={{ fontFamily: 'Open Sans,sans-serif', fontSize: 13, color: '#1a60a3', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 12, fontWeight: 600 }}>
              Ver historial completo →
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// ── PageReporteDeRiesgos ──────────────────────────────────────────────────────

type Urgencia = 'Baja' | 'Media' | 'Alta';

function PageReporteDeRiesgos() {
  const nav = useNav();
  const [tipoRiesgo, setTipoRiesgo] = useState('Criadero de mosquitos');
  const [urgencia, setUrgencia] = useState<Urgencia>('Media');
  const [descripcion, setDescripcion] = useState('');
  const [correo, setCorreo] = useState('');
  const [ubicacion, setUbicacion] = useState('');

  function chipStyle(level: Urgencia): React.CSSProperties {
    const base: React.CSSProperties = { fontFamily: 'Open Sans,sans-serif', fontSize: 14, fontWeight: 600, borderRadius: 9999, padding: '4px 14px', cursor: 'pointer', border: '1px solid transparent' };
    if (level === urgencia) {
      if (level === 'Baja') return { ...base, background: '#19b5a5', color: '#00403a' };
      if (level === 'Media') return { ...base, background: '#d3e4ff', border: '2px solid #1a60a3', color: '#001c38' };
      return { ...base, background: '#ffdad6', color: '#93000a' };
    }
    return { ...base, background: '#fff', border: '1px solid #bbcac6', color: '#3c4947' };
  }

  const [enviando, setEnviando] = useState(false);

  async function handleEnviar() {
    if (!descripcion.trim()) { alert('⚠️ Por favor ingresa una descripción del riesgo.'); return; }
    if (!correo.trim()) { alert('⚠️ Por favor ingresa tu correo electrónico.'); return; }

    setEnviando(true);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          tipo_riesgo: tipoRiesgo,
          urgencia,
          descripcion,
          correo_reportante: correo,
          ubicacion: ubicacion || 'No especificada',
        },
        EMAILJS_PUBLIC_KEY
      );
      alert('✅ Reporte enviado exitosamente\n\nRecibirás una confirmación en tu correo.\nSe atenderá en menos de 2 horas.');
      setTipoRiesgo('Criadero de mosquitos'); setUrgencia('Media'); setDescripcion(''); setCorreo(''); setUbicacion('');
      setTimeout(() => nav('/'), 500);
    } catch {
      alert('❌ Error al enviar el reporte. Verifica tu conexión e intenta de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  const inputStyle: React.CSSProperties = { fontFamily: 'Open Sans,sans-serif', fontSize: 16, color: '#1b1c1c', background: '#fbf9f8', border: '1px solid #bbcac6', borderRadius: 8, width: '100%', boxSizing: 'border-box', outline: 'none' };
  const labelStyle: React.CSSProperties = { display: 'block', fontFamily: 'Open Sans,sans-serif', fontWeight: 600, fontSize: 13, color: '#3c4947', letterSpacing: '0.7px', textTransform: 'uppercase', marginBottom: 8 };

  return (
    <div style={{ width: '100%', height: '100%', background: '#fbf9f8', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <TopNav active="/reporte-de-riesgos" />

      <main style={{ flex: 1, maxWidth: 1280, margin: '0 auto', width: '100%', padding: '24px 48px 40px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

          {/* Sidebar */}
          <aside style={{ width: 296, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: '#f6f3f2', border: '1px solid #bbcac6', borderRadius: 12, padding: 25 }}>
              <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 600, fontSize: 22, color: '#006a60', marginBottom: 12 }}>¿Por qué reportar?</h2>
              <p style={{ fontFamily: 'Open Sans,sans-serif', fontSize: 15, color: '#3c4947', lineHeight: 1.6, marginBottom: 16 }}>Tu participación es fundamental. Cada reporte activa protocolos de respuesta y ayuda a mapear zonas de riesgo.</p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, listStyle: 'none', padding: 0, margin: 0 }}>
                {['Acción rápida garantizada', 'Geolocalización precisa', 'Reporte 100% confidencial'].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}><circle cx="8" cy="8" r="8" fill="#1a60a3" /><path d="M5 8.5L7 10.5L11 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span style={{ fontFamily: 'Open Sans,sans-serif', fontSize: 14, fontWeight: 600, color: '#1b1c1c' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ background: '#fff', borderTop: '4px solid #c79c16', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontFamily: 'Open Sans,sans-serif', fontWeight: 700, fontSize: 13, color: '#483600', letterSpacing: '0.7px', textTransform: 'uppercase', marginBottom: 10 }}>PROTOCOLO DE SALUD</h3>
              <p style={{ fontFamily: 'Open Sans,sans-serif', fontSize: 15, color: '#3c4947', lineHeight: 1.6, fontStyle: 'italic' }}>"Si presentas fiebre alta, dolor de cabeza intenso o erupción en la piel, acude de inmediato a un centro de salud."</p>
            </div>
          </aside>

          {/* Form card */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ background: '#fff', border: '1px solid #bbcac6', borderRadius: 12, padding: '41px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ borderBottom: '1px solid #bbcac6', paddingBottom: 25, marginBottom: 40 }}>
                <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 32, color: '#1b1c1c', marginBottom: 8 }}>Formulario de Reporte</h1>
                <p style={{ fontFamily: 'Open Sans,sans-serif', fontSize: 16, color: '#3c4947' }}>Complete el formulario con la información del riesgo detectado. Su reporte será atendido en menos de 2 horas.</p>
              </div>

              <form style={{ display: 'flex', flexDirection: 'column', gap: 36 }} onSubmit={e => { e.preventDefault(); handleEnviar(); }}>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div>
                    <label style={labelStyle}>Tipo de Riesgo</label>
                    <div style={{ position: 'relative' }}>
                      <select value={tipoRiesgo} onChange={e => setTipoRiesgo(e.target.value)} style={{ ...inputStyle, padding: '13px 40px 13px 13px', appearance: 'none', cursor: 'pointer' }}>
                        {['Criadero de mosquitos', 'Agua estancada', 'Caso sospechoso', 'Brote confirmado', 'Otro'].map(o => <option key={o}>{o}</option>)}
                      </select>
                      <svg style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 9L15 1" stroke="#3c4947" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Nivel de Urgencia</label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {(['Baja', 'Media', 'Alta'] as Urgencia[]).map(l => (
                        <button key={l} type="button" style={chipStyle(l)} onClick={() => setUrgencia(l)}>{l}</button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Descripción del Riesgo</label>
                  <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Describa brevemente lo observado (ej. acumulación de agua estancada, llantas abandonadas...)" style={{ ...inputStyle, minHeight: 130, padding: 17, resize: 'none' }} />
                </div>

                <div>
                  <label style={labelStyle}>Correo Electrónico</label>
                  <div style={{ position: 'relative' }}>
                    <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} placeholder="tucorreo@ejemplo.com" style={{ ...inputStyle, padding: '14px 41px 14px 13px' }} />
                    <svg style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="18" height="14" viewBox="0 0 18 14" fill="none"><rect x="0.5" y="0.5" width="17" height="13" rx="1.5" stroke="#1a60a3" /><path d="M1 1L9 8L17 1" stroke="#1a60a3" strokeWidth="1.2" strokeLinecap="round" /></svg>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Ubicación exacta</label>
                  <div style={{ position: 'relative' }}>
                    <input type="text" value={ubicacion} onChange={e => setUbicacion(e.target.value)} placeholder="Calle, número, barrio o referencias visuales" style={{ ...inputStyle, padding: '14px 41px 14px 13px' }} />
                    <svg style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="20" viewBox="0 0 16 20" fill="none"><path d="M8 0C4.13 0 1 3.13 1 7c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5C6.62 9.5 5.5 8.38 5.5 7S6.62 4.5 8 4.5 10.5 5.62 10.5 7 9.38 9.5 8 9.5z" fill="#1a60a3" /></svg>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Confirmación en Mapa</label>
                  <div style={{ background: '#e8f0ef', height: 220, borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0 }}>
                      <InteractiveMap />
                    </div>
                    <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', background: '#fff', border: '1px solid #006a60', borderRadius: 9999, padding: '8px 18px', display: 'flex', gap: 8, alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', whiteSpace: 'nowrap' }}>
                      <svg width="14" height="18" viewBox="0 0 14 18" fill="none"><path d="M7 0C3.69 0 1 2.69 1 6c0 4.5 6 12 6 12s6-7.5 6-12c0-3.31-2.69-6-6-6zm0 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="#006a60" /></svg>
                      <span style={{ fontFamily: 'Open Sans,sans-serif', fontWeight: 600, fontSize: 13, color: '#1b1c1c' }}>Selecciona una zona en el mapa</span>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #bbcac6', paddingTop: 25, display: 'flex', gap: 24, justifyContent: 'flex-end', alignItems: 'center' }}>
                  <button type="button" onClick={() => { if (confirm('¿Cancelar el reporte?')) nav('/'); }} style={{ fontFamily: 'Open Sans,sans-serif', fontWeight: 600, fontSize: 16, color: '#1a60a3', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 16px' }}>Cancelar</button>
                  <button type="submit" disabled={enviando} style={{ fontFamily: 'Open Sans,sans-serif', fontWeight: 700, fontSize: 16, color: '#fff', background: enviando ? '#6b9e99' : '#006a60', border: 'none', borderRadius: 9999, padding: '12px 32px', cursor: enviando ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(0,106,96,0.3)', transition: 'background 0.2s' }}>
                    {enviando ? 'Enviando...' : 'Enviar Reporte'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ── App Root ──────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<AppPage>('/');
  return (
    <NavCtx.Provider value={setPage}>
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
        {page === '/' && <PageIncio />}
        {page === '/mapa-de-riesgo' && <PageMapaDeRiesgo />}
        {page === '/reporte-de-riesgos' && <PageReporteDeRiesgos />}
      </div>
    </NavCtx.Provider>
  );
}
