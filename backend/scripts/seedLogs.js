import mongoose from "mongoose";
import dotenv from "dotenv";
import Log from "../models/Log.js";
import Device from "../models/Device.js";
import Sensor from "../models/Sensor.js";

dotenv.config();

// Hanoi weather simulation (December - cool and humid)
function generateHanoiWeather() {
  // Temperature: 15-30°C (cooler in December)
  const baseTemp = 18 + Math.random() * 8; // 18-26°C average
  const tempVariation = (Math.random() - 0.5) * 4; // ±2°C variation
  const temperature = Math.max(15, Math.min(30, baseTemp + tempVariation));

  // Humidity: 60-85% (high humidity in Hanoi)
  const baseHumidity = 70 + Math.random() * 10; // 70-80% average
  const humidityVariation = (Math.random() - 0.5) * 10; // ±5% variation
  const humidity = Math.max(60, Math.min(85, baseHumidity + humidityVariation));

  return {
    temperature: parseFloat(temperature.toFixed(1)),
    humidity: parseFloat(humidity.toFixed(1))
  };
}

// Brightness simulation (lux)
function generateBrightness(hour) {
  // Night (0-5): 0-10 lux
  if (hour >= 0 && hour < 6) {
    return Math.random() * 10;
  }
  // Dawn (6-8): 10-300 lux
  else if (hour >= 6 && hour < 8) {
    return 10 + Math.random() * 290;
  }
  // Morning (8-11): 300-800 lux
  else if (hour >= 8 && hour < 11) {
    return 300 + Math.random() * 500;
  }
  // Noon (11-14): 800-1200 lux (peak)
  else if (hour >= 11 && hour < 14) {
    return 800 + Math.random() * 400;
  }
  // Afternoon (14-17): 400-800 lux
  else if (hour >= 14 && hour < 17) {
    return 400 + Math.random() * 400;
  }
  // Dusk (17-19): 50-400 lux
  else if (hour >= 17 && hour < 19) {
    return 50 + Math.random() * 350;
  }
  // Night (19-24): 0-50 lux
  else {
    return Math.random() * 50;
  }
}

// LED brightness (0-255)
function generateLEDBrightness(hour) {
  // More light during evening hours
  if (hour >= 18 || hour < 6) {
    return Math.random() > 0.3 ? Math.floor(50 + Math.random() * 205) : 0;
  }
  // Less light during day
  else if (hour >= 6 && hour < 18) {
    return Math.random() > 0.7 ? Math.floor(30 + Math.random() * 100) : 0;
  }
  return 0;
}

// Fan motor speed (0 or 70-200)
function generateFanSpeed(temperature) {
  // Fan more likely to be on when hot
  if (temperature > 27) {
    return Math.random() > 0.2 ? Math.floor(120 + Math.random() * 80) : 0;
  } else if (temperature > 24) {
    return Math.random() > 0.5 ? Math.floor(70 + Math.random() * 80) : 0;
  } else {
    return Math.random() > 0.8 ? Math.floor(70 + Math.random() * 50) : 0;
  }
}

async function seedLogs() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Get all devices and sensors
    const devices = await Device.find({});
    const sensors = await Sensor.find({});

    console.log(`Found ${devices.length} devices and ${sensors.length} sensors`);

    if (devices.length === 0 && sensors.length === 0) {
      console.log("No devices or sensors found. Please add them first.");
      process.exit(0);
    }

    // Clear existing logs (optional)
    const shouldClear = process.argv.includes('--clear');
    if (shouldClear) {
      console.log("Clearing existing logs...");
      await Log.deleteMany({});
      console.log("Existing logs cleared");
    }

    const logs = [];
    const now = new Date();
    const DAYS = 10;
    const INTERVAL_MINUTES = 5;
    const LOGS_PER_DAY = (24 * 60) / INTERVAL_MINUTES; // 288 logs per day

    console.log(`Generating logs for ${DAYS} days...`);

    // Generate logs for each day
    for (let day = DAYS - 1; day >= 0; day--) {
      const dayDate = new Date(now);
      dayDate.setDate(dayDate.getDate() - day);
      dayDate.setHours(0, 0, 0, 0);

      console.log(`Generating logs for ${dayDate.toDateString()}...`);

      // Generate logs for each 5-minute interval
      for (let interval = 0; interval < LOGS_PER_DAY; interval++) {
        const timestamp = new Date(dayDate);
        timestamp.setMinutes(interval * INTERVAL_MINUTES);

        const hour = timestamp.getHours();

        // Generate sensor logs (both sensors at same time)
        for (const sensor of sensors) {
          const sensorName = sensor.name.toLowerCase();

          if (sensorName.includes('dht22')) {
            const { temperature, humidity } = generateHanoiWeather();
            logs.push({
              sourceId: sensor._id,
              sourceType: 'Sensor',
              timestamp,
              state: { temperature, humidity },
              trigger: 'polling'
            });
          } else if (sensorName.includes('bh1750')) {
            const brightness = parseFloat(generateBrightness(hour).toFixed(1));
            logs.push({
              sourceId: sensor._id,
              sourceType: 'Sensor',
              timestamp,
              state: { brightness },
              trigger: 'polling'
            });
          }
        }

        // Generate device logs (randomly, not all devices at every interval)
        for (const device of devices) {
          // Only log ~30% of the time for devices to make it more realistic
          if (Math.random() > 0.7) continue;

          const deviceType = device.deviceType?.toLowerCase() || '';
          let state = {};

          if (deviceType.includes('light')) {
            state.brightness = generateLEDBrightness(hour);
          } else if (deviceType.includes('fan')) {
            // Use a consistent temperature for this interval
            const { temperature } = generateHanoiWeather();
            state['Fan speed'] = generateFanSpeed(temperature);
          }

          // Only add log if device has activity
          if (Object.keys(state).length > 0) {
            logs.push({
              sourceId: device._id,
              sourceType: 'Device',
              timestamp,
              state,
              trigger: Math.random() > 0.9 ? 'manual' : 'polling'
            });
          }
        }
      }
    }

    console.log(`Generated ${logs.length} log entries`);
    console.log("Inserting logs into database...");

    // Insert in batches to avoid memory issues
    const BATCH_SIZE = 1000;
    for (let i = 0; i < logs.length; i += BATCH_SIZE) {
      const batch = logs.slice(i, i + BATCH_SIZE);
      await Log.insertMany(batch);
      console.log(`Inserted batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(logs.length / BATCH_SIZE)}`);
    }

    console.log("✅ Logs seeded successfully!");
    console.log(`Total logs created: ${logs.length}`);

    // Show sample logs
    const sampleLogs = await Log.find({}).limit(5).sort({ timestamp: -1 });
    console.log("\nSample logs (most recent):");
    sampleLogs.forEach(log => {
      console.log(`- ${log.timestamp.toISOString()} | ${log.sourceType} | ${JSON.stringify(log.state)}`);
    });

  } catch (error) {
    console.error("Error seeding logs:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the seed function
seedLogs();

// Usage:
// node scripts/seedLogs.js           # Add logs (keep existing)
// node scripts/seedLogs.js --clear   # Clear and regenerate all logs
