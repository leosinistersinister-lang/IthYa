import React from 'react';
import { HomeLayout, Device } from '../types';
import Room from './Room';

interface FloorPlanProps {
  layout: HomeLayout;
  onDeviceUpdate: (deviceId: string, updates: Partial<Device>) => void;
}

const FloorPlan: React.FC<FloorPlanProps> = ({ layout, onDeviceUpdate }) => {
  if (!layout || layout.rooms.length === 0) {
    return (
      <div className="text-center text-slate-400 p-8">
        No layout available. Please set up your home.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 flex-grow">
      <div className="grid grid-cols-12 gap-4 auto-rows-min">
        {layout.rooms.map((room, index) => (
          <Room key={`${room.name}-${index}`} room={room} onDeviceUpdate={onDeviceUpdate} />
        ))}
      </div>
    </div>
  );
};

export default FloorPlan;