const { parentPort, workerData } = require('worker_threads');

// Логика Потребителя (Consumer): Получить задачу, обработать, вернуть результат
// Симуляция тяжелых вычислений
const generateReport = () => {
    const start = Date.now();
    let count = 0;
    // Симуляция задачи, нагружающей CPU
    for (let i = 0; i < 100000000; i++) {
        count += i;
    }
    const end = Date.now();

    // Генерация реалистичной суммы продаж (от 10,000 до 50,000)
    const realisticSales = Math.floor(Math.random() * (50000 - 10000 + 1)) + 10000;

    return {
        reportId: workerData.reportId,
        totalSales: `$${realisticSales.toLocaleString('en-US')}`, // Форматирование валюты
        generatedAt: new Date(),
        duration: `${end - start}ms`
    };
};

const result = generateReport();
parentPort.postMessage(result);
