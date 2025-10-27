const API_KEY = "BG5QGZ2MODXC8F4R";


async function getStock(symbol) {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data["Time Series (Daily)"]) {
    const timeSeries = data["Time Series (Daily)"];
    const dates = Object.keys(timeSeries).slice(0, 10).reverse(); 
    const prices = dates.map(date => parseFloat(timeSeries[date]["4. close"]));
    plotGraph(dates, prices, symbol); 
  } else {
    alert("Erro ao buscar dados da ação");
  }
}

function plotGraph(labels, data, symbol) {
  const ctx = document.getElementById("stockChart").getContext("2d");
  if (window.stockChartInstance) {
    window.stockChartInstance.destroy();
  }

  window.stockChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: `Preço de Fechamento - ${symbol}`,
        data: data,
        borderColor: "#2196F3",
        fill: false,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' }
      },
      scales: {
        x: { display: true },
        y: { display: true }
      }
    }
  });
}
  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: `Preço de Fechamento - ${symbol}`,
        data: data,
        borderColor: "#2196F3",
        fill: false,
        tension: 0.3
      }]
    },
    options: { 
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' }
      },
      scales: {
        x: { display: true },
        y: { display: true }
      }
    }
  });



async function takePhoto() {
  const video = document.createElement("video");
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
  video.play();
  document.body.appendChild(video);

  video.addEventListener("click", () => {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const imageData = canvas.toDataURL("image/png");
    localStorage.setItem("lastStockPhoto", imageData);
    video.pause();
    stream.getTracks()[0].stop();
    video.remove();
    alert("Foto salva!");
  });
}
