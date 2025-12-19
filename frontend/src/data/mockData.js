import { Thermometer, Wind, Lightbulb, Lock } from 'lucide-react';

export const mockFloors = [

  {
    name: 'Ground Floor',
    rooms: [
      {
        name: 'Living / Dining',
        x: 60,
        y: 40,
        width: 300,
        height: 200,
        devices: [
          { icon: '🌡️', status: 'online' },
          { icon: '💡', status: 'online' },
          { icon: '💨', status: 'online' },
        ],
      },
      {
        name: 'Kitchen',
        x: 360,
        y: 40,
        width: 180,
        height: 200,
        devices: [
          { icon: '🌡️', status: 'online' },
          { icon: '💨', status: 'online' },
        ],
      },
      {
        name: 'Bathroom',
        x: 60,
        y: 240,
        width: 180,
        height: 120,
        devices: [
          { icon: '💧', status: 'online' },
          { icon: '🌡️', status: 'online' },
        ],
      },
      {
        name: 'Garage',
        x: 240,
        y: 240,
        width: 300,
        height: 120,
        devices: [
          { icon: '💡', status: 'online' },
          { icon: '🔒', status: 'online' },
        ],
      },
    ],
  },

  {
    name: 'First Floor',
    rooms: [
      {
        name: 'Master Bedroom',
        x: 60,
        y: 40,
        width: 300,
        height: 160,
        devices: [
          { icon: '🌡️', status: 'online' },
          { icon: '💡', status: 'online' },
          { icon: '💨', status: 'online' },
        ],
      },
      {
        name: 'Bedroom',
        x: 360,
        y: 40,
        width: 180,
        height: 160,
        devices: [
          { icon: '🌡️', status: 'online' },
          { icon: '💡', status: 'offline' },
        ],
      },
      {
        name: 'Office',
        x: 60,
        y: 200,
        width: 300,
        height: 160,
        devices: [
          { icon: '💡', status: 'online' },
          { icon: '💨', status: 'online' },
        ],
      },
      {
        name: 'Bathroom',
        x: 360,
        y: 200,
        width: 180,
        height: 160,
        devices: [
          { icon: '💧', status: 'online' },
          { icon: '💡', status: 'online' },
        ],
      },
    ],
  }
];

export const mockDevices = [
  {
    id: 1,
    name: 'Living Room AC',
    type: 'temperature',
    room: 'Living Room',
    status: 'online',
    targetTemp: 24,
    iconComponent: Thermometer,
  },
  {
    id: 2,
    name: 'Kitchen Air Purifier',
    type: 'air',
    room: 'Kitchen',
    status: 'online',
    iconComponent: Wind,
  },
  {
    id: 3,
    name: 'Master Bedroom Light',
    type: 'light',
    room: 'Master Bedroom',
    status: 'online',
    iconComponent: Lightbulb,
  },
  {
    id: 4,
    name: 'Main Door Lock',
    type: 'security',
    room: 'Entrance',
    status: 'online',
    iconComponent: Lock,
  },
  {
    id: 5,
    name: 'Bedroom 2 Fan',
    type: 'temperature',
    room: 'Bedroom 2',
    status: 'offline',
    iconComponent: Wind,
  },
];
