import React from 'react';
import { Appointment, SaleInvoice, TabType } from '../types';

interface DashboardViewProps {
  appointments: Appointment[];
  invoices: SaleInvoice[];
  clientsCount: number;
  servicesCount: number;
  onNavigate: (tab: TabType) => void;
  onSelectInvoice: (inv: SaleInvoice) => void;
  currencySymbol?: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  appointments,
  invoices,
  clientsCount,
  servicesCount,
  onNavigate,
  onSelectInvoice,
  currencySymbol = 'EGP',
}) => {
  // Calculations
  const totalSales = invoices.reduce((acc, inv) => acc + (inv.status !== 'ملغي' ? inv.total : 0), 0);
  const totalExpenses = 500;
  const netIncome = Math.max(0, totalSales - totalExpenses);

  const weeklyData = [
    { day: 'الأحد', height: '40%', amount: '1,200', active: false },
    { day: 'الاثنين', height: '65%', amount: '1,800', active: false },
    { day: 'الثلاثاء', height: '50%', amount: '1,450', active: false },
    { day: 'الأربعاء', height: '90%', amount: '2,600', active: false },
    { day: 'الخميس', height: '70%', amount: '2,100', active: true },
    { day: 'الجمعة', height: '100%', amount: '3,200', active: false },
    { day: 'السبت', height: '35%', amount: '950', active: false },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F0] tracking-tight">نظرة عامة</h2>
          <p className="text-sm sm:text-base text-[#9A9A9A] mt-1">ملخص أداء الصالون والمؤشرات التشغيلية لهذا اليوم</p>
        </div>
        <div className="text-sm font-medium text-[#D4CFC9] bg-[#161616] border border-[#262626] py-2 px-4 rounded-xl flex items-center gap-2 shadow-sm">
          <span className="material-symbols-outlined text-[#C5A059] text-[20px]">event</span>
          <span>٢٤ أكتوبر ٢٠٢٣</span>
        </div>
      </div>

      {/* Bento Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Net Income (Large) */}
        <div className="glass-card rounded-2xl p-6 col-span-1 md:col-span-2 relative overflow-hidden bg-gradient-to-br from-[#181818] to-[#0F0F0F] border border-[#2A2A2A]">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="font-mono text-xs text-[#9A9A9A] uppercase tracking-wider block mb-1">
                  صافي الدخل
                </span>
                <span className="font-mono text-3xl sm:text-4xl font-bold text-[#F5F5F0] block mt-2">
                  {netIncome.toLocaleString()} <span className="text-lg text-[#C5A059] font-sans">{currencySymbol}</span>
                </span>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
                <span className="material-symbols-outlined text-[26px]">account_balance</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs sm:text-sm">
              <span className="flex items-center text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-2.5 py-1 rounded-md font-bold font-mono">
                <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
                +12.5%
              </span>
              <span className="text-[#9A9A9A]">مقارنة بالأمس</span>
            </div>
          </div>
        </div>

        {/* Sales */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between border border-[#262626] bg-[#141414]">
          <div className="flex justify-between items-start">
            <span className="font-mono text-xs text-[#9A9A9A] uppercase tracking-wider">المبيعات</span>
            <span className="material-symbols-outlined text-[#C5A059]">payments</span>
          </div>
          <div className="mt-4">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-[#F5F5F0] block">
              {totalSales.toLocaleString()} <span className="text-sm text-[#C5A059] font-sans">{currencySymbol}</span>
            </span>
          </div>
        </div>

        {/* Expenses */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between border border-[#262626] bg-[#141414]">
          <div className="flex justify-between items-start">
            <span className="font-mono text-xs text-[#9A9A9A] uppercase tracking-wider">المصاريف</span>
            <span className="material-symbols-outlined text-[#9A9A9A]">receipt_long</span>
          </div>
          <div className="mt-4">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-[#F5F5F0] block">
              {totalExpenses.toLocaleString()} <span className="text-sm text-[#9A9A9A] font-sans">{currencySymbol}</span>
            </span>
          </div>
        </div>

        {/* Small Stats Row */}
        <div className="glass-card rounded-2xl p-6 flex items-center justify-between col-span-1 md:col-span-2 lg:col-span-4 bg-[#121212] border border-[#262626]">
          <div className="flex-1 border-l border-[#262626] px-4 sm:px-6 last:border-0 text-center">
            <span className="font-mono text-xs text-[#9A9A9A] block mb-1">العملاء المسجلين</span>
            <span className="font-mono text-xl sm:text-2xl font-bold text-[#F5F5F0] block">{clientsCount}</span>
          </div>
          <div className="flex-1 border-l border-[#262626] px-4 sm:px-6 last:border-0 text-center">
            <span className="font-mono text-xs text-[#9A9A9A] block mb-1">الخدمات والباقات</span>
            <span className="font-mono text-xl sm:text-2xl font-bold text-[#F5F5F0] block">{servicesCount}</span>
          </div>
          <div className="flex-1 px-4 sm:px-6 text-center">
            <span className="font-mono text-xs text-[#9A9A9A] block mb-1">مواعيد اليوم</span>
            <span className="font-mono text-xl sm:text-2xl font-bold text-[#F5F5F0] block">{appointments.length}</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Appointments & Charts/Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Appointments */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-1 flex flex-col h-full border border-[#262626] bg-[#121212]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[#F5F5F0]">مواعيد اليوم</h3>
            <button
              onClick={() => onNavigate('appointments')}
              className="text-[#C5A059] hover:underline text-sm font-medium cursor-pointer"
            >
              عرض الكل
            </button>
          </div>

          <div className="space-y-3.5 flex-1 overflow-y-auto pr-1">
            {appointments.slice(0, 4).map((apt) => {
              const isActive = apt.status === 'جاري الآن' || apt.status === 'مؤكد';
              const isPending = apt.status === 'قيد الانتظار' || apt.status === 'قادم';
              const isDone = apt.status === 'مكتمل';

              return (
                <div
                  key={apt.id}
                  className={`p-4 rounded-xl border border-[#262626] bg-[#161616] relative overflow-hidden pl-4 pr-5 transition-all hover:border-[#333333] ${
                    isActive
                      ? 'border-r-4 border-r-[#C5A059]'
                      : isPending
                      ? 'border-r-4 border-r-amber-500'
                      : 'border-r-4 border-r-emerald-500 opacity-80'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`font-mono font-bold text-sm text-[#F5F5F0] ${isDone ? 'line-through opacity-70' : ''}`}>
                      {apt.time} {apt.period}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                        isActive
                          ? 'bg-[#C5A059]/15 text-[#C5A059] border-[#C5A059]/30'
                          : isPending
                          ? 'bg-amber-950/40 text-amber-400 border-amber-800/40'
                          : 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                  <div className="font-bold text-sm text-[#F5F5F0] mb-1">{apt.clientName}</div>
                  <div className="text-xs text-[#9A9A9A] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#C5A059]">
                      {apt.icon || 'content_cut'}
                    </span>
                    <span>{apt.serviceName}</span>
                    <span className="text-[#666666] mx-1">•</span>
                    <span>مع: {apt.barberName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Sales & Weekly Chart */}
        <div className="lg:col-span-2 space-y-8">
          {/* Weekly Sales Chart */}
          <div className="glass-card rounded-2xl p-6 border border-[#262626] bg-[#121212]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[#F5F5F0]">المبيعات الأسبوعية</h3>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#C5A059]" />
                <span className="text-xs text-[#9A9A9A]">هذا الأسبوع</span>
              </div>
            </div>

            <div className="h-44 w-full flex items-end justify-between px-3 sm:px-6 pb-2 border-b border-[#262626] relative gap-2 sm:gap-4">
              {weeklyData.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div
                    style={{ height: item.height }}
                    className={`w-full max-w-[42px] rounded-t-md transition-all duration-300 relative group-hover:opacity-90 ${
                      item.active ? 'bg-[#C5A059]' : 'bg-[#C5A059]/30 hover:bg-[#C5A059]/60'
                    }`}
                  >
                    {/* Tooltip */}
                    <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0C0C0C] border border-[#333333] text-[#F5F5F0] text-[11px] font-mono py-1 px-2 rounded-lg shadow-xl whitespace-nowrap z-20">
                      {item.amount} {currencySymbol}
                    </div>
                  </div>
                  <span className="text-xs text-[#9A9A9A] font-medium">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Sales List */}
          <div className="glass-card rounded-2xl overflow-hidden border border-[#262626] bg-[#121212]">
            <div className="p-5 border-b border-[#262626] flex justify-between items-center bg-[#161616]">
              <h3 className="text-lg font-bold text-[#F5F5F0]">أحدث المبيعات</h3>
              <button
                onClick={() => onNavigate('sales')}
                className="text-[#C5A059] hover:underline text-sm font-medium cursor-pointer"
              >
                عرض الكل
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-[#161616] font-mono text-xs text-[#9A9A9A] border-b border-[#262626]">
                  <tr>
                    <th className="py-3.5 px-5 font-semibold">رقم الفاتورة</th>
                    <th className="py-3.5 px-5 font-semibold">العميل</th>
                    <th className="py-3.5 px-5 font-semibold">الحلاق</th>
                    <th className="py-3.5 px-5 font-semibold">الإجمالي</th>
                    <th className="py-3.5 px-5 font-semibold">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222222] bg-[#121212]">
                  {invoices.slice(0, 4).map((inv) => (
                    <tr
                      key={inv.id}
                      onClick={() => onSelectInvoice(inv)}
                      className="hover:bg-[#181818] transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-5 font-mono font-bold text-[#F5F5F0]">#{inv.invoiceNumber}</td>
                      <td className="py-3.5 px-5 text-[#F5F5F0] font-medium">{inv.clientName}</td>
                      <td className="py-3.5 px-5 text-[#9A9A9A]">{inv.barberName}</td>
                      <td className="py-3.5 px-5 font-mono font-bold text-[#F5F5F0]">
                        {inv.total} <span className="text-xs font-sans text-[#C5A059]">{currencySymbol}</span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                            inv.status === 'مدفوع'
                              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                              : inv.status === 'آجل'
                              ? 'bg-amber-950/40 text-amber-400 border-amber-800/40'
                              : 'bg-[#222222] text-[#9A9A9A] border-[#333333]'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
