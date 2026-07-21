# 🎛️ CARTOGRAPHER // OP-MIR-1

> **Acoustic Space Engine & Interactive Audio Similarity Map**  
> *Mappatura topologica e analisi spettrale di librerie sonore in tempo reale.*

[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Web Audio API](https://img.shields.io/badge/Web_Audio_API-Enabled-45B8AC?style=flat-square)](#)
[![Teenage Engineering UI](https://img.shields.io/badge/Design-Teenage_Engineering-FF4400?style=flat-square)](#)

---

## 👁️ Anteprima dell'Interfaccia

Il progetto adotta il design system hardware **"Cream / Field"** firmato **Teenage Engineering**: controlli industriali compatti, display LCD retroilluminato, tipografia monospaziata e palette cromatiche opache con dettagli *Orange*.

+-------------------------------------------------------------------------------+
| [OP-MIR-1]  CARTOGRAPHER // ACOUSTIC SPACE ENGINE            [GUIDA] [AUTHOR] |
+-------------------------------------------------------------------------------+
| LCD DISPLAY:  ACTIVE NODE: SUB KICK 808 | CENTROID: 85 Hz | STATUS: READY     |
+-------------------------------------------------------+-----------------------+
| SPATIAL FIELD // ACOUSTIC MAP                         | INSPECTOR             |
|                                                       |  - TRACK: SUB KICK    |
|   ● (Bass Zone)                                       |  - TYPE: KICK         |
|             \                                         |  - CENTROID: 85 Hz    |
|              \                                        |  - ENERGY: 0.842      |
|               ●---● (Percussions)                     |                       |
|                   |                                   | [ PLAY ] [ DELETE ]   |
|                   ● (Synth/Pads)                      | --------------------- |
|                                                       | GESTIONE DATASET      |
|                                                       | [ CARICA WAV / MP3 ]  |
|                                                       | [ RICALCOLA UMAP ]    |
+-------------------------------------------------------+-----------------------+
| OP-MIR-1 FIELD EDITION // REVISION 4.5                                        |
+-------------------------------------------------------------------------------+

---

## ⚡ Cos'è Cartographer?

**Cartographer** è un'applicazione web interattiva di **Music Information Retrieval (MIR)**. Analizza le caratteristiche timbriche, spettrali ed energetiche dei file audio (presi da una libreria di sintesi interna o caricati dall'utente) e li proietta su uno spazio bidimensionale.

I campioni audio acusticamente simili (come *kick*, *snare*, *pad* o *drone*) si aggregano automaticamente vicini tra loro, creando una vera e propria **mappa di navigazione sonora**.

---

## 🚀 Caratteristiche Principali

* **🔬 Estrazione Feature DSP (Digital Signal Processing)**:
  * **Spectral Centroid** (frequenza media/brillantezza del suono).
  * **RMS / Energy** (energia e ampiezza del segnale).
  * **MFCC** (Mel-Frequency Cepstral Coefficients, 13 coefficienti per l'impronta timbrica).
* **🗺️ Riduzione Topologica UMAP**:
  * Riduzione vettoriale ad alta dimensione (15 dimensioni) a uno spazio canvas 2D (X, Y).
  * Normalizzazione **Z-Score** pesata per evidenziare le differenze spettrali.
  * Loop di **Repulsione/Relaxing** per evitare la sovrapposizione visiva dei nodi.
* **🎹 Synthesizer Audio Engine Integrato**:
  * Inizializzazione istantanea con un dataset demo di **24 preset sintetizzati in Web Audio API** (Bass, Kick, Acid, Pad, Glitch, Reverse FX, ecc.).
* **📂 Drag & Drop e Importazione Personale**:
  * Possibilità di trascinare o caricare i propri file `.wav` o `.mp3` per mapparli in tempo reale.
* **🌐 Grafo di Prossimità (2-KNN)**:
  * Connessione visiva automatica tra i nodi audio più vicini nello spazio acustico.

---

## 📐 Come Funziona: Architettura MIR e Formule Matematiche

Il motore di **Cartographer** trasforma un segnale audio temporale in un punto nello spazio cartesiano attraverso una pipeline a 4 fasi:

Segnale Audio PCM ➔ Estrazione Feature DSP ➔ Normalizzazione Vector ➔ Proiezione UMAP / Physics

### 1. Estrazione Spettrale (DSP)

Ogni file audio viene diviso in frame e analizzato tramite Trasformata di Fourier Veloce (**FFT**). Per ciascun frame vengono calcolate tre metriche chiave:

#### A. Spectral Centroid (Baricentro Spettrale)
Rappresenta il "centro di gravità" delle frequenze del suono ed è direttamente correlato con la brillantezza percepita dal timbro.

* Formula: **Centroid = Σ ( f(k) * |X(k)| ) / Σ |X(k)|**
* **f(k)** è la frequenza centrale del bin k.
* **|X(k)|** è la magnitudo dello spettro al bin k.

#### B. RMS / Energy (Valore Efficace)
Misura l'energia complessiva del segnale audio nel tempo:

* Formula: **RMS = sqrt( (1 / N) * Σ |x(n)|^2 )**
* **x(n)** rappresenta l'ampiezza del campione n.

#### C. MFCC (Mel-Frequency Cepstral Coefficients)
I 13 coefficienti MFCC modellano l'inviluppo spettrale basandosi sulla scala Mel, che simula la percezione logaritmica dell'orecchio umano. Vengono calcolati applicando la Trasformata Discreta del Coseno (**DCT**) sui logaritmi delle energie dei filtri Mel:

* Formula: **c_m = Σ log(S_k) * cos( (π * m / M) * (k - 0.5) )**

---

### 2. Vettore delle Caratteristiche & Normalizzazione Z-Score

Per ogni campione audio si costruisce un **vettore caratteristico a 15 dimensioni**:
`v = [Centroid, RMS, MFCC_1, MFCC_2, ..., MFCC_13]`

Poiché le metriche hanno unità di misura differenti (es. Centroid espresso in Hz nell'ordine delle migliaia, RMS normalizzato fra 0 e 1), il sistema applica una **Standardizzazione Z-Score** su ogni dimensione j del dataset:

* Formula: **z_(i,j) = (x_(i,j) - μ_j) / σ_j**
* **μ_j** è la media della feature j su tutti i suoni caricati.
* **σ_j** è la deviazione standard della feature j.

La normalizzazione garantisce che il baricentro spettrale non domini rispetto all'energia o all'impronta timbrica durante la misurazione della distanza.

---

### 3. Misurazione della Similarità (Distanza Euclidea)

La similarità visiva e acustica nello spazio 15-dimensionale tra due campioni A e B si basa sulla **Distanza Euclidea Pesata**:

* Formula: **d(A, B) = sqrt( Σ w_j * (z_(A,j) - z_(B,j))^2 )**
* **w_j** è un fattore di peso che bilancia l'importanza di ciascuna proprietà.

---

### 4. Proiezione Topologica (UMAP & Relaxing Loop)

1. **UMAP (Uniform Manifold Approximation and Projection)**: Riduce lo spazio 15D ad un piano 2D (X, Y), conservando sia la struttura locale (suoni simili raggruppati) sia la struttura globale (relazione tra intere famiglie di strumenti).
2. **Post-Processing Fisico (Algoritmo Anti-Sovrapposizione)**: Per evitare che nodi quasi identici si sovrappongano del tutto sullo schermo, Cartographer applica un piccolo ciclo di **repulsione elettrostatica (Forza di Coulomb)**:
   * Formula: **F_rep = k * (r_ij / ||r_ij||^3)**
   
Questo permette di distanziare visivamente le sfere pur mantenendole all'interno del proprio cluster timbrico.

---

## 🛠️ Tech Stack

* **Frontend Framework**: Vanilla TypeScript + HTML5 Canvas API
* **Build Tool**: Vite 8
* **Audio Analysis**: Meyda (DSP Feature Extraction)
* **Dimensionality Reduction**: umap-js
* **Design & Font**: Custom CSS (Teenage Engineering Hardware Aesthetics), Google Fonts (*Space Mono*, *Silkscreen*, *Inter*)

---

## 📦 Installazione e Avvio Locale

Assicurati di avere Node.js (versione 20.19+ o superiore) installato.

1. **Clona il repository**:
   git clone https://github.com/flaviagaglio/cartographer.git
   cd cartographer

2. **Installa le dipendenze**:
   npm install

3. **Avvia il server di sviluppo**:
   npm run dev

4. **Apri nel browser**:
   Visita `http://localhost:5173` per esplorare la mappa sonora.

---

## 🎮 Come Usare l'Applicazione

1. **Esplora la Mappa**: Clicca su qualsiasi punto/nodo visibile nel Canvas per ascoltare il campione audio e leggere le sue metriche nel display LCD e nell'Inspector.
2. **Carica i tuoi Suoni**: Trascina dei file `.wav` o `.mp3` direttamente nell'area della mappa oppure usa il tasto **"CARICA FILE WAV / MP3"**.
3. **Ricalcola il Layout**: Dopo aver aggiunto o rimosso tracce, clicca su **"RICALCOLA MAPPA UMAP"** per riorganizzare lo spazio acustico.
4. **Svuota o Ripristina**: Usa **"SVUOTA MAPPA"** per lavorare solo con i tuoi file oppure **"RIPRISTINA DEMO"** per ricaricare i 24 synth sintetizzati di default.

---

## 👤 Autore

Made by **Flavia Gaglio**  
🔗 Portfolio / Website: https://flaviagaglio.github.io