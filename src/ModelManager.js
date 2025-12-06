class ModelManager {
    constructor() {
        this.strategies = new Map();
        this.currentStrategyId = null;
    }

    /**
     * Register a strategy with its fallback configuration
     * @param {ModelStrategy} strategy - The strategy instance
     * @param {string[]} fallbackOrder - Array of strategy IDs to use as fallback
     */
    registerStrategy(strategy, fallbackOrder = []) {
        this.strategies.set(strategy.id, {
            strategy,
            fallbackOrder,
            errorCount: 0,
            maxErrors: strategy.config.maxErrors || 3,
            isAvailable: true
        });
        console.log(`Registered strategy: ${strategy.name} (ID: ${strategy.id})`);
    }

    /**
     * Set the current strategy
     * @param {string} strategyId 
     * @returns {boolean} success
     */
    setStrategy(strategyId) {
        if (!this.strategies.has(strategyId)) {
            console.error(`Strategy ${strategyId} not found`);
            return false;
        }
        
        const modelData = this.strategies.get(strategyId);
        
        if (!modelData.isAvailable) {
             console.warn(`Strategy ${strategyId} is unavailable.`);
             return false;
        }
        
        this.currentStrategyId = strategyId;
        console.log(`\n>>> Switched to strategy: ${modelData.strategy.name}`);
        return true;
    }

    /**
     * Send a message using the current strategy, with automatic fallback
     * @param {string} message 
     */
    async sendMessage(message) {
        const currentId = this.currentStrategyId;
        if (!currentId) throw new Error("No strategy selected");

        const modelData = this.strategies.get(currentId);

        try {
            const response = await modelData.strategy.sendMessage(message);
            // Reset errors on success
            if (modelData.errorCount > 0) {
                modelData.errorCount = 0;
                console.log(`[Manager] Reset error count for ${modelData.strategy.name}`);
            }
            return response;
        } catch (error) {
            console.error(`[Manager] Error with ${modelData.strategy.name}: ${error.message}`);
            modelData.errorCount++;

            console.log(`[Manager] Error count for ${modelData.strategy.name}: ${modelData.errorCount}/${modelData.maxErrors}`);

            if (modelData.errorCount >= modelData.maxErrors) {
                modelData.isAvailable = false;
                console.log(`[Manager] ${modelData.strategy.name} exceeded max errors. Attempting fallback...`);
                
                const fallbackId = this.findFallback(modelData);
                if (fallbackId) {
                    this.setStrategy(fallbackId);
                    return this.sendMessage(message); // Retry with new strategy
                } else {
                    console.error("[Manager] All fallbacks failed!");
                    throw new Error("All fallbacks failed and original model is unavailable.");
                }
            }
            // If we haven't switched yet, we can either retry or throw. 
            // For this pattern demo, we'll throw to let the caller know, 
            // but in a real chat app we might auto-retry immediately or just show error.
            // The Instructions imply showing the pattern structure, so throwing is fine 
            // as long as the 'client' sees the error.
            throw error; 
        }
    }

    findFallback(modelData) {
        for (const fallbackId of modelData.fallbackOrder) {
            const fallback = this.strategies.get(fallbackId);
            if (fallback && fallback.isAvailable) {
                return fallbackId;
            }
        }
        return null;
    }
    
    getCurrentStrategyName() {
        if (!this.currentStrategyId) return "None";
        return this.strategies.get(this.currentStrategyId).strategy.name;
    }
}

module.exports = ModelManager;
