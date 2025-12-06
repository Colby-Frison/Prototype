# Design Pattern Prototype: Strategy Pattern for AI Model Management

## Group Info
**Member:** Colby (User) & Assistant (AI)
**Pattern:** Strategy Pattern

## Problem Description
In the SmartWrite application, we support multiple AI models (GPT-4, GPT-3.5, Claude, etc.). Each model has different costs, capabilities, and reliability profiles. 
The application needs to:
1. Switch between these models dynamically based on user preference or system availability.
2. Handle failures gracefully by falling back to alternative models.

The original implementation mixed the logic of model selection, error handling, and the specific behavior of each model (simulated API calls) into a single monolithic `ModelManager` class with large switch statements. This violates the Open/Closed Principle (adding a new model requires modifying the manager) and makes the code hard to maintain and test.

## Pattern Selection: Strategy Pattern
The **Strategy Pattern** defines a family of algorithms, encapsulates each one, and makes them interchangeable. It lets the algorithm vary independently from clients that use it.

In our prototype:
- **Context**: `ModelManager` maintains a reference to the current strategy and handles the fallback logic.
- **Strategy Interface**: `ModelStrategy` defines the `sendMessage` contract.
- **Concrete Strategies**: `GPT4Strategy`, `GPT35Strategy`, `UnstableStrategy` implement the specific API calls (simulated).

This allows us to add new models by simply creating a new class and registering it, without changing the core logic of the `ModelManager`.

## Implementation Details
- **`src/strategies/ModelStrategy.js`**: Base class defining the interface.
- **`src/strategies/GPT4Strategy.js`**: Concrete implementation for GPT-4.
- **`src/strategies/UnstableStrategy.js`**: A strategy designed to fail, demonstrating the fallback mechanism.
- **`src/ModelManager.js`**: The context that manages the current strategy and executes the fallback chain if the current strategy fails.
- **`tests/test_prototype.js`**: A demonstration script that runs a "Happy Path" scenario and a "Fallback" scenario.

## How to Run
To run the prototype demonstration:

```bash
node "Prototype project/tests/test_prototype.js"
```

## Expected Output
The demo will show:
1. Successful communication with GPT-4.
2. Attempted communication with "Unstable AI".
3. Simulated failures of "Unstable AI".
4. Automatic switching (fallback) to GPT-4 after error threshold is reached.
5. Successful response from the fallback model.

## Interview Prep: Sample Questions & Answers

**Q: Why choose Strategy Pattern over a simple switch statement?**
**A:** A switch statement violates the Open/Closed Principle. Every time we add a new model, we'd have to modify the main class, increasing the risk of bugs. The Strategy pattern isolates each model's implementation, making it easier to add, remove, or test them independently.

**Q: How does this pattern help with testing?**
**A:** It allows us to mock individual strategies easily. We can test the `ModelManager`'s fallback logic by injecting a mock strategy that we control (like we did with `UnstableStrategy`), without needing to make real API calls or rely on the complex internal logic of a real model adapter.

**Q: Can strategies maintain state?**
**A:** Yes, concrete strategies can maintain their own state (like `errorCount` in our original `ModelManager`, though in our refactor we moved `errorCount` to the context's wrapper to keep strategies pure, but they *could* hold state like conversation history if needed).
