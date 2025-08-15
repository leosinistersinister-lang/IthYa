
import React, { useState } from 'react';
import Loader from './Loader';

interface LayoutSetupProps {
  onLayoutGenerated: (description: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const LayoutSetup: React.FC<LayoutSetupProps> = ({ onLayoutGenerated, isLoading, error }) => {
  const [description, setDescription] = useState('');

  const exampleDescription = "My house has a large living room on the left with a main light, a smart TV, and a speaker. To the right is the kitchen, which has a smart switch. Above the living room is the master bedroom with two smart lights. Next to the bedroom is a small bathroom with one light.";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      onLayoutGenerated(description);
    }
  };

  const handleUseExample = () => {
    setDescription(exampleDescription);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-2xl mx-auto bg-slate-900/50 rounded-2xl shadow-2xl shadow-black/30 border border-slate-700 overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center text-cyan-300 tracking-widest uppercase mb-2">
            Aura Home Setup
          </h1>
          <p className="text-center text-slate-400 mb-8">
            Describe your home, and our AI will create a floor plan for you.
          </p>

          {isLoading ? (
            <Loader text="Generating Floor Plan..." />
          ) : (
            <form onSubmit={handleSubmit}>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., A living room with a smart light, connected to a kitchen..."
                className="w-full h-48 p-4 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                disabled={isLoading}
              />
              {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={handleUseExample}
                  className="w-full px-6 py-3 bg-slate-700 text-slate-200 font-semibold rounded-lg hover:bg-slate-600 transition-colors duration-300 disabled:opacity-50"
                  disabled={isLoading}
                >
                  Use Example
                </button>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-500 transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                  disabled={isLoading || !description.trim()}
                >
                  Generate Plan
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
       <div className="mt-8 text-center text-slate-500 text-xs max-w-md">
            <p className="font-bold mb-2">Supported Integrations:</p>
            <p>Sonoff, Zigbee, Alexa, Google Home, Apple HomeKit</p>
            <p>(Simulated for demonstration)</p>
        </div>
    </div>
  );
};

export default LayoutSetup;
