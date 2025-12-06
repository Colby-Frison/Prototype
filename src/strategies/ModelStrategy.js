class ModelStrategy {
    constructor(config) {
        this.id = config.id;
        this.name = config.displayName;
        this.config = config;
    }

    async sendMessage(message) {
        throw new Error("Method 'sendMessage' must be implemented.");
    }
}

module.exports = ModelStrategy;
