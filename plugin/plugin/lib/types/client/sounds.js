/**
 * Synthesized classic sounds. Generated with Web Audio at play time, so no
 * audio files ship and nothing Microsoft owns is redistributed.
 * @module dsh-clippy/client/sounds
 */
let context;
function ctx() {
    if (context === undefined)
        context = new AudioContext();
    return context;
}
function tone(freq, startMs, durMs, type, gainPeak) {
    const audio = ctx();
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    const t0 = audio.currentTime + startMs / 1000;
    const t1 = t0 + durMs / 1000;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(gainPeak, t0 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t1);
    osc.connect(gain).connect(audio.destination);
    osc.start(t0);
    osc.stop(t1);
}
/** The error ding. Two-note chord in the spirit of the classic chord.wav. */
export function playError() {
    tone(523.25, 0, 380, 'triangle', 0.12);
    tone(415.3, 0, 380, 'triangle', 0.1);
    tone(311.13, 0, 420, 'triangle', 0.08);
}
/** The arrival chime. Rising two notes. */
export function playChime() {
    tone(659.25, 0, 140, 'sine', 0.09);
    tone(987.77, 130, 220, 'sine', 0.09);
}
/** The celebration blip. */
export function playTada() {
    tone(523.25, 0, 110, 'square', 0.05);
    tone(659.25, 100, 110, 'square', 0.05);
    tone(783.99, 200, 240, 'square', 0.06);
}
