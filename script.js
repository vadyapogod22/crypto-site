async function fetchCryptoData() {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano,solana,dogecoin,ripple,polkadot,tron&vs_currencies=usd');
    const data = await response.json();

    const cryptocurrencies = [
        { id: 'bitcoin', name: 'Bitcoin' },
        { id: 'ethereum', name: 'Ethereum' },
        { id: 'cardano', name: 'Cardano' },
        { id: 'solana', name: 'Solana' },
        { id: 'dogecoin', name: 'Dogecoin' },
        { id: 'ripple', name: 'XRP' },
        { id: 'polkadot', name: 'Polkadot' },
        { id: 'tron', name: 'Tron' }
    ];

    const table = document.getElementById('crypto-table');
    table.innerHTML = ""; // Очищаем таблицу перед обновлением

    cryptocurrencies.forEach(coin => {
        const price = data[coin.id]?.usd ?? 'N/A'; // Проверяем, есть ли данные
        const row = `<tr><td>${coin.name}</td><td>$${price}</td></tr>`;
        table.innerHTML += row;
    });
}

// Загружаем данные при загрузке страницы
fetchCryptoData();
setInterval(fetchCryptoData, 60000); // Обновляем раз в минуту
