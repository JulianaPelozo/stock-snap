const API_KEY = "BG5QGZ2MODXC8F4R";

const stockForm = document.getElementById("stockForm");
const stockInput = document.getElementById("stockInput");
const stockResult = document.getElementById("stockResult");

let watchId = null;
const geoStatus = document.getElementById("geoStatus");
const latEl = document.getElementById("lat");
const lngEl = document.getElementById("lng");
const accEl = document.getElementById("acc");
const btnStartGeo = document.getElementById("btnStartGeo");
const btnStopGeo = document.getElementById("btnStopGeo");
const openMaps = document.getElementById("openMaps");

btnStartGeo.addEventListener("click", () => {
  if (!navigator.geolocation) {
    geoStatus.textContent = "Geolocalização não suportada.";
    return;
  }
  geoStatus.textContent = "Procurando posição...";
  watchId = navigator.geolocation.watchPosition(onGeoSuccess, onGeoError, {
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000,
  });
  btnStartGeo.disabled = true;
  btnStopGeo.disabled = false;
});

btnStopGeo.addEventListener("click", () => {
  if (watchId !== null) navigator.geolocation.clearWatch(watchId);
  watchId = null;
  geoStatus.textContent = "Localização parada.";
  btnStartGeo.disabled = false;
  btnStopGeo.disabled = true;
});

function onGeoSuccess(pos) {
  const { latitude, longitude, accuracy } = pos.coords;
  latEl.textContent = latitude.toFixed(6);
  lngEl.textContent = longitude.toFixed(6);
  accEl.textContent = accuracy.toFixed(1);
  geoStatus.textContent = "Posição atualizada.";
  openMaps.href = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}

function onGeoError(err) {
  geoStatus.textContent = "Erro: " + err.message;
}

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const btnStartCam = document.getElementById("btnStartCam");
const btnCapture = document.getElementById("btnCapture");
const btnStopCam = document.getElementById("btnStopCam");
const lastImage = document.getElementById("lastImage");
const downloadLink = document.getElementById("downloadLink");
let stream = null;

btnStartCam.addEventListener("click", async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    video.srcObject = stream;
    btnCapture.disabled = false;
    btnStopCam.disabled = false;
    btnStartCam.disabled = true;
  } catch (e) {
    alert("Erro ao acessar a câmera: " + e.message);
  }
});

btnCapture.addEventListener("click", () => {
  const w = video.videoWidth || 320;
  const h = video.videoHeight || 240;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, w, h);
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    lastImage.src = url;
    downloadLink.href = url;
  }, "image/png");
});

btnStopCam.addEventListener("click", () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
    video.srcObject = null;
  }
  btnCapture.disabled = true;
  btnStopCam.disabled = true;
  btnStartCam.disabled = false;
});
