const videoElement = document.getElementById("drop-zone-video");
const audioElement = document.getElementById("drop-zone-audio");
const albumArtElement = document.getElementById('drop-zone-image');
const progressBar = document.getElementById("progressbar");
const progressBar2 = document.querySelector(".barz-inner-2");
const volumeRange = document.getElementById('volume-range');
const repeat = document.getElementById('btn-repeat');
const playpause = document.getElementById('btn-play-pause');

let jsmediatags = window.jsmediatags;
let isDragging = false;
let currentlyPlayingElement = null;

progressBar.addEventListener("input", handleInput);

function handleInput() {
    const progress = progressBar.value;
    seekTo(progress);
    progressBar.addEventListener("input", handleInput);
}

document.querySelectorAll(".drop-zone-input").forEach((inputElement) => {
    const dropZoneElement = inputElement.closest(".drop-zone");
    const openfile = document.getElementById('Menu-Open-File');
    const multiplefiles = document.getElementById('Menu-Multiple-Files');
    const menuquit = document.getElementById('Menu-Quit');

    const mute = document.getElementById('Mute');

    dropZoneElement.addEventListener("click", (e) => {
        inputElement.click();
    });

    openfile.addEventListener("click", (e) => {
        inputElement.click();
    });

    multiplefiles.addEventListener("click", (e) => {
        document.querySelector('.drop-zone-input').setAttribute('multiple', 'multiple');
        inputElement.click();
    });

    menuquit.addEventListener("click", (e) => {
        close()
    });

    mute.addEventListener("click", (e) => {
        if (currentlyPlayingElement.muted === true) {
            currentlyPlayingElement.muted = false;
            mute.innerHTML = 'Mute';
        } else {
            currentlyPlayingElement.muted = true;
            mute.innerHTML = 'Unmute';
        }
    })

    inputElement.addEventListener("change", (e) => {
        if (inputElement.files.length) {
            updateThumbnail(dropZoneElement, inputElement.files[0]);
            handleFiles(Array.from(inputElement.files));
            const file = inputElement.files[0];
            const fileURL = URL.createObjectURL(file);
            if (file.type.startsWith("image/")) {
                displayImage(fileURL);
            } else if (file.type.startsWith("video/")) {
                playVideo(fileURL);
                videoElement.play();
                playpause.innerHTML = '⏸'
                videoElement.style.display = "block";
                audioElement.style.display = "none";
            } else if (file.type.startsWith("audio/")) {
                playAudio(fileURL);
                audioElement.play();
                playpause.innerHTML = '⏸'
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

    function handleFiles(files) {
        const filenames = Array.from(files).map((file) => file.name);
        console.log(filenames.join(",\n"));
        const fileVars = [];
        files.forEach((file, index) => {
            const fileURL = URL.createObjectURL(file);
            if (file.type.startsWith("image/")) {
                const imageName = `image${index + 1}`;
                fileVars[imageName] = fileURL;
                displayImage(fileURL);
            } else if (file.type.startsWith("video/")) {
                const videoName = `video${index + 1}`;
                fileVars[videoName] = fileURL;
                playVideo(fileURL);
            } else if (file.type.startsWith("audio/")) {
                const audioName = `audio${index + 1}`;
                fileVars[audioName] = fileURL;
                playAudio(fileURL);
            }
        });
        console.log("File Variables:", fileVars);
        const fileVarKeys = Object.keys(fileVars);
        let audioElementsCount = 0;
        let audioEndedCount = 0;
        for (let i = 1; i < fileVarKeys.length; i++) {
            const fileVarKey = fileVarKeys[i];
            const fileVarValue = fileVars[fileVarKey];
        }
    }

    dropZoneElement.addEventListener("drop", (e) => {
        e.preventDefault();

        if (e.dataTransfer.files.length) {
            inputElement.files = e.dataTransfer.files;
            updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
            handleFiles(Array.from(e.dataTransfer.files));
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith("image/")) {
                displayImage(file);
            } else if (file.type.startsWith("video/")) {
                playVideo(fileURL);
                videoElement.src = fileURL;
                videoElement.play();
                playpause.innerHTML = '⏸'
                videoElement.style.display = "block";
                audioElement.style.display = "none";
            } else if (file.type.startsWith("audio/")) {
                playAudio(fileURL);
                audioElement.src = fileURL;
                audioElement.play();
                playpause.innerHTML = '⏸'
                videoElement.style.display = "none";
                audioElement.style.display = "block";
            }
        }

        dropZoneElement.classList.remove("drop-zone--over");
    });
});

function updateThumbnail(dropZoneElement, file) {
    let thumbnailElement = dropZoneElement.querySelector(".drop-zone-image");

    function extractAlbumArt(file) {
        const reader = new FileReader();

        reader.onload = () => {

            jsmediatags.read(file, {
                onSuccess: (tag) => {
                    const {
                        tags
                    } = tag;
                    const {
                        picture
                    } = tags;

                    if (picture) {
                        const base64String = arrayBufferToBase64(picture.data);
                        const imageUrl = `data:${picture.format};base64,${base64String}`;
                        rmv = document.getElementById("vlc-icon");
                        rmv.style.display = "none";
                        displayAlbumArt(imageUrl);
                    } else {
                        rmv = document.getElementById("vlc-icon");
                        rmv.style.display = "none";
                        imageUrl = './assets/img/Audio.svg';
                        displayAlbumArt(imageUrl);
                    }
                },
                onError: (error) => {
                    console.error('Error reading MP3 tags:', error);
                    rmv = document.getElementById("vlc-icon");
                    rmv.style.display = "none";
                    imageUrl = './assets/img/Audio.svg';
                    displayAlbumArt(imageUrl);
                }
            });
        };

        reader.onerror = (error) => {
            console.error('Error reading file:', error);
            displayAlbumArt(null);
        };

        reader.readAsArrayBuffer(file);
    }

    function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;

        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }

        return window.btoa(binary);
    }

    function displayAlbumArt(imageUrl) {

        if (imageUrl) {
            albumArtElement.src = imageUrl;
            albumArtElement.style.display = 'block';
        } else {
            albumArtElement.src = '';
            albumArtElement.style.display = 'none';
        }
    }

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
        playpause.innerHTML = '⏸'
        extractAlbumArt(file);
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

function displayImage(file) {
    if (currentlyPlayingElement) {
        currentlyPlayingElement.src = "";
        currentlyPlayingElement.style.display = "none";
        currentlyPlayingElement = null;
        progressBar.setAttribute('value', '0.01');
        progressBar2.style.width = "0%";
        playpause.innerHTML = '⏵';
        document.getElementById("time-one").innerHTML = '--:--'
        document.getElementById("time-two").innerHTML = '--:--'
    }

    const thumbnailElement = document.getElementById("thumbnail");
    const reader = new FileReader();
    document.getElementById("time-one").innerHTML = '--:--';
    document.getElementById("time-two").innerHTML = '--:--';
    reader.onload = () => {
        progressBar.setAttribute('value', '0.01');
        progressBar2.style.width = "0%";
        thumbnailElement.src = reader.result;
        thumbnailElement.style.display = "block";
    };

    reader.readAsDataURL(file);
}

function playVideo(fileURL) {
    if (currentlyPlayingElement === audioElement) {
        audioElement.src = "";
        playpause.innerHTML = '⏵';
        audioElement.style.display = "none";
        progressBar.value = 0;
    }

    videoElement.src = fileURL;
    videoElement.play();
    playpause.innerHTML = '⏸'
    videoElement.style.display = "block";
    currentlyPlayingElement = videoElement;
}

function playAudio(fileURL) {
    if (currentlyPlayingElement === videoElement) {
        videoElement.src = "";
        playpause.innerHTML = '⏵';
        videoElement.style.display = "none";
        progressBar.value = 0;
    }

    audioElement.src = fileURL;
    audioElement.play();
    playpause.innerHTML = '⏸'
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
        progressBar.value = progress;
        progressBar2.style.width = `${progress}%`;
        if (!isDragging) {
            const currentTime = videoElement.currentTime;
            const duration = videoElement.duration;
            const progress = (currentTime / duration) * 100;
            progressBar.value = progress;
        }
    }
});

