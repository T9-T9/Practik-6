class SortStrategy {
    sort(products) {
        return products;
    }
}

class SortByPrice extends SortStrategy {
    sort(products) {
        return products.sort((a, b) => a.price - b.price);
    }
}

class SortByName extends SortStrategy {
    sort(products) {
        return products.sort((a, b) => a.name.localeCompare(b.name));
    }
}

class SortContext {
    constructor(strategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }

    executeStrategy(products) {
        return this.strategy.sort(products);
    }
}

module.exports = { SortByPrice, SortByName, SortContext };
