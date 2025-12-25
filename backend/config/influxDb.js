import { InfluxDB } from "@influxdata/influxdb-client";

let influx = null;
let writeApi = null;

export function initInfluxClient({
    url,
    token,
    org,
    bucket
}) {
    if (!url || !token || !org || !bucket) {
        throw new Error("InfluxDB configuration missing");
    }

    if (influx && writeApi) {
        return { influx, writeApi };
    }

    influx = new InfluxDB({ url, token });

    writeApi = influx.getWriteApi(org, bucket, "ms"); // millisecond precision
    writeApi.useDefaultTags({ service: "iot-backend" });

    console.log("InfluxDB connected");

    return { influx, writeApi };
}

export function getInfluxWriteApi() {
    if (!writeApi) {
        throw new Error("InfluxDB not initialized");
    }
    return writeApi;
}
