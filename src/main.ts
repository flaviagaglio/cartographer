import Meyda from 'meyda';
import { UMAP } from 'umap-js';

// Funzione helper per sanificare i valori DSP ed evitare NaN / Infinity
function sanitize(val: number): number {
  return Number.isFinite(val) && !isNaN(val) ? val : 0;
}

// --- TEENAGE ENGINEERING "CREAM / FIELD" HARDWARE DESIGN SYSTEM ---
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Silkscreen&family=Inter:wght@400;500;600;700&display=swap');

    :root {
      --te-cream-bg: #f2efe6;
      --te-chassis: #e5e1d5;
      --te-panel: #dcd7c8;
      --te-lcd-bg: #222623;
      --te-lcd-text: #50ff40;
      --te-orange: #ff4400;
      --te-dark: #121315;
      --te-border: #1a1a1a;
      --te-btn-gray: #ccc7b8;
      --font-mono: 'Space Mono', monospace;
      --font-lcd: 'Silkscreen', monospace;
      --font-sans: 'Inter', sans-serif;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; border-radius: 0 !important; }

    body {
      background-color: var(--te-cream-bg);
      color: var(--te-dark);
      font-family: var(--font-mono);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px;
      -webkit-font-smoothing: antialiased;
    }

    input[type="file"] { display: none; }

    a.te-link {
      color: var(--te-dark);
      text-decoration: none;
      font-weight: 700;
      border-bottom: 2px solid var(--te-orange);
    }
    a.te-link:hover {
      background: var(--te-orange);
      color: #fff;
    }

    /* Hardware Chassis Container */
    .te-chassis-box {
      width: 100%;
      max-width: 1280px;
      background: var(--te-chassis);
      border: 3px solid var(--te-border);
      box-shadow: 8px 8px 0px rgba(0,0,0,0.15);
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      position: relative;
    }

    /* Top Bar Header */
    .te-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--te-panel);
      border: 2px solid var(--te-border);
      padding: 12px 18px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .te-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 700;
    }

    .te-badge {
      background: var(--te-orange);
      color: #fff;
      padding: 3px 8px;
      font-weight: 700;
    }

    /* LCD Screen Display */
    .te-lcd-screen {
      background: var(--te-lcd-bg);
      border: 2px solid var(--te-border);
      padding: 16px;
      color: var(--te-lcd-text);
      font-family: var(--font-lcd);
      font-size: 11px;
      box-shadow: inset 0 0 10px rgba(0,0,0,0.9);
      display: grid;
      grid-template-columns: 1fr 2fr 1fr;
      gap: 16px;
      align-items: center;
    }

    @media (max-width: 900px) {
      .te-lcd-screen { grid-template-columns: 1fr; }
    }

    .lcd-block {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .lcd-label {
      font-size: 8px;
      color: rgba(80, 255, 64, 0.5);
      text-transform: uppercase;
    }

    .lcd-val {
      font-size: 12px;
      color: var(--te-lcd-text);
      word-break: break-all;
    }

    /* Main Workspace Layout */
    .te-workspace {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 20px;
    }

    @media (max-width: 960px) {
      .te-workspace { grid-template-columns: 1fr; }
    }

    .te-map-frame {
      background: #fcfbfa;
      border: 2px solid var(--te-border);
      position: relative;
      height: 520px;
      display: flex;
      flex-direction: column;
    }

    .map-bar {
      background: var(--te-panel);
      border-bottom: 2px solid var(--te-border);
      padding: 8px 12px;
      font-size: 10px;
      color: #555;
      display: flex;
      justify-content: space-between;
      text-transform: uppercase;
      font-weight: 700;
      z-index: 10;
    }

    .canvas-area {
      position: relative;
      flex: 1;
      width: 100%;
      height: 100%;
    }

    canvas {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      touch-action: none;
    }

    .drop-overlay {
      position: absolute;
      inset: 0;
      background: rgba(242, 239, 230, 0.95);
      border: 3px dashed var(--te-orange);
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--te-orange);
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.15s ease;
      z-index: 100;
    }
    .drop-overlay.active { opacity: 1; }

    /* Control Panel */
    .te-controls {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .te-panel-card {
      background: var(--te-panel);
      border: 2px solid var(--te-border);
      padding: 16px;
    }

    .card-head {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: #555;
      border-bottom: 2px solid var(--te-border);
      padding-bottom: 8px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
    }

    .data-row {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      margin-bottom: 6px;
      border-bottom: 1px stroke rgba(0,0,0,0.1);
      padding-bottom: 4px;
    }

    .data-k { color: #666; }
    .data-v { color: var(--te-dark); font-weight: 700; }

    /* Buttons */
    .te-btn {
      width: 100%;
      background: var(--te-btn-gray);
      color: var(--te-dark);
      border: 2px solid var(--te-border);
      box-shadow: 3px 3px 0px var(--te-border);
      padding: 10px;
      font-family: var(--font-mono);
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      cursor: pointer;
      margin-top: 8px;
      text-align: center;
      display: block;
      transition: transform 0.05s ease, box-shadow 0.05s ease;
      user-select: none;
    }

    .te-btn:active:not(:disabled) {
      transform: translate(2px, 2px);
      box-shadow: 1px 1px 0px var(--te-border);
    }

    .te-btn-orange { background: var(--te-orange); color: #fff; }
    .te-btn-danger { background: #e57373; color: #000; }

    .te-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
      box-shadow: none;
    }

    .btn-grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    /* Modal Tutorial Overlay */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(18, 19, 21, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      padding: 20px;
      opacity: 1;
      transition: opacity 0.2s ease;
    }
    .modal-backdrop.hidden {
      opacity: 0;
      pointer-events: none;
    }

    .modal-window {
      background: var(--te-cream-bg);
      border: 3px solid var(--te-border);
      box-shadow: 10px 10px 0px var(--te-dark);
      max-width: 680px;
      width: 100%;
      padding: 28px;
      font-family: var(--font-sans);
    }

    .modal-title {
      font-family: var(--font-mono);
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      background: var(--te-dark);
      color: #fff;
      padding: 6px 10px;
      display: inline-block;
      margin-bottom: 16px;
    }

    .modal-subtitle {
      font-size: 15px;
      font-weight: 600;
      color: var(--te-dark);
      margin-bottom: 12px;
      line-height: 1.4;
    }

    .modal-body {
      font-size: 13px;
      color: #444;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .guide-steps {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
      margin: 16px 0;
      font-family: var(--font-mono);
    }

    .step-box {
      background: var(--te-panel);
      border: 1px solid var(--te-border);
      padding: 10px;
      font-size: 11px;
    }

    .step-num {
      color: var(--te-orange);
      font-weight: 700;
      margin-bottom: 4px;
    }

    footer {
      font-size: 10px;
      text-transform: uppercase;
      color: #777;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 12px;
      border-top: 2px solid var(--te-border);
    }
  </style>

  <!-- Chassis Principale -->
  <div class="te-chassis-box">
    <!-- Header -->
    <div class="te-header">
      <div class="te-logo">
        <span class="te-badge">OP-MIR-1</span>
        <span>CARTOGRAPHER // ACOUSTIC SPACE ENGINE</span>
      </div>
      <div style="display: flex; gap: 12px; align-items: center;">
        <button class="te-btn" id="open-guide-btn" style="margin: 0; padding: 4px 8px; font-size: 10px;">[ GUIDA / INFO ]</button>
        <span>BY <a href="https://flaviagaglio.github.io" target="_blank" rel="noopener noreferrer" class="te-link">FLAVIA GAGLIO</a></span>
      </div>
    </div>

    <!-- LCD Display Screen -->
    <div class="te-lcd-screen">
      <div class="lcd-block">
        <span class="lcd-label">ACTIVE NODE</span>
        <span class="lcd-val" id="lcd-name">NO TRACK</span>
      </div>
      <div class="lcd-block">
        <span class="lcd-label">DSP METRICS</span>
        <span class="lcd-val" id="lcd-metrics">CENTROID: -- Hz | RMS: --</span>
      </div>
      <div class="lcd-block">
        <span class="lcd-label">STATUS</span>
        <span class="lcd-val" id="lcd-status">READY</span>
      </div>
    </div>

    <!-- Workspace -->
    <div class="te-workspace">
      <!-- Field Canvas Map -->
      <div class="te-map-frame" id="drop-zone">
        <div class="map-bar">
          <span>SPATIAL FIELD // ACOUSTIC SIMILARITY MAP</span>
          <span>DRAG WAV/MP3 HERE</span>
        </div>

        <div class="canvas-area" id="canvas-container">
          <canvas id="map-canvas"></canvas>
          <div class="drop-overlay" id="drop-overlay">
            RILASCIA FILE PER ANALIZZARE E MAPPARE
          </div>
        </div>
      </div>

      <!-- Controls Panel -->
      <div class="te-controls">
        <div class="te-panel-card">
          <div class="card-head">
            <span>INSPECTOR</span>
            <span>DATA</span>
          </div>

          <div class="data-row">
            <span class="data-k">TRACK:</span>
            <span class="data-v" id="inspect-name">NESSUNA</span>
          </div>
          <div class="data-row">
            <span class="data-k">TYPE:</span>
            <span class="data-v" id="inspect-type">SELEZIONA UN NODO</span>
          </div>
          <div class="data-row">
            <span class="data-k">CENTROID:</span>
            <span class="data-v" id="inspect-centroid">-- Hz</span>
          </div>
          <div class="data-row">
            <span class="data-k">ENERGY:</span>
            <span class="data-v" id="inspect-energy">--</span>
          </div>
          <div class="data-row">
            <span class="data-k">COORDINATES:</span>
            <span class="data-v" id="inspect-coords">X: -- | Y: --</span>
          </div>

          <button class="te-btn te-btn-orange" id="play-btn" disabled>ASCOLTA TRACCIA</button>
          <button class="te-btn te-btn-danger" id="delete-node-btn" disabled>RIMUOVI TRACCIA</button>
        </div>

        <div class="te-panel-card">
          <div class="card-head">
            <span>GESTIONE DATASET</span>
            <span>SLOT</span>
          </div>

          <label class="te-btn" for="audio-input">CARICA FILE WAV / MP3</label>
          <input type="file" id="audio-input" accept="audio/*" multiple />

          <button class="te-btn" id="recluster-btn">RICALCOLA MAPPA UMAP</button>

          <div class="btn-grid-2">
            <button class="te-btn" id="clear-all-btn">SVUOTA MAPPA</button>
            <button class="te-btn" id="reset-demo-btn">RIPRISTINA DEMO</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer>
      <span>OP-MIR-1 FIELD EDITION // REVISION 4.5</span>
      <span>PORTFOLIO: <a href="https://flaviagaglio.github.io" target="_blank" rel="noopener noreferrer" class="te-link">FLAVIAGAGLIO.GITHUB.IO</a></span>
    </footer>
  </div>

  <!-- TUTORIAL / GUIDA POPUP MODAL -->
  <div class="modal-backdrop" id="modal-backdrop">
    <div class="modal-window">
      <div class="modal-title">OP-MIR-1 // USER MANUAL & GUIDA</div>
      <div class="modal-subtitle">A cosa serve e come funziona Cartographer?</div>
      
      <div class="modal-body">
        Cartographer è uno strumento di <strong>Audio Information Retrieval (MIR)</strong>. Mappa una libreria sonora in base alle caratteristiche fisiche e timbriche del suono, posizionando vicini i brani che si assomigliano acusticamente.

        <div class="guide-steps">
          <div class="step-box">
            <div class="step-num">01. DSP ANALYSIS</div>
            Estrazione di timbro (MFCC), frequenza media (Centroid) ed energia del segnale.
          </div>
          <div class="step-box">
            <div class="step-num">02. UMAP REDUCTION</div>
            Mappatura topologica dal vettore a 15 dimensioni ad una coordinata 2D (X,Y).
          </div>
          <div class="step-box">
            <div class="step-num">03. EXPLORATION</div>
            I suoni simili (es. droni, synth o percussioni) si raggruppano nella stessa zona.
          </div>
        </div>

        <strong>Come usarlo subito:</strong>
        <ul style="margin-left: 18px; margin-top: 8px;">
          <li>Clicca sui punti nella mappa per ascoltarne l'audio e vederne le metriche.</li>
          <li>Carica i tuoi file audio (.wav, .mp3) trascinandoli o usando il tasto <strong>"CARICA FILE"</strong>.</li>
          <li>Puoi pulire la mappa con <strong>"SVUOTA MAPPA"</strong> per analizzare esclusivamente i tuoi file.</li>
        </ul>
      </div>

      <button class="te-btn te-btn-orange" id="close-guide-btn" style="width: auto; padding: 12px 24px; font-size: 12px;">
        HO CAPITO // INIZIA ESPLORAZIONE
      </button>
    </div>
  </div>
`;

// --- DATA TYPES & AUDIO ENGINE ---
interface AudioNodeData {
  id: string;
  name: string;
  type: string;
  buffer?: AudioBuffer;
  features?: number[];
  x: number;
  y: number;
}

type PresetType = 
  | 'kick' | 'punchy_kick' | 'snare' | 'clap' 
  | 'hihat' | 'cymbal' | 'acid' | 'bell' 
  | 'chord' | 'pad' | 'noise' | 'zap'
  | 'deep_drone' | 'shimmer' | 'granular' | 'dark_fm'
  | 'modular_bleep' | 'resonant_pulse' | 'vinyl_crackle'
  | 'echo_pluck' | 'space_drone' | 'glitch_perc' | 'sub_swell' | 'reverse_fx';

const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
let dataset: AudioNodeData[] = [];
let selectedNode: AudioNodeData | null = null;
let hoverNode: AudioNodeData | null = null;

// DOM Elements
const canvas = document.getElementById('map-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const container = document.getElementById('canvas-container')!;
const lcdName = document.getElementById('lcd-name')!;
const lcdMetrics = document.getElementById('lcd-metrics')!;
const lcdStatus = document.getElementById('lcd-status')!;

const inspectName = document.getElementById('inspect-name')!;
const inspectType = document.getElementById('inspect-type')!;
const inspectCentroid = document.getElementById('inspect-centroid')!;
const inspectEnergy = document.getElementById('inspect-energy')!;
const inspectCoords = document.getElementById('inspect-coords')!;

const playBtn = document.getElementById('play-btn') as HTMLButtonElement;
const deleteNodeBtn = document.getElementById('delete-node-btn') as HTMLButtonElement;
const audioInput = document.getElementById('audio-input') as HTMLInputElement;
const reclusterBtn = document.getElementById('recluster-btn') as HTMLButtonElement;
const clearAllBtn = document.getElementById('clear-all-btn') as HTMLButtonElement;
const resetDemoBtn = document.getElementById('reset-demo-btn') as HTMLButtonElement;

const dropZone = document.getElementById('drop-zone')!;
const dropOverlay = document.getElementById('drop-overlay')!;

const modalBackdrop = document.getElementById('modal-backdrop')!;
const closeGuideBtn = document.getElementById('close-guide-btn')!;
const openGuideBtn = document.getElementById('open-guide-btn')!;

// Modal Handlers
closeGuideBtn.addEventListener('click', () => modalBackdrop.classList.add('hidden'));
openGuideBtn.addEventListener('click', () => modalBackdrop.classList.remove('hidden'));

function resizeCanvas() {
  const rect = container.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const width = rect.width > 0 ? rect.width : 780;
  const height = rect.height > 0 ? rect.height : 460;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);
  renderMap();
}
window.addEventListener('resize', resizeCanvas);

// Generatore Sintesi Audio Synth
function createSynthesizedPreset(type: PresetType): AudioBuffer {
  const sampleRate = audioCtx.sampleRate || 44100;
  const duration = 1.2;
  const buffer = audioCtx.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < buffer.length; i++) {
    const t = i / sampleRate;

    switch (type) {
      case 'kick': {
        const freq = 130 * Math.exp(-25 * t) + 35;
        data[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-4 * t);
        break;
      }
      case 'punchy_kick': {
        const freq = 200 * Math.exp(-35 * t) + 45;
        const click = (Math.random() * 2 - 1) * Math.exp(-150 * t);
        data[i] = (Math.sin(2 * Math.PI * freq * t) * Math.exp(-5 * t)) + click * 0.3;
        break;
      }
      case 'snare': {
        const tone = Math.sin(2 * Math.PI * 180 * t) * Math.exp(-15 * t);
        const noise = (Math.random() * 2 - 1) * Math.exp(-8 * t);
        data[i] = (tone * 0.4 + noise * 0.6);
        break;
      }
      case 'clap': {
        const env = Math.exp(-12 * t) * (Math.sin(t * 120) > 0 ? 1 : 0.2);
        const noise = (Math.random() * 2 - 1);
        data[i] = noise * env * 0.6;
        break;
      }
      case 'hihat': {
        const noise = (Math.random() * 2 - 1);
        const env = Math.exp(-40 * t);
        data[i] = noise * env * 0.4;
        break;
      }
      case 'cymbal': {
        const noise = (Math.random() * 2 - 1);
        const metallic = Math.sin(2 * Math.PI * 3450 * t) + Math.sin(2 * Math.PI * 5210 * t);
        const env = Math.exp(-2.5 * t);
        data[i] = (noise * 0.5 + metallic * 0.5) * env * 0.3;
        break;
      }
      case 'acid': {
        const env = Math.exp(-3 * t);
        const freq = 110 + 600 * env;
        data[i] = (Math.sin(2 * Math.PI * freq * t) > 0 ? 1 : -1) * env * 0.3;
        break;
      }
      case 'bell': {
        const env = Math.exp(-2 * t);
        data[i] = Math.sin(2 * Math.PI * 880 * t + 3 * Math.sin(2 * Math.PI * 1760 * t)) * env * 0.4;
        break;
      }
      case 'chord': {
        const env = Math.exp(-2.5 * t);
        const f1 = Math.sin(2 * Math.PI * 261.63 * t);
        const f2 = Math.sin(2 * Math.PI * 329.63 * t);
        const f3 = Math.sin(2 * Math.PI * 392.00 * t);
        data[i] = ((f1 + f2 + f3) / 3) * env * 0.5;
        break;
      }
      case 'pad': {
        const env = Math.sin(Math.PI * (t / duration));
        data[i] = Math.sin(2 * Math.PI * 440 * t) * env * 0.4;
        break;
      }
      case 'noise': {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-2 * t) * 0.3;
        break;
      }
      case 'zap': {
        const freq = 2000 * Math.exp(-20 * t) + 100;
        data[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-6 * t) * 0.5;
        break;
      }
      case 'deep_drone': {
        const lfo = 1 + 0.15 * Math.sin(2 * Math.PI * 1.5 * t);
        data[i] = Math.sin(2 * Math.PI * 55 * t) * lfo * 0.5;
        break;
      }
      case 'shimmer': {
        const env = Math.sin(Math.PI * (t / duration));
        const f1 = Math.sin(2 * Math.PI * 880 * t);
        const f2 = Math.sin(2 * Math.PI * 1760 * t);
        const f3 = Math.sin(2 * Math.PI * 3520 * t);
        data[i] = (f1 * 0.4 + f2 * 0.3 + f3 * 0.3) * env * 0.3;
        break;
      }
      case 'granular': {
        const grainPulse = Math.sin(2 * Math.PI * 18 * t) > 0.8 ? 1 : 0.05;
        const noise = (Math.random() * 2 - 1);
        const tone = Math.sin(2 * Math.PI * 1200 * t);
        data[i] = (tone * 0.5 + noise * 0.5) * grainPulse * Math.exp(-1.5 * t) * 0.4;
        break;
      }
      case 'dark_fm': {
        const modulator = Math.sin(2 * Math.PI * 311 * t) * 8;
        const carrier = Math.sin(2 * Math.PI * 220 * t + modulator);
        data[i] = carrier * Math.exp(-2 * t) * 0.4;
        break;
      }
      case 'modular_bleep': {
        const step = Math.floor(t * 12) % 4;
        const pitches = [440, 659, 880, 523];
        const freq = pitches[step];
        const env = Math.exp(-20 * (t % 0.083));
        data[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.4;
        break;
      }
      case 'resonant_pulse': {
        const square = Math.sin(2 * Math.PI * 140 * t) > 0 ? 1 : -1;
        const env = Math.exp(-3 * t);
        data[i] = square * env * 0.25;
        break;
      }
      case 'vinyl_crackle': {
        const crackle = Math.random() > 0.985 ? (Math.random() * 2 - 1) : 0;
        const hum = Math.sin(2 * Math.PI * 50 * t) * 0.05;
        data[i] = (crackle * 0.8 + hum) * Math.exp(-0.8 * t);
        break;
      }
      case 'echo_pluck': {
        const pluckFreq = 587.33;
        let signal = 0;
        const delays = [0, 0.2, 0.4, 0.6];
        delays.forEach((delay, idx) => {
          if (t >= delay) {
            const dt = t - delay;
            const amp = Math.pow(0.5, idx);
            signal += Math.sin(2 * Math.PI * pluckFreq * dt) * Math.exp(-12 * dt) * amp;
          }
        });
        data[i] = signal * 0.4;
        break;
      }
      case 'space_drone': {
        const env = Math.sin(Math.PI * (t / duration));
        const osc1 = Math.sin(2 * Math.PI * 110 * t);
        const osc2 = Math.sin(2 * Math.PI * 112.5 * t);
        data[i] = ((osc1 + osc2) / 2) * env * 0.4;
        break;
      }
      case 'glitch_perc': {
        const env = Math.exp(-120 * t);
        const freq = 3200 + Math.sin(2 * Math.PI * 400 * t) * 1000;
        data[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.5;
        break;
      }
      case 'sub_swell': {
        const swell = Math.pow(t / duration, 2);
        data[i] = Math.sin(2 * Math.PI * 40 * t) * swell * 0.6;
        break;
      }
      case 'reverse_fx': {
        const swell = 1 - Math.exp(-3 * t);
        const freq = 300 + t * 400;
        data[i] = Math.sin(2 * Math.PI * freq * t) * swell * Math.exp(-0.5 * t) * 0.4;
        break;
      }
    }
  }
  return buffer;
}

// Estrazione Feature DSP
function extractNodeFeatures(node: AudioNodeData) {
  if (!node.buffer) return;

  const channelData = node.buffer.getChannelData(0);
  const bufferSize = 512;

  Meyda.bufferSize = bufferSize;
  Meyda.sampleRate = node.buffer.sampleRate;

  let totalCentroid = 0;
  let totalEnergy = 0;
  let mfccSum = new Array(13).fill(0);
  let frames = 0;

  const step = 8;
  for (let i = 0; i < channelData.length - bufferSize; i += bufferSize * step) {
    const frame = channelData.slice(i, i + bufferSize);
    const res = Meyda.extract(['spectralCentroid', 'energy', 'mfcc'], frame);

    if (res) {
      if (typeof res.spectralCentroid === 'number') totalCentroid += sanitize(res.spectralCentroid);
      if (typeof res.energy === 'number') totalEnergy += sanitize(res.energy);
      if (Array.isArray(res.mfcc)) {
        res.mfcc.forEach((v, idx) => (mfccSum[idx] += sanitize(v)));
      }
      frames++;
    }
  }

  const avgCentroid = frames ? sanitize(totalCentroid / frames) : 0;
  const avgEnergy = frames ? sanitize(totalEnergy / frames) : 0;
  const avgMfcc = mfccSum.map((v) => (frames ? sanitize(v / frames) : 0));

  node.features = [avgCentroid, avgEnergy, ...avgMfcc];
}

// 1. Normalizzazione Z-Score Standardizzata (con Pesi)
function getNormalizedFeatureVectors(nodes: AudioNodeData[]): number[][] {
  const rawVectors = nodes.map(n => n.features!).filter(Boolean);
  if (rawVectors.length === 0) return [];

  const numFeatures = rawVectors[0].length;
  const numSamples = rawVectors.length;
  const normalized: number[][] = Array.from({ length: numSamples }, () => []);

  for (let f = 0; f < numFeatures; f++) {
    const vals = rawVectors.map(v => sanitize(v[f]));
    const mean = vals.reduce((a, b) => a + b, 0) / numSamples;
    const std = Math.sqrt(vals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / numSamples) || 1;

    // Diamo maggior peso a Spectral Centroid (0) ed Energy (1) per distanziare il timbro
    const weight = (f === 0 || f === 1) ? 2.5 : 1.0;

    for (let i = 0; i < numSamples; i++) {
      normalized[i][f] = sanitize(((rawVectors[i][f] - mean) / std) * weight);
    }
  }

  return normalized;
}

// 2. Calcolo Layout UMAP + Force Relaxation Loop per Repulsione Nodi
function computeUMAPLayout() {
  if (dataset.length === 0) {
    renderMap();
    lcdStatus.innerText = "EMPTY MAP";
    return;
  }

  lcdStatus.innerText = "CALCULATING UMAP...";

  dataset.forEach((item) => {
    if (!item.features) extractNodeFeatures(item);
  });

  const rect = container.getBoundingClientRect();
  const width = rect.width > 0 ? rect.width : 780;
  const height = rect.height > 0 ? rect.height : 460;
  const padding = 80;

  if (dataset.length < 2) {
    if (dataset[0]) {
      dataset[0].x = width / 2;
      dataset[0].y = height / 2;
    }
    renderMap();
    lcdStatus.innerText = "SINGLE NODE";
    return;
  }

  const normalizedVectors = getNormalizedFeatureVectors(dataset);

  try {
    const umap = new UMAP({
      nNeighbors: Math.min(8, Math.max(2, dataset.length - 1)),
      minDist: 0.9,
      spread: 2.0,
      nComponents: 2,
    });

    const embedding = umap.fit(normalizedVectors);

    const xVals = embedding.map((p) => p[0]);
    const yVals = embedding.map((p) => p[1]);
    const minX = Math.min(...xVals), maxX = Math.max(...xVals);
    const minY = Math.min(...yVals), maxY = Math.max(...yVals);

    dataset.forEach((item, index) => {
      let normX = (maxX - minX === 0) ? 0.5 : (embedding[index][0] - minX) / (maxX - minX);
      let normY = (maxY - minY === 0) ? 0.5 : (embedding[index][1] - minY) / (maxY - minY);

      item.x = padding + sanitize(normX) * (width - padding * 2);
      item.y = padding + sanitize(normY) * (height - padding * 2);
    });

  } catch (err) {
    console.warn("UMAP Fallback:", err);
    dataset.forEach((item) => {
      const cHz = item.features![0] || 0;
      const energy = item.features![1] || 0;
      item.x = padding + (Math.min(cHz / 5000, 1)) * (width - padding * 2);
      item.y = height - (padding + (Math.min(energy * 5, 1)) * (height - padding * 2));
    });
  }

  // Loop di Repulsione (Distanziamento Forzato Anti-Sovrapposizione)
  const minDistance = 70;
  for (let pass = 0; pass < 60; pass++) {
    for (let i = 0; i < dataset.length; i++) {
      for (let j = i + 1; j < dataset.length; j++) {
        let dx = dataset[j].x - dataset[i].x;
        let dy = dataset[j].y - dataset[i].y;
        let dist = Math.hypot(dx, dy);

        if (dist === 0) {
          dx = (Math.random() - 0.5) * 2;
          dy = (Math.random() - 0.5) * 2;
          dist = 1;
        }

        if (dist < minDistance) {
          const overlap = (minDistance - dist) / 2;
          const nx = (dx / dist) * overlap;
          const ny = (dy / dist) * overlap;

          dataset[i].x -= nx;
          dataset[i].y -= ny;
          dataset[j].x += nx;
          dataset[j].y += ny;
        }
      }
    }

    dataset.forEach(n => {
      n.x = Math.max(padding, Math.min(width - padding, n.x));
      n.y = Math.max(padding, Math.min(height - padding, n.y));
    });
  }

  lcdStatus.innerText = "READY";
  renderMap();
}

// 3. Rendering Canvas Pulito (Grafo KNN 2-Vicini + Etichette Sfondate)
function renderMap() {
  const rect = container.getBoundingClientRect();
  const width = rect.width > 0 ? rect.width : 780;
  const height = rect.height > 0 ? rect.height : 460;

  ctx.clearRect(0, 0, width, height);

  // Griglia Puntinata
  ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
  const step = 28;
  for (let x = step; x < width; x += step) {
    for (let y = step; y < height; y += step) {
      ctx.fillRect(x, y, 1.5, 1.5);
    }
  }

  if (dataset.length === 0) {
    ctx.font = "11px 'Space Mono', monospace";
    ctx.fillStyle = "#888888";
    ctx.textAlign = "center";
    ctx.fillText("MAPPA VUOTA — CARICA I TUOI FILE O RIPRISTINA LA DEMO", width / 2, height / 2);
    ctx.textAlign = "left";
    return;
  }

  // Linee KNN (Massimo 2 vicini più prossimi)
  ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
  ctx.lineWidth = 1;
  
  for (let i = 0; i < dataset.length; i++) {
    const distances = dataset
      .map((target, idx) => ({ idx, dist: Math.hypot(target.x - dataset[i].x, target.y - dataset[i].y) }))
      .filter(d => d.idx !== i)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 2);

    distances.forEach(d => {
      if (d.dist < 180) {
        ctx.beginPath();
        ctx.moveTo(dataset[i].x, dataset[i].y);
        ctx.lineTo(dataset[d.idx].x, dataset[d.idx].y);
        ctx.stroke();
      }
    });
  }

  // Render Nodi e Etichette
  dataset.forEach((item) => {
    const isSelected = selectedNode?.id === item.id;
    const isHovered = hoverNode?.id === item.id;

    if (isSelected || isHovered) {
      ctx.strokeStyle = isSelected ? "#ff4400" : "#121315";
      ctx.lineWidth = 1.5;
      const cs = 10;
      ctx.beginPath();
      ctx.moveTo(item.x - cs, item.y); ctx.lineTo(item.x + cs, item.y);
      ctx.moveTo(item.x, item.y - cs); ctx.lineTo(item.x, item.y + cs);
      ctx.stroke();
    }

    ctx.fillStyle = isSelected ? "#ff4400" : isHovered ? "#121315" : "#666666";
    ctx.fillRect(item.x - 3, item.y - 3, 6, 6);

    ctx.font = isSelected ? "700 10px 'Space Mono', monospace" : "10px 'Space Mono', monospace";
    const textWidth = ctx.measureText(item.name).width;
    
    // Rettangolo di sfondo per rendere il testo sempre leggibile
    ctx.fillStyle = isSelected ? "rgba(255, 68, 0, 0.15)" : "rgba(252, 251, 250, 0.85)";
    ctx.fillRect(item.x + 8, item.y - 9, textWidth + 6, 13);

    ctx.fillStyle = isSelected ? "#ff4400" : isHovered ? "#000000" : "#555555";
    ctx.fillText(item.name, item.x + 11, item.y + 1);
  });
}

function handlePointer(clientX: number, clientY: number, isClick: boolean) {
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  let found: AudioNodeData | null = null;
  for (const item of dataset) {
    if (Math.hypot(item.x - x, item.y - y) < 20) {
      found = item;
      break;
    }
  }

  if (isClick && found) {
    selectNode(found);
  } else if (!isClick && found !== hoverNode) {
    hoverNode = found;
    canvas.style.cursor = hoverNode ? 'pointer' : 'crosshair';
    renderMap();
  }
}

canvas.addEventListener('mousemove', (e) => handlePointer(e.clientX, e.clientY, false));
canvas.addEventListener('click', (e) => handlePointer(e.clientX, e.clientY, true));
canvas.addEventListener('touchstart', (e) => {
  if (e.touches.length > 0) handlePointer(e.touches[0].clientX, e.touches[0].clientY, true);
}, { passive: true });

function playAudioBuffer(buffer: AudioBuffer) {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);
  source.start(0);
}

function selectNode(node: AudioNodeData) {
  selectedNode = node;
  renderMap();

  const cHz = Math.round(node.features![0]);
  const rms = node.features![1].toFixed(3);

  lcdName.innerText = node.name.toUpperCase();
  lcdMetrics.innerText = `CENTROID: ${cHz} Hz | RMS: ${rms}`;

  inspectName.innerText = node.name.toUpperCase();
  inspectType.innerText = node.type.toUpperCase();
  inspectCentroid.innerText = `${cHz} Hz`;
  inspectEnergy.innerText = rms;
  inspectCoords.innerText = `X: ${Math.round(node.x)} | Y: ${Math.round(node.y)}`;

  playBtn.disabled = false;
  deleteNodeBtn.disabled = false;
  if (node.buffer) playAudioBuffer(node.buffer);
}

function clearSelection() {
  selectedNode = null;
  lcdName.innerText = "NO TRACK";
  lcdMetrics.innerText = "CENTROID: -- Hz | RMS: --";

  inspectName.innerText = "NESSUNA";
  inspectType.innerText = "SELEZIONA UN NODO";
  inspectCentroid.innerText = "-- Hz";
  inspectEnergy.innerText = "--";
  inspectCoords.innerText = "X: -- | Y: --";

  playBtn.disabled = true;
  deleteNodeBtn.disabled = true;
  renderMap();
}

// Handler Pulsanti UI
playBtn.addEventListener('click', () => {
  if (selectedNode?.buffer) playAudioBuffer(selectedNode.buffer);
});

deleteNodeBtn.addEventListener('click', () => {
  if (selectedNode) {
    dataset = dataset.filter((n) => n.id !== selectedNode!.id);
    clearSelection();
    computeUMAPLayout();
  }
});

reclusterBtn.addEventListener('click', () => {
  computeUMAPLayout();
});

clearAllBtn.addEventListener('click', () => {
  dataset = [];
  clearSelection();
  renderMap();
});

resetDemoBtn.addEventListener('click', () => {
  clearSelection();
  initDemoDataset();
});

// Importazione File Audio Personali
async function processAudioFiles(files: FileList | File[]) {
  lcdStatus.innerText = "PROCESSING AUDIO...";
  
  for (const file of Array.from(files)) {
    if (!file.type.startsWith('audio/')) continue;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      const newNode: AudioNodeData = {
        id: `custom-${Date.now()}-${Math.random()}`,
        name: file.name.replace(/\.[^/.]+$/, "").substring(0, 18),
        type: 'IMPORTED AUDIO',
        buffer: decodedBuffer,
        x: 0,
        y: 0,
      };

      extractNodeFeatures(newNode);
      dataset.push(newNode);
    } catch (err) {
      console.error("Errore caricamento file:", err);
    }
  }

  computeUMAPLayout();
}

audioInput.addEventListener('change', (e) => {
  const files = (e.target as HTMLInputElement).files;
  if (files && files.length > 0) processAudioFiles(files);
});

// Drag & Drop File Audio
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropOverlay.classList.add('active');
});

dropZone.addEventListener('dragleave', () => {
  dropOverlay.classList.remove('active');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropOverlay.classList.remove('active');
  if (e.dataTransfer?.files) processAudioFiles(e.dataTransfer.files);
});

// Popolamento Dataset Demo
function initDemoDataset() {
  const presets: { name: string; type: PresetType }[] = [
    { name: 'Sub Kick 808', type: 'kick' },
    { name: 'Punch Kick', type: 'punchy_kick' },
    { name: 'Lo-Fi Snare', type: 'snare' },
    { name: 'Hand Clap', type: 'clap' },
    { name: 'Closed Hi-Hat', type: 'hihat' },
    { name: 'Open Cymbal', type: 'cymbal' },
    { name: 'Acid Bass', type: 'acid' },
    { name: 'FM Bell', type: 'bell' },
    { name: 'Synth Chord', type: 'chord' },
    { name: 'Ambient Pad', type: 'pad' },
    { name: 'White Noise', type: 'noise' },
    { name: 'Laser Zap', type: 'zap' },
    { name: 'Deep Drone', type: 'deep_drone' },
    { name: 'Shimmer Reverb', type: 'shimmer' },
    { name: 'Granular Texture', type: 'granular' },
    { name: 'Dark FM Patch', type: 'dark_fm' },
    { name: 'Modular Bleep', type: 'modular_bleep' },
    { name: 'Resonant Pulse', type: 'resonant_pulse' },
    { name: 'Vinyl Crackle', type: 'vinyl_crackle' },
    { name: 'Echo Delay Pluck', type: 'echo_pluck' },
    { name: 'Space Drone', type: 'space_drone' },
    { name: 'Glitch Perc', type: 'glitch_perc' },
    { name: 'Sub Swell', type: 'sub_swell' },
    { name: 'Reverse FX', type: 'reverse_fx' },
  ];

  dataset = presets.map((item, idx) => {
    const buf = createSynthesizedPreset(item.type);
    const node: AudioNodeData = {
      id: `demo-${idx}`,
      name: item.name,
      type: item.type,
      buffer: buf,
      x: 0,
      y: 0,
    };
    extractNodeFeatures(node);
    return node;
  });

  computeUMAPLayout();
}

// Inizializzazione Applicazione
setTimeout(() => {
  resizeCanvas();
  initDemoDataset();
}, 100);