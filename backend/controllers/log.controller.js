import {
  getLogsByDateRange,
  getLogsBySourceId,
  getAggregatedDeviceLogs,
  getAggregatedSensorLogs,
  getHourlyDeviceActivity,
  getDeviceUsageByRoom,
  createLog
} from "../services/log/log.service.js";

export async function fetchLogsByDateRange(req, res) {
  try {
    const { startDate, endDate, sourceType } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "startDate and endDate are required"
      });
    }

    const logs = await getLogsByDateRange(startDate, endDate, sourceType);
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function fetchLogsBySource(req, res) {
  try {
    const { sourceId } = req.params;
    const { limit } = req.query;

    const logs = await getLogsBySourceId(sourceId, limit ? parseInt(limit) : 100);
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function fetchAggregatedDeviceLogs(req, res) {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "startDate and endDate are required"
      });
    }

    const logs = await getAggregatedDeviceLogs(startDate, endDate);
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function fetchAggregatedSensorLogs(req, res) {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "startDate and endDate are required"
      });
    }

    const logs = await getAggregatedSensorLogs(startDate, endDate);
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function fetchHourlyDeviceActivity(req, res) {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "startDate and endDate are required"
      });
    }

    const logs = await getHourlyDeviceActivity(startDate, endDate);
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function fetchDeviceUsageByRoom(req, res) {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "startDate and endDate are required"
      });
    }

    const logs = await getDeviceUsageByRoom(startDate, endDate);
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function addLog(req, res) {
  try {
    const logData = req.body;

    if (!logData.sourceId || !logData.sourceType || !logData.state) {
      return res.status(400).json({
        message: "sourceId, sourceType, and state are required"
      });
    }

    const log = await createLog(logData);
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
