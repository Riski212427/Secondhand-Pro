import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { CatalogView } from './components/CatalogView';
import { CreditSimulatorView } from './components/CreditSimulatorView';
import { SalesSpkView } from './components/SalesSpkView';
import { PosCashierView } from './components/PosCashierView';
import { SalesPerformanceView } from './components/SalesPerformanceView';
import { SpkModal } from './components/SpkModal';
import { ReceiptModal } from './components/ReceiptModal';
import { ShieldCheck, HeartHandshake, PhoneCall } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1 pb-16">
        {activeTab === 'katalog' && <CatalogView />}
        {activeTab === 'simulasi' && (
          <CreditSimulatorView onProceedToSpk={() => setActiveTab('spk')} />
        )}
        {activeTab === 'spk' && <SalesSpkView />}
        {activeTab === 'kasir' && <PosCashierView />}
        {activeTab === 'performa' && <SalesPerformanceView />}
      </main>

      {/* Global Modals */}
      <SpkModal />
      <ReceiptModal />

      {/* Toast Notification */}
      {useApp().toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="bg-slate-900 text-white text-xs font-medium px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 max-w-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span>{useApp().toastMessage}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">SecondPhone Pro</span>
            <span aria-hidden="true">·</span>
            <span>Sistem POS & Simulasi Kredit HP Bekas Terintegrasi</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Garansi Fisik & Mesin</span>
            </span>
            <span className="flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
              <span>Simulasi Bunga Flat Transparan</span>
            </span>
            <span className="text-slate-400">Tugas Proyek Web Penjualan & Sales Financing</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
