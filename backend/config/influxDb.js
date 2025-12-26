import { InfluxDB } from "@influxdata/influxdb-client";
import https from "https";

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

    const agent = new https.Agent({
        keepAlive: true,
        keepAliveMsecs: 30000,
        maxSockets: 50,
        maxFreeSockets: 10,
        timeout: 60000
    });

    influx = new InfluxDB({ url, token, transportOptions: {
        agent
    }});

    writeApi = influx.getWriteApi(org, bucket, "ns", {
        batchSize: 1000,
        flushInterval: 5000,
        maxRetries: 10,
        maxRetryDelay: 15000
    }); 
    writeApi.useDefaultTags({ service: "2iot-dev" });

    console.log("InfluxDB connected");

    return { influx, writeApi };
}

export function getInfluxWriteApi() {
    if (!writeApi) {
        throw new Error("InfluxDB not initialized");
    }
    return writeApi;
}
