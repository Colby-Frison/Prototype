# SmartWrite ModelManager Refactor – Strategy Pattern Demo

## Overview
This project demonstrates the **Strategy Design Pattern** in refactoring a monolithic AI ModelManager. By decoupling individual model logic from management and error handling, the code becomes more maintainable, extensible, and easier to test.

## Pattern Used
- **Strategy Pattern:** Enables switching between different AI model strategies (e.g., GPT-4, GPT-3.5) at runtime and establishes a flexible fallback mechanism.

## Key Files
- `src/ModelManager.js` – Context class for managing models and error/fallback flow.
- `src/strategies/ModelStrategy.js` – Defines the Strategy interface.
- `src/strategies/GPT4Strategy.js`, `src/strategies/GPT35Strategy.js`, `src/strategies/UnstableStrategy.js` – Concrete strategy implementations.
- `tests/test_prototype.js` – Demo and test cases for model selection and fallback.

## How to Run the Demo

```bash
node tests/test_prototype.js
```

## Authors / Group
- Colby Frison, Emily Locklear, Grant Parkman, James Totah, Antonio Natusch Zarco (Group H)

