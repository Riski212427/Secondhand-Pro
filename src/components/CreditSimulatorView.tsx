import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah, calculateCredit } from '../utils/creditCalculator';
import { Calculator, ArrowRight, Check, SlidersHorizontal, Info, Calendar, Sparkles } from 'lucide-react';

export const CreditSimulatorView: React.FC<{ onProceedToSpk?: () => void }> = ({ onProceedToSpk }) => {
  const { phones, selectedPhoneForSimulation, setSelectedPhoneForSimulation, setActiveTab } = useApp();

  // Selected phone
  const currentPhone = selectedPhoneForSimulation || phones[0];
  const [customPrice, setCustomPrice] = useState<number>(currentPhone ? currentPhone.priceCash : 10000000);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  // Simulation inputs
  const [dpPercent, setDpPercent] = useState<number>(20);
  const [tenorMonths, setTenorMonths] = useState<number>(12);
  const [interestRate, setInterestRate] = useState<number>(1.5); // 1.5% flat / bulan
  const [adminFee, setAdminFee] = useState<number>(50000); // Rp 50.000

  const activePrice = isCustomMode ? customPrice : currentPhone.priceCash;

  // Real-time calculation
  const calculation = useMemo(() => {
    return calculateCredit(activePrice, dpPercent, tenorMonths, interestRate, adminFee);
  }, [activePrice, dpPercent, tenorMonths, interestRate, adminFee]);

  const handlePhoneChange = (phoneId: string) => {
    if (phoneId === 'CUSTOM') {
      setIsCustomMode(true);
    } else {
      setIsCustomMode(false);
      const found = phones.find((p) => p.id === phoneId);
      if (found) {
        setSelectedPhoneForSimulation(found);
      }
    }
  };

  const handleStartSpk = () => {
    if (onProceedToSpk) {
      onProceedToSpk();
    } else {
      setActiveTab('spk');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Concept */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <span>Sales Financing Simulator</span>
            <span aria-hidden="true">·</span>
            <span>Skema Bunga Flat Bulanan</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Kalkulator Simulasi Cicilan Smartphone Bekas
          </h1>
          <p className="mt-1 text-sm text-slate-600 max-w-2xl">
            Hitung uang muka (DP), angsuran bulanan, dan jadwal amortisasi secara instan untuk presentasi penawaran sales kepada calon pembeli.
          </p>
        </div>

        <button
          onClick={handleStartSpk}
          className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm flex items-center justify-center gap-2 whitespace-nowrap shrink-0 transition-colors"
        >
          <span>Buat Pengajuan SPK</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Unit Selection Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                1. Pilih Unit Smartphone Bekas
              </label>
              {!isCustomMode && currentPhone && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="font-semibold text-slate-800">{currentPhone.grade}</span>
                  <span aria-hidden="true">·</span>
                  <span>BH {currentPhone.batteryHealth}%</span>
                </div>
              )}
            </div>

            <select
              value={isCustomMode ? 'CUSTOM' : currentPhone.id}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
            >
              {phones.map((phone) => (
                <option key={phone.id} value={phone.id}>
                  {phone.model} ({phone.storage} - {phone.grade}) — {formatRupiah(phone.priceCash)}
                </option>
              ))}
              <option value="CUSTOM">+ Input Nominal Harga Bebas / Kustom</option>
            </select>

            {isCustomMode && (
              <div className="pt-2">
                <label className="text-xs text-slate-600 block mb-1">Nominal Harga HP (Rupiah):</label>
                <input
                  type="number"
                  step="50000"
                  min="1000000"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-mono tabular-nums bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                />
              </div>
            )}

            {/* Selected unit banner */}
            {!isCustomMode && currentPhone && (
              <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                <div className="w-16 h-16 rounded bg-slate-200 overflow-hidden shrink-0">
                  <img
                    src={currentPhone.imageUrl}
                    alt={currentPhone.model}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-slate-900 block truncate">{currentPhone.model}</span>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>{currentPhone.storage}</span>
                    <span aria-hidden="true">·</span>
                    <span>{currentPhone.color}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-slate-600 text-[11px]">IMEI: {currentPhone.imei.slice(0, 8)}...</span>
                  </div>
                  <span className="text-xs text-emerald-600 font-medium block mt-0.5">
                    Garansi Toko {currentPhone.warrantyDays} Hari
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-500 block">Harga Tunai</span>
                  <span className="text-sm font-bold font-mono tabular-nums text-slate-900">
                    {formatRupiah(currentPhone.priceCash)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Down Payment (DP) Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                2. Uang Muka / Down Payment (DP)
              </label>
              <span className="text-sm font-bold font-mono tabular-nums text-blue-600">
                {dpPercent}% ({formatRupiah(calculation.dpAmount)})
              </span>
            </div>

            {/* Preset DP Chips */}
            <div className="grid grid-cols-5 gap-2">
              {[15, 20, 30, 40, 50].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setDpPercent(pct)}
                  className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                    dpPercent === pct
                      ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>

            {/* Range Slider */}
            <div className="pt-2">
              <input
                type="range"
                min="10"
                max="70"
                step="5"
                value={dpPercent}
                onChange={(e) => setDpPercent(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>Min 10%</span>
                <span>Standar 20%-30%</span>
                <span>Maks 70%</span>
              </div>
            </div>
          </div>

          {/* Tenor & Suku Bunga Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  3. Jangka Waktu Cicilan (Tenor)
                </label>
                <span className="text-xs font-semibold text-slate-700">Pilihan: {tenorMonths} Bulan</span>
              </div>

              {/* Tenor Selector Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[3, 6, 9, 12, 18, 24].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTenorMonths(t)}
                    className={`py-2.5 px-2 text-xs font-medium rounded-lg border text-center transition-all ${
                      tenorMonths === t
                        ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block text-sm font-bold font-mono">{t}</span>
                    <span className="text-[10px] opacity-80">Bulan</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Interest Rate & Admin Fee Settings */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-600 block mb-1">
                  Suku Bunga Flat Bulanan (%):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="5.0"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 text-xs sm:text-sm font-mono tabular-nums bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  />
                  <span className="text-xs text-slate-500 font-medium shrink-0">%/bln</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-600 block mb-1">
                  Biaya Administrasi Pembiayaan:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="10000"
                    min="0"
                    value={adminFee}
                    onChange={(e) => setAdminFee(Number(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 text-xs sm:text-sm font-mono tabular-nums bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  />
                  <span className="text-xs text-slate-500 font-medium shrink-0">IDR</span>
                </div>
              </div>
            </div>

            {/* Formula Explanation box */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Info className="w-3.5 h-3.5 text-blue-600" />
                <span>Formula Bunga Flat:</span>
              </div>
              <p className="font-mono text-[11px] text-slate-700">
                Pokok = Rp {calculation.principal.toLocaleString('id-ID')} · Bunga/Bln = {interestRate}% × Pokok = Rp {calculation.monthlyInterest.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Summary & Primary Quote Box (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Financial Quote Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Hasil Estimasi Angsuran
              </span>
              <div className="mt-2 p-4 bg-blue-50/70 rounded-xl border border-blue-200 text-center">
                <span className="text-xs text-blue-700 font-medium block">Angsuran per Bulan ({tenorMonths}x)</span>
                <div className="text-3xl font-extrabold font-mono tabular-nums text-blue-900 mt-1">
                  {formatRupiah(calculation.monthlyInstallment)}
                </div>
                <span className="text-[11px] text-blue-600 font-medium block mt-1">
                  Jatuh tempo setiap tanggal {new Date().getDate()}
                </span>
              </div>
            </div>

            {/* Breakdown Items */}
            <div className="space-y-3 text-xs border-t border-slate-100 pt-4">
              <div className="flex justify-between items-center text-slate-600">
                <span>Harga Unit HP</span>
                <span className="font-mono tabular-nums text-slate-900 font-semibold">
                  {formatRupiah(calculation.phonePrice)}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span>Uang Muka (DP {calculation.dpPercent}%)</span>
                <span className="font-mono tabular-nums text-blue-700 font-semibold">
                  {formatRupiah(calculation.dpAmount)}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span>Pokok Pinjaman Kredit</span>
                <span className="font-mono tabular-nums text-slate-900 font-semibold">
                  {formatRupiah(calculation.principal)}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span>Total Bunga ({tenorMonths} bln @ {calculation.interestRatePerMonth}%)</span>
                <span className="font-mono tabular-nums text-amber-700 font-semibold">
                  {formatRupiah(calculation.totalInterest)}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span>Biaya Administrasi Pembiayaan</span>
                <span className="font-mono tabular-nums text-slate-900 font-semibold">
                  {formatRupiah(calculation.adminFee)}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-slate-900">
                <span>Total Biaya (DP + Angsuran)</span>
                <span className="font-mono tabular-nums text-slate-900">
                  {formatRupiah(calculation.totalPayable)}
                </span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                onClick={handleStartSpk}
                className="w-full py-3 px-4 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span>Ajukan SPK Kredit Sales Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="mt-2 text-center text-[11px] text-slate-500">
                Data simulasi akan otomatis disalin ke formulir Surat Pesanan Konsumen.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Schedule Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Jadwal Angsuran & Tabel Amortisasi (Tenor {tenorMonths} Bulan)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Rincian alokasi pokok utang, bunga flat, dan sisa kewajiban pembayaran tiap periode.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 tabular-nums">
            Total {calculation.schedule.length} Periode
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">Bulan</th>
                <th className="py-3 px-4">Jatuh Tempo</th>
                <th className="py-3 px-4 text-right">Porsi Pokok</th>
                <th className="py-3 px-4 text-right">Porsi Bunga ({interestRate}%)</th>
                <th className="py-3 px-4 text-right">Biaya Admin</th>
                <th className="py-3 px-4 text-right">Total Angsuran</th>
                <th className="py-3 px-4 text-right">Sisa Pokok</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
              {calculation.schedule.map((row) => (
                <tr key={row.month} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-slate-900 font-sans">
                    Bulan ke-{row.month}
                  </td>
                  <td className="py-2.5 px-4 text-slate-600 font-sans">
                    {row.dueDate}
                  </td>
                  <td className="py-2.5 px-4 text-right text-slate-700">
                    {formatRupiah(row.principal)}
                  </td>
                  <td className="py-2.5 px-4 text-right text-amber-700">
                    {formatRupiah(row.interest)}
                  </td>
                  <td className="py-2.5 px-4 text-right text-slate-500">
                    {formatRupiah(row.adminFee)}
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold text-blue-700">
                    {formatRupiah(row.installment)}
                  </td>
                  <td className="py-2.5 px-4 text-right text-slate-500">
                    {formatRupiah(row.remainingPrincipal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
