import React from 'react';
import { useApp, NavTab } from '../context/AppContext';
import { Smartphone, RotateCcw } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, resetToDemoData } = useApp();

  const navItems: { key: NavTab; label: string }[] = [
    { key: 'katalog', label: 'Katalog HP Bekas' },
    { key: 'simulasi', label: 'Kalkulator Cicilan' },
    { key: 'spk', label: 'SPK & Sales Kredit' },
    { key: 'kasir', label: 'Kasir POS' },
    { key: 'performa', label: 'Performa Sales' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div 
          onClick={() => setActiveTab('katalog')}
          className="flex items-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0 group"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              SecondPhone<span className="text-blue-600">Pro</span>
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`px-3 py-2 text-sm font-medium transition-all rounded-md whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-blue-600 bg-blue-50/80 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              if (window.confirm('Reset semua data transaksi & SPK kembali ke kondisi demo awal?')) {
                resetToDemoData();
              }
            }}
            title="Kembalikan data contoh awal untuk presentasi dosen"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
          
          <button
            onClick={() => setActiveTab('simulasi')}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            Hitung Cicilan
          </button>
        </div>
      </div>

      {/* Mobile Subnav Strip */}
      <div className="md:hidden flex items-center justify-between overflow-x-auto px-4 py-2 bg-slate-50 border-t border-slate-100 no-scrollbar gap-2">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`px-2.5 py-1 text-xs whitespace-nowrap rounded-md font-medium shrink-0 ${
              activeTab === item.key
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
