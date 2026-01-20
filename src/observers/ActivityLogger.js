class ActivityLogger {
    constructor() {
        this.observers = [];
    }

    subscribe(observer) {
        this.observers.push(observer);
    }

    unsubscribe(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notify(data) {
        this.observers.forEach(observer => observer.log(data));
    }
}

class ConsoleObserver {
    log(data) {
        console.log(`[Observer] Action Logged: ${JSON.stringify(data)}`);
    }
}

const activityLogger = new ActivityLogger();
activityLogger.subscribe(new ConsoleObserver());

module.exports = activityLogger;
