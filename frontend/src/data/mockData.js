import { Thermometer, Wind, Lightbulb, Lock } from 'lucide-react';

export const mockFloors = [
  {
    name: 'Ground Floor',
    rooms: [
      {
        name: 'Living Room',
        x: 50,
        y: 50,
        width: 300,
        height: 200,
        devices: [
          { icon: '🌡️', status: 'online' },
          { icon: '💡', status: 'online' },
          { icon: '💨', status: 'offline' },
        ],
      },
      {
        name: 'Kitchen',
        x: 400,
        y: 50,
        width: 250,
        height: 200,
        devices: [
          { icon: '🌡️', status: 'online' },
          { icon: '💨', status: 'online' },
        ],
      },
      {
        name: 'Dining Room',
        x: 50,
        y: 300,
        width: 300,
        height: 200,
        devices: [{ icon: '💡', status: 'online' }],
      },
      {
        name: 'Bathroom',
        x: 400,
        y: 300,
        width: 150,
        height: 200,
        devices: [
          { icon: '💧', status: 'online' },
          { icon: '🌡️', status: 'online' },
        ],
      },
    ],
  },
  {
    name: 'First Floor',
    rooms: [
      {
        name: 'Master Bedroom',
        x: 50,
        y: 50,
        width: 350,
        height: 250,
        devices: [
          { icon: '🌡️', status: 'online' },
          { icon: '💡', status: 'online' },
          { icon: '💨', status: 'online' },
        ],
      },
      {
        name: 'Bedroom 2',
        x: 450,
        y: 50,
        width: 250,
        height: 250,
        devices: [
          { icon: '🌡️', status: 'online' },
          { icon: '💡', status: 'offline' },
        ],
      },
      {
        name: 'Office',
        x: 50,
        y: 350,
        width: 300,
        height: 150,
        devices: [
          { icon: '💡', status: 'online' },
          { icon: '💨', status: 'online' },
        ],
      },
    ],
  },
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
