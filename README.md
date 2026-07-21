# 🎛️ CARTOGRAPHER // OP-MIR-1

> **Acoustic Space Engine & Interactive Audio Similarity Map**  
> *Mappatura topologica e analisi spettrale di librerie sonore in tempo reale.*

[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Web Audio API](https://img.shields.io/badge/Web_Audio_API-Enabled-45B8AC?style=flat-square)](#)
[![Teenage Engineering UI](https://img.shields.io/badge/Design-Teenage_Engineering-FF4400?style=flat-square)](#)

---

## ⚡ Cos'è Cartographer?

**Cartographer** è un'applicazione web interattiva di **Music Information Retrieval (MIR)**. Analizza le caratteristiche timbriche, spettrali ed energetiche dei file audio e le proietta su uno spazio bidimensionale.

I campioni audio acusticamente simili (come *kick*, *snare*, *pad* o *drone*) si aggregano automaticamente vicini tra loro, creando una vera e propria **mappa di navigazione sonora**.

Il progetto adotta il design system hardware **"Cream / Field"** firmato **Teenage Engineering**: controlli industriali compatti, display LCD retroilluminato e palette cromatica minimale.

---

## 🚀 Caratteristiche Principali

* **🔬 Estrazione Feature DSP (Digital Signal Processing)**:
  * **Spectral Centroid**: Frequenza media e brillantezza percepita.
  * **RMS / Energy**: Energia e ampiezza del segnale.
  * **MFCC**: 13 coefficienti Mel-Frequency Cepstral per l'impronta timbrica.
* **🗺️ Riduzione Topologica UMAP**:
  * Proiezione ad alta dimensione (15D -> 2D) su Canvas HTML5.
  * Normalizzazione **Z-Score** pesata per bilanciare le metriche.
  * Algoritmo di **Repulsione/Relaxing** per evitare sovrapposizioni visive.
* **🎹 Synthesizer Audio Engine Integrato**:
  * Inizializzazione con 24 preset sintetizzati direttamente tramite **Web Audio API**.
* **📂 Importazione Personale**:
  * Supporto Drag & Drop per file `.wav` e `.mp3`.
* **🌐 Grafo di Prossimità (2-KNN)**:
  * Connessione visiva automatica tra i nodi audio acusticamente più vicini.

---

## 📐 Architettura MIR e Fondamenti Matematici

Il motore di Cartographer trasforma un segnale audio temporale in coordinate cartesiane attraverso una pipeline a 4 fasi:

Audio PCM ➔ Estrazione DSP ➔ Normalizzazione Z-Score ➔ Proiezione UMAP / Fisica

### 1. Estrazione Spettrale (DSP)

Ogni segnale viene diviso in frame e analizzato tramite **Fast Fourier Transform (FFT)**:

#### A. Spectral Centroid
Rappresenta il baricentro delle frequenze ed è legato alla brillantezza timbrica:

* Formula: C = Σ ( f(k) * |X(k)| ) / Σ |X(k)|
* Dove f(k) è la frequenza del bin k e |X(k)| è la sua magnitudo.

#### B. RMS (Root Mean Square)
Misura l'energia complessiva del segnale:

* Formula: RMS = sqrt( (1 / N) * Σ |x(n)|^2 )

#### C. MFCC (Mel-Frequency Cepstral Coefficients)
Rappresentano la forma dell'inviluppo spettrale adattato alla percezione umana (Scala Mel) tramite Discrete Cosine Transform (DCT):

* Formula: c_m = Σ log(S_k) * cos( (π * m / M) * (k - 0.5) )

---

### 2. Standardizzazione Z-Score

Per ogni campione viene creato un vettore a 15 dimensioni:

v = [Centroid, RMS, MFCC_1, ..., MFCC_13]

Per evitare che valori elevati (es. Centroid in Hz) dominino su valori piccoli (es. RMS), si applica la normalizzazione Z-Score:

* Formula: z_(i,j) = (x_(i,j) - μ_j) / σ_j
* Dove μ_j è la media e σ_j è la deviazione standard della feature j.

---

### 3. Similarità e Distanza

La distanza acustica tra due campioni A e B nello spazio multidimensionale è calcolata tramite **Distanza Euclidea Pesata**:

* Formula: d(A, B) = sqrt( Σ w_j * (z_(A,j) - z_(B,j))^2 )

---

### 4. Proiezione Topologica e Layout Fisico

1. **UMAP**: Riduce lo spazio da 15D a 2D (X, Y) preservando sia i cluster locali sia le relazioni globali.
2. **Forza Repulsiva Anti-Sovrapposizione**: Per evitare sovrapposizioni visive tra nodi molto simili, viene applicato un ciclo di rilassamento basato sulla legge di repulsione elettrostatica:

* Formula: F_rep = k * (r_ij / ||r_ij||^3)

---

## 🛠️ Tech Stack

| Componente | Tecnologia |
| :--- | :--- |
| **Language** | TypeScript |
| **Build Tool** | Vite |
| **DSP / Audio Analysis** | Meyda |
| **Dimensionality Reduction** | UMAP-js |
| **Rendering** | HTML5 Canvas API |
| **Styling** | Custom CSS (Teenage Engineering Hardware Style) |

---

## 📦 Installazione e Avvio Locale

Assicurati di avere **Node.js** (v20+) installato.

1. Clona il repository:
   git clone https://github.com/flaviagaglio/cartographer.git

2. Entra nella cartella:
   cd cartographer

3. Installa le dipendenze:
   npm install

4. Avvia il server di sviluppo:
   npm run dev

Apri il browser all'indirizzo http://localhost:5173.

---

## 🎮 Guida all'Uso

1. **Esplorazione**: Clicca su qualsiasi nodo nel Canvas per riprodurre il suono e analizzarne le metriche nell'Inspector.
2. **Caricamento**: Trascina file `.wav` o `.mp3` nell'interfaccia per aggiungerli alla mappa.
3. **Ricalcolo**: Clicca su **"RICALCOLA MAPPA UMAP"** dopo aver modificato il dataset per riorganizzare i nodi.
4. **Reset**: Usa **"RIPRISTINA DEMO"** per ricaricare i campioni di sintesi di default.

---

## 👤 Autore

Made by **Flavia Gaglio**  
🔗 Website: https://flaviagaglio.github.io