import React from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/creditCalculator';
import { Printer, X, Receipt } from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { activeReceiptForModal, setActiveReceiptForModal } = useApp();

  if (!activeReceiptForModal) return null;

  const tx = activeReceiptForModal;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-sm w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Modal Top Control Bar */}
        <div className="no-print bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Struk Transaksi Kasir
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors flex items-center gap-1"
            >
              <Printer className="w-3 h-3" />
              <span>Cetak</span>
            </button>
            <button
              onClick={() => setActiveReceiptForModal(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Thermal Receipt Style */}
        <div id="print-area" className="p-6 font-mono text-xs text-slate-800 space-y-4 bg-white">
          <div className="text-center space-y-1">
            <h4 className="font-bold text-sm tracking-tight text-slate-900">SECONDPHONE PRO</h4>
            <p className="text-[11px] text-slate-500">
              Pusat Smartphone Second & Pembiayaan
              <br />Depok, Jawa Barat · (021) 7788-9900
            </p>
          </div>

          <div className="border-t border-b border-dashed border-slate-400 py-2 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span>No. Nota:</span>
              <span className="font-bold">{tx.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Tanggal:</span>
              <span>{tx.createdAt}</span>
            </div>
            <div className="flex justify-between">
              <span>Kasir:</span>
              <span>{tx.cashierName}</span>
            </div>
            <div className="flex justify-between">
              <span>Pelanggan:</span>
              <span className="font-semibold">{tx.customerName}</span>
            </div>
            {tx.spkId && (
              <div className="flex justify-between text-blue-700 font-bold">
                <span>Ref. SPK:</span>
                <span>{tx.spkId}</span>
              </div>
            )}
          </div>

          {/* Item details */}
          <div className="space-y-2 text-[11px]">
            <div className="font-bold text-slate-900">
              {tx.type === 'DP_INSTALLMENT' ? '[PELUNASAN DP KREDIT]' : '[PENJUALAN TUNAI LANGSUNG]'}
            </div>
            <div className="space-y-0.5">
              <span className="block font-semibold">{tx.phoneModel}</span>
              <span className="block text-[10px] text-slate-500">IMEI: {tx.phoneImei}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 pt-1">
              <span>Total Bayar:</span>
              <span className="text-xs">{formatRupiah(tx.totalAmount)}</span>
            </div>
          </div>

          {/* Payment breakdown */}
          <div className="border-t border-dashed border-slate-400 pt-2 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span>Metode:</span>
              <span className="font-bold">{tx.paymentMethod}</span>
            </div>
            {tx.cashTendered !== undefined && (
              <>
                <div className="flex justify-between">
                  <span>Tunai Diterima:</span>
                  <span>{formatRupiah(tx.cashTendered)}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-700">
                  <span>Kembalian:</span>
                  <span>{formatRupiah(tx.changeAmount || 0)}</span>
                </div>
              </>
            )}
          </div>

          {/* Footer note */}
          <div className="border-t border-dashed border-slate-400 pt-3 text-center text-[10px] text-slate-500 space-y-1">
            <p className="font-bold text-slate-700">TERIMA KASIH ATAS KUNJUNGAN ANDA</p>
            <p>
              Simpan struk ini sebagai bukti sah klaim garansi toko (30-90 hari).
              Segel utuh dan tidak terkena cairan / retak fisik.
            </p>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="no-print bg-slate-50 px-4 py-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">Format thermal 80mm</span>
          <button
            onClick={() => setActiveReceiptForModal(null)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