audioElement.addEventListener("play", () => {
    audioElement.addEventListener("timeupdate", updateProgressBar);

    function updateProgressBar() {
        const currentTime = audioElement.currentTime;
        const duration = audioElement.duration;
        const progress = (currentTime / duration) * 100;
        progressBar.value = progress;
        progressBar2.style.width = `${progress}%`;
        if (!isDragging) {
            const currentTime = audioElement.currentTime;
            const duration = audioElement.duration;
            const progress = (currentTime / duration) * 100;
            progressBar.value = progress;
            progressBar2.style.width = `${progress}%`;
        }
    }
});

function startDrag() {
    isDragging = true;
}

function handleDrag(e) {
    if (isDragging) {
        const progressBarRect = progressBar.getBoundingClientRect();
        const progressWidth = e.clientX - progressBarRect.left;
        const progressBarWidth = progressBarRect.width;
        const progress = (progressWidth / progressBarWidth) * 100;
        progressBar.value = progress;
        seekTo(progress);
    }
}

function endDrag() {
    if (isDragging) {
        isDragging = false;
    }
}

function seekTo(progress) {
    const duration = currentlyPlayingElement.duration;
    if (!isNaN(duration) && isFinite(duration)) {
        const currentTime = (progress / 100) * duration;
        currentlyPlayingElement.currentTime = currentTime;
    }
}

