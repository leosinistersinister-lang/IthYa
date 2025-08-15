import React, { useState } from 'react';
import { Device as DeviceType, DeviceType as DType } from '../types';
import DeviceIcon from './DeviceIcon';

interface DeviceProps {
  device: DeviceType;
  onDeviceUpdate: (deviceId: string, updates: Partial<DeviceType>) => void;
}

const Device: React.FC<DeviceProps> = ({ device, onDeviceUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isLight = device.type === DType.Light;
  const isToggleable = device.type === DType.Light || device.type === DType.Switch || device.type === DType.Speaker || device.type === DType.TV;
  const isOn = device.state === 'on';

  const handleToggle = () => {
    const newState = isOn ? 'off' : 'on';
    onDeviceUpdate(device.id, { state: newState });
    if (newState === 'off') {
      setIsExpanded(false);
    }
  };

  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDeviceUpdate(device.id, { brightness: parseInt(e.target.value, 10) });
  };
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDeviceUpdate(device.id, { color: e.target.value });
  };
  
  const handleContainerClick = () => {
    if (isLight && isOn) {
      setIsExpanded(prev => !prev);
    }
  };

  const cardStyle: React.CSSProperties = {};
  if (isLight && isOn) {
    const color = device.color || '#FFFFFF';
    cardStyle.background = `linear-gradient(145deg, ${color}1A, #0f172a80)`;
    cardStyle.borderColor = `${color}33`;
  }

  const iconStyle: React.CSSProperties = {};
  if (isLight && isOn) {
    iconStyle.color = device.color || '#00ffff';
  }

  return (
    <div
      style={cardStyle}
      className={`
        relative p-3 rounded-lg transition-all duration-300 border border-transparent
        ${isOn ? (isLight ? 'text-slate-100' : 'bg-cyan-500/20 text-cyan-200') : 'bg-slate-700/50 text-slate-300'}
      `}
    >
      <div className="flex items-center gap-3">
        <div 
          onClick={handleContainerClick}
          className={`flex-1 flex items-center gap-3 ${isLight && isOn ? 'cursor-pointer' : ''}`}
        >
          <div className={`p-2 rounded-full ${isOn ? (isLight ? 'bg-slate-900/50' : 'bg-cyan-500/30') : 'bg-slate-600/50'}`}>
            <DeviceIcon type={device.type} className={`w-5 h-5 ${isOn ? '' : 'text-slate-400'}`} style={iconStyle} />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm truncate">{device.name}</p>
            {isLight && isOn && (
              <p className="text-xs opacity-80" style={{color: device.color || '#FFFFFF'}}>
                {device.brightness ?? 100}% Brightness
              </p>
            )}
          </div>
        </div>
        
        {isToggleable && (
          <button
            onClick={handleToggle}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500`}
            aria-pressed={isOn}
          >
            <span className="sr-only">Toggle {device.name}</span>
            <span
              className={`absolute inset-0 rounded-full transition-colors duration-300 ${isOn ? 'bg-cyan-600' : 'bg-slate-600'}`}
            ></span>
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${isOn ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        )}
      </div>

      {isLight && isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-4 animate-[fadeIn_0.3s_ease-out]">
          <div>
            <label htmlFor={`brightness-${device.id}`} className="block text-xs font-medium text-slate-400 mb-2">Brightness</label>
            <input
              id={`brightness-${device.id}`}
              type="range"
              min="0"
              max="100"
              value={device.brightness ?? 100}
              onChange={handleBrightnessChange}
              className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>
          <div>
            <label htmlFor={`color-${device.id}`} className="block text-xs font-medium text-slate-400 mb-2">Color</label>
            <input
              id={`color-${device.id}`}
              type="color"
              value={device.color ?? '#ffffff'}
              onChange={handleColorChange}
              className="p-0 h-10 w-full block bg-transparent border-none cursor-pointer"
              title="Choose your color"
            />
          </div>
        </div>
      )}
      <div className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${isOn ? 'animate-pulse' : 'hidden'}`} style={isLight && isOn ? { backgroundColor: device.color || '#00ffff' } : { backgroundColor: '#22d3ee' }}></div>
    </div>
  );
};

export default Device;