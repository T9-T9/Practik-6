class MockLegacyPaymentSystem {
    constructor() {
        console.log("Legacy Payment Initialized...");
    }

    makePayment(amountXML) {
        // Simulates old system accepting XML
        console.log(`Processing payment in Legacy System... XML Data: ${amountXML}`);
        return true;
    }
}

module.exports = MockLegacyPaymentSystem;
