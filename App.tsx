import React, { useState, useCallback } from 'react';
import { generateHomeLayout } from './services/geminiService';
import type { HomeLayout, Device } from './types';
import LayoutSetup from './components/LayoutSetup';
import Dashboard from './components/Dashboard';
import VoiceControl from './components/VoiceControl';

const App: React.FC = () => {
  const [homeLayout, setHomeLayout] = useState<HomeLayout | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLayoutGenerated = async (description: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const layout = await generateHomeLayout(description);
      if (layout) {
        setHomeLayout(layout);
      } else {
        setError("Failed to parse the layout from AI response. Please try a more descriptive prompt.");
      }
    } catch (err) {
      setError("An error occurred while generating the layout. Please check your API key and try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVoiceCommand = useCallback((command: string) => {
    if (!homeLayout) return;

    let commandProcessed = false;
    
    const newRooms = homeLayout.rooms.map(room => {
        const newDevices = room.devices.map(device => {
            const deviceIdentifier = `${room.name} ${device.name}`.toLowerCase();
            let newDeviceState: Partial<Device> = {};

            if (command.includes(deviceIdentifier)) {
                // On/Off commands
                if (command.startsWith('turn on')) {
                    commandProcessed = true;
                    newDeviceState.state = 'on';
                } else if (command.startsWith('turn off')) {
                    commandProcessed = true;
                    newDeviceState.state = 'off';
                }

                // Brightness command
                const brightnessMatch = command.match(/(?:brightness to|set to|dim to) (\d+)/);
                if (device.type === 'light' && brightnessMatch?.[1]) {
                    commandProcessed = true;
                    const newBrightness = Math.max(0, Math.min(100, parseInt(brightnessMatch[1], 10)));
                    newDeviceState.brightness = newBrightness;
                    if (newBrightness > 0 && device.state === 'off') {
                        newDeviceState.state = 'on'; 
                    } else if (newBrightness === 0) {
                        newDeviceState.state = 'off';
                    }
                }

                // Color command
                const colorMatch = command.match(/(?:color to|change to|set to) (\w+)/);
                if (device.type === 'light' && colorMatch?.[1]) {
                    const colorName = colorMatch[1].toLowerCase();
                    const colorMap: Record<string, string> = {
                        red: '#FF4136', blue: '#0074D9', green: '#2ECC40',
                        yellow: '#FFDC00', orange: '#FF851B', purple: '#B10DC9',
                        white: '#FFFFFF', pink: '#F012BE', cyan: '#39CCCC',
                    };
                    if (colorMap[colorName]) {
                        commandProcessed = true;
                        newDeviceState.color = colorMap[colorName];
                        if (device.state === 'off') {
                           newDeviceState.state = 'on';
                        }
                    }
                }
            }
            return Object.keys(newDeviceState).length > 0 ? { ...device, ...newDeviceState } : device;
        });
        return { ...room, devices: newDevices };
    });

    if(commandProcessed) {
        setHomeLayout({ rooms: newRooms });
    }

  }, [homeLayout]);

  if (!homeLayout) {
    return (
      <LayoutSetup 
        onLayoutGenerated={handleLayoutGenerated} 
        isLoading={isLoading}
        error={error} 
      />
    );
  }

  return (
    <>
      <Dashboard homeLayout={homeLayout} setHomeLayout={setHomeLayout} />
      <VoiceControl onCommand={handleVoiceCommand} />
    </>
  );
};

export default App;