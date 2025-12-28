import Log from "../../models/Log.js";
import Device from "../../models/Device.js";
import Sensor from "../../models/Sensor.js";

export const getLogsByDateRange = async (startDate, endDate, sourceType = null) => {
  const query = {
    timestamp: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  };

  if (sourceType) {
    query.sourceType = sourceType;
  }

  const logs = await Log.find(query)
    .sort({ timestamp: -1 })
    .lean();

  return logs;
};

export const getLogsBySourceId = async (sourceId, limit = 100) => {
  const logs = await Log.find({ sourceId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .lean();

  return logs;
};

export const getAggregatedDeviceLogs = async (startDate, endDate) => {
  try {
    const logs = await Log.aggregate([
      {
        $match: {
          timestamp: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          },
          sourceType: 'Device'
        }
      },
      {
        $lookup: {
          from: 'devices',
          localField: 'sourceId',
          foreignField: '_id',
          as: 'device'
        }
      },
      {
        $unwind: {
          path: '$device',
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $addFields: {
          stateValue: {
            $cond: [
              { $ifNull: ['$state.brightness', false] },
              '$state.brightness',
              { $ifNull: ['$state.Fan speed', 0] }
            ]
          }
        }
      },
      {
        $group: {
          _id: {
            deviceId: '$sourceId',
            deviceName: '$device.name',
            deviceType: '$device.deviceType',
            date: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$timestamp'
              }
            }
          },
          avgState: { $avg: '$stateValue' },
          minState: { $min: '$stateValue' },
          maxState: { $max: '$stateValue' },
          count: { $sum: 1 },
          timestamps: { $push: '$timestamp' }
        }
      },
      {
        $project: {
          _id: 0,
          deviceId: '$_id.deviceId',
          deviceName: '$_id.deviceName',
          deviceType: '$_id.deviceType',
          date: '$_id.date',
          avgState: { $round: ['$avgState', 2] },
          minState: 1,
          maxState: 1,
          count: 1,
          activeHours: {
            $round: [
              {
                $multiply: [
                  { $divide: ['$count', 12] }, // 5 min intervals = 12 per hour
                  1
                ]
              },
              1
            ]
          }
        }
      },
      {
        $sort: { date: 1 }
      }
    ]);

    return logs;
  } catch (error) {
    console.error('Error in getAggregatedDeviceLogs:', error);
    throw error;
  }
};

export const getAggregatedSensorLogs = async (startDate, endDate) => {
  try {
    const logs = await Log.aggregate([
      {
        $match: {
          timestamp: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          },
          sourceType: 'Sensor'
        }
      },
      {
        $lookup: {
          from: 'sensors',
          localField: 'sourceId',
          foreignField: '_id',
          as: 'sensor'
        }
      },
      {
        $unwind: {
          path: '$sensor',
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $group: {
          _id: {
            sensorId: '$sourceId',
            sensorName: '$sensor.name',
            date: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$timestamp'
              }
            }
          },
          avgTemperature: {
            $avg: '$state.temperature'
          },
          avgHumidity: {
            $avg: '$state.humidity'
          },
          avgBrightness: {
            $avg: '$state.brightness'
          },
          minTemperature: { $min: '$state.temperature' },
          maxTemperature: { $max: '$state.temperature' },
          minHumidity: { $min: '$state.humidity' },
          maxHumidity: { $max: '$state.humidity' },
          minBrightness: { $min: '$state.brightness' },
          maxBrightness: { $max: '$state.brightness' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          sensorId: '$_id.sensorId',
          sensorName: '$_id.sensorName',
          date: '$_id.date',
          avgTemperature: {
            $cond: [
              { $ifNull: ['$avgTemperature', false] },
              { $round: ['$avgTemperature', 1] },
              null
            ]
          },
          avgHumidity: {
            $cond: [
              { $ifNull: ['$avgHumidity', false] },
              { $round: ['$avgHumidity', 1] },
              null
            ]
          },
          avgBrightness: {
            $cond: [
              { $ifNull: ['$avgBrightness', false] },
              { $round: ['$avgBrightness', 1] },
              null
            ]
          },
          minTemperature: { $round: [{ $ifNull: ['$minTemperature', 0] }, 1] },
          maxTemperature: { $round: [{ $ifNull: ['$maxTemperature', 0] }, 1] },
          minHumidity: { $round: [{ $ifNull: ['$minHumidity', 0] }, 1] },
          maxHumidity: { $round: [{ $ifNull: ['$maxHumidity', 0] }, 1] },
          minBrightness: { $round: [{ $ifNull: ['$minBrightness', 0] }, 1] },
          maxBrightness: { $round: [{ $ifNull: ['$maxBrightness', 0] }, 1] },
          count: 1
        }
      },
      {
        $sort: { date: 1 }
      }
    ]);

    return logs;
  } catch (error) {
    console.error('Error in getAggregatedSensorLogs:', error);
    throw error;
  }
};

export const getHourlyDeviceActivity = async (startDate, endDate) => {
  const logs = await Log.aggregate([
    {
      $match: {
        timestamp: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        },
        sourceType: 'Device'
      }
    },
    {
      $lookup: {
        from: 'devices',
        localField: 'sourceId',
        foreignField: '_id',
        as: 'device'
      }
    },
    {
      $unwind: '$device'
    },
    {
      $group: {
        _id: {
          hour: { $hour: '$timestamp' },
          deviceType: '$device.deviceType'
        },
        count: { $sum: 1 },
        avgState: {
          $avg: {
            $cond: [
              { $gt: ['$state.brightness', 0] },
              '$state.brightness',
              { $ifNull: ['$state.Fan speed', 0] }
            ]
          }
        }
      }
    },
    {
      $group: {
        _id: '$_id.hour',
        totalActivity: { $sum: '$count' },
        devices: {
          $push: {
            type: '$_id.deviceType',
            count: '$count',
            avgState: { $round: ['$avgState', 1] }
          }
        }
      }
    },
    {
      $sort: { _id: 1 }
    },
    {
      $project: {
        _id: 0,
        hour: '$_id',
        totalActivity: 1,
        devices: 1
      }
    }
  ]);

  return logs;
};

export const getDeviceUsageByRoom = async (startDate, endDate) => {
  const logs = await Log.aggregate([
    {
      $match: {
        timestamp: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        },
        sourceType: 'Device'
      }
    },
    {
      $lookup: {
        from: 'devices',
        localField: 'sourceId',
        foreignField: '_id',
        as: 'device'
      }
    },
    {
      $unwind: '$device'
    },
    {
      $group: {
        _id: {
          room: '$device.area.room',
          floor: '$device.area.floor'
        },
        activeCount: {
          $sum: {
            $cond: [
              {
                $or: [
                  { $gt: ['$state.brightness', 0] },
                  { $gt: ['$state.Fan speed', 0] }
                ]
              },
              1,
              0
            ]
          }
        },
        totalLogs: { $sum: 1 },
        devices: { $addToSet: '$device.name' }
      }
    },
    {
      $project: {
        _id: 0,
        room: '$_id.room',
        floor: '$_id.floor',
        activeCount: 1,
        totalLogs: 1,
        deviceCount: { $size: '$devices' },
        activityRate: {
          $round: [
            {
              $multiply: [
                { $divide: ['$activeCount', '$totalLogs'] },
                100
              ]
            },
            1
          ]
        }
      }
    },
    {
      $sort: { activityRate: -1 }
    }
  ]);

  return logs;
};

export const createLog = async (logData) => {
  const log = await Log.create(logData);
  return log;
};
