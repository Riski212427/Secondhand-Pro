import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UsedPhone, PhoneGrade } from '../types';
import { formatRupiah } from '../utils/creditCalculator';
import { Search, ShieldCheck, BatteryCharging, Box, Sparkles, CheckCircle2, ArrowRight, X } from 'lucide-react';

export const CatalogView: React.FC = () => {
  const { phones, startSimulationForPhone, seedAdditionalPhones, seedRandomBatch, resetToDemoData } = useApp();
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [detailModalPhone, setDetailModalPhone] = useState<UsedPhone | null>(null);
  const [showSeedDropdown, setShowSeedDropdown] = useState<boolean>(false);

  const filteredPhones = phones.filter((phone) => {
    const matchesBrand = selectedBrand === 'ALL' || phone.brand === selectedBrand;
    const matchesGrade = selectedGrade === 'ALL' || phone.grade === selectedGrade;
    const matchesSearch =
      phone.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phone.storage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phone.color.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBrand && matchesGrade && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 tracking-wider uppercase mb-1">
            <span>Showroom Smartphone Pre-Owned & Financing</span>
            <span aria-hidden="true">·</span>
            <span>Garansi Toko Resmi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Katalog Smartphone Bekas Flagship & Mid-Range
          </h1>
          <p className="mt-1 text-sm text-slate-600 max-w-2xl">
            Semua unit telah lolos 32 titik uji teknisi ahli, bebas bypass, IMEI terdaftar resmi Kemenperin/Bea Cukai, dengan skema cicilan kredit bunga flat transparan.
          </p>
        </div>

        {/* Quick Action & Value Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 shrink-0">
          {/* Seed Data Dropdown Action */}
          <div className="relative">
            <button
              onClick={() => setShowSeedDropdown(!showSeedDropdown)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Seed Data Stok HP (+Variasi)</span>
            </button>

            {showSeedDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-30 space-y-1 text-xs">
                <div className="px-3 py-2 border-b border-slate-100">
                  <span className="font-bold text-slate-900 block">Fungsi Seed Data Stok</span>
                  <span className="text-[11px] text-slate-500">
                    Menambahkan unit iPhone & Android dengan variasi Grade A+/A/B, Battery Health, dan kelengkapan.
                  </span>
                </div>
                
                <button
                  onClick={() => {
                    seedAdditionalPhones('append');
                    setShowSeedDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-800 font-medium flex items-center justify-between"
                >
                  <span>Tambah Batch Kurasi (+7 Unit)</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-mono">+7</span>
                </button>

                <button
                  onClick={() => {
                    seedRandomBatch(5);
                    setShowSeedDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-800 font-medium flex items-center justify-between"
                >
                  <span>Generate Acak (+5 Unit Dinamis)</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">+5</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm('Reset katalog ke 7 unit awal?')) {
                      resetToDemoData();
                      setShowSeedDropdown(false);
                    }
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-50 text-rose-700 font-medium flex items-center justify-between border-t border-slate-100 pt-2"
                >
                  <span>Reset ke 7 Unit Default</span>
                  <span className="text-[10px] text-rose-500">Reset</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div>
              <span className="block text-lg font-bold tabular-nums font-mono text-slate-900">{phones.length} Unit</span>
              <span>Stok Terverifikasi</span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <span className="block text-lg font-bold tabular-nums font-mono text-emerald-600">30 - 90 Hari</span>
              <span>Garansi Toko</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Brand Segmented Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 bg-slate-100 rounded-lg">
            {['ALL', 'Apple', 'Samsung', 'Google', 'Xiaomi'].map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  selectedBrand === brand
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {brand === 'ALL' ? 'Semua Merk' : brand}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari tipe HP (misal: iPhone 15, S24 Ultra, Pixel)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
            />
          </div>
        </div>

        {/* Grade Filter Bar */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600 overflow-x-auto">
          <span className="font-semibold text-slate-800 whitespace-nowrap">Filter Kondisi Fisik:</span>
          {[
            { id: 'ALL', label: 'Semua Grade' },
            { id: 'Grade A+', label: 'Grade A+ (Like New 99%)' },
            { id: 'Grade A', label: 'Grade A (Mulus 95%)' },
            { id: 'Grade B', label: 'Grade B (Terawat 90%)' },
          ].map((gradeItem) => (
            <button
              key={gradeItem.id}
              onClick={() => setSelectedGrade(gradeItem.id)}
              className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap shrink-0 ${
                selectedGrade === gradeItem.id
                  ? 'bg-slate-900 text-white font-medium'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {gradeItem.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      {filteredPhones.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-xl">
          <p className="text-sm font-medium text-slate-700">Tidak ada unit smartphone yang sesuai dengan kriteria filter.</p>
          <button
            onClick={() => {
              setSelectedBrand('ALL');
              setSelectedGrade('ALL');
              setSearchQuery('');
            }}
            className="mt-3 px-4 py-2 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhones.map((phone) => {
            // Estimasi cicilan 12 bulan DP 20%
            const estDp = Math.round(phone.priceCash * 0.2);
            const estPrincipal = phone.priceCash - estDp;
            const estInterest = Math.round(estPrincipal * 0.015 * 12);
            const estMonthly = Math.round((estPrincipal + estInterest + 50000) / 12);

            return (
              <div
                key={phone.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col hover:border-slate-300 transition-all duration-200"
              >
                {/* Product Image Lead (65-75% standard) */}
                <div className="relative aspect-4/3 bg-slate-100 overflow-hidden group">
                  <img
                    src={phone.imageUrl}
                    alt={phone.model}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    onError={(e) => {
                      // Fallback jika path lokal tidak dapat dimuat
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  
                  {/* Clean unboxed grade tag at corner */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-900 border border-slate-200/80 shadow-xs flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>{phone.grade}</span>
                  </div>

                  {!phone.inStock && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                      <span className="text-white text-xs font-bold uppercase tracking-wider px-3 py-1 bg-rose-600 rounded">
                        Unit Sudah Terjual
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Metadata line with typographic separators */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                      <span>{phone.brand}</span>
                      <span aria-hidden="true">·</span>
                      <span>{phone.storage}</span>
                      <span aria-hidden="true">·</span>
                      <span>{phone.color}</span>
                    </div>

                    {/* Model Name */}
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {phone.model}
                    </h3>

                    {/* Condition details */}
                    <div className="mt-3 flex items-center gap-3 text-xs text-slate-600">
                      <div className="flex items-center gap-1" title="Battery Health Original">
                        <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-semibold text-slate-800">BH {phone.batteryHealth}%</span>
                      </div>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <div className="flex items-center gap-1" title="Kelengkapan Paket">
                        <Box className="w-3.5 h-3.5 text-slate-500" />
                        <span className="truncate max-w-[130px]">{phone.completeness}</span>
                      </div>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <div className="flex items-center gap-1" title="Garansi Toko">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                        <span>{phone.warrantyDays} Hari</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Box */}
                  <div className="pt-3 border-t border-slate-100 flex items-end justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 block">Harga Tunai (Cash)</span>
                      <span className="text-lg font-bold tabular-nums font-mono text-slate-900">
                        {formatRupiah(phone.priceCash)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-blue-600 font-medium block">Estimasi Cicilan (12 bln)</span>
                      <span className="text-xs font-bold tabular-nums font-mono text-blue-700">
                        {formatRupiah(estMonthly)}<span className="font-normal text-[10px] text-slate-500">/bln</span>
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => setDetailModalPhone(phone)}
                      className="w-full py-2 px-3 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-center"
                    >
                      Detail Fisik
                    </button>
                    <button
                      disabled={!phone.inStock}
                      onClick={() => startSimulationForPhone(phone)}
                      className="w-full py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 rounded-lg transition-colors flex items-center justify-center gap-1 text-center"
                    >
                      <span>Simulasi</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Fisik Unit Modal */}
      {detailModalPhone && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 border border-slate-200 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
                  <span>Lembar Inspeksi Fisik Smartphone</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-500 font-mono">IMEI: {detailModalPhone.imei}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {detailModalPhone.model} ({detailModalPhone.storage})
                </h3>
              </div>
              <button
                onClick={() => setDetailModalPhone(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Visual Specs Matrix */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 block">Grading Fisik</span>
                <span className="font-bold text-slate-900">{detailModalPhone.grade}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Battery Health (BH)</span>
                <span className="font-bold font-mono text-emerald-600">{detailModalPhone.batteryHealth}% (Original)</span>
              </div>
              <div>
                <span className="text-slate-500 block">Kelengkapan</span>
                <span className="font-bold text-slate-900">{detailModalPhone.completeness}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Garansi Servis & Ganti Unit</span>
                <span className="font-bold text-blue-600">{detailModalPhone.warrantyDays} Hari Toko</span>
              </div>
            </div>

            {/* Condition Notes */}
            <div>
              <span className="text-xs font-semibold text-slate-700 block mb-2">Hasil Uji QC Teknisi:</span>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {detailModalPhone.conditionNotes.map((note, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-slate-500 italic bg-amber-50 p-2.5 rounded border border-amber-200 text-amber-900">
                {detailModalPhone.gradeDescription}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 block">Harga Tunai</span>
                <span className="text-lg font-bold font-mono tabular-nums text-slate-900">
                  {formatRupiah(detailModalPhone.priceCash)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDetailModalPhone(null)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    const target = detailModalPhone;
                    setDetailModalPhone(null);
                    startSimulationForPhone(target);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <span>Simulasi Kredit HP Ini</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
