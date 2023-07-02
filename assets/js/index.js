const videoElement = document.getElementById("drop-zone-video");
const audioElement = document.getElementById("drop-zone-audio");
const progressBar = document.querySelector(".barz-inner");

let currentlyPlayingElement = null;

document.querySelectorAll(".drop-zone-input").forEach((inputElement) => {
    const dropZoneElement = inputElement.closest(".drop-zone");

    dropZoneElement.addEventListener("click", (e) => {
        inputElement.click();
    });

    inputElement.addEventListener("change", (e) => {
        if (inputElement.files.length) {
            updateThumbnail(dropZoneElement, inputElement.files[0]);
            const file = inputElement.files[0];
            if (file.type.startsWith("image/")) {
                displayImage(file);
            } else if (file.type.startsWith("video/")) {
                playVideo(file);
            } else if (file.type.startsWith("audio/")) {
                playAudio(file);
            }
        }
    });

    dropZoneElement.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZoneElement.classList.add("drop-zone--over");
    });

    ["dragleave", "dragend"].forEach((type) => {
        dropZoneElement.addEventListener(type, (e) => {
            dropZoneElement.classList.remove("drop-zone--over");
        });
    });

    dropZoneElement.addEventListener("drop", (e) => {
        e.preventDefault();

        if (e.dataTransfer.files.length) {
            inputElement.files = e.dataTransfer.files;
            updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith("image/")) {
                displayImage(file);
            } else if (file.type.startsWith("video/")) {
                playVideo(file);
            } else if (file.type.startsWith("audio/")) {
                playAudio(file);
            }
        }

        dropZoneElement.classList.remove("drop-zone--over");
    });
});

function updateThumbnail(dropZoneElement, file) {
    let thumbnailElement = dropZoneElement.querySelector(".drop-zone-image");

    // Show thumbnail for image files
    if (file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.onload = () => {
            thumbnailElement.src = reader.result;
            thumbnailElement.style.display = "block";
            videoElement.style.display = "none";
            audioElement.style.display = "none";
        };

        reader.readAsDataURL(file);
    } else if (file.type.startsWith("audio/")) {
        thumbnailElement.style.display = "none";
        videoElement.style.display = "none";
        audioElement.style.display = "block";
        audioElement.src = URL.createObjectURL(file);
        audioElement.play();
    } else {
        thumbnailElement.style.display = "none";
        videoElement.style.display = "none";
        audioElement.style.display = "none";
    }

    if (!thumbnailElement) {
        thumbnailElement = document.createElement("div");
        thumbnailElement.classList.add("drop-zone-thumb");
        rmv = document.getElementById("vlc-icon");
        rmv.style.display = "none";
        dropZoneElement.appendChild(thumbnailElement);
    }

    thumbnailElement.dataset.label = file.name;
}

document.querySelectorAll(".drop-zone-input").forEach((inputElement) => {
    const dropZoneElement = inputElement.closest(".drop-zone");
    const videoElement = dropZoneElement.querySelector(".drop-zone-video");

    dropZoneElement.addEventListener("click", (e) => {
        inputElement.click();
        videoElement.style.display = "block";
        audioElement.style.display = "none";
    });

    inputElement.addEventListener("change", (e) => {
        if (inputElement.files.length) {
            const file = inputElement.files[0];
            const fileURL = URL.createObjectURL(file);

            if (file.type.startsWith("video/")) {
                playVideo(fileURL);
                videoElement.play();
                videoElement.style.display = "block";
                audioElement.style.display = "none";
            } else if (file.type.startsWith("audio/")) {
                playAudio(fileURL);
                audioElement.play();
                videoElement.style.display = "none";
                audioElement.style.display = "block";
            }
        }
    });

    dropZoneElement.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZoneElement.classList.add("drop-zone--over");
    });

    ["dragleave", "dragend"].forEach((type) => {
        dropZoneElement.addEventListener(type, (e) => {
            dropZoneElement.classList.remove("drop-zone--over");
        });
    });

    dropZoneElement.addEventListener("drop", (e) => {
        e.preventDefault();

        if (e.dataTransfer.files.length) {
            const file = e.dataTransfer.files[0];
            const fileURL = URL.createObjectURL(file);

            if (file.type.startsWith("video/")) {
                playVideo(fileURL);
                videoElement.src = fileURL;
                videoElement.play();
                videoElement.style.display = "block";
                audioElement.style.display = "none";
            } else if (file.type.startsWith("audio/")) {
                playAudio(fileURL);
                audioElement.src = fileURL;
                audioElement.play();
                videoElement.style.display = "none";
                audioElement.style.display = "block";
            }
        }

        dropZoneElement.classList.remove("drop-zone--over");
    });
});

