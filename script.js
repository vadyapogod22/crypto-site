async function fetchCryptoData() {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
    const data = await response.json();

    const table = document.getElementById('crypto-table');
    table.innerHTML = `
        <tr><td>Bitcoin</td><td>$${data.bitcoin.usd}</td></tr>
        <tr><td>Ethereum</td><td>$${data.ethereum.usd}</td></tr>
    `;
}

// Загружаем данные при загрузке страницы
fetchCryptoData();
setInterval(fetchCryptoData, 60000); // Обновляем раз в минуту
