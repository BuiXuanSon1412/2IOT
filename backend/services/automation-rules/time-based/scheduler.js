import cron from "node-cron";
import { handleTimeEvent } from "../automation-rule.service.js";

function fieldToCronExpr(value) {
    return value === null || value === undefined || value === "" || value === "*" ? "*" : value;
}

function buildCronExpr(schedule) {
    const second = fieldToCronExpr(schedule.second);
    const minute = fieldToCronExpr(schedule.minute);
    const hour = fieldToCronExpr(schedule.hour);
    const dayOfMonth = fieldToCronExpr(schedule.daysOfMonth);
    const month = fieldToCronExpr(schedule.month);
    const dayOfWeek = fieldToCronExpr(schedule.daysOfWeek);

    return `${second} ${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
}

export function scheduleTimeRule(rule) {
    cron.schedule(buildCronExpr(rule.schedule), () => {
        handleTimeEvent(rule._id);
    });
}
