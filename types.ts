export enum DeviceType {
  Light = 'light',
  Camera = 'camera',
  Switch = 'switch',
  Thermostat = 'thermostat',
  Speaker = 'speaker',
  TV = 'tv',
}

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  state: 'on' | 'off' | number | string; // on/off for binary, number for thermostat, string for TV channel etc.
  brightness?: number; // For lights: 0-100
  color?: string;      // For lights: hex color string e.g., '#FFFFFF'
}

export interface Room {
  name:string;
  gridPosition: {
    row: number;
    col: number;
  };
  gridSpan: {
    rowSpan: number;
    colSpan: number;
  };
  devices: Device[];
}

export interface HomeLayout {
  rooms: Room[];
}