progressBar.addEventListener("mousedown", startDrag);
progressBar.addEventListener("mousemove", handleDrag);
progressBar.addEventListener("mouseup", endDrag);

let rewindInterval;
let isRewinding = false;
let isSeeking = false;
let playbackRate = 1;
let isRepeating = false;

function Vskipbackward() {
    if (!isRewinding) {
        clearInterval(rewindInterval);
        isRewinding = true;
        playbackRate = 2;
        currentlyPlayingElement.playbackRate = playbackRate;
        currentlyPlayingElement.play();
        rewindInterval = setInterval(() => {
            if (currentlyPlayingElement.currentTime <= 0) {
                currentlyPlayingElement.pause();
                isRewinding = false;
                clearInterval(rewindInterval);
            } else {
                currentlyPlayingElement.currentTime -= 2;
            }
        }, 100);
    }
}

function Vskipforward() {
    if (!isSeeking) {
        isSeeking = true;
        playbackRate = 2;
        currentlyPlayingElement.playbackRate = playbackRate;
        currentlyPlayingElement.play();
        seekInterval = setInterval(() => {
            if (currentlyPlayingElement.currentTime <= 0) {
                currentlyPlayingElement.pause();
            } else {
                currentlyPlayingElement.currentTime += 2;
            }
        }, 100);
    }
}

function Vtoggle() {
    if (isSeeking) {
        clearInterval(seekInterval);
        isSeeking = false;
        currentlyPlayingElement.playbackRate = 1;
        currentlyPlayingElement.pause();
        currentlyPlayingElement.play();
    } else if (isRewinding) {
        clearInterval(rewindInterval);
        isRewinding = false;
        currentlyPlayingElement.playbackRate = 1;
        currentlyPlayingElement.pause();
        currentlyPlayingElement.play();
    } else if (currentlyPlayingElement.paused) {
        currentlyPlayingElement.play();
        playpause.innerHTML = '⏸'
    } else {
        currentlyPlayingElement.pause();
        playpause.innerHTML = '⏵';
    }
}

function Vstop() {
    if (currentlyPlayingElement) {
        currentlyPlayingElement.src = "";
        currentlyPlayingElement.style.display = "none";
        currentlyPlayingElement = null;
        progressBar.value = 0.01;
        document.getElementById("time-one").innerHTML = '--:--'
        document.getElementById("time-two").innerHTML = '--:--'
        Vstop();
        playpause.innerHTML = '⏵';
    } else {
        document.getElementById("time-one").innerHTML = '--:--';
        document.getElementById("time-two").innerHTML = '--:--';
        playpause.innerHTML = '⏵';
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

function toggleRepeat() {
    isRepeating = !isRepeating;
    if (isRepeating) {
        repeat.classList.toggle('repeat-active');
        currentlyPlayingElement.loop = true;
    } else {
        repeat.classList.toggle('repeat-active');
        currentlyPlayingElement.loop = false;
    }
}

volumeRange.addEventListener('input', () => {
    const volume = volumeRange.value / 100;
    videoElement.volume = volume;
    audioElement.volume = volume;
});
