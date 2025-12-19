import { operatorHandlers } from "./operatorHandler.js";

export function evaluateCondition(actualValue, condition) {
    const handler = operatorHandlers[condition.valueType]?.[condition.operator];

    if (!handler) return false;

    return handler(actualValue, condition.expectedValue);
}
