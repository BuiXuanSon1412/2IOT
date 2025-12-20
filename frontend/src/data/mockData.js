import { Thermometer, Droplets, Wind, Activity, Lightbulb, Lock, Fan, AlertTriangle } from 'lucide-react';

export const mockDeviceDetails = {
  // === LIVING ROOM 01 ===
  'fan-living01-001': {
    id: 'fan-living01-001',
    name: 'Living Room Fan',
    type: 'fan',
    room: 'Living Room 01',
    status: 'online',
    icon: '🌀',
    iconComponent: Fan,
    power: true,
    speed: 3, // 0-5 speed levels
    mode: 'normal', // normal, sleep, natural
    timer: 0, // minutes, 0 = off
    energyUsage: '0.075 kWh',
    lastUpdated: '2 mins ago',

    // ===== Basic =====
    isOn: true,
    speed: 'medium', // low | medium | high

    // ===== Advanced =====
    maxRPM: 1200,

    // ===== Logs =====
    logs: [
      'Fan turned ON',
      'Speed changed to Medium',
    ],
  },
  'light-living01-001': {
    id: 'light-living01-001',
    name: 'Living Room Light',
    type: 'light',
    room: 'Living Room 01',
    status: 'online',
    icon: '💡',
    iconComponent: Lightbulb,
    power: true,
    brightness: 75, // 0-100%
    energyUsage: '0.012 kWh',
    lastUpdated: '1 min ago',
    // ===== Basic =====
    isOn: true,
    brightness: 75,

    // ===== Advanced =====
    autoOffMinutes: 15,
    powerLimitWatt: 12,

    // ===== Logs =====
    logs: [
      'Turned ON at 18:30',
      'Brightness set to 75%',
      'Auto-off scheduled (15 min)',
    ],
  },
  'dht22-living01-001': {
    id: 'dht22-living01-001',
    name: 'Living Room Climate',
    type: 'dht22',
    room: 'Living Room 01',
    status: 'online',
    icon: '🌡️',
    iconComponent: Thermometer,
    lastUpdated: '30 secs ago',
    // ===== Basic =====
    temperature: 29.4,
    humidity: 68,

    // ===== Advanced =====
    alertTempThreshold: 32,
    alertHumidityThreshold: 75,
    pollingIntervalSec: 5,

    // ===== Logs =====
    logs: [
      'Temp: 29.1°C, Humidity: 65%',
      'Temp: 29.4°C, Humidity: 68%',
    ],
  },
  'bh1750-living01-001': {
    id: 'bh1750-living01-001',
    name: 'Living Room Light Sensor',
    type: 'bh1750',
    room: 'Living Room 01',
    status: 'online',
    icon: '☀️',
    iconComponent: Activity, // or import Sun from lucide-react
    lightLevel: 245, // lux
    condition: 'bright', // dark, dim, bright, very-bright
    lastUpdated: '20 secs ago',

    // ===== Basic =====
    lux: 420,

    // ===== Advanced =====
    pollingIntervalSec: 10,
    calibrationFactor: 1.02,

    // ===== Logs =====
    logs: [
      'Lux reading: 450',
      'Lux reading: 420',
    ],
  },
  // === STAIR 01 ===
  'light-stair01-001': {
    id: 'light-stair01-001',
    name: 'Stairway Light',
    type: 'light',
    room: 'Stair 01',
    status: 'online',
    icon: '💡',
    iconComponent: Lightbulb,
    power: false,
    brightness: 50,
    energyUsage: '0.008 kWh',
    lastUpdated: '5 mins ago',
    // ===== Basic =====
    lux: 420,

    // ===== Advanced =====
    pollingIntervalSec: 10,
    calibrationFactor: 1.02,

    // ===== Logs =====
    logs: [
      'Lux reading: 450',
      'Lux reading: 420',
    ],
  },
  'bh1750-stair01-001': {
    id: 'bh1750-stair01-001',
    name: 'Stairway Light Sensor',
    type: 'bh1750',
    room: 'Stair 01',
    status: 'online',
    icon: '☀️',
    iconComponent: Activity,
    lightLevel: 40, // lux
    condition: 'dim',
    lastUpdated: '30 secs ago'
  },
  // === KITCHEN 01 ===
  'fan-kitchen01-001': {
    id: 'fan-kitchen01-001',
    name: 'Kitchen Exhaust Fan',
    type: 'fan',
    room: 'Kitchen 01',
    status: 'online',
    icon: '🌀',
    iconComponent: Fan,
    power: false,
    speed: 2,
    mode: 'exhaust', // exhaust mode
    timer: 0,
    energyUsage: '0.095 kWh',
    lastUpdated: '1 min ago'
  },
  'mq2-kitchen01-001': {
    id: 'mq2-kitchen01-001',
    name: 'Kitchen Gas Sensor',
    type: 'mq2',
    room: 'Kitchen 01',
    status: 'online',
    icon: '💨',
    iconComponent: AlertTriangle,
    gasLevel: 125, // PPM (parts per million)
    smokeDetected: false,
    lpgDetected: false,
    coDetected: false,
    alertThreshold: 1000, // PPM
    lastUpdated: '15 secs ago',
    // ===== Basic =====
    gasLevel: 180, // ppm
    smokeDetected: false,

    // ===== Advanced =====
    sensitivity: 3, // 1–5
    alarmEnabled: true,

    // ===== Logs =====
    logs: [
      'Gas level: 170 ppm',
      'Gas level: 180 ppm',
    ],
  },

  // === GARAGE 01 ===
  'lock-garage01-001': {
    id: 'lock-garage01-001',
    name: 'Garage Door Lock',
    type: 'lock',
    room: 'Garage 01',
    status: 'online',
    icon: '🔒',
    iconComponent: Lock,
    locked: true,
    battery: 85, // percentage
    autoLock: true,
    autoLockDelay: 30, // seconds
    lastAccess: '2 hours ago',
    accessLog: [
      { user: 'John', time: '8:30 AM', action: 'unlock' },
      { user: 'Sarah', time: '7:15 AM', action: 'lock' }
    ],
    // ===== Basic =====
    locked: true,

    // ===== Advanced =====
    autoLockSeconds: 30,
    failedAttemptLimit: 5,

    // ===== Logs =====
    logs: [
      'Door locked automatically',
      'Door unlocked by user',
    ],
  },

  // === BATHROOM 01 ===
  'dht22-bathroom01-001': {
    id: 'dht22-bathroom01-001',
    name: 'Bathroom Climate',
    type: 'dht22',
    room: 'Bathroom 01',
    status: 'online',
    icon: '🌡️',
    iconComponent: Thermometer,
    lastUpdated: '45 secs ago',
    // ===== Basic =====
    temperature: 29.4,
    humidity: 68,

    // ===== Advanced =====
    alertTempThreshold: 32,
    alertHumidityThreshold: 75,
    pollingIntervalSec: 5,

    // ===== Logs =====
    logs: [
      'Temp: 29.1°C, Humidity: 65%',
      'Temp: 29.4°C, Humidity: 68%',
    ],
  },

  // === BEDROOM 01 ===
  'fan-bedroom01-001': {
    id: 'fan-bedroom01-001',
    name: 'Bedroom Fan',
    type: 'fan',
    room: 'Bedroom 01',
    status: 'online',
    icon: '🌀',
    iconComponent: Fan,
    power: true,
    speed: 2,
    mode: 'sleep', // sleep mode - quieter
    timer: 480, // 8 hours
    energyUsage: '0.065 kWh',
    lastUpdated: '3 mins ago',
    // ===== Basic =====
    isOn: true,
    speed: 'medium', // low | medium | high

    // ===== Advanced =====
    maxRPM: 1200,

    // ===== Logs =====
    logs: [
      'Fan turned ON',
      'Speed changed to Medium',
    ],
  },
  'light-bedroom01-001': {
    id: 'light-bedroom01-001',
    name: 'Bedroom Light',
    type: 'light',
    room: 'Bedroom 01',
    status: 'online',
    icon: '💡',
    iconComponent: Lightbulb,
    power: true,
    brightness: 30,
    energyUsage: '0.006 kWh',
    lastUpdated: '2 mins ago',
    // ===== Basic =====
    isOn: true,
    brightness: 75,

    // ===== Advanced =====
    autoOffMinutes: 15,
    powerLimitWatt: 12,

    // ===== Logs =====
    logs: [
      'Turned ON at 18:30',
      'Brightness set to 75%',
      'Auto-off scheduled (15 min)',
    ],
  },
  'dht22-bedroom01-001': {
    id: 'dht22-bedroom01-001',
    name: 'Bedroom Climate',
    type: 'dht22',
    room: 'Bedroom 01',
    status: 'online',
    icon: '🌡️',
    iconComponent: Thermometer,
    lastUpdated: '1 min ago',
    // ===== Basic =====
    temperature: 29.4,
    humidity: 68,

    // ===== Advanced =====
    alertTempThreshold: 32,
    alertHumidityThreshold: 75,
    pollingIntervalSec: 5,

    // ===== Logs =====
    logs: [
      'Temp: 29.1°C, Humidity: 65%',
      'Temp: 29.4°C, Humidity: 68%',
    ],
  },
  'bh1750-bedroom01-001': {
    id: 'bh1750-bedroom01-001',
    name: 'Bedroom Light Sensor',
    type: 'bh1750',
    room: 'Bedroom 01',
    status: 'online',
    icon: '☀️',
    iconComponent: Activity,
    lightLevel: 45, // lux
    condition: 'dim',
    lastUpdated: '30 secs ago',
    // ===== Basic =====
    lux: 420,

    // ===== Advanced =====
    pollingIntervalSec: 10,
    calibrationFactor: 1.02,

    // ===== Logs =====
    logs: [
      'Lux reading: 450',
      'Lux reading: 420',
    ],
  },
  // === BEDROOM 02 ===
  'fan-bedroom02-001': {
    id: 'fan-bedroom02-001',
    name: 'Bedroom Fan',
    type: 'fan',
    room: 'Bedroom 02',
    status: 'online',
    icon: '🌀',
    iconComponent: Fan,
    power: false,
    speed: 3,
    mode: 'normal',
    timer: 0,
    energyUsage: '0.080 kWh',
    lastUpdated: '10 mins ago',
    // ===== Basic =====
    isOn: true,
    speed: 'medium', // low | medium | high

    // ===== Advanced =====
    maxRPM: 1200,

    // ===== Logs =====
    logs: [
      'Fan turned ON',
      'Speed changed to Medium',
    ],
  },
  'light-bedroom02-001': {
    id: 'light-bedroom02-001',
    name: 'Bedroom Light',
    type: 'light',
    room: 'Bedroom 02',
    status: 'online',
    icon: '💡',
    iconComponent: Lightbulb,
    power: false,
    brightness: 60,
    energyUsage: '0.010 kWh',
    lastUpdated: '20 mins ago',
    // ===== Basic =====
    isOn: true,
    brightness: 75,

    // ===== Advanced =====
    autoOffMinutes: 15,
    powerLimitWatt: 12,

    // ===== Logs =====
    logs: [
      'Turned ON at 18:30',
      'Brightness set to 75%',
      'Auto-off scheduled (15 min)',
    ],
  },
  'dht22-bedroom02-001': {
    id: 'dht22-bedroom02-001',
    name: 'Bedroom Climate',
    type: 'dht22',
    room: 'Bedroom 02',
    status: 'online',
    icon: '🌡️',
    iconComponent: Thermometer,
    lastUpdated: '2 mins ago',
    // ===== Basic =====
    temperature: 29.4,
    humidity: 68,

    // ===== Advanced =====
    alertTempThreshold: 32,
    alertHumidityThreshold: 75,
    pollingIntervalSec: 5,

    // ===== Logs =====
    logs: [
      'Temp: 29.1°C, Humidity: 65%',
      'Temp: 29.4°C, Humidity: 68%',
    ],
  },
  'bh1750-bedroom02-001': {
    id: 'bh1750-bedroom02-001',
    name: 'Bedroom Light Sensor',
    type: 'bh1750',
    room: 'Bedroom 02',
    status: 'online',
    icon: '☀️',
    iconComponent: Activity,
    lightLevel: 10, // lux
    condition: 'dark',
    lastUpdated: '25 secs ago',
    // ===== Basic =====
    lux: 420,

    // ===== Advanced =====
    pollingIntervalSec: 10,
    calibrationFactor: 1.02,

    // ===== Logs =====
    logs: [
      'Lux reading: 450',
      'Lux reading: 420',
    ],
  },
  // === HALLWAY 01 ===
  'light-hallway01-001': {
    id: 'light-hallway01-001',
    name: 'Hallway Light',
    type: 'light',
    room: 'Hallway 01',
    status: 'online',
    icon: '💡',
    iconComponent: Lightbulb,
    power: true,
    brightness: 100,
    energyUsage: '0.015 kWh',
    lastUpdated: '30 secs ago',
    // ===== Basic =====
    isOn: true,
    brightness: 75,

    // ===== Advanced =====
    autoOffMinutes: 15,
    powerLimitWatt: 12,

    // ===== Logs =====
    logs: [
      'Turned ON at 18:30',
      'Brightness set to 75%',
      'Auto-off scheduled (15 min)',
    ],
  },
  'bh1750-hallway01-001': {
    id: 'bh1750-hallway01-001',
    name: 'Hallway Light Sensor',
    type: 'bh1750',
    room: 'Hallway 01',
    status: 'online',
    icon: '☀️',
    iconComponent: Activity,
    lightLevel: 580, // lux
    condition: 'very-bright',
    lastUpdated: '15 secs ago',
    // ===== Basic =====
    lux: 420,

    // ===== Advanced =====
    pollingIntervalSec: 10,
    calibrationFactor: 1.02,

    // ===== Logs =====
    logs: [
      'Lux reading: 450',
      'Lux reading: 420',
    ],
  }
};

