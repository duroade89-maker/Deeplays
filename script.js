const audioFile = document.getElementById("audioFile");
const audioPlayer = document.getElementById("audioPlayer");

audioFile.addEventListener("change", function () {
    const file = this.files[0];

    if (file) {
        const url = URL.createObjectURL(file);
        audioPlayer.src = url;
        audioPlayer.play();
    }
});

const startBtn = document.getElementById("startRecord");
const stopBtn = document.getElementById("stopRecord");
const recordings = document.getElementById("recordings");

let mediaRecorder;
let audioChunks = [];

startBtn.addEventListener("click", async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
    });

    mediaRecorder = new MediaRecorder(stream);

    audioChunks = [];

    mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {

        const audioBlob = new Blob(audioChunks, {
            type: "audio/webm"
        });

        const audioUrl = URL.createObjectURL(audioBlob);

        const container = document.createElement("div");
        container.classList.add("recording");

        const audio = document.createElement("audio");
        audio.controls = true;
        audio.src = audioUrl;

        const download = document.createElement("a");
        download.href = audioUrl;
        download.download = `DeePlays_Recording_${Date.now()}.webm`;
        download.classList.add("download-link");
        download.textContent = "Save Recording";

        container.appendChild(audio);
        container.appendChild(document.createElement("br"));
        container.appendChild(download);

        recordings.prepend(container);
    };

    mediaRecorder.start();

    startBtn.disabled = true;
    stopBtn.disabled = false;
});

stopBtn.addEventListener("click", () => {

    mediaRecorder.stop();

    startBtn.disabled = false;
    stopBtn.disabled = true;
});