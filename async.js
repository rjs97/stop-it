
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("StopItPhotos", 3);

    request.onupgradeneeded = () => {
      const db = request.result;

      db.createObjectStore("photos", {
        keyPath: "id",
        autoIncrement: true
      });
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function savePicture(blob) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("photos", "readwrite");

    transaction.objectStore("photos").add({
      image: blob,
      date: new Date().toISOString()
    });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

async function getPictures() {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("photos", "readonly");

    const request = transaction
      .objectStore("photos")
      .getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function deleteDB() {
  const request = indexedDB.open("StopItPhotos", 3);

  request.onupgradeneeded = () => {
    const db = request.result;

    db.deleteObjectStore("photos", {
      keyPath: "id",
      autoIncrement: true
    });
  };

  indexedDB.deleteDatabase("StopItPhotos")

  request.onsuccess = () => console.log("deleted db");
  request.onerror = () => console.error(request.error);
}