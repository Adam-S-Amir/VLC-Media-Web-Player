const videoElement = document.getElementById("drop-zone-video");

document.querySelectorAll(".drop-zone-input").forEach((inputElement) => {
    const dropZoneElement = inputElement.closest(".drop-zone");

    dropZoneElement.addEventListener("click", (e) => {
        inputElement.click();
    });

    inputElement.addEventListener("change", (e) => {
        if (inputElement.files.length) {
            updateThumbnail(dropZoneElement, inputElement.files[0]);
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
        }

        dropZoneElement.classList.remove("drop-zone--over");
    });
});

/**
 * Updates the thumbnail on a drop zone element.
 *
 * @param {HTMLElement} dropZoneElement
 * @param {File} file
 */

function updateThumbnail(dropZoneElement, file) {
    let thumbnailElement = dropZoneElement.querySelector(".drop-zone-thumb");

    // First time - remove the prompt
    if (dropZoneElement.querySelector(".drop-zone-prompt")) {
        dropZoneElement.querySelector(".drop-zone-prompt").remove();
    }

    // First time - there is no thumbnail element, so let's create it
    if (!thumbnailElement) {
        thumbnailElement = document.createElement("div");
        thumbnailElement.classList.add("drop-zone-thumb");
        rmv = document.getElementById("vlc-icon");
        rmv.style.display = "none";
        dropZoneElement.appendChild(thumbnailElement);
    }

    thumbnailElement.dataset.label = file.name;

    // Show thumbnail for image files
    if (file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.onload = () => {
            const imgElement = document.createElement("img");
            imgElement.onload = () => {
                const width = imgElement.width;
                const height = imgElement.height;
                const aspectRatio = width / height;

                if (width > height) {
                    imgElement.style.width = "100%";
                    imgElement.style.height = "auto";
                } else {
                    imgElement.style.width = "auto";
                    imgElement.style.height = "100%";
                }

                thumbnailElement.innerHTML = ""; // Clear existing content
                thumbnailElement.appendChild(imgElement);
            };

            imgElement.src = reader.result;
            imgElement.alt = file.name;
        };

        reader.readAsDataURL(file);
    } else {
        thumbnailElement.innerHTML = null;
    }
}

document.querySelectorAll(".drop-zone-input").forEach((inputElement) => {
    const dropZoneElement = inputElement.closest(".drop-zone");
    const videoElement = dropZoneElement.querySelector(".drop-zone-video");

    dropZoneElement.addEventListener("click", (e) => {
        inputElement.click();
        videoElement.style.display = "block";
    });

    inputElement.addEventListener("change", (e) => {
        if (inputElement.files.length) {
            const file = inputElement.files[0];
            const fileURL = URL.createObjectURL(file);
            videoElement.src = fileURL;
            videoElement.play();
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
            videoElement.src = fileURL;
            videoElement.play();
        }

        dropZoneElement.classList.remove("drop-zone--over");
    });
});

videoElement.addEventListener("timeupdate", () => {
    const currentTime = videoElement.currentTime;
    const formattedTime = formatTime(currentTime);
    let Ctime = document.getElementById("time-one");
    Ctime.innerHTML = formattedTime;
});

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
}

videoElement.addEventListener("loadedmetadata", () => {
    const duration = videoElement.duration;
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

const progressBar = document.querySelector(".barz-inner");

videoElement.addEventListener("timeupdate", updateProgressBar);

function updateProgressBar() {
    const currentTime = videoElement.currentTime;
    const duration = videoElement.duration;
    const progress = (currentTime / duration) * 100;
    progressBar.style.width = `${progress}%`;
}


function Vplay() {
    let videoElement = document.getElementById("drop-zone-video");
    videoElement.play();
}

function Vpause() {
    let videoElement = document.getElementById("drop-zone-video");
    videoElement.pause();
}

function Vstop() {
    Vpause();
    let videoElement = document.getElementById("drop-zone-video");
    videoElement.style.display = "none";
    rmv = document.getElementById("vlc-icon");
    rmv.style.display = "inline";
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
});


function trash() {
    console.log("hello");
}