import { AmortizationRow, CreditCalculation } from '../types';

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('id-ID').format(amount);
}

export function calculateCredit(
  phonePrice: number,
  dpPercent: number,
  tenorMonths: number,
  interestRatePerMonth: number = 1.5,
  adminFee: number = 50000
): CreditCalculation {
  const safeDpPercent = Math.min(Math.max(dpPercent, 10), 90);
  const dpAmount = Math.round(phonePrice * (safeDpPercent / 100));
  const principal = phonePrice - dpAmount;

  // Suku bunga flat bulanan
  const monthlyInterest = Math.round(principal * (interestRatePerMonth / 100));
  const totalInterest = monthlyInterest * tenorMonths;
  
  // Total utang yang dicicil per bulan
  const totalDebt = principal + totalInterest + adminFee;
  const monthlyInstallment = Math.round(totalDebt / tenorMonths);
  const totalPayable = dpAmount + (monthlyInstallment * tenorMonths);

  // Jadwal Amortisasi Bulanan
  const schedule: AmortizationRow[] = [];
  const monthlyPrincipal = Math.round(principal / tenorMonths);
  const monthlyAdmin = Math.round(adminFee / tenorMonths);

  const baseDate = new Date();

  for (let m = 1; m <= tenorMonths; m++) {
    const due = new Date(baseDate);
    due.setMonth(due.getMonth() + m);
    
    // Sisa pokok pinjaman
    const remainingPrincipal = Math.max(0, principal - (monthlyPrincipal * m));
    
    // Penyesuaian rounding di bulan terakhir jika ada selisih
    const isLastMonth = m === tenorMonths;
    const currentPrincipal = isLastMonth 
      ? principal - (monthlyPrincipal * (tenorMonths - 1))
      : monthlyPrincipal;

    schedule.push({
      month: m,
      dueDate: due.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      principal: currentPrincipal,
      interest: monthlyInterest,
      adminFee: monthlyAdmin,
      installment: monthlyInstallment,
      remainingPrincipal: isLastMonth ? 0 : remainingPrincipal,
    });
  }

  return {
    phonePrice,
    dpPercent: safeDpPercent,
    dpAmount,
    principal,
    tenorMonths,
    interestRatePerMonth,
    monthlyInterest,
    totalInterest,
    adminFee,
    totalPayable,
    monthlyInstallment,
    schedule,
  };
}
