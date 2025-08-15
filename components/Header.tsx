
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="p-4 bg-slate-950/30 backdrop-blur-sm sticky top-0 z-20">
      <h1 className="text-2xl font-bold text-center text-cyan-300 tracking-widest uppercase">
        Aura Home
      </h1>
    </header>
  );
};

export default Header;
