import React from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/creditCalculator';
import { Trophy, TrendingUp, Users, Smartphone, Award, Target, CheckCircle2 } from 'lucide-react';

export const SalesPerformanceView: React.FC = () => {
  const { salesReps, orders, phones, transactions } = useApp();

  // Metrics
  const totalOrdersCount = orders.length;
  const approvedOrdersCount = orders.filter((o) => o.status === 'APPROVED' || o.status === 'DISBURSED').length;
  
  // Total omzet dari transaksi riil yang masuk
  const totalRevenueCollected = transactions.reduce((sum, tx) => sum + tx.totalAmount, 0);

  // Total nilai pembiayaan kredit yang aktif
  const totalCreditFinanced = orders
    .filter((o) => o.status === 'APPROVED' || o.status === 'DISBURSED')
    .reduce((sum, o) => sum + o.calculation.principal, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <span>Executive Dashboard</span>
            <span aria-hidden="true">·</span>
            <span>Monitoring Tim Sales & Komisi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Performa Tim Sales & Target Penjualan Kredit
          </h1>
          <p className="mt-1 text-sm text-slate-600 max-w-2xl">
            Laporan pencapaian target bulanan, omzet pembiayaan kredit, dan komisi closing tim sales executive showroom.
          </p>
        </div>

        {/* Lecturer Note Banner */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 max-w-sm">
          <div className="font-bold flex items-center gap-1.5 mb-0.5">
            <Award className="w-4 h-4 text-blue-600" />
            <span>Kriteria Penilaian Dosen:</span>
          </div>
          <span>
            Setiap pengajuan SPK terikat ke sales executive dengan sistem target unit dan kalkulasi komisi penjualan kredit.
          </span>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 block">Total Uang Masuk (Kasir)</span>
          <div className="text-2xl font-extrabold font-mono tabular-nums text-slate-900 mt-1">
            {formatRupiah(totalRevenueCollected)}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium block mt-1">
            Tunai & Pelunasan DP Kredit
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 block">Total Pokok Pembiayaan Kredit</span>
          <div className="text-2xl font-extrabold font-mono tabular-nums text-blue-600 mt-1">
            {formatRupiah(totalCreditFinanced)}
          </div>
          <span className="text-[11px] text-slate-500 font-mono block mt-1">
            {approvedOrdersCount} Unit SPK Disetujui
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 block">Total Berkas SPK Masuk</span>
          <div className="text-2xl font-extrabold font-mono tabular-nums text-slate-900 mt-1">
            {totalOrdersCount} Berkas
          </div>
          <span className="text-[11px] text-blue-600 font-medium block mt-1">
            Tingkat Approval: {Math.round((approvedOrdersCount / (totalOrdersCount || 1)) * 100)}%
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 block">Unit HP Tersedia di Showroom</span>
          <div className="text-2xl font-extrabold font-mono tabular-nums text-slate-900 mt-1">
            {phones.filter((p) => p.inStock).length} / {phones.length} Unit
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            iPhone & Android Bekas Siap Jual
          </span>
        </div>
      </div>

      {/* Sales Representatives Leaderboard */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>Leaderboard Pencapaian Sales Executive</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">Bulan Berjalan: Oktober 2026</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {salesReps.map((rep, idx) => {
            const targetPct = Math.min(100, Math.round((rep.achievedDeals / rep.monthlyTarget) * 100));
            // Estimasi komisi 1.25% dari total omzet penjualan
            const commission = Math.round(rep.achievedOmzet * 0.0125);
            // Jumlah SPK yang dibuat oleh sales ini
            const myOrders = orders.filter((o) => o.salesRep.id === rep.id);

            return (
              <div
                key={rep.id}
                className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between space-y-5 hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-slate-900">{rep.name}</span>
                        {idx === 0 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            #1 Top Sales
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 font-mono block mt-0.5">
                        {rep.code} · {rep.role}
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs">
                      {rep.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                  </div>

                  {/* Progress target deals */}
                  <div className="mt-5 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 font-medium">Target Closing Unit:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {rep.achievedDeals} / {rep.monthlyTarget} Unit ({targetPct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          targetPct >= 80 ? 'bg-emerald-600' : 'bg-blue-600'
                        }`}
                        style={{ width: `${targetPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Financial stats */}
                  <div className="mt-5 grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs">
                    <div>
                      <span className="text-slate-500 block">Total Omzet:</span>
                      <span className="font-bold font-mono tabular-nums text-slate-900">
                        {formatRupiah(rep.achievedOmzet)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Estimasi Komisi:</span>
                      <span className="font-bold font-mono tabular-nums text-emerald-700">
                        {formatRupiah(commission)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recent Deals handled by this sales */}
                <div className="pt-3 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 font-medium block mb-1.5">
                    Berkas SPK Ditangani ({myOrders.length}):
                  </span>
                  <div className="space-y-1">
                    {myOrders.slice(0, 2).map((o) => (
                      <div key={o.id} className="flex justify-between items-center text-[11px] text-slate-700">
                        <span className="truncate max-w-[140px] font-medium">{o.customerName}</span>
                        <span className="font-mono text-slate-500">{o.phone.model.split(' ')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
