


const randomBetween = (min, max) => Math.random() * (max - min) + min;

export class Art {
    constructor(audioContext, arts) {
        this.x = Math.floor(Math.random() * window.innerWidth);
        this.y = Math.floor(Math.random() * window.innerHeight);
        this.width = Math.floor(Math.random() * 50);
        this.random = randomBetween(0, window.innerWidth);
        this.id = Math.random() * 100000000;
        this.audioContext = audioContext;
        this.oscillator = this.audioContext.createOscillator();
        this.output = this.audioContext.createGain();
        this.oscillator.type = Math.random() < .8 ? 'sine' : 'sine';
        this.oscillator.start();
        this.oscillator.connect(this.output);
        this.output.gain.value = 0.0001
        const convolver = this.audioContext.createConvolver();
        convolver.buffer = this.impulseResponseBuffer(12, 4, false);

        this.output.connect(convolver);

        convolver.connect(this.audioContext.destination);

        this.output.gain.linearRampToValueAtTime(randomBetween(0.05, 0.1), this.audioContext.currentTime + randomBetween(0, 1))

        this.notes = [
            { q: 261.63, color: 'rgba(97, 7, 181, 1)', r: [97, 7, 181] },
            { q: 311.13, color: 'rgba(63, 5, 117, 1)', r: [63, 5, 117] },
            { q: 349.23, color: 'rgba(130, 10, 245, 1)', r: [130, 10, 245] },
            { q: 392, color: 'rgba(118, 9, 219, 1)', r: [118, 9, 219] },
            { q: 311.13, color: 'rgba(115, 7, 181, 1)', r: [115, 7, 181] },
            { q: 466.16, color: 'rgba(155, 10, 245, 1)', r: [155, 10, 245] },
            { q: 523.25, color: 'rgba(139, 9, 219, 1)', r: [139, 9, 219] },
            { q: 587.33, color: 'rgba(74, 0, 117, 1)', r: [74, 0, 117] },
            { q: 622.25, color: 'rgba(74, 0, 117, 1)', r: [74, 0, 117] }]

        const note = this.notes[Math.floor(Math.random() * this.notes.length)]
        this.note = note.q;
        this.color = note.color;
        this.spectrum = note.r;
        this.width = this.output.gain.value * 100
        const ra = Math.random() < .5 ? Math.random() < .5 ? 4 : 3 : Math.random() < .5 ? 2 : 1
        this.oscillator.frequency.value = this.note / ra;
        this.output.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + randomBetween(3, 10))

    }

    impulseResponseBuffer(duration, decay, reverse) {
        let sampleRate = this.audioContext.sampleRate;
        let length = sampleRate * duration;
        let impulse = this.audioContext.createBuffer(2, length, sampleRate);
        let impulseL = impulse.getChannelData(0);
        let impulseR = impulse.getChannelData(1);

        if (!decay)
            decay = 2.0;
        for (let i = 0; i < length; i++) {
            let n = reverse ? length - i : i;
            impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
            impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
        }
        return impulse;
    }


    move() {

        this.random += this.output.gain.value * 5;
        this.y += 2;
        this.x += 2;
        // this.width = this.output.gain.value * 10000

        if (this.output.gain.value <= 0) {
            this.oscillator.disconnect()
        }

    }
}
