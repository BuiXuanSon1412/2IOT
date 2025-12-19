import { Thermometer, Droplets, Wind, Activity, X, Power, ThermometerSun, Lightbulb, Lock, Unlock, Clock, Snowflake, Fan } from 'lucide-react';
export const mockDeviceDetails = {
  'fan-living01-001': {
    id: 'fan-living01-001',
    name: 'Living Room Fan',
    type: 'fan',
    room: 'Living Room 01',
    status: 'online',
    icon: '🌀',
    iconComponent: Fan,
    currentTemp: 24,
    targetTemp: 22,
    humidity: 55,
    mode: 'cool',
    fanSpeed: 'medium',
    power: true,
    energyUsage: '1.2 kWh',
    lastUpdated: '2 mins ago'
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
    brightness: 75,
    colorTemp: 4000,
    energyUsage: '0.1 kWh',
    lastUpdated: '1 min ago'
  },
  'dht22-living01-001': {
    id: 'dht22-living01-001',
    name: 'Living Room DHT Sensor',
    type: 'dht22',
    room: 'Living Room 01',
    status: 'online',
    icon: '🌡️',
    iconComponent: Thermometer,
    humidity: 68,
    temperature: 22,
    lastUpdated: '1 min ago'
  },
  'light-stair01-001': {
    id: 'light-stair01-001',
    name: 'Stair Light',
    type: 'light',
    room: 'Stair 01',
    status: 'online',
    icon: '💡',
    iconComponent: Lightbulb,
    power: true,
    brightness: 75,
    colorTemp: 4000,
    energyUsage: '0.1 kWh',
    lastUpdated: '1 min ago'

  },
  'fan-kitchen01-001': {
    id: 'fan-kitchen01-001',
    name: 'Kitchen Fan',
    type: 'fan',
    room: 'Kitchen 01',
    status: 'online',
    icon: '🌀',
    iconComponent: Fan,
    power: true,
    fanSpeed: 'high',
    airQuality: 'Good',
    pm25: 12,
    filterLife: 87,
    energyUsage: '0.5 kWh',
    lastUpdated: '30 secs ago'
  },

  'mq2-kitchen01-001': {
    id: 'mq2-kitchen01-001',
    name: 'Kitchen Gas Sensor',
    type: 'mq2',
    room: 'Kitchen 01',
    status: 'online',
    icon: '💨',
    iconComponent: Thermometer,
    humidity: 68,
    temperature: 22,
    lastUpdated: '1 min ago'

  },
  'lock-garage01-001': {
    id: 'lock-garage01-001',
    name: 'Garage Door Lock',
    type: 'lock',
    room: 'Garage 01',
    status: 'online',
    icon: '🔒',
    iconComponent: Lock,
    locked: true,
    battery: 85,
    lastAccess: '2 hours ago',
    accessLog: ['John - 8:30 AM', 'Sarah - 7:15 AM']
  },
  'dht22-bathroom01-001': {
    id: 'dht22-bathroom01-001',
    name: 'Bathroom DHT Sensor',
    type: 'dht22',
    room: 'Bathroom 01',
    status: 'online',
    icon: '🌡️',
    iconComponent: Thermometer,
    humidity: 68,
    temperature: 22,
    lastUpdated: '1 min ago'
  },
  'fan-bedroom01-001': {
    id: 'fan-bedroom01-001',
    name: 'Bedroom Fan',
    type: 'fan',
    room: 'Bedroom 01',
    status: 'online',
    icon: '🌀',
    iconComponent: Fan,
    currentTemp: 24,
    targetTemp: 22,
    humidity: 55,
    mode: 'cool',
    fanSpeed: 'medium',
    power: true,
    energyUsage: '1.2 kWh',
    lastUpdated: '2 mins ago'
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
    brightness: 75,
    colorTemp: 4000,
    energyUsage: '0.1 kWh',
    lastUpdated: '1 min ago'
  },
  'dht22-bedroom01-001': {
    id: 'dht22-bedroom01-001',
    name: 'Bedroom DHT Sensor',
    type: 'dht22',
    room: 'Bedroom 01',
    status: 'online',
    icon: '🌡️',
    iconComponent: Thermometer,
    humidity: 68,
    temperature: 22,
    lastUpdated: '1 min ago'
  },
  'fan-bedroom02-001': {
    id: 'fan-bedroom02-001',
    name: 'Bedroom Fan',
    type: 'fan',
    room: 'Bedroom 02',
    status: 'online',
    icon: '🌀',
    iconComponent: Fan,
    currentTemp: 24,
    targetTemp: 22,
    humidity: 55,
    mode: 'cool',
    fanSpeed: 'medium',
    power: true,
    energyUsage: '1.2 kWh',
    lastUpdated: '2 mins ago'
  },
  'light-bedroom02-001': {
    id: 'light-bedroom02-001',
    name: 'Bedroom Light',
    type: 'light',
    room: 'Bedroom 02',
    status: 'online',
    icon: '💡',
    iconComponent: Lightbulb,
    power: true,
    brightness: 75,
    colorTemp: 4000,
    energyUsage: '0.1 kWh',
    lastUpdated: '1 min ago'
  },
  'dht22-bedroom02-001': {
    id: 'dht22-bedroom02-001',
    name: 'Bedroom DHT Sensor',
    type: 'dht22',
    room: 'Bedroom 02',
    status: 'online',
    icon: '🌡️',
    iconComponent: Thermometer,
    humidity: 68,
    temperature: 22,
    lastUpdated: '1 min ago'
  },
  'light-hallway01-001': {
    id: 'light-hallway01-001',
    name: 'Hallway Light',
    type: 'light',
    room: 'Hallway 01',
    status: 'online',
    icon: '💡',
    iconComponent: Lightbulb,
    power: true,
    brightness: 75,
    colorTemp: 4000,
    energyUsage: '0.1 kWh',
    lastUpdated: '1 min ago'
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
        width: 260, // reduced for stair
        height: 200,
        devices: [
          'fan-living01-001',
          'dht22-living01-001',
          'light-living01-001',
        ],
      },
      {
        name: 'Stair 01',
        x: 320,
        y: 40,
        width: 50,
        height: 140,
        devices: [
          'light-stair01-001'
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
        width: 260, // reduced for stair + hallway
        height: 140,
        devices: [
          'fan-bedroom01-001',
          'dht22-bedroom01-001',
          'light-bedroom01-001',
        ],
      },
      {
        name: 'Stair 01',
        x: 320,
        y: 40,
        width: 50,
        height: 140,
        devices: [
          'light-stair01-001'
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
        ],
      },
      {
        name: 'Hallway',
        x: 60,
        y: 180,
        width: 480,
        height: 40,
        devices: [
          'light-hallway01-001'
        ],
      },
      {
        name: 'Office 01',
        x: 60,
        y: 220,
        width: 300,
        height: 140,
        devices: [
        ],
      },
      {
        name: 'Bathroom',
        x: 360,
        y: 220,
        width: 180,
        height: 140,
        devices: [
        ],
      },
    ],
  }
];


