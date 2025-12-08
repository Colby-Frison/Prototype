class ModelStrategy {
    constructor(config) {
        this.id = config.id;
        this.name = config.displayName;
        this.config = config;
    }

    // Abstract method to send message
    async sendMessage(message) {
        throw new Error("Method 'sendMessage' must be implemented.");
    }
}

module.exports = ModelStrategy;
