console.log("Loaded");

const transactionTable = document.getElementById("transactionTable");
const filterService = document.getElementById("filterService");
const searchTarget = document.getElementById("searchTarget");
const filterStatus = document.getElementById("filterStatus");
const paginationContainer = document.getElementById("paginationContainer");
const itemsPerPage = 10; 
let currentPage = 1; 
let filteredTransactions = [];
let transactions = []; 

const API_URL = "https://script.google.com/macros/s/AKfycbwSb-rkeX0hkKf0z8767ziHGtLdDsJAiLq5PtLfWw2cUK8MEnlTHycWWty4qB_ctbo0/exec"; // Ganti dengan URL Anda

async function fetchTransactions() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch data");
        transactions = await response.json();
        filteredTransactions = transactions; 
        loadTable(filteredTransactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
    }
}

function loadTable(data) {
    transactionTable.innerHTML = ""; 
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);
    paginatedData.forEach(transaction => {
        const row = document.createElement("tr");
        let statusClass = "";
        if (transaction.status === "Success") statusClass = "status-success";
        else if (transaction.status === "Pending") statusClass = "status-pending";
        else if (transaction.status === "Failed") statusClass = "status-failed";

        row.innerHTML = `
            <td>
                <span class="date-item text-primary" data-id="${transaction.id}">
                    ${transaction.date}
                </span>
            </td>
            <td>${transaction.service}</td>
            <td>${transaction.product}</td>
            <td>${transaction.target}</td>
            <td class="${statusClass}">${transaction.status}</td>
        `;
        transactionTable.appendChild(row);
    });

    document.querySelectorAll(".date-item").forEach(el => {
    el.addEventListener("click", event => {
        const transactionId = event.target.getAttribute("data-id");
        showPopup(transactionId);
    });
});

function showPopup(transactionId) {
    const popup = document.getElementById("popup");
    const popupText = document.getElementById("popupText");
    popupText.textContent = `${transactionId}`;
    popup.classList.remove("hidden");
}

const closePopup = document.getElementById("closePopup");
const popup = document.getElementById("popup");

closePopup.addEventListener("click", () => {
    popup.classList.add("hidden");
});

popup.addEventListener("click", (e) => {
    if (e.target === popup) {
        popup.classList.add("hidden");
    }
});
    
    createPagination(data.length);
}

function createPagination(totalItems) {
    paginationContainer.innerHTML = ""; 
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const prevButton = document.createElement("button");
    prevButton.innerHTML = "&lt;";
    prevButton.classList.add("btn", "btn-outline-primary", "mx-1");
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener("click", () => {
        currentPage = Math.max(1, currentPage - 1);
        loadTable(filteredTransactions);
    });
    paginationContainer.appendChild(prevButton);

    const range = 2;
    const start = Math.max(1, currentPage - range);
    const end = Math.min(totalPages, currentPage + range);

    if (start > 1) {
        const dots = document.createElement("span");
        dots.textContent = "...";
        dots.classList.add("mx-1");
        paginationContainer.appendChild(dots);
    }

    for (let i = start; i <= end; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.classList.add("btn", "mx-1");
        pageButton.classList.add(i === currentPage ? "btn-primary" : "btn-outline-primary");

        pageButton.addEventListener("click", () => {
            currentPage = i;
            loadTable(filteredTransactions);
        });

        paginationContainer.appendChild(pageButton);
    }

    if (end < totalPages) {
        const dots = document.createElement("span");
        dots.textContent = "...";
        dots.classList.add("mx-1");
        paginationContainer.appendChild(dots);
    }

    const nextButton = document.createElement("button");
    nextButton.innerHTML = "&gt;";
    nextButton.classList.add("btn", "btn-outline-primary", "mx-1");
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener("click", () => {
        currentPage = Math.min(totalPages, currentPage + 1);
        loadTable(filteredTransactions);
    });
    paginationContainer.appendChild(nextButton);
}

function applyFilter() {
    const serviceFilter = filterService.value.toLowerCase();
    const targetFilter = searchTarget.value.toLowerCase();
    const statusFilter = filterStatus.value.toLowerCase();

    console.log("Service Filter:", serviceFilter);
    console.log("Target Filter:", targetFilter);
    console.log("Status Filter:", statusFilter);

    filteredTransactions = transactions.filter(transaction => {
        const matchesService = serviceFilter === "" || transaction.service.toLowerCase().includes(serviceFilter);
        const matchesTarget = targetFilter === "" || String(transaction.target).toLowerCase().includes(targetFilter);
        const matchesStatus = statusFilter === "" || transaction.status.toLowerCase() === statusFilter;

        return matchesService && matchesTarget && matchesStatus;
    });

    console.log("Filtered Transactions:", filteredTransactions);
    currentPage = 1; 
    loadTable(filteredTransactions); 
}

filterService.addEventListener("change", applyFilter);
searchTarget.addEventListener("input", applyFilter); 
filterStatus.addEventListener("change", applyFilter);

fetchTransactions();
