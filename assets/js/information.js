console.log("Loaded");

const tableBody = document.getElementById('tableBody');
const dataCount = document.getElementById('dataCount');
const search = document.getElementById('search');
const infoDropdown = document.getElementById('infoDropdown');
let activeDropdownTarget = null;
let data = []; 

const API_URL = "https://script.google.com/macros/s/AKfycbz8hwQOsrLT_ufGaPHFPwRfigs4KY6FsllEA-QN6g5HGsEKWwjBXYr3E7m6khGJGj7z/exec"; // Ganti dengan URL Apps Script Anda

async function fetchData() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch data");
        data = await response.json(); 
        renderTable(); 
    } catch (error) {
        console.error("Error fetching data:", error);
        data = []; 
        renderTable(); 
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes} WIB`;
}

function renderTable() {
    const searchTerm = search.value.toLowerCase();
    const showCount = parseInt(dataCount.value);
    const filteredData = data.filter(item => item.content.toLowerCase().includes(searchTerm));
    const displayData = filteredData.slice(0, showCount);
    tableBody.innerHTML = '';
    if (displayData.length === 0) {
        tableBody.innerHTML = '<tr><td class="text-center">No data available</td></tr>';
        return;
    }
    displayData.forEach((item, index) => {
        const row = `
            <tr>
                <td>
                    <span class="content-item fw-bold" data-index="${index}">
                        ${item.content}
                    </span>
                    <small class="text-muted ms-2">(${formatDate(item.createdAt)})</small>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
    document.querySelectorAll('.content-item').forEach(el => {
        el.addEventListener('click', event => {
            const index = event.target.getAttribute('data-index');
            showDetails(index, event.target);
        });
    });
}

function showDetails(index, target) {
    const item = data[index];
    if (!item) return;
    hideDetails();
    activeDropdownTarget = target;
    infoDropdown.innerHTML = `<strong>${item.content}</strong><p>${item.details}</p>`;
    const rect = target.getBoundingClientRect();
    infoDropdown.style.top = `${rect.bottom + window.scrollY}px`;
    infoDropdown.style.left = `${rect.left}px`;
    infoDropdown.style.display = 'block';
    infoDropdown.addEventListener('click', event => event.stopPropagation());
    document.addEventListener('click', outsideClickHandler);
}

function hideDetails() {
    infoDropdown.style.display = 'none';
    activeDropdownTarget = null;
}

function outsideClickHandler(event) {
    if (!infoDropdown.contains(event.target) && !activeDropdownTarget.contains(event.target)) {
        hideDetails();
        document.removeEventListener('click', outsideClickHandler);
    }
}

dataCount.addEventListener('change', renderTable);
search.addEventListener('input', renderTable);

fetchData();
