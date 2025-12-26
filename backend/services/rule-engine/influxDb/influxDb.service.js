import { Point } from "@influxdata/influxdb-client";
import { getInfluxWriteApi } from "../../../config/influxDb.js";

export async function writeSensorPoint({
    homeId,
    name,
    measure,
    value,
    timestamp
}) {
    const influx = getInfluxWriteApi();

    const point = new Point(measure)
        .tag("homeId", String(homeId))
        .tag("sensorName", name)
        .floatField("value", Number(value))
        .timestamp(new Date(timestamp));

    influx.writePoint(point);
}