export const mockFloors = [
  {
    name: 'Floor 1',
    rooms: [
      {
        name: 'Living Room 01',
        x: 60,
        y: 40,
        width: 240,
        height: 200,
        devices: [
          'fan-living01-001',
          'dht22-living01-001',
          'light-living01-001',
          'bh1750-living01-001',
        ],
      },
      {
        name: 'Stair 01',
        x: 300,
        y: 40,
        width: 70,
        height: 140,
        devices: [
          'light-stair01-001',
          'bh1750-stair01-001'
        ],
      },
      {
        name: 'Kitchen 01',
        x: 370,
        y: 40,
        width: 170,
        height: 200,
        devices: [
          'mq2-kitchen01-001',
          'fan-kitchen01-001',
        ],
      },
      {
        name: 'Bathroom 01',
        x: 60,
        y: 240,
        width: 180,
        height: 120,
        devices: [
          'dht22-bathroom01-001',
        ],
      },
      {
        name: 'Garage 01',
        x: 240,
        y: 240,
        width: 300,
        height: 120,
        devices: [
          'lock-garage01-001',
        ],
      },
    ],
  },
  {
    name: 'Floor 2',
    rooms: [
      {
        name: 'Bedroom 01',
        x: 60,
        y: 40,
        width: 240,
        height: 140,
        devices: [
          'fan-bedroom01-001',
          'dht22-bedroom01-001',
          'light-bedroom01-001',
          'bh1750-bedroom01-001',
        ],
      },
      {
        name: 'Stair 01',
        x: 300,
        y: 40,
        width: 70,
        height: 140,
        devices: [
          'light-stair01-001',
          'bh1750-stair01-001'
        ],
      },
      {
        name: 'Bedroom 02',
        x: 370,
        y: 40,
        width: 170,
        height: 140,
        devices: [
          'fan-bedroom02-001',
          'dht22-bedroom02-001',
          'light-bedroom02-001',
          'bh1750-bedroom02-001',
        ],
      },
      {
        name: 'Hallway',
        x: 60,
        y: 180,
        width: 480,
        height: 40,
        devices: [
          'light-hallway01-001',
          'bh1750-hallway01-001',
        ],
      },
      {
        name: 'Office 01',
        x: 60,
        y: 220,
        width: 300,
        height: 140,
        devices: [],
      },
      {
        name: 'Bathroom',
        x: 360,
        y: 220,
        width: 180,
        height: 140,
        devices: [],
      },
    ],
  }
];
