import React from 'react';
import { Room as RoomType, Device as DeviceInfo } from '../types';
import Device from './Device';

interface RoomProps {
  room: RoomType;
  onDeviceUpdate: (deviceId: string, updates: Partial<DeviceInfo>) => void;
}

const Room: React.FC<RoomProps> = ({ room, onDeviceUpdate }) => {
  const gridStyle = {
    gridColumn: `${room.gridPosition.col} / span ${room.gridSpan.colSpan}`,
    gridRow: `${room.gridPosition.row} / span ${room.gridSpan.rowSpan}`,
  };

  return (
    <div
      style={gridStyle}
      className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex flex-col gap-3 backdrop-blur-sm shadow-lg shadow-black/20"
    >
      <h3 className="font-bold text-cyan-400 tracking-wider text-center border-b border-slate-700 pb-2 mb-2">
        {room.name}
      </h3>
      <div className="flex-grow space-y-3 overflow-y-auto">
        {room.devices.length > 0 ? (
          room.devices.map(device => (
            <Device key={device.id} device={device} onDeviceUpdate={onDeviceUpdate} />
          ))
        ) : (
          <p className="text-slate-500 text-sm text-center italic mt-4">No devices</p>
        )}
      </div>
    </div>
  );
};

export default Room;