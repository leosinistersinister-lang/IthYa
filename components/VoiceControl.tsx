
import React from 'react';
import { useSpeech } from '../hooks/useSpeech';

interface VoiceControlProps {
  onCommand: (command: string) => void;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ onCommand }) => {
  const { isListening, startListening, stopListening, speak } = useSpeech((command) => {
      onCommand(command);
      speak('Claro');
  });

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <button
      onClick={handleToggleListening}
      className={`
        fixed bottom-6 right-6 w-16 h-16 rounded-full flex items-center justify-center
        transition-all duration-300 transform shadow-2xl shadow-black/50
        focus:outline-none focus:ring-4 focus:ring-cyan-500/50
        ${isListening ? 'bg-cyan-500 animate-pulse' : 'bg-slate-700 hover:bg-slate-600'}
      `}
      aria-label={isListening ? 'Stop listening' : 'Start voice command'}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
      {isListening && (
        <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-ping"></span>
      )}
    </button>
  );
};

export default VoiceControl;
