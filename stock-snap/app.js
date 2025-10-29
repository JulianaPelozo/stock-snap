const API_KEY = "BG5QGZ2MODXC8F4R";

document.getElementById("btnStock").addEventListener("click", async () => {
  const symbol = document.getElementById("symbol").value.toUpperCase();
  if (!symbol) return alert("Digite um símbolo de ação!");

  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data["Time Series (Daily)"]) {
    const timeSeries = data["Time Series (Daily)"];
    const dates = Object.keys(timeSeries).slice(0, 10).reverse();
    const prices = dates.map(d => parseFloat(timeSeries[d]["4. close"]));
    plotGraph(dates, prices, symbol);
  } else {
    alert("Erro ao buscar dados da ação.");
  }
});

function plotGraph(labels, data, symbol) {
  const ctx = document.getElementById("stockChart").getContext("2d");
  if (window.stockChartInstance) window.stockChartInstance.destroy();

  window.stockChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: `Preço de Fechamento - ${symbol}`,
        data,
        borderColor: "#9e21e6",
        fill: false,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}


let watchId = null;
const geoStatus = document.getElementById("geoStatus");
const latEl = document.getElementById("lat");
const lngEl = document.getElementById("lng");
const btnStartGeo = document.getElementById("btnStartGeo");
const btnStopGeo = document.getElementById("btnStopGeo");
const openMaps = document.getElementById("openMaps");

btnStartGeo.addEventListener("click", () => {
  if (!navigator.geolocation) {
    geoStatus.textContent = "Geolocalização não suportada.";
    return;
  }
  geoStatus.textContent = "Localizando...";
  watchId = navigator.geolocation.watchPosition(onGeoSuccess, onGeoError, {
    enableHighAccuracy: true,
    timeout: 10000
  });
  btnStartGeo.disabled = true;
  btnStopGeo.disabled = false;
});

btnStopGeo.addEventListener("click", () => {
  if (watchId) navigator.geolocation.clearWatch(watchId);
  watchId = null;
  geoStatus.textContent = "Parado.";
  btnStartGeo.disabled = false;
  btnStopGeo.disabled = true;
});

function onGeoSuccess(pos) {
  const { latitude, longitude } = pos.coords;
  latEl.textContent = latitude.toFixed(6);
  lngEl.textContent = longitude.toFixed(6);
  geoStatus.textContent = "Localização atualizada.";
  openMaps.href = `https://www.google.com/maps?q=${latitude},${longitude}`;
  localStorage.setItem("lastLocation", JSON.stringify({ latitude, longitude }));
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
let stream = null;

btnStartCam.addEventListener("click", async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    btnCapture.disabled = false;
    btnStopCam.disabled = false;
    btnStartCam.disabled = true;
  } catch (e) {
    alert("Erro ao acessar a câmera.");
  }
});

btnCapture.addEventListener("click", () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);
  const imageUrl = canvas.toDataURL("image/png");
  lastImage.src = imageUrl;
  localStorage.setItem("lastPhoto", imageUrl);
});

btnStopCam.addEventListener("click", () => {
  if (stream) stream.getTracks().forEach(t => t.stop());
  video.srcObject = null;
  btnCapture.disabled = true;
  btnStopCam.disabled = true;
  btnStartCam.disabled = false;
});


if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("Service Worker registrado!"));
}
