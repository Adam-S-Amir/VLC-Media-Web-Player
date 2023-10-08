document.querySelectorAll(".drop-zone-input").forEach((inputElement) => {
  const dropZoneElement = inputElement.closest(".drop-zone");
  const openfile = document.getElementById('Open-File');
  const multiplefiles = document.getElementById('Multiple-Files');

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

  inputElement.addEventListener("change", (e) => {
    if (inputElement.files.length) {
      updateThumbnail(dropZoneElement, inputElement.files[0]);
      handleFiles(inputElement.files);
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
    console.log("Uploaded Files:", filenames.join(", "));

    files.forEach((file) => {
      const fileURL = URL.createObjectURL(file);

      if (file.type.startsWith("image/")) {
        displayImage(fileURL);
      } else if (file.type.startsWith("video/")) {
        playVideo(fileURL);
      } else if (file.type.startsWith("audio/")) {
        playAudio(fileURL);
      }
    });
  }

  dropZoneElement.addEventListener("drop", (e) => {
    e.preventDefault();

    if (e.dataTransfer.files.length) {
      inputElement.files = e.dataTransfer.files;
      updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
      handleFiles(e.dataTransfer.files);
    }

    dropZoneElement.classList.remove("drop-zone--over");
  });
});
