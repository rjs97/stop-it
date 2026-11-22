

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

const loadWOS = (photos) => {
  const photoMax = 1
  if (photos.length > photoMax) {
    toDelete = photos.slice(0, -photoMax)
    toDelete.forEach(d => deletePicture(d.id))
  }
  photos.forEach(p => {
    const img = document.createElement("img");

    img.src = URL.createObjectURL(p.image);
    const wos = document.getElementById("wall-of-shame")
    wos.appendChild(img);
  })
}

const init = async () => {
  const photos = await getPictures()
  loadWOS(photos)

  const item = window.localStorage.getItem("stop-it-count")
  const data = item ? JSON.parse(item) : { "date": Date.now(), "count": 1 }
  const msDay = 86400000

  const stats = document.createElement("h3")
  stats.textContent = `${data.count} visits since ${Date(data.date).toLocaleString()}...`
  const h1 = document.getElementById("title")
  h1.appendChild(stats)

  if (Date.now() - data.date < msDay) {
    console.log(Date.now() - data.date, data.count)
    if (data.count > 5) {
      await takePicture()
      data.count = 0
    }
  } else {
    data.date = Date.now()
    data.count = 0
  }
  data.count++

  window.localStorage.setItem("stop-it-count", JSON.stringify(data))
}



init().then(() => { console.log("page initialized") })


