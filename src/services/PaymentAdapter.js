const MockLegacyPaymentSystem = require('./MockLegacyPaymentSystem');

class PaymentAdapter {
    constructor() {
        this.legacySystem = new MockLegacyPaymentSystem();
    }

    processPayment(amount) {
        // Логика Адаптера: Преобразовать простую сумму в "XML" для устаревшей системы
        const xmlPayload = `<amount>${amount}</amount>`;
        return this.legacySystem.makePayment(xmlPayload);
    }
}

module.exports = PaymentAdapter;
