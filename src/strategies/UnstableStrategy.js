const ModelStrategy = require('./ModelStrategy');

// This model is unstable is is made to randomly fail in order to test the fallback mechanism
class UnstableStrategy extends ModelStrategy {
    async sendMessage(message) {
        console.log(`[${this.name}] Handling request: ${message}`);
        
        // Simulate high probability of failure
        // Using a high probability to ensure we trigger fallback in tests
        const failProbability = this.config.errorProbability !== undefined ? this.config.errorProbability : 0.85;
        
        if (Math.random() < failProbability) {
             // Simulate delay before failure
            await new Promise(resolve => setTimeout(resolve, 200));
            throw new Error(`${this.name} failed to respond (simulated failure)`);
        }

        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            text: `Unstable AI: somehow I worked! Response to "${message}"`,
            model: this.id,
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = UnstableStrategy;
