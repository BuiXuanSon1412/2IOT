import AutomationRule from "../../models/automation-rules/AutomationRule.js";
import { evaluateCondition } from "./condition-based/conditionEvaluators.js";
import { scheduleTimeRule } from "./time-based/scheduler.js";

let conditionRuleIndex = new Map();
let timeRules = [];

export async function initAutomationEngine() {
    const rules = await AutomationRule.find({ enabled: true });

    conditionRuleIndex.clear();
    timeRules = [];

    for (const rule of rules) {
        if (rule.ruleType === "condition_based") {
            const sensorId = rule.condition.sensorId.toString();
            if (!conditionRuleIndex.has(sensorId)) {
                conditionRuleIndex.set(sensorId, []);
            }
            conditionRuleIndex.get(sensorId).push(rule);
        }

        if (rule.ruleType === "time_based") {
            timeRules.push(rule);
            scheduleTimeRule(rule);
        }
    }
}

export async function handleSensorEvent(sensorId, metadata) {
    const rules = conditionRuleIndex.get(sensorId.toString());
    if (!rules) return;

    for (const rule of rules) {
        const field = metadata[rule.condition.field];
        if (!field) continue;

        const passed = evaluateCondition(field.value, rule.condition);
        if (!passed) continue;

        await executeRule(rule);
    }
}

export async function handleTimeEvent(ruleId) {
    const rule = timeRules.find(r => r._id.equals(ruleId));
    if (!rule) return;

    await executeRule(rule);
}

async function executeRule(rule) {
    if (!rule.enabled) return;

    await executeActions(rule.actions);

    rule.lastExecutedAt = new Date();
    await rule.save();
}

async function executeActions(actions) {
    for (const action of actions) {
        // TODO: Implement sending commands logic to devices through MQTT.
               
    }
}
