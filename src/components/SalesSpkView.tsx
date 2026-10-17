import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SalesOrder, OrderStatus, UsedPhone } from '../types';
import { formatRupiah, calculateCredit } from '../utils/creditCalculator';
import { 
  FileText, Plus, Search, CheckCircle2, Clock, XCircle, 
  Printer, ArrowRight, UserCheck, Shield, Eye, DollarSign 
} from 'lucide-react';

export const SalesSpkView: React.FC = () => {
  const { 
    orders, 
    phones, 
    salesReps, 
    selectedPhoneForSimulation, 
    createSalesOrder, 
    updateOrderStatus, 
    setActiveSpkForModal, 
    setActiveTab 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'list' | 'create'>('list');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form State for creating new SPK
  const defaultPhone = selectedPhoneForSimulation || phones[0];
  const [formPhoneId, setFormPhoneId] = useState<string>(defaultPhone.id);
  const [formCustomerName, setFormCustomerName] = useState<string>('');
  const [formCustomerNik, setFormCustomerNik] = useState<string>('');
  const [formCustomerPhone, setFormCustomerPhone] = useState<string>('');
  const [formCustomerAddress, setFormCustomerAddress] = useState<string>('');
  const [formCustomerJob, setFormCustomerJob] = useState<string>('');
  const [formCustomerIncome, setFormCustomerIncome] = useState<number>(8500000);
  const [formSalesRepId, setFormSalesRepId] = useState<string>(salesReps[0]?.id || '');
  const [formDpPercent, setFormDpPercent] = useState<number>(20);
  const [formTenorMonths, setFormTenorMonths] = useState<number>(12);
  const [formError, setFormError] = useState<string>('');

  const selectedFormPhone = phones.find((p) => p.id === formPhoneId) || defaultPhone;

  // Filter orders
  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = filterStatus === 'ALL' || ord.status === filterStatus;
    const matchesSearch =
      ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerNik.includes(searchQuery) ||
      ord.phone.model.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSubmitNewSpk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCustomerName.trim() || !formCustomerNik.trim() || !formCustomerPhone.trim()) {
      setFormError('Nama, NIK KTP, dan Nomor Telepon wajib diisi!');
      return;
    }

    if (formCustomerNik.length < 16) {
      setFormError('Nomor Induk Kependudukan (NIK) harus 16 digit angka sesuai KTP.');
      return;
    }

    const calc = calculateCredit(selectedFormPhone.priceCash, formDpPercent, formTenorMonths, 1.5, 50000);

    const created = createSalesOrder({
      customerName: formCustomerName,
      customerNik: formCustomerNik,
      customerPhone: formCustomerPhone,
      customerAddress: formCustomerAddress || 'Domisili terverifikasi sesuai KTP',
      customerJob: formCustomerJob || 'Karyawan Swasta',
      customerIncome: formCustomerIncome,
      phone: selectedFormPhone,
      calculation: calc,
      salesRepId: formSalesRepId || salesReps[0].id,
    });

    // Reset form and return to list
    setFormError('');
    setActiveSubTab('list');
    setActiveSpkForModal(created);
  };

  const getStatusBadge = (status: OrderStatus, dpPaid: boolean) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Menunggu Review</span>
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Disetujui ({dpPaid ? 'DP Lunas' : 'Belum DP'})</span>
          </span>
        );
      case 'DISBURSED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <CheckCircle2 className="w-3 h-3 text-blue-600" />
            <span>Unit Serah Terima</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>Pengajuan Ditolak</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <span>Sales & Credit Management</span>
            <span aria-hidden="true">·</span>
            <span>Surat Pesanan Konsumen (SPK)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Pengajuan Kredit & Manajemen SPK Sales
          </h1>
          <p className="mt-1 text-sm text-slate-600 max-w-2xl">
            Input data calon debitur, verifikasi skor kredit, setujui pengajuan, dan cetak Surat Pesanan Konsumen resmi beserta jadwal angsuran.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            onClick={() => setActiveSubTab('list')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-all ${
              activeSubTab === 'list'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daftar SPK ({orders.length})
          </button>
          <button
            onClick={() => setActiveSubTab('create')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeSubTab === 'create'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat SPK Baru</span>
          </button>
        </div>
      </div>

      {/* SubTab 1: List SPK */}
      {activeSubTab === 'list' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Status Filters */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full sm:w-auto">
              {[
                { id: 'ALL', label: 'Semua Status' },
                { id: 'PENDING', label: 'Menunggu' },
                { id: 'APPROVED', label: 'Disetujui' },
                { id: 'DISBURSED', label: 'Lunas DP / Selesai' },
                { id: 'REJECTED', label: 'Ditolak' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setFilterStatus(st.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    filterStatus === st.id
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari No SPK, Nama, atau NIK..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/30"
              />
            </div>
          </div>

          {/* SPK Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-3 px-4">No. SPK & Tanggal</th>
                    <th className="py-3 px-4">Calon Konsumen</th>
                    <th className="py-3 px-4">Unit HP Bekas</th>
                    <th className="py-3 px-4 text-right">DP & Angsuran</th>
                    <th className="py-3 px-4">Sales In-Charge</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Aksi Dokumen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-500 font-medium">
                        Tidak ada berkas SPK yang sesuai dengan filter pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="font-mono font-bold text-slate-900 block">{ord.id}</span>
                          <span className="text-[11px] text-slate-500 font-mono">{ord.createdAt}</span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 block">{ord.customerName}</span>
                          <span className="text-[11px] text-slate-500 block">NIK: {ord.customerNik}</span>
                          <span className="text-[11px] text-slate-500 block truncate max-w-[180px]">{ord.customerJob}</span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-900 block truncate max-w-[200px]">
                            {ord.phone.model}
                          </span>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                            <span className="font-semibold text-slate-700">{ord.phone.grade}</span>
                            <span aria-hidden="true">·</span>
                            <span>BH {ord.phone.batteryHealth}%</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono text-[10px]">IMEI: {ord.phone.imei.slice(0, 7)}...</span>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right whitespace-nowrap font-mono tabular-nums">
                          <div className="text-slate-900 font-bold">
                            {formatRupiah(ord.calculation.monthlyInstallment)}
                            <span className="text-[10px] text-slate-500 font-normal">/bln ({ord.calculation.tenorMonths}x)</span>
                          </div>
                          <div className="text-[11px] text-blue-700">
                            DP: {formatRupiah(ord.calculation.dpAmount)} ({ord.calculation.dpPercent}%)
                          </div>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="font-semibold text-slate-800 block">{ord.salesRep.name}</span>
                          <span className="text-[11px] text-slate-500 font-mono">{ord.salesRep.code}</span>
                        </td>

                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          {getStatusBadge(ord.status, ord.dpPaid)}
                        </td>

                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* View / Print Official Document */}
                            <button
                              onClick={() => setActiveSpkForModal(ord)}
                              title="Lihat & Cetak Kontrak SPK"
                              className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            >
                              <FileText className="w-4 h-4" />
                            </button>

                            {/* Approve / Reject Controls for demo */}
                            {ord.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => updateOrderStatus(ord.id, 'APPROVED', 'Disetujui: Dokumen lengkap & skor kredit valid.')}
                                  title="Setujui Pengajuan Kredit"
                                  className="px-2 py-1 text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => updateOrderStatus(ord.id, 'REJECTED', 'Ditolak: Riwayat angsuran perbankan belum memenuhi syarat.')}
                                  title="Tolak Pengajuan Kredit"
                                  className="px-2 py-1 text-[11px] font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {/* Kasir Shortcut if approved and DP unpaid */}
                            {ord.status === 'APPROVED' && !ord.dpPaid && (
                              <button
                                onClick={() => setActiveTab('kasir')}
                                title="Lanjutkan Pembayaran DP di Kasir"
                                className="px-2 py-1 text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors flex items-center gap-1"
                              >
                                <span>Bayar DP</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 2: Form Create SPK Baru */}
      {activeSubTab === 'create' && (
        <form onSubmit={handleSubmitNewSpk} className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 max-w-4xl mx-auto space-y-8">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Formulir Pembuatan Surat Pesanan Konsumen (SPK Kredit)</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Input data nasabah dan unit smartphone untuk diterbitkan kontrak pembiayaan cicilan.
            </p>
          </div>

          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold text-rose-800">
              {formError}
            </div>
          )}

          {/* Section 1: Customer Data */}
          <div className="space-y-4">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              1. Identitas Lengkap Calon Konsumen (Debitur)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Nama Lengkap (sesuai KTP)*</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Ilham"
                  value={formCustomerName}
                  onChange={(e) => setFormCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Nomor Induk Kependudukan (NIK 16 Digit)*</label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  placeholder="3201xxxxxxxxxxxx"
                  value={formCustomerNik}
                  onChange={(e) => setFormCustomerNik(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 text-xs sm:text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Nomor WhatsApp Aktif*</label>
                <input
                  type="tel"
                  required
                  placeholder="0812xxxxxxxx"
                  value={formCustomerPhone}
                  onChange={(e) => setFormCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Pekerjaan & Nama Perusahaan</label>
                <input
                  type="text"
                  placeholder="Contoh: IT Staff PT Telkom"
                  value={formCustomerJob}
                  onChange={(e) => setFormCustomerJob(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-slate-700 block mb-1">Alamat Domisili Sekarang (Lengkap)</label>
                <input
                  type="text"
                  placeholder="Jalan, No Rumah, Kelurahan, Kecamatan, Kota"
                  value={formCustomerAddress}
                  onChange={(e) => setFormCustomerAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Estimasi Penghasilan Bulanan (Rp)</label>
                <input
                  type="number"
                  step="500000"
                  value={formCustomerIncome}
                  onChange={(e) => setFormCustomerIncome(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs sm:text-sm font-mono tabular-nums bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Sales Penanggung Jawab*</label>
                <select
                  value={formSalesRepId}
                  onChange={(e) => setFormSalesRepId(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                >
                  {salesReps.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.code}) — {r.role}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Unit HP & Skema Cicilan */}
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              2. Unit Smartphone Bekas & Pilihan Skema Pembiayaan
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3">
                <label className="text-xs font-medium text-slate-700 block mb-1">Unit Smartphone Bekas:</label>
                <select
                  value={formPhoneId}
                  onChange={(e) => setFormPhoneId(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                >
                  {phones.map((p) => (
                    <option key={p.id} value={p.id} disabled={!p.inStock}>
                      {p.model} ({p.storage} - {p.grade}) — {formatRupiah(p.priceCash)} {!p.inStock ? '(Sudah Terjual)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Down Payment (DP %):</label>
                <select
                  value={formDpPercent}
                  onChange={(e) => setFormDpPercent(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                >
                  {[15, 20, 25, 30, 40, 50].map((dp) => (
                    <option key={dp} value={dp}>
                      DP {dp}% ({formatRupiah(Math.round(selectedFormPhone.priceCash * (dp / 100)))})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Tenor Cicilan:</label>
                <select
                  value={formTenorMonths}
                  onChange={(e) => setFormTenorMonths(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                >
                  {[3, 6, 9, 12, 18, 24].map((t) => (
                    <option key={t} value={t}>
                      {t} Bulan Angsuran
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 flex flex-col justify-center">
                <span className="text-[11px] text-blue-700 font-semibold block">Estimasi Angsuran:</span>
                <span className="text-base font-bold font-mono text-blue-900">
                  {formatRupiah(calculateCredit(selectedFormPhone.priceCash, formDpPercent, formTenorMonths, 1.5, 50000).monthlyInstallment)}
                  <span className="text-xs font-normal text-slate-600">/bln</span>
                </span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveSubTab('list')}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              <span>Terbitkan Berkas SPK</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
