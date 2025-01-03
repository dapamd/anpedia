const sheetUrl =
  "https://script.google.com/macros/s/AKfycbwSb-rkeX0hkKf0z8767ziHGtLdDsJAiLq5PtLfWw2cUK8MEnlTHycWWty4qB_ctbo0/exec";

const successCountEl = document.getElementById("successCount");
const processCountEl = document.getElementById("processCount");
const failedCountEl = document.getElementById("failedCount");

const successSyncEl = document.getElementById("successSync");
const processSyncEl = document.getElementById("processSync");
const failedSyncEl = document.getElementById("failedSync");

async function fetchData() {
  try {
    const response = await fetch(sheetUrl);
    const data = await response.json();

    const successCount = data.filter((item) => item.status === "Success").length;
    const processCount = data.filter((item) => item.status === "Pending").length;
    const failedCount = data.filter((item) => item.status === "Failed").length;

    successCountEl.textContent = successCount;
    processCountEl.textContent = processCount;
    failedCountEl.textContent = failedCount;

    const lastSync = new Date();
    const day = String(lastSync.getDate()).padStart(2, "0");
    const month = String(lastSync.getMonth() + 1).padStart(2, "0");
    const year = lastSync.getFullYear();
    const hours = String(lastSync.getHours()).padStart(2, "0");
    const minutes = String(lastSync.getMinutes()).padStart(2, "0");

    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes} WIB`;

    successSyncEl.textContent = `Sinkron terakhir ${formattedDate}`;
    processSyncEl.textContent = `Sinkron terakhir ${formattedDate}`;
    failedSyncEl.textContent = `Sinkron terakhir ${formattedDate}`;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchData();

setInterval(fetchData, 60000);