import * as Tone from 'tone';

export const alarmSounds = {
  'Synth Beep': 'Synth Beep',
  'Simple Bell': 'Simple Bell',
  'Digital Tone': 'Digital Tone',
  'Morning Dove': 'Morning Dove',
  'Chirping Sparrow': 'Chirping Sparrow',
  'Forest Canary': 'Forest Canary',
  'Gentle Robin': 'Gentle Robin',
  'Soothing Warbler': 'Soothing Warbler',
} as const;

export type AlarmSound = keyof typeof alarmSounds;

const synths: { [key in AlarmSound]: () => void } = {
  'Synth Beep': () => {
    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease("C5", "8n");
  },
  'Simple Bell': () => {
    const synth = new Tone.MetalSynth({
      envelope: {
        attack: 0.001,
        decay: 1.4,
        release: 0.2,
      },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5,
    }).toDestination();
    synth.triggerAttackRelease("C4", "8n");
  },
  'Digital Tone': () => {
    const synth = new Tone.Synth({
      oscillator: {
        type: "square"
      },
      envelope: {
        attack: 0.01,
        decay: 0.2,
        sustain: 0.1,
        release: 0.1,
      }
    }).toDestination();
    synth.triggerAttackRelease("G4", "16n");
  },
  'Morning Dove': () => {
    const synth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.01, decay: 0.3, sustain: 0.2, release: 1 },
    }).toDestination();
    const now = Tone.now();
    synth.triggerAttackRelease('A4', '8n', now);
    synth.triggerAttackRelease('F#4', '8n', now + 0.3);
    synth.triggerAttackRelease('D4', '4n', now + 0.6);
  },
  'Chirping Sparrow': () => {
    const synth = new Tone.FMSynth({
        harmonicity: 3,
        modulationIndex: 10,
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.01, release: 0.2 },
        modulationEnvelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.2 }
    }).toDestination();
    const now = Tone.now();
    synth.triggerAttackRelease('C6', '16n', now);
    synth.triggerAttackRelease('E6', '16n', now + 0.1);
    synth.triggerAttackRelease('G6', '16n', now + 0.2);
  },
  'Forest Canary': () => {
    const synth = new Tone.MembraneSynth({
        pitchDecay: 0.01,
        octaves: 5,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 0.5, sustain: 0.01, release: 1.4 },
    }).toDestination();
    const now = Tone.now();
    synth.triggerAttackRelease('G5', '8n', now);
    synth.triggerAttackRelease('A5', '8n', now + 0.2);
    synth.triggerAttackRelease('G5', '8n', now + 0.4);
  },
  'Gentle Robin': () => {
    const synth = new Tone.PluckSynth({
        attackNoise: 1,
        dampening: 4000,
        resonance: 0.7
    }).toDestination();
    const now = Tone.now();
    synth.triggerAttackRelease('D5', now);
    synth.triggerAttackRelease('E5', now + 0.25);
    synth.triggerAttackRelease('C5', now + 0.5);
  },
  'Soothing Warbler': () => {
    const synth = new Tone.Synth({
        oscillator: { type: "triangle" },
        envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 0.4 }
    }).toDestination();
    const vibrato = new Tone.Vibrato("8n", 0.2).toDestination();
    synth.connect(vibrato);
    const now = Tone.now();
    synth.triggerAttackRelease('A5', '8n', now);
    synth.triggerAttackRelease('B5', '8n', now + 0.3);
    synth.triggerAttackRelease('G#5', '4n', now + 0.6);
  }
};

export const playSound = (sound: AlarmSound) => {
  if (Tone.context.state !== 'running') {
    Tone.start();
  }
  const player = synths[sound];
  if (player) {
    player();
  }
};
