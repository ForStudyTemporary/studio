import * as Tone from 'tone';

export const alarmSounds = {
  'Synth Beep': 'Synth Beep',
  'Simple Bell': 'Simple Bell',
  'Digital Tone': 'Digital Tone',
} as const;

export type AlarmSound = keyof typeof alarmSounds;

const synths: { [key in AlarmSound]: () => void } = {
  'Synth Beep': () => {
    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease("C5", "8n");
  },
  'Simple Bell': () => {
    const synth = new Tone.MetalSynth({
      frequency: 300,
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
