export type PhoneGrade = 'Grade A+' | 'Grade A' | 'Grade B';

export type Completeness = 
  | 'Fullset Original Box'
  | 'Box OEM + Fast Charger'
  | 'Unit Only (Batangan)';

export interface UsedPhone {
  id: string;
  brand: 'Apple' | 'Samsung' | 'Google' | 'Xiaomi';
  model: string;
  storage: string;
  color: string;
  priceCash: number;
  grade: PhoneGrade;
  gradeDescription: string;
  batteryHealth: number;
  completeness: Completeness;
  warrantyDays: number;
  imei: string;
  imageUrl: string;
  conditionNotes: string[];
  inStock: boolean;
  minDpPercent: number;
}

export interface AmortizationRow {
  month: number;
  dueDate: string;
  principal: number;
  interest: number;
  adminFee: number;
  installment: number;
  remainingPrincipal: number;
}

export interface CreditCalculation {
  phonePrice: number;
  dpPercent: number;
  dpAmount: number;
  principal: number;
  tenorMonths: number;
  interestRatePerMonth: number;
  monthlyInterest: number;
  totalInterest: number;
  adminFee: number;
  totalPayable: number;
  monthlyInstallment: number;
  schedule: AmortizationRow[];
}

export interface SalesRep {
  id: string;
  name: string;
  code: string;
  phone: string;
  role: string;
  monthlyTarget: number;
  achievedDeals: number;
  achievedOmzet: number;
}

export type OrderStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'DISBURSED';

export interface SalesOrder {
  id: string; // e.g. "SPK-SEC-2026-001"
  createdAt: string;
  customerName: string;
  customerNik: string;
  customerPhone: string;
  customerAddress: string;
  customerJob: string;
  customerIncome: number;
  phone: UsedPhone;
  calculation: CreditCalculation;
  salesRep: SalesRep;
  status: OrderStatus;
  dpPaid: boolean;
  dpPaidAt?: string;
  dpPaymentMethod?: 'CASH' | 'QRIS' | 'TRANSFER';
  reviewerNotes?: string;
}

export interface PosTransaction {
  id: string; // e.g. "INV-2026-0104"
  createdAt: string;
  type: 'CASH_SALE' | 'DP_INSTALLMENT';
  spkId?: string;
  customerName: string;
  phoneModel: string;
  phoneImei: string;
  totalAmount: number;
  paymentMethod: 'CASH' | 'QRIS' | 'TRANSFER';
  cashTendered?: number;
  changeAmount?: number;
  cashierName: string;
}
