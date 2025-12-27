import { InfluxDB } from "@influxdata/influxdb-client";
import https from "https";
import http from "http";

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

    const isHttps = url.startsWith("https://");
    const AgentClass = isHttps ? https.Agent : http.Agent;
    
    const agent = new AgentClass({
        keepAlive: true,
        keepAliveMsecs: 1000,
        maxSockets: 10,
        maxFreeSockets: 5,
        timeout: 30000,
        freeSocketTimeout: 30000
    });

    influx = new InfluxDB({ url, token, transportOptions: {
        agent
    }});

    writeApi = influx.getWriteApi(org, bucket, "ns", {
        batchSize: 500,
        flushInterval: 1000,
        maxRetries: 5,
        maxRetryDelay: 3000
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

export async function closeInfluxClient() {
    if (writeApi) {
        try {
            await writeApi.flush();
            console.log("InfluxDB write API flushed");
        } catch (error) {
            console.error("Error flushing InfluxDB:", error);
        }
    }
    if (influx) {
        try {
            await influx.close();
            console.log("InfluxDB connection closed");
        } catch (error) {
            console.error("Error closing InfluxDB:", error);
        }
    }
}
