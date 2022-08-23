import { Art } from './art.js';

const d = document;
const canvas = d.createElement("canvas");
d.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

const randomBetween = (min, max) => Math.random() * (max - min) + min;
const newContext = () => {
    const audioContext = window.AudioContext || window.webkitAudioContext;
    return new audioContext({ sampleRate: 48000 });
}

const audioContext = newContext();

let arts = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function main() {
    ctx.fillStyle = "#230124"
    ctx.imageSmoothingEnabled = true;
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    arts.forEach(e => {
        ctx.beginPath();
        const [r, g, b] = e.spectrum;
        const color = `rgba(${r}, ${g}, ${b}, ${e.output.gain.value}`;
        ctx.strokeStyle = color;
        ctx.moveTo(e.x - e.width, e.y);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round'

        ctx.stroke()
        e.move();
        if (e.output.gain.value <= 0) {
            arts = arts.filter(f => f.id !== e.id);
        }
        ctx.fillStyle = color
        ctx.shadowColor = color;
        ctx.strokeStyle = color;
        ctx.shadowColor = `white`;
        ctx.lineWidth = 1
        ctx.shadowBlur = 40
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.lineWidth = 1 * e.output.gain.value;

        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.lineTo(e.x, e.y);
        ctx.bezierCurveTo(e.x, e.y, e.x * e.output.gain.value, e.y * e.output.gain.value, e.output.gain.value / e.random, e.random * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.closePath()

    })
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    ctx.lineWidth = 1;
    for (const element of arts) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(225,225,225,${element.output.gain.value})`
        ctx.shadowColor = "gold";
        ctx.lineWidth = element.output.gain.value * 100;
        ctx.arc(canvas.width / 2, (canvas.height / 2), element.output.gain.value * canvas.width, 0, Math.PI * 2);
        ctx.stroke()
        ctx.closePath();
    };
}
function add(interval) {
    Math.random() < .5 ? arts.push(new Art(audioContext, arts)) : false;
    Math.random() < .5 ? arts.push(new Art(audioContext, arts)) : false;
    Math.random() < .5 ? arts.push(new Art(audioContext, arts)) : false;
    Math.random() < .5 ? arts.push(new Art(audioContext, arts)) : false;
    clearInterval(interval);
    set()
}
let interval
function set() {
    interval = setInterval(() => add(interval), randomBetween(3000, 10000))
}

Math.random() < .5 ? arts.push(new Art(audioContext, arts)) : false;
Math.random() < .5 ? arts.push(new Art(audioContext, arts)) : false;
Math.random() < .5 ? arts.push(new Art(audioContext, arts)) : false;
Math.random() < .5 ? arts.push(new Art(audioContext, arts)) : false;
set()

interval = setInterval(() => add(interval), randomBetween(1000, 5000))

window.addEventListener('blur', () => {
    arts = [];

    clearInterval(interval)
})
window.addEventListener('focus', () => {
    set();
});


window.addEventListener("resize", _ =>
    resize()
);

function draw() {
    main();
    requestAnimationFrame(draw)
}

resize()
main();
draw();
