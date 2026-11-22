

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

getPictures().then(async photos => {
  photos.forEach(p => {
    const img = document.createElement("img");

    img.src = URL.createObjectURL(p.image);

    document.body.appendChild(img);
  })
})

const item = window.localStorage.getItem("stop-it-count")
const data = item ? JSON.parse(item) : { "date": Date.now(), "count": 1 }
const ms_day = 86400000

if (Date.now() - data.date < ms_day) {
  console.log(Date.now() - data.date, data.count)
  if (data.count > 5) {
    takePicture().then(async () => {
      console.log("Picture saved!")
    })
    data.count = 0
  }
} else {
  data.date = Date.now()
  data.count = 0
}
data.count++

window.localStorage.setItem("stop-it-count", JSON.stringify(data))


// deleteDB()



