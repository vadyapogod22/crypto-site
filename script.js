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

// Глобальная переменная для хранения графика
let cryptoChart;

// Функция для загрузки данных и обновления графика
async function updateCryptoChart() {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,cardano,solana,dogecoin&order=market_cap_desc');
    const data = await response.json();

    const labels = data.map(coin => coin.name);
    const prices = data.map(coin => coin.current_price);

    const ctx = document.getElementById('cryptoChart').getContext('2d');

    if (cryptoChart) {
        cryptoChart.destroy(); // Удаляем старый график перед созданием нового
    }

    cryptoChart = new Chart(ctx, {
        type: 'line', // Линейный график в финансовом стиле
        data: {
            labels: labels,
            datasets: [{
                label: 'Цена в USD',
                data: prices,
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                borderWidth: 2,
                pointRadius: 3, // Уменьшаем точки данных
                pointHoverRadius: 5, // Делаем точки больше при наведении
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: "rgba(0, 0, 0, 0.1)" // Тонкая сетка, как в финансовых графиках
                    },
                    ticks: {
                        font: {
                            size: 14
                        }
                    }
                },
                x: {
                    grid: {
                        display: false // Убираем вертикальную сетку для чистого вида
                    },
                    ticks: {
                        font: {
                            size: 14
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: "#fff",
                    titleColor: "#000",
                    bodyColor: "#000",
                    borderColor: "#007bff",
                    borderWidth: 1
                }
            },
            elements: {
                line: {
                    tension: 0.3 // Легкое сглаживание линии
                }
            }
        }
    });
}

// Загружаем график при загрузке страницы
updateCryptoChart();
setInterval(updateCryptoChart, 30000); // Обновляем график каждые 30 секунд
