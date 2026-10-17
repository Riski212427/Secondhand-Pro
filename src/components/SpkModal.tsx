import React from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/creditCalculator';
import { Printer, X, ShieldCheck, Smartphone, CheckCircle, FileText } from 'lucide-react';

export const SpkModal: React.FC = () => {
  const { activeSpkForModal, setActiveSpkForModal, setActiveTab } = useApp();

  if (!activeSpkForModal) return null;

  const spk = activeSpkForModal;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Modal Top Bar (Hidden in Print) */}
        <div className="no-print bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Preview Dokumen Resmi SPK & Kontrak Pembiayaan
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Dokumen (Print / PDF)</span>
            </button>
            <button
              onClick={() => setActiveSpkForModal(null)}
              className="text-slate-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div id="print-area" className="p-6 sm:p-10 space-y-6 text-slate-800 text-xs sm:text-sm bg-white">
          {/* Header Kop Surat */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                  SP
                </div>
                <span className="text-lg font-black tracking-tight text-slate-900">
                  SECONDPHONE PRO INDONESIA
                </span>
              </div>
              <p className="text-[11px] text-slate-500 max-w-sm leading-tight">
                Pusat Penjualan & Pembiayaan Kredit Smartphone Pre-Owned Resmi
                <br />Jl. Margonda Raya No. 108, Beji, Depok · Telp: (021) 7788-9900
              </p>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest block">
                SURAT PESANAN KONSUMEN (SPK)
              </span>
              <span className="text-sm sm:text-base font-extrabold font-mono text-slate-900 block mt-0.5">
                {spk.id}
              </span>
              <span className="text-[11px] text-slate-500 font-mono block">
                Tanggal: {spk.createdAt}
              </span>
              <div className="mt-1">
                <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-800 border border-slate-300 uppercase">
                  Status: {spk.status}
                </span>
              </div>
            </div>
          </div>

          {/* Bagian 1: Data Konsumen */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block border-b border-slate-200 pb-1">
              I. Identitas Konsumen (Debitur)
            </span>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Nama Lengkap:</span>
                <span className="font-semibold text-slate-900">{spk.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">No. NIK (KTP):</span>
                <span className="font-mono text-slate-900">{spk.customerNik}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nomor WhatsApp:</span>
                <span className="font-mono text-slate-900">{spk.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pekerjaan / Instansi:</span>
                <span className="font-semibold text-slate-900">{spk.customerJob}</span>
              </div>
              <div className="col-span-2 flex justify-between">
                <span className="text-slate-500">Alamat Domisili:</span>
                <span className="text-slate-900 text-right">{spk.customerAddress}</span>
              </div>
            </div>
          </div>

          {/* Bagian 2: Spesifikasi Unit Smartphone Bekas */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block border-b border-slate-200 pb-1">
              II. Rincian Unit Smartphone Bekas (Pre-Owned)
            </span>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Tipe / Model HP:</span>
                <span className="font-bold text-slate-900">{spk.phone.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kapasitas & Warna:</span>
                <span className="font-semibold text-slate-900">{spk.phone.storage} · {spk.phone.color}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Grading Fisik:</span>
                <span className="font-bold text-slate-900">{spk.phone.grade}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Battery Health (BH):</span>
                <span className="font-bold font-mono text-emerald-700">{spk.phone.batteryHealth}% Original</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nomor IMEI Fisik:</span>
                <span className="font-mono font-bold text-slate-900">{spk.phone.imei}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kelengkapan:</span>
                <span className="text-slate-900">{spk.phone.completeness}</span>
              </div>
              <div className="col-span-2 flex justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-500">Masa Garansi Toko:</span>
                <span className="font-bold text-blue-700">{spk.phone.warrantyDays} Hari (Ganti unit / servis gratis)</span>
              </div>
            </div>
          </div>

          {/* Bagian 3: Rincian Skema Kredit Finansial */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block border-b border-slate-200 pb-1">
              III. Rincian Pembiayaan & Skema Angsuran Cicilan
            </span>
            <table className="w-full text-xs font-mono tabular-nums border border-slate-200">
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 px-3 text-slate-600 font-sans">Harga Tunai Barang (Cash OTR):</td>
                  <td className="py-1.5 px-3 text-right font-bold text-slate-900">{formatRupiah(spk.calculation.phonePrice)}</td>
                </tr>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <td className="py-1.5 px-3 text-slate-600 font-sans">Uang Muka / Down Payment (DP {spk.calculation.dpPercent}%):</td>
                  <td className="py-1.5 px-3 text-right font-bold text-blue-700">{formatRupiah(spk.calculation.dpAmount)}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 px-3 text-slate-600 font-sans">Pokok Pembiayaan Kredit:</td>
                  <td className="py-1.5 px-3 text-right text-slate-900">{formatRupiah(spk.calculation.principal)}</td>
                </tr>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <td className="py-1.5 px-3 text-slate-600 font-sans">
                    Suku Bunga Flat ({spk.calculation.interestRatePerMonth}%/bln × {spk.calculation.tenorMonths} bln):
                  </td>
                  <td className="py-1.5 px-3 text-right text-amber-700">{formatRupiah(spk.calculation.totalInterest)}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 px-3 text-slate-600 font-sans">Biaya Administrasi & Polis Garansi:</td>
                  <td className="py-1.5 px-3 text-right text-slate-900">{formatRupiah(spk.calculation.adminFee)}</td>
                </tr>
                <tr className="bg-blue-50 font-bold border-t-2 border-blue-600">
                  <td className="py-2.5 px-3 text-blue-900 font-sans text-sm">
                    ANGSURAN PER BULAN ({spk.calculation.tenorMonths}x Tenor):
                  </td>
                  <td className="py-2.5 px-3 text-right text-blue-900 text-sm">
                    {formatRupiah(spk.calculation.monthlyInstallment)}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
              <span>Status Pembayaran Uang Muka (DP):</span>
              <span className={`font-bold ${spk.dpPaid ? 'text-emerald-600' : 'text-amber-600'}`}>
                {spk.dpPaid ? `LUNAS (${spk.dpPaymentMethod} - ${spk.dpPaidAt})` : 'BELUM DIBAYAR (Harap bayar di Kasir)'}
              </span>
            </div>
          </div>

          {/* Bagian 4: Pernyataan & Ketentuan */}
          <div className="text-[10px] text-slate-500 leading-normal border border-slate-200 p-2.5 rounded bg-slate-50/50">
            <span className="font-bold text-slate-700 block mb-0.5">Syarat & Ketentuan Pembiayaan:</span>
            1. Konsumen menyatakan data diri yang diberikan adalah sah dan benar.<br />
            2. Pembayaran angsuran jatuh tempo pada tanggal yang sama setiap bulannya.<br />
            3. Unit dilindungi garansi toko selama masa garansi tertera, tidak berlaku untuk kerusakan akibat kelalaian pemakaian (kemasukan air/layar pecah).
          </div>

          {/* Bagian 5: Tiga Kolom Tanda Tangan */}
          <div className="grid grid-cols-3 gap-4 pt-6 text-center text-xs">
            <div>
              <span className="text-slate-500 block">Pemohon / Konsumen,</span>
              <div className="h-16 flex items-end justify-center">
                <span className="font-script text-base text-slate-400 font-serif">[Ttd. Digital]</span>
              </div>
              <span className="font-bold text-slate-900 block underline">{spk.customerName}</span>
              <span className="text-[10px] text-slate-400 font-mono">NIK: {spk.customerNik.slice(0, 10)}...</span>
            </div>

            <div>
              <span className="text-slate-500 block">Sales Executive,</span>
              <div className="h-16 flex items-end justify-center">
                <span className="font-script text-base text-slate-400 font-serif">[Ttd. Valid]</span>
              </div>
              <span className="font-bold text-slate-900 block underline">{spk.salesRep.name}</span>
              <span className="text-[10px] text-slate-400 font-mono">NIP: {spk.salesRep.code}</span>
            </div>

            <div>
              <span className="text-slate-500 block">Branch / Credit Manager,</span>
              <div className="h-16 flex items-end justify-center">
                <span className="font-script text-base text-slate-400 font-serif">[Stempel Resmi]</span>
              </div>
              <span className="font-bold text-slate-900 block underline">Handoko Kusuma, S.E.</span>
              <span className="text-[10px] text-slate-400">Head of Financing</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar (Hidden in Print) */}
        <div className="no-print bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Format resmi siap cetak ke printer fisik atau simpan sebagai PDF.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSpkForModal(null)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Tutup
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak SPK Sekarang</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
