import { getRedisClient } from "../../../config/redis.js";
import Device from "../../../models/Device.js";

export async function loadRulesIntoRedis() {
    const redis = getRedisClient();

    const devices = await Device.find({
        "settings.autoBehavior.0": { $exists: true }
    }).lean();

    for (const device of devices) {
        const homeId = device.homeId.toString();

        for (const rule of device.settings.autoBehavior) {
            const redisKey = `rules:${homeId}:${rule.measure}`;

            const ruleEntry = {
                devicePin: device.pin,
                condition: rule.condition,
                threshold: rule.value,
                action: rule.action,
                cooldownMs: process.env.RULE_COOLDOWN || 30000,
                lastTriggeredAt: 0
            };

            // redis client
            await redis.rPush(redisKey, JSON.stringify(ruleEntry));
        }
    }

    console.log("Rule Engine: Rules loaded into Redis");
}

export async function canTrigger(redisKey, ruleIndex, cooldownMs=process.env.RULE_COOLDOWN) {
    const redis = getRedisClient();

    const cooldownKey = `${redisKey}:cooldown:${ruleIndex}`;
    const last = await redis.get(cooldownKey);

    if (!last) return true;
    return Date.now() - Number(last) >= cooldownMs;
}

export async function markTriggered(redisKey, ruleIndex) {
    const redis = getRedisClient();

    const cooldownKey = `${redisKey}:cooldown:${ruleIndex}`;
    await redis.set(cooldownKey, Date.now());
}
