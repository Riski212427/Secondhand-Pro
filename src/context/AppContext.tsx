import React, { createContext, useContext, useState, useEffect } from 'react';
import { UsedPhone, SalesOrder, PosTransaction, SalesRep, OrderStatus, CreditCalculation } from '../types';
import { INITIAL_PHONES, SALES_REPRESENTATIVES, INITIAL_ORDERS, INITIAL_TRANSACTIONS } from '../data/mockData';
import { ADDITIONAL_SEED_PHONES, generateRandomUsedPhone } from '../data/seedData';

export type NavTab = 'katalog' | 'simulasi' | 'spk' | 'kasir' | 'performa';

interface AppContextType {
  phones: UsedPhone[];
  orders: SalesOrder[];
  transactions: PosTransaction[];
  salesReps: SalesRep[];
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  selectedPhoneForSimulation: UsedPhone | null;
  setSelectedPhoneForSimulation: (phone: UsedPhone | null) => void;
  startSimulationForPhone: (phone: UsedPhone) => void;
  activeSpkForModal: SalesOrder | null;
  setActiveSpkForModal: (order: SalesOrder | null) => void;
  activeReceiptForModal: PosTransaction | null;
  setActiveReceiptForModal: (tx: PosTransaction | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  createSalesOrder: (params: {
    customerName: string;
    customerNik: string;
    customerPhone: string;
    customerAddress: string;
    customerJob: string;
    customerIncome: number;
    phone: UsedPhone;
    calculation: CreditCalculation;
    salesRepId: string;
  }) => SalesOrder;
  updateOrderStatus: (orderId: string, status: OrderStatus, notes?: string) => void;
  processDpPayment: (orderId: string, paymentMethod: 'CASH' | 'QRIS' | 'TRANSFER', cashTendered?: number) => PosTransaction | null;
  processCashSale: (phone: UsedPhone, customerName: string, paymentMethod: 'CASH' | 'QRIS' | 'TRANSFER', cashTendered?: number) => PosTransaction;
  seedAdditionalPhones: (mode?: 'append' | 'replace') => number;
  seedRandomBatch: (count?: number) => number;
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [phones, setPhones] = useState<UsedPhone[]>(() => {
    const saved = localStorage.getItem('sp_phones');
    return saved ? JSON.parse(saved) : INITIAL_PHONES;
  });

  const [orders, setOrders] = useState<SalesOrder[]>(() => {
    const saved = localStorage.getItem('sp_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [transactions, setTransactions] = useState<PosTransaction[]>(() => {
    const saved = localStorage.getItem('sp_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [salesReps, setSalesReps] = useState<SalesRep[]>(() => {
    const saved = localStorage.getItem('sp_salesreps');
    return saved ? JSON.parse(saved) : SALES_REPRESENTATIVES;
  });

  const [activeTab, setActiveTab] = useState<NavTab>('katalog');
  const [selectedPhoneForSimulation, setSelectedPhoneForSimulation] = useState<UsedPhone | null>(INITIAL_PHONES[0]);
  const [activeSpkForModal, setActiveSpkForModal] = useState<SalesOrder | null>(null);
  const [activeReceiptForModal, setActiveReceiptForModal] = useState<PosTransaction | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // Sync state ke localStorage
  useEffect(() => {
    localStorage.setItem('sp_phones', JSON.stringify(phones));
  }, [phones]);

  useEffect(() => {
    localStorage.setItem('sp_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('sp_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('sp_salesreps', JSON.stringify(salesReps));
  }, [salesReps]);

  const startSimulationForPhone = (phone: UsedPhone) => {
    setSelectedPhoneForSimulation(phone);
    setActiveTab('simulasi');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const createSalesOrder = (params: {
    customerName: string;
    customerNik: string;
    customerPhone: string;
    customerAddress: string;
    customerJob: string;
    customerIncome: number;
    phone: UsedPhone;
    calculation: CreditCalculation;
    salesRepId: string;
  }): SalesOrder => {
    const rep = salesReps.find((r) => r.id === params.salesRepId) || salesReps[0];
    const orderIndex = orders.length + 1;
    const formattedNum = String(orderIndex).padStart(3, '0');
    const newId = `SPK-SEC-2026-${formattedNum}`;

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newOrder: SalesOrder = {
      id: newId,
      createdAt: dateStr,
      customerName: params.customerName,
      customerNik: params.customerNik,
      customerPhone: params.customerPhone,
      customerAddress: params.customerAddress,
      customerJob: params.customerJob,
      customerIncome: params.customerIncome,
      phone: params.phone,
      calculation: params.calculation,
      salesRep: rep,
      status: 'PENDING',
      dpPaid: false,
      reviewerNotes: 'Menunggu review dokumen dan konfirmasi oleh Supervisor.',
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Update sales rep omzet & deals
    setSalesReps((prev) =>
      prev.map((r) =>
        r.id === rep.id
          ? {
              ...r,
              achievedDeals: r.achievedDeals + 1,
              achievedOmzet: r.achievedOmzet + params.phone.priceCash,
            }
          : r
      )
    );

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, notes?: string) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status,
              reviewerNotes: notes || ord.reviewerNotes,
            }
          : ord
      )
    );
  };

  const processDpPayment = (
    orderId: string,
    paymentMethod: 'CASH' | 'QRIS' | 'TRANSFER',
    cashTendered?: number
  ): PosTransaction | null => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return null;

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const txIndex = transactions.length + 94;
    const invId = `INV-2026-${String(txIndex).padStart(4, '0')}`;
    const dpAmount = order.calculation.dpAmount;
    const change = cashTendered && cashTendered >= dpAmount ? cashTendered - dpAmount : 0;

    const newTx: PosTransaction = {
      id: invId,
      createdAt: dateStr,
      type: 'DP_INSTALLMENT',
      spkId: order.id,
      customerName: order.customerName,
      phoneModel: `${order.phone.model} (${order.phone.storage} - ${order.phone.grade})`,
      phoneImei: order.phone.imei,
      totalAmount: dpAmount,
      paymentMethod,
      cashTendered: paymentMethod === 'CASH' ? cashTendered : undefined,
      changeAmount: paymentMethod === 'CASH' ? change : undefined,
      cashierName: 'Rina (Kasir Utama)',
    };

    // Update order status
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              dpPaid: true,
              dpPaidAt: dateStr,
              dpPaymentMethod: paymentMethod,
              status: 'DISBURSED',
            }
          : o
      )
    );

    // Tandai unit terjual / out of stock
    setPhones((prev) =>
      prev.map((p) => (p.id === order.phone.id ? { ...p, inStock: false } : p))
    );

    setTransactions((prev) => [newTx, ...prev]);
    return newTx;
  };

  const processCashSale = (
    phone: UsedPhone,
    customerName: string,
    paymentMethod: 'CASH' | 'QRIS' | 'TRANSFER',
    cashTendered?: number
  ): PosTransaction => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const txIndex = transactions.length + 94;
    const invId = `INV-2026-${String(txIndex).padStart(4, '0')}`;
    const change = cashTendered && cashTendered >= phone.priceCash ? cashTendered - phone.priceCash : 0;

    const newTx: PosTransaction = {
      id: invId,
      createdAt: dateStr,
      type: 'CASH_SALE',
      customerName,
      phoneModel: `${phone.model} (${phone.storage} - ${phone.grade})`,
      phoneImei: phone.imei,
      totalAmount: phone.priceCash,
      paymentMethod,
      cashTendered: paymentMethod === 'CASH' ? cashTendered : undefined,
      changeAmount: paymentMethod === 'CASH' ? change : undefined,
      cashierName: 'Rina (Kasir Utama)',
    };

    // Mark phone as out of stock
    setPhones((prev) =>
      prev.map((p) => (p.id === phone.id ? { ...p, inStock: false } : p))
    );

    setTransactions((prev) => [newTx, ...prev]);
    return newTx;
  };

  const seedAdditionalPhones = (mode: 'append' | 'replace' = 'append'): number => {
    if (mode === 'replace') {
      const combined = [...INITIAL_PHONES, ...ADDITIONAL_SEED_PHONES];
      setPhones(combined);
      showToast(`Berhasil me-reset dan mengisi ${combined.length} unit smartphone second (Grade A+, A, B)!`);
      return combined.length;
    } else {
      // Append only items that are not already present by id
      const existingIds = new Set(phones.map((p) => p.id));
      const toAdd = ADDITIONAL_SEED_PHONES.filter((p) => !existingIds.has(p.id));

      if (toAdd.length === 0) {
        // If all curated already added, generate 4 new unique ones
        const newlyGenerated = [0, 1, 2, 3].map((idx) => generateRandomUsedPhone(phones.length + idx));
        setPhones((prev) => [...newlyGenerated, ...prev]);
        showToast(`Batch kurasi sudah ada. Berhasil generate 4 unit HP second baru dengan variasi Grade A/B & BH!`);
        return 4;
      }

      setPhones((prev) => [...toAdd, ...prev]);
      showToast(`Berhasil menambahkan batch ${toAdd.length} unit HP second (iPhone & Android) ke stok katalog!`);
      return toAdd.length;
    }
  };

  const seedRandomBatch = (count: number = 5): number => {
    const generated: UsedPhone[] = [];
    for (let i = 0; i < count; i++) {
      generated.push(generateRandomUsedPhone(phones.length + i));
    }
    setPhones((prev) => [...generated, ...prev]);
    showToast(`Berhasil meng-generate ${count} unit HP second otomatis (variasi Grade A+, A, B & Battery Health)!`);
    return count;
  };

  const resetToDemoData = () => {
    localStorage.removeItem('sp_phones');
    localStorage.removeItem('sp_orders');
    localStorage.removeItem('sp_transactions');
    localStorage.removeItem('sp_salesreps');
    setPhones(INITIAL_PHONES);
    setOrders(INITIAL_ORDERS);
    setTransactions(INITIAL_TRANSACTIONS);
    setSalesReps(SALES_REPRESENTATIVES);
    setSelectedPhoneForSimulation(INITIAL_PHONES[0]);
    setActiveTab('katalog');
    showToast('Data demo berhasil di-reset ke kondisi awal.');
  };

  return (
    <AppContext.Provider
      value={{
        phones,
        orders,
        transactions,
        salesReps,
        activeTab,
        setActiveTab,
        selectedPhoneForSimulation,
        setSelectedPhoneForSimulation,
        startSimulationForPhone,
        activeSpkForModal,
        setActiveSpkForModal,
        activeReceiptForModal,
        setActiveReceiptForModal,
        toastMessage,
        showToast,
        createSalesOrder,
        updateOrderStatus,
        processDpPayment,
        processCashSale,
        seedAdditionalPhones,
        seedRandomBatch,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
