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

// ==================== Подключение MetaMask (Ethereum) ====================
document.getElementById('connect-metamask').addEventListener('click', async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const address = await signer.getAddress();

            // Проверяем, действительно ли это MetaMask, а не Phantom
            const network = await provider.getNetwork();
            console.log("Подключено к сети:", network);

            document.getElementById('wallet-address').innerText = `MetaMask: ${address}`;
        } catch (error) {
            console.error("Ошибка подключения MetaMask:", error);
        }
    } else {
        alert("MetaMask не установлен! Установите расширение MetaMask в браузер.");
    }
});

// ==================== Подключение Phantom (Solana) ====================
document.getElementById('connect-phantom').addEventListener('click', async () => {
    if (window.solana && window.solana.isPhantom) {
        try {
            const response = await window.solana.connect();
            document.getElementById('wallet-address').innerText = `Phantom: ${response.publicKey.toString()}`;
        } catch (error) {
            console.error("Ошибка подключения Phantom:", error);
        }
    } else {
        alert("Phantom Wallet не установлен! Установите расширение Phantom в браузер.");
    }
});
