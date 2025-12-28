import { getRedisClient } from "../../../config/redis.js";
import Device from "../../../models/Device.js";
import { executeOnce } from "../rule/rule.service.js";

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
        name: device.name,
        range: rule.range,
        action: rule.action,
        cooldownMs: process.env.RULE_COOLDOWN || 30000,
        lastTriggeredAt: 0
      };

      await redis.rPush(redisKey, JSON.stringify(ruleEntry));
    }
  }

  console.log("Rule Engine: Rules loaded into Redis");
}

export async function loadSchedulesIntoRedis() {
  const devices = await Device.find({
    "settings.schedules.0": { $exists: true }
  }).lean();

  for (const device of devices) {
    for (const schedule of device.settings.schedules) {
      await cacheScheduleRule({
        homeId: device.homeId.toString(),
        name: device.name,
        cronExpression: schedule.cronExpression,
        action: schedule.action
      });
    }
  }

  console.log("Scheduler: schedules loaded into Redis");
}

export async function canTrigger(redisKey, ruleIndex, cooldownMs = process.env.RULE_COOLDOWN) {
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

export function buildRedisRule({ deviceName, measure, range, action }) {
  return JSON.stringify({
    name: deviceName,
    measure,
    range,
    action: [...action]
      .map(a => ({ name: a.name, value: a.value }))
      .sort((a, b) => a.name.localeCompare(b.name))
  });
}

export async function addRuleToRedis({ homeId, measure, rule }) {
  const redis = getRedisClient();
  const key = `rules:${homeId}:${measure}`;
  await redis.rPush(key, rule);
}

export async function removeRuleFromRedis({ homeId, measure, rule }) {
  const redis = getRedisClient();
  const key = `rules:${homeId}:${measure}`;
  await redis.lRem(key, 0, rule);
}

function parseField(field, min, max) {
  if (field === "*") return ["*"];
  return field.split(",").map(v => Number(v));
}

function expandCron(cronExpression) {
  const [min, hour, dom, month, dow] = cronExpression.split(" ");

  return {
    minutes: parseField(min, 0, 59),
    hours: parseField(hour, 0, 23),
    daysOfMonth: parseField(dom, 1, 31),
    daysOfWeek: parseField(dow, 0, 6)
  };
}

export async function cacheScheduleRule({
  homeId,
  name,
  cronExpression,
  action
}) {

  const redis = getRedisClient();
  const { minutes, hours, daysOfMonth, daysOfWeek } =
    expandCron(cronExpression);

  for (const m of minutes)
    for (const h of hours)
      for (const dom of daysOfMonth)
        for (const dow of daysOfWeek) {
          const key = `schedule:${m}:${h}:${dow}:${dom}`;
          await redis.rPush(key, JSON.stringify({
            homeId,
            name,
            cronExpression,
            action
          }));
        }
}

export async function removeScheduleRule({
  homeId,
  name,
  cronExpression,
  action
}) {
  const redis = getRedisClient();
  const { minutes, hours, daysOfMonth, daysOfWeek } =
    expandCron(cronExpression);

  const rule = JSON.stringify({
    homeId,
    name,
    cronExpression,
    action
  });

  for (const m of minutes)
    for (const h of hours)
      for (const dom of daysOfMonth)
        for (const dow of daysOfWeek) {
          const key = `schedule:${m}:${h}:${dow}:${dom}`;
          await redis.lRem(key, 0, rule);
        }
}

export async function startScheduler() {
  const redis = getRedisClient();

  setInterval(async () => {
    const now = new Date();

    const minute = now.getMinutes();
    const hour = now.getHours();
    const dow = now.getDay();      // 0–6
    const dom = now.getDate();     // 1–31

    const keys = [
      `schedule:${minute}:${hour}:${dow}:${dom}`,
      `schedule:${minute}:${hour}:${dow}:*`,
      `schedule:${minute}:${hour}:*:${dom}`,
      `schedule:${minute}:${hour}:*:*`,
      `schedule:${minute}:*:*:*`,
      `schedule:*:*:*:*`
    ];

    for (const key of keys) {
      const rules = await redis.lRange(key, 0, -1);
      for (const raw of rules) {
        await executeOnce(JSON.parse(raw));
      }
    }
  }, 60_000);

  console.log("Scheduler started");
}