function displayImage(file) {
    if (currentlyPlayingElement) {
        currentlyPlayingElement.src = "";
        currentlyPlayingElement.style.display = "none";
        currentlyPlayingElement = null;
        progressBar.style.width = 0;
        document.getElementById("time-one").innerHTML = '--:--'
        document.getElementById("time-two").innerHTML = '--:--'
    }

    const thumbnailElement = document.getElementById("thumbnail");
    const reader = new FileReader();
    document.getElementById("time-one").innerHTML = '--:--';
    document.getElementById("time-two").innerHTML = '--:--';
    reader.onload = () => {
        thumbnailElement.src = reader.result;
        thumbnailElement.style.display = "block";
    };

    reader.readAsDataURL(file);
}

function playVideo(fileURL) {
    if (currentlyPlayingElement === audioElement) {
        audioElement.src = "";
        audioElement.style.display = "none";
        progressBar.style.width = 0;
    }

    videoElement.src = fileURL;
    videoElement.play();
    videoElement.style.display = "block";
    currentlyPlayingElement = videoElement;
}

function playAudio(fileURL) {
    if (currentlyPlayingElement === videoElement) {
        videoElement.src = "";
        videoElement.style.display = "none";
        progressBar.style.width = 0;
    }

    audioElement.src = fileURL;
    audioElement.play();
    audioElement.style.display = "block";
    currentlyPlayingElement = audioElement;
}

videoElement.addEventListener("timeupdate", () => {
    const currentTime = videoElement.currentTime;
    const formattedTime = formatTime(currentTime);
    let Ctime = document.getElementById("time-one");
    Ctime.innerHTML = formattedTime;
});

audioElement.addEventListener("timeupdate", () => {
    const currentTime = audioElement.currentTime;
    const formattedTime = formatTime(currentTime);
    let Ctime = document.getElementById("time-one");
    Ctime.innerHTML = formattedTime;
});

videoElement.addEventListener("loadedmetadata", () => {
    const duration = videoElement.duration;
    const formattedDuration = formatTime(duration);
    let Ctime = document.getElementById("time-two");
    Ctime.innerHTML = formattedDuration;
});

audioElement.addEventListener("loadedmetadata", () => {
    const duration = audioElement.duration;
    const formattedDuration = formatTime(duration);
    let Ctime = document.getElementById("time-two");
    Ctime.innerHTML = formattedDuration;
});

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
}

videoElement.addEventListener("play", () => {
    videoElement.addEventListener("timeupdate", updateProgressBar);

    function updateProgressBar() {
        const currentTime = videoElement.currentTime;
        const duration = videoElement.duration;
        const progress = (currentTime / duration) * 100;
        progressBar.style.width = `${progress}%`;
    }
});

audioElement.addEventListener("play", () => {
    audioElement.addEventListener("timeupdate", updateProgressBar);

    function updateProgressBar() {
        const currentTime = audioElement.currentTime;
        const duration = audioElement.duration;
        const progress = (currentTime / duration) * 100;
        progressBar.style.width = `${progress}%`;
    }
});

function Vplay() {
    videoElement.play();
    audioElement.play();
}

function Vpause() {
    videoElement.pause();
    audioElement.pause();
}

function Vstop() {
    if (currentlyPlayingElement) {
        currentlyPlayingElement.src = "";
        currentlyPlayingElement.style.display = "none";
        currentlyPlayingElement = null;
        progressBar.style.width = 0;
        document.getElementById("time-one").innerHTML = '--:--'
        document.getElementById("time-two").innerHTML = '--:--'
        Vstop();
    } else {
        document.getElementById("time-one").innerHTML = '--:--';
        document.getElementById("time-two").innerHTML = '--:--';
    }
}


function Vfullscreen() {
    const docElement = document.documentElement;

    if (
        !document.fullscreenElement &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement
    ) {
        // Enter fullscreen
        if (docElement.requestFullscreen) {
            docElement.requestFullscreen();
        } else if (docElement.mozRequestFullScreen) {
            docElement.mozRequestFullScreen();
        } else if (docElement.webkitRequestFullscreen) {
            docElement.webkitRequestFullscreen();
        } else if (docElement.msRequestFullscreen) {
            docElement.msRequestFullscreen();
        }
    } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

const volumeRange = document.getElementById('volume-range');

volumeRange.addEventListener('input', () => {
    const volume = volumeRange.value / 100;
    videoElement.volume = volume;
    audioElement.volume = volume;
});