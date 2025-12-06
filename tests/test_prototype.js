const ModelManager = require('../src/ModelManager');
const GPT4Strategy = require('../src/strategies/GPT4Strategy');
const GPT35Strategy = require('../src/strategies/GPT35Strategy');
const UnstableStrategy = require('../src/strategies/UnstableStrategy');

async function runDemo() {
    console.log("=== SmartWrite AI Model Strategy Pattern Demo ===\n");

    const manager = new ModelManager();

    // 1. Initialize Strategies
    const gpt4 = new GPT4Strategy({
        id: 'gpt-4',
        displayName: 'GPT-4',
        maxErrors: 3
    });

    const gpt35 = new GPT35Strategy({
        id: 'gpt-3.5-turbo',
        displayName: 'GPT-3.5',
        maxErrors: 3
    });

    const unstableAI = new UnstableStrategy({
        id: 'unstable-ai',
        displayName: 'Unstable AI',
        maxErrors: 2, // Low threshold to trigger fallback quickly
        errorProbability: 1.0 // Force failure for demo
    });

    // 2. Register Strategies with Fallback Chains
    // GPT-4 falls back to GPT-3.5
    manager.registerStrategy(gpt4, ['gpt-3.5-turbo']);
    
    // GPT-3.5 has no fallback (end of chain)
    manager.registerStrategy(gpt35, []);

    // Unstable AI falls back to GPT-4, then GPT-3.5
    manager.registerStrategy(unstableAI, ['gpt-4', 'gpt-3.5-turbo']);


    // 3. Scenario: Happy Path (GPT-4)
    console.log("\n--- Scenario 1: Happy Path (GPT-4) ---");
    manager.setStrategy('gpt-4');
    try {
        const response = await manager.sendMessage("Hello, how are you?");
        console.log(`Received response: ${response.text}`);
    } catch (e) {
        console.error(`Failed: ${e.message}`);
    }


    // 4. Scenario: Fallback Chain (Unstable AI -> GPT-4)
    console.log("\n--- Scenario 2: Fallback Chain (Unstable AI -> GPT-4) ---");
    // Force switch to unstable model
    manager.setStrategy('unstable-ai');
    
    console.log("Attempting to send message with Unstable AI (Configured to fail)...");
    
    // We expect this to fail twice (maxErrors: 2) and then switch
    for (let i = 0; i < 5; i++) {
        try {
            console.log(`\nRequest #${i+1}:`);
            const response = await manager.sendMessage(`Test message ${i+1}`);
            console.log(`SUCCESS! Received response from [${response.model}]: ${response.text}`);
            break; // Stop if we succeeded (which means we successfully fell back)
        } catch (e) {
            console.log(`Request failed: ${e.message}`);
            if (manager.getCurrentStrategyName() !== 'Unstable AI') {
                // If the name changed, we successfully switched!
                console.log("Model switched detected! Retrying request automatically is handled by recursion, but here we see the error bubble up if not retried internally.");
            }
        }
    }
    
    // Verify final state
    console.log(`\nFinal Active Strategy: ${manager.getCurrentStrategyName()}`);
}

runDemo().catch(console.error);
