import { useCallback } from "react";

export const AUDIO_OPTIONS = [
  { id: "classical", label: "Soft Classical Music" },
  { id: "white-noise", label: "White Noise" },
  { id: "rain", label: "Rain Sounds" },
  { id: "silence", label: "Silence" },
];

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

class BackgroundAudioEngine {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    this.currentScene = null;
    this.currentOption = "silence";
    this.classicalInterval = null;
    this.pulseTimeout = null;
  }

  async ensureContext() {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;

      this.audioContext = new AudioCtx();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = 0.24;
      this.masterGain.connect(this.audioContext.destination);
    }

    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }

    return this.audioContext;
  }

  stopScene(scene, fadeSeconds = 0.65) {
    if (!scene || !this.audioContext) return;

    const now = this.audioContext.currentTime;
    scene.gain.gain.cancelScheduledValues(now);
    scene.gain.gain.setValueAtTime(scene.gain.gain.value, now);
    scene.gain.gain.linearRampToValueAtTime(0.0001, now + fadeSeconds);

    window.setTimeout(() => {
      scene.stop?.();
      scene.disconnect?.();
    }, Math.ceil((fadeSeconds + 0.08) * 1000));
  }

  createWhiteNoiseScene(context) {
    const sceneGain = context.createGain();
    sceneGain.gain.value = 0;

    const noiseBuffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const data = noiseBuffer.getChannelData(0);

    for (let i = 0; i < data.length; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = context.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const lowpass = context.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 1200;

    const highpass = context.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 120;

    source.connect(lowpass);
    lowpass.connect(highpass);
    highpass.connect(sceneGain);
    sceneGain.connect(this.masterGain);

    source.start();

    return {
      gain: sceneGain,
      stop: () => source.stop(),
      disconnect: () => {
        source.disconnect();
        lowpass.disconnect();
        highpass.disconnect();
        sceneGain.disconnect();
      },
    };
  }

  createRainScene(context) {
    const sceneGain = context.createGain();
    sceneGain.gain.value = 0;

    const rainBuffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const data = rainBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * 0.85;
    }

    const rainSource = context.createBufferSource();
    rainSource.buffer = rainBuffer;
    rainSource.loop = true;

    const rainBand = context.createBiquadFilter();
    rainBand.type = "bandpass";
    rainBand.frequency.value = 1100;
    rainBand.Q.value = 0.72;

    const rainLow = context.createBiquadFilter();
    rainLow.type = "lowpass";
    rainLow.frequency.value = 3800;

    const rainGain = context.createGain();
    rainGain.gain.value = 0.2;

    rainSource.connect(rainBand);
    rainBand.connect(rainLow);
    rainLow.connect(rainGain);
    rainGain.connect(sceneGain);

    const droplets = [];
    for (let i = 0; i < 6; i += 1) {
      const osc = context.createOscillator();
      const dropGain = context.createGain();
      osc.type = "triangle";
      osc.frequency.value = 550 + i * 120;
      dropGain.gain.value = 0;

      osc.connect(dropGain);
      dropGain.connect(sceneGain);
      osc.start();

      droplets.push({ osc, dropGain });
    }

    const scheduleDroplet = () => {
      const now = context.currentTime;
      droplets.forEach((drop, idx) => {
        if (Math.random() < 0.35) {
          const start = now + idx * 0.02 + Math.random() * 0.22;
          const attack = 0.02;
          const release = 0.18 + Math.random() * 0.24;

          drop.dropGain.gain.cancelScheduledValues(start);
          drop.dropGain.gain.setValueAtTime(0.0001, start);
          drop.dropGain.gain.linearRampToValueAtTime(0.03 + Math.random() * 0.03, start + attack);
          drop.dropGain.gain.exponentialRampToValueAtTime(0.0001, start + release);
        }
      });
    };

    const dropletInterval = window.setInterval(scheduleDroplet, 420);

    rainSource.start();

    return {
      gain: sceneGain,
      stop: () => {
        rainSource.stop();
        window.clearInterval(dropletInterval);
        droplets.forEach((drop) => drop.osc.stop());
      },
      disconnect: () => {
        rainSource.disconnect();
        rainBand.disconnect();
        rainLow.disconnect();
        rainGain.disconnect();
        droplets.forEach((drop) => {
          drop.osc.disconnect();
          drop.dropGain.disconnect();
        });
        sceneGain.disconnect();
      },
    };
  }

  createClassicalScene(context) {
    const sceneGain = context.createGain();
    sceneGain.gain.value = 0;

    const oscA = context.createOscillator();
    const oscB = context.createOscillator();
    const oscC = context.createOscillator();

    oscA.type = "sine";
    oscB.type = "triangle";
    oscC.type = "sine";

    const gainA = context.createGain();
    const gainB = context.createGain();
    const gainC = context.createGain();
    gainA.gain.value = 0.0001;
    gainB.gain.value = 0.0001;
    gainC.gain.value = 0.0001;

    const lowpass = context.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 2000;

    oscA.connect(gainA);
    oscB.connect(gainB);
    oscC.connect(gainC);
    gainA.connect(lowpass);
    gainB.connect(lowpass);
    gainC.connect(lowpass);
    lowpass.connect(sceneGain);
    sceneGain.connect(this.masterGain);

    const sequence = [261.63, 329.63, 392.0, 523.25, 392.0, 329.63, 293.66, 349.23];
    let step = 0;

    const scheduleStep = () => {
      const now = context.currentTime;
      const base = sequence[step % sequence.length];
      const notes = [base, base * 1.25, base * 1.5];
      const gains = [gainA, gainB, gainC];
      const oscs = [oscA, oscB, oscC];

      oscs.forEach((osc, index) => {
        const note = notes[index];
        const noteGain = gains[index];
        osc.frequency.cancelScheduledValues(now);
        osc.frequency.setValueAtTime(note, now);

        noteGain.gain.cancelScheduledValues(now);
        noteGain.gain.setValueAtTime(0.0001, now);
        noteGain.gain.linearRampToValueAtTime(0.026 - index * 0.005, now + 0.12);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);
      });

      step += 1;
    };

    scheduleStep();
    this.classicalInterval = window.setInterval(scheduleStep, 520);

    oscA.start();
    oscB.start();
    oscC.start();

    return {
      gain: sceneGain,
      stop: () => {
        if (this.classicalInterval) {
          window.clearInterval(this.classicalInterval);
          this.classicalInterval = null;
        }
        oscA.stop();
        oscB.stop();
        oscC.stop();
      },
      disconnect: () => {
        oscA.disconnect();
        oscB.disconnect();
        oscC.disconnect();
        gainA.disconnect();
        gainB.disconnect();
        gainC.disconnect();
        lowpass.disconnect();
        sceneGain.disconnect();
      },
    };
  }

  createScene(option, context) {
    if (option === "white-noise") return this.createWhiteNoiseScene(context);
    if (option === "rain") return this.createRainScene(context);
    if (option === "classical") return this.createClassicalScene(context);
    return null;
  }

  async setOption(option) {
    if (!AUDIO_OPTIONS.some((entry) => entry.id === option)) return;

    const context = await this.ensureContext();
    if (!context) return;

    this.currentOption = option;

    if (option === "silence") {
      this.stopScene(this.currentScene, 0.55);
      this.currentScene = null;
      return;
    }

    const nextScene = this.createScene(option, context);
    if (!nextScene) return;

    const now = context.currentTime;
    nextScene.gain.gain.setValueAtTime(0.0001, now);
    nextScene.gain.gain.linearRampToValueAtTime(1, now + 0.75);

    this.stopScene(this.currentScene, 0.75);
    this.currentScene = nextScene;
  }

  transitionPulse() {
    if (!this.audioContext || this.currentOption === "silence" || !this.masterGain) return;

    const now = this.audioContext.currentTime;
    const current = clamp(this.masterGain.gain.value, 0.08, 0.28);

    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(current, now);
    this.masterGain.gain.linearRampToValueAtTime(current * 0.68, now + 0.22);
    this.masterGain.gain.linearRampToValueAtTime(0.24, now + 0.85);

    if (this.pulseTimeout) {
      window.clearTimeout(this.pulseTimeout);
    }
    this.pulseTimeout = window.setTimeout(() => {
      if (!this.masterGain || !this.audioContext) return;
      const settleNow = this.audioContext.currentTime;
      this.masterGain.gain.cancelScheduledValues(settleNow);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, settleNow);
      this.masterGain.gain.linearRampToValueAtTime(0.24, settleNow + 0.25);
    }, 950);
  }
}

let sharedEngine = null;

const getEngine = () => {
  if (!sharedEngine) {
    sharedEngine = new BackgroundAudioEngine();
  }
  return sharedEngine;
};

export default function useBackgroundAudio() {
  const setBackgroundAudioOption = useCallback(async (option) => {
    await getEngine().setOption(option);
  }, []);

  const triggerSessionTransition = useCallback(() => {
    getEngine().transitionPulse();
  }, []);

  return { setBackgroundAudioOption, triggerSessionTransition };
}
