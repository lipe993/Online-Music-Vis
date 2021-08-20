const container = document.getElementById("container");
const canvas = document.getElementById("canvas1");
const file = document.getElementById("fileupload");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
let audioSource;
let analizer;
container.addEventListener("click", () => {
	const audio1 = document.getElementById("audio1");
	const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	audio1.load();
	audio1.play();
	audioSource = audioCtx.createMediaElementSource(audio1);
	analizer = audioCtx.createAnalyser();
	audioSource.connect(analizer);
	analizer.connect(audioCtx.destination);
	analizer.fftSize = 128;
	const bufferLength = analizer.frequencyBinCount;
	const dataArray = new Uint8Array(bufferLength);
	const barWidth = canvas.width/bufferLength;
	let barHeight;
	let x;
	function animate() {
		x = 0;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		analizer.getByteFrequencyData(dataArray);
		drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray);
		requestAnimationFrame(animate);
	}
	animate();
});
file.addEventListener("change", function(){
	const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	const files = this.files;
	const audio1 = document.getElementById("audio1");
	audio1.src = URL.createObjectURL(files[0]);
	audio1.load();
	audio1.play();
	audioSource = audioCtx.createMediaElementSource(audio1);
	analizer = audioCtx.createAnalyser();
	audioSource.connect(analizer);
	analizer.connect(audioCtx.destination);
	analizer.fftSize = 128;
	const bufferLength = analizer.frequencyBinCount;
	console.log(bufferLength);
	const dataArray = new Uint8Array(bufferLength);
	const barWidth = (canvas.width*0.5)/bufferLength;
	let barHeight;
	let x;
	function animate() {
		x = 0;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		analizer.getByteFrequencyData(dataArray);
		drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray);
		requestAnimationFrame(animate);
	}
	animate();
});
function drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray) {
	for(let i = 0; i < bufferLength; i++) {
		barHeight = dataArray[i] * 1.6 + 1;
		const red = i * barHeight/20;
		const green = i-7;
		const blue = i * 4;
		ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
		ctx.fillRect(x, canvas.height-barHeight, barWidth, barHeight);
		x += barWidth + 5;
	}
}