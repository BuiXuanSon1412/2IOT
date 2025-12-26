import { Point } from "@influxdata/influxdb-client";
import { getInfluxWriteApi } from "../../../config/influxDb.js";

export function writeSensorPoint({
    homeId,
    sensorPin,
    measure,
    value,
    timestamp
}) {
    const influx = getInfluxWriteApi();

    const point = new Point(measure)
        .tag("homeId", String(homeId))
        .tag("sensorPin", sensorPin)
        .floatField("value", Number(value))
        .timestamp(new Date(timestamp));

    influx.writePoint(point);
}