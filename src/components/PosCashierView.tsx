import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/creditCalculator';
import { PosTransaction, SalesOrder, UsedPhone } from '../types';
import { 
  CreditCard, Banknote, QrCode, Receipt, ArrowRight, 
  CheckCircle2, Printer, Search, ShieldCheck 
} from 'lucide-react';

export const PosCashierView: React.FC = () => {
  const { 
    orders, 
    phones, 
    transactions, 
    processDpPayment, 
    processCashSale, 
    setActiveReceiptForModal 
  } = useApp();

  const [cashierMode, setCashierMode] = useState<'dp' | 'direct' | 'history'>('dp');

  // DP Mode state
  const approvedOrdersPendingDp = orders.filter((o) => o.status === 'APPROVED' && !o.dpPaid);
  const [selectedSpkId, setSelectedSpkId] = useState<string>(
    approvedOrdersPendingDp[0]?.id || ''
  );
  const [dpPaymentMethod, setDpPaymentMethod] = useState<'CASH' | 'QRIS' | 'TRANSFER'>('QRIS');
  const [dpCashTendered, setDpCashTendered] = useState<number>(0);

  // Direct Cash Mode state
  const availablePhones = phones.filter((p) => p.inStock);
  const [selectedPhoneId, setSelectedPhoneId] = useState<string>(availablePhones[0]?.id || '');
  const [directCustomerName, setDirectCustomerName] = useState<string>('');
  const [directPaymentMethod, setDirectPaymentMethod] = useState<'CASH' | 'QRIS' | 'TRANSFER'>('CASH');
  const [directCashTendered, setDirectCashTendered] = useState<number>(0);

  // Active SPK selected
  const activeSelectedSpk = orders.find((o) => o.id === selectedSpkId);
  const activeSelectedPhone = phones.find((p) => p.id === selectedPhoneId);

  // Handle submit DP payment
  const handleProcessDp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSpkId) return;

    const tx = processDpPayment(
      selectedSpkId,
      dpPaymentMethod,
      dpPaymentMethod === 'CASH' ? dpCashTendered : undefined
    );

    if (tx) {
      setActiveReceiptForModal(tx);
      // reset
      setDpCashTendered(0);
    }
  };

  // Handle submit Direct Cash sale
  const handleProcessCashSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSelectedPhone || !directCustomerName.trim()) {
      alert('Harap masukkan nama pembeli dan pilih unit HP!');
      return;
    }

    const tx = processCashSale(
      activeSelectedPhone,
      directCustomerName,
      directPaymentMethod,
      directPaymentMethod === 'CASH' ? directCashTendered : undefined
    );

    setActiveReceiptForModal(tx);
    setDirectCustomerName('');
    setDirectCashTendered(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <span>Point of Sale Terminal</span>
            <span aria-hidden="true">·</span>
            <span>Kasir Transaksi & Struk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Kasir Toko: Pelunasan DP Kredit & Penjualan Tunai
          </h1>
          <p className="mt-1 text-sm text-slate-600 max-w-2xl">
            Proses penyelesaian pembayaran uang muka (Down Payment) untuk SPK yang disetujui, transaksi tunai langsung, serta pencetakan struk nota belanja.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            onClick={() => setCashierMode('dp')}
            className={`px-3 sm:px-4 py-2 text-xs font-semibold rounded-md transition-all ${
              cashierMode === 'dp'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pelunasan DP Kredit ({approvedOrdersPendingDp.length})
          </button>
          <button
            onClick={() => setCashierMode('direct')}
            className={`px-3 sm:px-4 py-2 text-xs font-semibold rounded-md transition-all ${
              cashierMode === 'direct'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Penjualan Tunai (Cash)
          </button>
          <button
            onClick={() => setCashierMode('history')}
            className={`px-3 sm:px-4 py-2 text-xs font-semibold rounded-md transition-all ${
              cashierMode === 'history'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Riwayat Nota ({transactions.length})
          </button>
        </div>
      </div>

      {/* Mode 1: Pelunasan DP Kredit */}
      {cashierMode === 'dp' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Pilih Berkas SPK yang Telah Disetujui (Approved)
              </label>

              {approvedOrdersPendingDp.length === 0 ? (
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="text-xs sm:text-sm font-semibold text-slate-800">
                    Semua SPK yang disetujui telah melunasi DP!
                  </p>
                  <p className="text-xs text-slate-500">
                    Silakan approve SPK baru di tab "SPK & Sales Kredit" untuk melakukan transaksi pelunasan DP di sini.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <select
                    value={selectedSpkId}
                    onChange={(e) => setSelectedSpkId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  >
                    {approvedOrdersPendingDp.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.id} — {o.customerName} ({o.phone.model}) · DP: {formatRupiah(o.calculation.dpAmount)}
                      </option>
                    ))}
                  </select>

                  {activeSelectedSpk && (
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-slate-500 block">Nama Debitur:</span>
                          <span className="font-bold text-slate-900">{activeSelectedSpk.customerName}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">No. KTP / NIK:</span>
                          <span className="font-mono text-slate-900">{activeSelectedSpk.customerNik}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Unit Smartphone:</span>
                          <span className="font-bold text-slate-900">{activeSelectedSpk.phone.model} ({activeSelectedSpk.phone.grade})</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">No. IMEI Fisik:</span>
                          <span className="font-mono text-slate-900">{activeSelectedSpk.phone.imei}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Tenor Angsuran:</span>
                          <span className="font-semibold text-slate-900">{activeSelectedSpk.calculation.tenorMonths} Bulan @ {formatRupiah(activeSelectedSpk.calculation.monthlyInstallment)}/bln</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Sales In-Charge:</span>
                          <span className="font-semibold text-slate-900">{activeSelectedSpk.salesRep.name}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Payment Method Selector */}
            {activeSelectedSpk && (
              <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Metode Pembayaran DP
                </label>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setDpPaymentMethod('QRIS')}
                    className={`p-3 rounded-lg border text-center transition-all flex flex-col items-center gap-1.5 ${
                      dpPaymentMethod === 'QRIS'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-blue-600" />
                    <span className="text-xs">QRIS Instan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDpPaymentMethod('CASH')}
                    className={`p-3 rounded-lg border text-center transition-all flex flex-col items-center gap-1.5 ${
                      dpPaymentMethod === 'CASH'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs">Uang Tunai (Cash)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDpPaymentMethod('TRANSFER')}
                    className={`p-3 rounded-lg border text-center transition-all flex flex-col items-center gap-1.5 ${
                      dpPaymentMethod === 'TRANSFER'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                    <span className="text-xs">Debit / Transfer</span>
                  </button>
                </div>

                {dpPaymentMethod === 'CASH' && (
                  <div className="pt-2 space-y-2">
                    <label className="text-xs text-slate-700 font-medium block">
                      Nominal Uang Tunai yang Diterima (Rp):
                    </label>
                    <input
                      type="number"
                      step="10000"
                      min={activeSelectedSpk.calculation.dpAmount}
                      value={dpCashTendered || ''}
                      onChange={(e) => setDpCashTendered(Number(e.target.value))}
                      placeholder={`Minimal ${formatRupiah(activeSelectedSpk.calculation.dpAmount)}`}
                      className="w-full px-3 py-2 text-sm font-mono tabular-nums bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                    />
                    {dpCashTendered > activeSelectedSpk.calculation.dpAmount && (
                      <div className="flex justify-between text-xs text-emerald-700 font-semibold pt-1">
                        <span>Uang Kembalian:</span>
                        <span className="font-mono tabular-nums font-bold">
                          {formatRupiah(dpCashTendered - activeSelectedSpk.calculation.dpAmount)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Summary Box */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Ringkasan Kasir Pelunasan DP
              </span>

              {activeSelectedSpk ? (
                <>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center">
                    <span className="text-xs text-blue-700 block">Total Uang Muka Wajib Dibayar</span>
                    <div className="text-3xl font-extrabold font-mono tabular-nums text-blue-900 mt-1">
                      {formatRupiah(activeSelectedSpk.calculation.dpAmount)}
                    </div>
                    <span className="text-[11px] text-blue-600 block mt-1">
                      DP {activeSelectedSpk.calculation.dpPercent}% dari harga tunai
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs border-t border-slate-100 pt-3">
                    <div className="flex justify-between text-slate-600">
                      <span>No. SPK:</span>
                      <span className="font-mono font-bold text-slate-900">{activeSelectedSpk.id}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Metode:</span>
                      <span className="font-semibold text-slate-900">{dpPaymentMethod}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Kasir Petugas:</span>
                      <span className="text-slate-900 font-medium">Rina (Kasir Utama)</span>
                    </div>
                  </div>

                  <button
                    onClick={handleProcessDp}
                    className="w-full py-3 px-4 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Konfirmasi Pembayaran & Cetak Struk</span>
                  </button>
                </>
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  Pilih berkas SPK terlebih dahulu untuk memproses pembayaran.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Penjualan Tunai Langsung */}
      {cashierMode === 'direct' && (
        <form onSubmit={handleProcessCashSale} className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 max-w-2xl mx-auto space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Kasir Penjualan Tunai Langsung (Cash Sale)</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Untuk transaksi penjualan unit smartphone bekas tanpa fasilitas kredit cicilan.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">Nama Pembeli:</label>
              <input
                type="text"
                required
                placeholder="Nama Konsumen Tunai"
                value={directCustomerName}
                onChange={(e) => setDirectCustomerName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/30"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">Pilih Unit Smartphone Bekas:</label>
              <select
                value={selectedPhoneId}
                onChange={(e) => setSelectedPhoneId(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
              >
                {availablePhones.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.model} ({p.storage} - {p.grade}) — {formatRupiah(p.priceCash)}
                  </option>
                ))}
              </select>
            </div>

            {activeSelectedPhone && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Nomor IMEI:</span>
                  <span className="font-mono font-bold text-slate-900">{activeSelectedPhone.imei}</span>
                </div>
                <div className="flex justify-between">
                  <span>Battery Health:</span>
                  <span className="font-mono text-emerald-600 font-bold">{activeSelectedPhone.batteryHealth}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Garansi Toko:</span>
                  <span className="text-blue-600 font-semibold">{activeSelectedPhone.warrantyDays} Hari</span>
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-2">Metode Pembayaran Tunai:</label>
              <div className="grid grid-cols-3 gap-3">
                {(['CASH', 'QRIS', 'TRANSFER'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setDirectPaymentMethod(m)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                      directPaymentMethod === m
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {m === 'CASH' ? 'Uang Tunai' : m === 'QRIS' ? 'QRIS' : 'Transfer Bank'}
                  </button>
                ))}
              </div>
            </div>

            {directPaymentMethod === 'CASH' && activeSelectedPhone && (
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Uang Tunai Diterima (Rp):</label>
                <input
                  type="number"
                  step="50000"
                  min={activeSelectedPhone.priceCash}
                  value={directCashTendered || ''}
                  onChange={(e) => setDirectCashTendered(Number(e.target.value))}
                  placeholder={`Minimal ${formatRupiah(activeSelectedPhone.priceCash)}`}
                  className="w-full px-3 py-2 text-sm font-mono tabular-nums bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                />
                {directCashTendered > activeSelectedPhone.priceCash && (
                  <div className="flex justify-between text-xs text-emerald-700 font-semibold pt-1">
                    <span>Kembalian:</span>
                    <span className="font-mono tabular-nums font-bold">
                      {formatRupiah(directCashTendered - activeSelectedPhone.priceCash)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {activeSelectedPhone && (
              <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">Total Tagihan Tunai</span>
                  <span className="text-xl font-bold font-mono tabular-nums">
                    {formatRupiah(activeSelectedPhone.priceCash)}
                  </span>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Cetak Struk Kasir</span>
                </button>
              </div>
            )}
          </div>
        </form>
      )}

      {/* Mode 3: Riwayat Transaksi */}
      {cashierMode === 'history' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs space-y-4">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Riwayat Transaksi Masuk</h3>
            <span className="text-xs font-mono text-slate-500 tabular-nums">
              Total {transactions.length} Transaksi Tercatat
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-3 px-4">No. Invoice & Tanggal</th>
                  <th className="py-3 px-4">Tipe Transaksi</th>
                  <th className="py-3 px-4">Konsumen</th>
                  <th className="py-3 px-4">Unit HP & IMEI</th>
                  <th className="py-3 px-4 text-right">Nominal</th>
                  <th className="py-3 px-4">Metode Bayar</th>
                  <th className="py-3 px-4 text-center">Struk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-900 block">{tx.id}</span>
                      <span className="text-[11px] text-slate-500 font-mono">{tx.createdAt}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        tx.type === 'DP_INSTALLMENT'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {tx.type === 'DP_INSTALLMENT' ? 'Uang Muka (DP)' : 'Penjualan Tunai'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {tx.customerName}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-800 block truncate max-w-[220px]">
                        {tx.phoneModel}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">IMEI: {tx.phoneImei}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums whitespace-nowrap">
                      {formatRupiah(tx.totalAmount)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-700">
                      {tx.paymentMethod}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => setActiveReceiptForModal(tx)}
                        title="Cetak Ulang Struk"
                        className="px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors inline-flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Struk</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
