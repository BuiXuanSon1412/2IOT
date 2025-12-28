import { canTrigger, markTriggered } from "../redis/redis.service.js";
import { publishControlCommand } from "../mqtt/mqtt.service.js";
import { getRedisClient } from "../../../config/redis.js";

function matchRange(value, range = {}) {
    if (typeof range.ge === "number" && value < range.ge) return false;
    if (typeof range.le === "number" && value > range.le) return false;
    return true;
}

export async function evaluateRules({ homeId, measure, value }) {
    const redis = getRedisClient();

    const redisKey = `rules:${homeId}:${measure}`;
    const rules = await redis.lRange(redisKey, 0, -1);
    // console.log("Examining rule:", redisKey);

    for (let i = 0; i < rules.length; i++) {
        const rule = JSON.parse(rules[i]);

        if (!matchRange(value, rule.range)) continue;

        if (!(await canTrigger(redisKey, i))) continue;

        publishControlCommand(
            homeId,
            rule.name,
            rule.action
        );

        await markTriggered(redisKey, i);
    }
}

export async function executeOnce(rule) {
    const redis = getRedisClient();

    const bucket = Math.floor(Date.now() / 60000);
    const execKey = `schedule:exec:${rule.name}:${bucket}`;

    const allowed = await redis.setNX(execKey, "1");
    if (!allowed) return;
    await redis.expire(execKey, process.env.EXEC_TTL);

    publishControlCommand(rule.homeId, rule.name, rule.action);
}
