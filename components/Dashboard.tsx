import React from 'react';
import { HomeLayout, Device } from '../types';
import Header from './Header';
import FloorPlan from './FloorPlan';

interface DashboardProps {
  homeLayout: HomeLayout;
  setHomeLayout: React.Dispatch<React.SetStateAction<HomeLayout | null>>;
}

const Dashboard: React.FC<DashboardProps> = ({ homeLayout, setHomeLayout }) => {
  
  const handleDeviceUpdate = (deviceId: string, updates: Partial<Device>) => {
    setHomeLayout(prevLayout => {
        if (!prevLayout) return null;
        
        const newRooms = prevLayout.rooms.map(room => {
            const newDevices = room.devices.map(device => {
                if (device.id === deviceId) {
                    return { ...device, ...updates };
                }
                return device;
            });
            return { ...room, devices: newDevices };
        });

        return { ...prevLayout, rooms: newRooms };
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <Header />
      <main className="flex-grow">
        <FloorPlan layout={homeLayout} onDeviceUpdate={handleDeviceUpdate} />
      </main>
    </div>
  );
};

export default Dashboard;