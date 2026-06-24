import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-black border-b border-neutral-900 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        {/* Mobile menu button could go here later */}
        <h1 className="text-lg font-semibold text-white">Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end hidden sm:flex">
          <span className="text-sm font-medium text-white">{user?.name || 'Administrator'}</span>
          <span className="text-xs text-neutral-500">{user?.email}</span>
        </div>
        
        <div className="h-8 w-px bg-neutral-800 mx-2"></div>
        
        <button 
          onClick={() => { if (window.confirm("End session?")) logout(); }}
          className="flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-neutral-900"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}