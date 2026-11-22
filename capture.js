

const takePicture = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true
  });

  const video = document.createElement("video")
  video.srcObject = stream;

  await video.play();

  const canvas = document.createElement("canvas");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  canvas.getContext("2d").drawImage(video, 0, 0);

  // Stop camera immediately after capture
  stream.getTracks().forEach(track => track.stop());

  const blob = await new Promise(resolve => {
    canvas.toBlob(resolve, "image/jpeg", 0.9);
  });

  await savePicture(blob);

}

// deleteDB()
takePicture().then(async () => {
  photos = await getPictures()
  photos.forEach(photo => {
    const img = document.createElement("img");

    img.src = URL.createObjectURL(photo.image);

    document.body.appendChild(img);
  });
  console.log("Picture saved!")
})


