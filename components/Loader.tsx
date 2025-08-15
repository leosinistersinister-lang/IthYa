
import React from 'react';

interface LoaderProps {
  text: string;
}

const Loader: React.FC<LoaderProps> = ({ text }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full"></div>
        <div className="absolute inset-0 border-t-4 border-cyan-500 rounded-full animate-spin"></div>
      </div>
      <p className="mt-6 text-lg font-medium text-cyan-300 tracking-widest uppercase animate-pulse">
        {text}
      </p>
    </div>
  );
};

export default Loader;
