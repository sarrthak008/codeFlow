import React from 'react';
import { useSetings } from '../store/Store';

const Toggle = ({ enabled, onClick }) => (
  <button
    onClick={onClick}
    className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${
      enabled ? 'bg-[#378ADD]' : 'bg-[#e5e5e5]'
    }`}
  >
    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
  </button>
);

const Settings = ({ setIsSetting }) => {
  const { settings, updateSettings , reset } = useSetings();

  return (
    <div className='fixed inset-0 z-[99] flex items-center justify-center bg-black/55 backdrop-blur-sm'>
      {/* Main Container matching LeaderBoard dimensions/style */}
      <div className='w-full max-w-[600px] mx-4 h-[80vh] flex flex-col rounded-2xl overflow-hidden'
        style={{ background: '#fff', border: '0.5px solid #e5e5e5' }}>

        {/* Header */}
        <div className='flex-shrink-0 flex items-center justify-between px-6 py-4'
          style={{ borderBottom: '0.5px solid #e5e5e5' }}>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 rounded-lg flex items-center justify-center'
              style={{ background: '#fef3c7', color: '#92400e' }}>⚙️</div>
            <div>
              <p className='text-sm font-medium' style={{ color: '#111' }}>Editor Settings</p>
              <p className='text-xs' style={{ color: '#888' }}>Customize your workspace</p>
            </div>
          </div>
          <button onClick={() => setIsSetting(false)} className='text-xs px-3 py-1.5 rounded-md border border-[#e5e5e5] text-[#555]'>
            ✕ Close
          </button>
        </div>

        {/* Scrollable Settings Body */}
        <div className='flex-grow overflow-y-auto px-6 py-6'>
          <div className='max-w-lg mx-auto flex flex-col gap-8'>
            
            {/* Theme Toggle */}
            <div className='flex items-center justify-between p-4 rounded-xl' style={{ background: '#f9f9f9' }}>
              <div>
                <p className='text-sm text-black font-medium'>Dark Mode</p>
                <p className='text-[11px]' style={{ color: '#888' }}>Toggle theme appearance</p>
              </div>
              <Toggle 
                enabled={settings.theme === 'dark'} 
                onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })} 
              />
            </div>

            {/* Minimap Toggle */}
            <div className='flex items-center justify-between p-4 rounded-xl' style={{ background: '#f9f9f9' }}>
              <div>
                <p className='text-sm text-black  font-medium'>Minimap</p>
                <p className='text-[11px]' style={{ color: '#888' }}>Show/Hide code overview</p>
              </div>
              <Toggle 
                enabled={settings.minimap ?? true} 
                onClick={() => updateSettings({ minimap: !settings.minimap })} 
              />
            </div>

            {/* Font Size */}
            <div className='p-4 rounded-xl' style={{ background: '#f9f9f9' }}>
              <div className='flex justify-between mb-3'>
                <p className='text-sm text-black font-medium'>Font Size</p>
                <span className='text-xs font-mono' style={{ color: '#378ADD' }}>{settings.fontSize}px</span>
              </div>
              <input
                type='range' min='12' max='32' value={settings.fontSize}
                onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) })}
                className='w-full h-1.5 bg-[#e5e5e5] rounded-lg appearance-none cursor-pointer accent-[#378ADD]'
              />
            </div>

            <div className='flex items-center justify-between p-4 rounded-xl' style={{ background: '#f9f9f9' }}>
              <div>
                <p className='text-sm text-black font-medium'>Reset All Settings</p>
                <p className='text-[11px] text-red-700' >Toggle theme appearance</p>
              </div>
              <button 
               onClick={()=>reset()}
              className='bg-red-500 py-1 px-5 rounded-md hover:bg-red-600  cursor-pointer'>Reset</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;