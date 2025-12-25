import { canTrigger, markTriggered } from "../redis/redis.service";
import { publishControlCommand } from "../mqtt/mqtt.service";

export function evaluateCondition(op, actual, expected) {
    switch (op) {
        case "gt": return actual > expected;
        case "ge": return actual >= expected;
        case "lt": return actual < expected;
        case "le": return actual <= expected;
        case "eq": return actual === expected;
        case "neq": return actual !== expected;
        case "contains": return String(actual).includes(expected);
        default: return false;
    }
}

export async function evaluateRules({ homeId, measure, value }) {
    const redisKey = `rules:${homeId}:${measure}`;
    const rules = await redis.lRange(redisKey, 0, -1);

    for (let i = 0; i < rules.length; i++) {
        const rule = JSON.parse(rules[i]);

        if (!evaluateCondition(rule.condition, value, rule.threshold)) continue;
        if (!(await canTrigger(redisKey, i))) continue;

        publishControlCommand(homeId, rule.devicePin, rule.action);
        await markTriggered(redisKey, i);
    }
}
