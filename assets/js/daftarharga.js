const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('category');
const loader = document.getElementById('loader');
loader.style.display = 'flex';

const API_URL = `https://script.google.com/macros/s/AKfycbzhcY2sTh2HOMcgipuX2bo61JBaOA_Jw4sdsA1UnLv9FAbXaDqxFf36ZufCfh65zcJs/exec/exec?category=${category}`;

fetch(API_URL)
    .then(response => response.json())
    .then(data => {
        const tableTitle = document.getElementById('table-title');
        const tableBody = document.getElementById('data-table');
        loader.style.display = 'none';

        if (!data || data.error) {
            tableTitle.textContent = 'Kategori Tidak Ditemukan';
            tableBody.innerHTML = `<tr><td colspan="3">Data tidak tersedia untuk kategori ini.</td></tr>`;
            return;
        }

        tableTitle.textContent = `Daftar Harga ${category}`;
        tableBody.innerHTML = ''; 
        
        data[category].data.forEach(item => {
            const row = `
                <tr>
                    <td>${item.kode}</td>
                    <td>${item.produk}</td>
                    <td>${item.harga}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        alert('Gagal memuat data. Silakan coba lagi.');
        loader.style.display = 'none';
    });
