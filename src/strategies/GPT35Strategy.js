const ModelStrategy = require('./ModelStrategy');

class GPT35Strategy extends ModelStrategy {
    async sendMessage(message) {
        console.log(`[${this.name}] Handling request: ${message}`);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Simulate API response
        return {
            text: `GPT-3.5: Regarding "${message}", here is a quick response...`,
            model: this.id,
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = GPT35Strategy;
