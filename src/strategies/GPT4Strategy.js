const ModelStrategy = require('./ModelStrategy');

class GPT4Strategy extends ModelStrategy {
    async sendMessage(message) {
        console.log(`[${this.name}] Handling request: ${message}`);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Simulate API response
        return {
            text: `GPT-4: I've analyzed your message "${message}" and here's my response...`,
            model: this.id,
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = GPT4Strategy;
