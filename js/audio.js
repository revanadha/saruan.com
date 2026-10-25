/**
 * ============================================================================
 * WEDDING BACKGROUND MUSIC ENGINE
 * Mendukung file audio lokal (assets/audio/wedding-song.mp3)
 * dengan Fallback Romantis Web Audio API Synthesizer (Zero Dependency)
 * ============================================================================
 */

class WeddingAudioController {
  constructor() {
    this.isPlaying = false;
    this.audioElement = null;
    this.audioContext = null;
    this.synthInterval = null;
    this.synthGain = null;
    this.toggleButton = null;
    this.hasLocalAudio = false;

    this.initAudioElement();
  }

  initAudioElement() {
    // Utamakan file tanpa spasi agar kompatibel 100% di GitHub Pages dan Linux server
    const primaryAudioPath = 'assets/audio/wedding-song.mp3';
    const fallbackAudioPath = encodeURI('assets/audio/Ini Abadi - Perunggu Lirik Lagu.mp3');

    this.audioElement = new Audio(primaryAudioPath);
    this.audioElement.loop = true;
    this.audioElement.volume = 0.5;
    this.audioElement.preload = 'auto';

    this.audioElement.addEventListener('error', () => {
      // Jika wedding-song.mp3 tidak ditemukan, coba file nama lengkap dengan encodeURI
      if (this.audioElement.src.indexOf('wedding-song.mp3') !== -1) {
        this.audioElement.src = fallbackAudioPath;
        if (this.isPlaying) {
          this.audioElement.play().catch(() => this.startRomanticMelody());
        }
      } else {
        // Jika keduanya tidak ada, gunakan synthesizer
        if (this.isPlaying) {
          this.startRomanticMelody();
        }
      }
    });
  }

  initWebAudioSynth() {
    if (this.audioContext) return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioCtx();

      // Master gain node
      this.synthGain = this.audioContext.createGain();
      this.synthGain.gain.setValueAtTime(0.08, this.audioContext.currentTime);

      // Low pass filter untuk suara hangat & lembut seperti harpa/kotak musik
      const filter = this.audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, this.audioContext.currentTime);

      this.synthGain.connect(filter);
      filter.connect(this.audioContext.destination);
    } catch (e) {
      console.warn('Web Audio API not supported on this browser', e);
    }
  }

  playNote(frequency, duration, timeOffset = 0) {
    if (!this.audioContext || this.audioContext.state === 'suspended') return;

    const osc = this.audioContext.createOscillator();
    const noteGain = this.audioContext.createGain();

    // Gunakan triangle wave untuk karakter suara akustik/harpa yang hangat
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime + timeOffset);

    // Envelope nada: attack cepat, decay anggun
    const now = this.audioContext.currentTime + timeOffset;
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.35, now + 0.05);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(noteGain);
    noteGain.connect(this.synthGain);

    osc.start(now);
    osc.stop(now + duration + 0.1);
  }

  startRomanticMelody() {
    this.initWebAudioSynth();
    if (!this.audioContext) return;

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    // Progresi akor Canon in D (D, A, Bm, F#m, G, D, G, A)
    const melodyChords = [
      [293.66, 369.99, 440.00, 587.33], // D Major (D4, F#4, A4, D5)
      [220.00, 277.18, 329.63, 440.00], // A Major (A3, C#4, E4, A4)
      [246.94, 293.66, 369.99, 493.88], // B Minor (B3, D4, F#4, B4)
      [185.00, 220.00, 277.18, 369.99], // F# Minor (F#3, A3, C#4, F#4)
      [196.00, 246.94, 293.66, 392.00], // G Major (G3, B3, D4, G4)
      [293.66, 369.99, 440.00, 587.33], // D Major (D4, F#4, A4, D5)
      [196.00, 246.94, 293.66, 392.00], // G Major (G3, B3, D4, G4)
      [220.00, 277.18, 329.63, 440.00]  // A Major (A3, C#4, E4, A4)
    ];

    let chordIndex = 0;

    const playNextArpeggio = () => {
      if (!this.isPlaying) return;

      const chord = melodyChords[chordIndex];
      // Mainkan arpeggio lembut 4 nada berurutan
      chord.forEach((freq, i) => {
        this.playNote(freq, 1.8, i * 0.45);
      });

      chordIndex = (chordIndex + 1) % melodyChords.length;
    };

    playNextArpeggio();
    this.synthInterval = setInterval(playNextArpeggio, 2200);
  }

  stopRomanticMelody() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  play() {
    this.isPlaying = true;

    if (this.audioElement) {
      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Berhasil memutar MP3 lokal
            this.stopRomanticMelody();
          })
          .catch((err) => {
            console.warn('Gagal memutar audio, mencoba fallback synth:', err);
            this.startRomanticMelody();
          });
      }
    } else {
      this.startRomanticMelody();
    }

    this.updateUI();
  }

  pause() {
    this.isPlaying = false;

    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.stopRomanticMelody();

    this.updateUI();
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  updateUI() {
    if (!this.toggleButton) {
      this.toggleButton = document.getElementById('musicToggleBtn');
    }
    if (!this.toggleButton) return;

    if (this.isPlaying) {
      this.toggleButton.classList.add('playing');
      this.toggleButton.setAttribute('aria-label', 'Jeda musik latar');
      this.toggleButton.title = 'Jeda Musik Latar';
    } else {
      this.toggleButton.classList.remove('playing');
      this.toggleButton.setAttribute('aria-label', 'Putar musik latar');
      this.toggleButton.title = 'Putar Musik Latar';
    }
  }
}

// Inisialisasi kontroler musik global
window.weddingAudio = new WeddingAudioController();
