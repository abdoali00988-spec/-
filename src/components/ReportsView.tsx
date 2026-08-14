import React, { useState } from 'react';
import { Employee, SaleInvoice } from '../types';

interface ReportsViewProps {
  employees: Employee[];
  invoices: SaleInvoice[];
  currencySymbol?: string;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  employees,
  invoices,
  currencySymbol = 'EGP',
}) => {
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('week');

  const exportCSV = () => {
    const headers = ['رقم الفاتورة', 'العميل', 'الحلاق', 'الإجمالي', 'طريقة الدفع', 'التاريخ'];
    const rows = invoices.map((i) => [
      i.invoiceNumber,
      i.clientName,
      i.barberName,
      i.total,
      i.paymentMethod,
      i.date,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `تقرير_مبيعات_صالون_النخبة_${period}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200" id="reports-container">
      {/* Top Header & Period Selector */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#F5F5F0] tracking-tight">التقارير والإحصائيات</h2>
          <p className="text-sm text-[#9A9A9A] mt-0.5">
            تحليل المبيعات، المصروفات، وأداء الحلاقين والخدمات بالتفصيل
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Period selector tabs */}
          <div className="bg-[#161616] border border-[#2A2A2A] p-1 rounded-xl flex items-center gap-1 text-xs font-bold">
            <button
              onClick={() => setPeriod('today')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                period === 'today' ? 'bg-[#262626] text-[#F5F5F0] shadow-sm' : 'text-[#9A9A9A] hover:text-[#F5F5F0]'
              }`}
            >
              اليوم
            </button>
            <button
              onClick={() => setPeriod('week')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                period === 'week' ? 'bg-[#C5A059] text-black font-bold shadow-sm' : 'text-[#C5A059] hover:bg-[#202020]'
              }`}
            >
              هذا الأسبوع
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                period === 'month' ? 'bg-[#262626] text-[#F5F5F0] shadow-sm' : 'text-[#9A9A9A] hover:text-[#F5F5F0]'
              }`}
            >
              هذا الشهر
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="bg-[#1A1A1A] border border-[#2A2A2A] text-[#D4CFC9] hover:text-[#F5F5F0] px-3.5 py-2 rounded-xl font-bold text-xs hover:bg-[#222222] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>تصدير CSV</span>
            </button>
            <button
              onClick={printReport}
              className="bg-[#C5A059] text-black px-3.5 py-2 rounded-xl font-bold text-xs hover:bg-[#D4AF37] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>طباعة التقرير</span>
            </button>
          </div>
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Sales */}
        <div className="glass-card rounded-2xl p-6 border border-[#262626] bg-[#121212]">
          <div className="flex justify-between items-start mb-3">
            <span className="font-mono text-xs text-[#9A9A9A] uppercase tracking-wider">إجمالي المبيعات</span>
            <div className="w-10 h-10 rounded-full bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
              <span className="material-symbols-outlined text-[22px]">payments</span>
            </div>
          </div>
          <div className="font-mono text-3xl font-bold text-[#F5F5F0] mb-2">
            45,200 <span className="text-sm font-sans text-[#C5A059]">{currencySymbol}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>+8.4% مقارنة بالفترة السابقة</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="glass-card rounded-2xl p-6 border border-[#262626] bg-[#121212]">
          <div className="flex justify-between items-start mb-3">
            <span className="font-mono text-xs text-[#9A9A9A] uppercase tracking-wider">إجمالي المصروفات</span>
            <div className="w-10 h-10 rounded-full bg-amber-950/40 border border-amber-800/40 flex items-center justify-center text-amber-400">
              <span className="material-symbols-outlined text-[22px]">receipt_long</span>
            </div>
          </div>
          <div className="font-mono text-3xl font-bold text-[#F5F5F0] mb-2">
            8,500 <span className="text-sm font-sans text-[#C5A059]">{currencySymbol}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
            <span className="material-symbols-outlined text-sm">trending_down</span>
            <span>-2.1% انخفاض في الهدر</span>
          </div>
        </div>

        {/* Net Profit */}
        <div className="glass-card rounded-2xl p-6 border-2 border-[#C5A059] bg-[#161616] shadow-lg shadow-[#C5A059]/5">
          <div className="flex justify-between items-start mb-3">
            <span className="font-mono text-xs text-[#C5A059] uppercase tracking-wider font-bold">
              صافي الربح
            </span>
            <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
              <span className="material-symbols-outlined text-[22px]">account_balance</span>
            </div>
          </div>
          <div className="font-mono text-3xl font-bold text-[#F5F5F0] mb-2">
            36,700 <span className="text-sm font-sans text-[#C5A059]">{currencySymbol}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>+11.2% نمو الأرباح الصافية</span>
          </div>
        </div>
      </div>

      {/* Top Rankings Grid: Services & Packages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Services */}
        <div className="glass-card rounded-2xl p-6 border border-[#262626] bg-[#121212]">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-base text-[#F5F5F0] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#C5A059] text-[20px]">content_cut</span>
              <span>أكثر الخدمات طلباً</span>
            </h3>
            <span className="text-xs text-[#9A9A9A] font-mono">حسب الإيراد</span>
          </div>

          <div className="space-y-3">
            {[
              { rank: 1, name: 'حلاقة شعر + ذقن VIP', count: 340, revenue: 27200, percent: 85 },
              { rank: 2, name: 'تنظيف بشرة عميق', count: 120, revenue: 18000, percent: 65 },
              { rank: 3, name: 'حلاقة شعر عادية', count: 210, revenue: 10500, percent: 45 },
              { rank: 4, name: 'صبغة شعر ولحية', count: 85, revenue: 10200, percent: 40 },
            ].map((s) => (
              <div key={s.rank} className="p-3 bg-[#161616] rounded-xl border border-[#262626]">
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#C5A059] text-black font-bold text-xs flex items-center justify-center font-mono">
                      {s.rank}
                    </span>
                    <span className="font-bold text-sm text-[#F5F5F0]">{s.name}</span>
                  </div>
                  <span className="font-mono font-bold text-sm text-[#F5F5F0]">
                    {s.revenue.toLocaleString()} {currencySymbol}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#9A9A9A] mb-1">
                  <span>{s.count} عملية حلاقة</span>
                  <span>{s.percent}% من الإيراد</span>
                </div>
                <div className="w-full bg-[#262626] h-1.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${s.percent}%` }}
                    className="bg-[#C5A059] h-full rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Packages */}
        <div className="glass-card rounded-2xl p-6 border border-[#262626] bg-[#121212]">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-base text-[#F5F5F0] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#C5A059] text-[20px]">inventory_2</span>
              <span>أكثر الباقات مبيعاً</span>
            </h3>
            <span className="text-xs text-[#9A9A9A] font-mono">عرسان ومناسبات</span>
          </div>

          <div className="space-y-3">
            {[
              { rank: 1, name: 'باقة العريس المميزة', count: 24, revenue: 16800, percent: 90 },
              { rank: 2, name: 'باقة النخبة الأسبوعية', count: 45, revenue: 12600, percent: 70 },
              { rank: 3, name: 'باقة العناية المتكاملة', count: 30, revenue: 10500, percent: 55 },
              { rank: 4, name: 'الباقة الملكية VIP', count: 6, revenue: 7200, percent: 35 },
            ].map((p) => (
              <div key={p.rank} className="p-3 bg-[#161616] rounded-xl border border-[#262626]">
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#C5A059] text-black font-bold text-xs flex items-center justify-center font-mono">
                      {p.rank}
                    </span>
                    <span className="font-bold text-sm text-[#F5F5F0]">{p.name}</span>
                  </div>
                  <span className="font-mono font-bold text-sm text-[#F5F5F0]">
                    {p.revenue.toLocaleString()} {currencySymbol}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#9A9A9A] mb-1">
                  <span>{p.count} باقة مباعة</span>
                  <span>{p.percent}% من المبيعات</span>
                </div>
                <div className="w-full bg-[#262626] h-1.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${p.percent}%` }}
                    className="bg-[#C5A059] h-full rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Barber Performance Ranking Table */}
      <div className="glass-card rounded-2xl border border-[#262626] overflow-hidden bg-[#121212]">
        <div className="p-5 border-b border-[#262626] bg-[#161616] flex items-center justify-between">
          <h3 className="font-bold text-base text-[#F5F5F0] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#C5A059] text-[20px]">badge</span>
            <span>تقرير أداء الحلاقين وفريق العمل</span>
          </h3>
          <span className="text-xs text-[#9A9A9A]">مرتب حسب أعلى الإيرادات المحققة</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-[#161616] text-xs font-mono text-[#9A9A9A] border-b border-[#262626]">
              <tr>
                <th className="py-3.5 px-5 font-semibold">الحلاق</th>
                <th className="py-3.5 px-5 font-semibold">الدور</th>
                <th className="py-3.5 px-5 font-semibold">الخدمات المنفذة</th>
                <th className="py-3.5 px-5 font-semibold">إجمالي المبيعات</th>
                <th className="py-3.5 px-5 font-semibold">العمولة التقديرية (10%)</th>
                <th className="py-3.5 px-5 font-semibold">التقييم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222] bg-[#121212]">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-[#181818] transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-[#2A2A2A] bg-[#1A1A1A] flex-shrink-0">
                        <img src={emp.avatarUrl} alt={emp.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-bold text-[#F5F5F0]">{emp.name}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-5 font-mono text-xs text-[#D4CFC9]">{emp.role}</td>

                  <td className="py-3.5 px-5 font-mono font-semibold text-[#F5F5F0]">
                    {emp.servicesCount} خدمة
                  </td>

                  <td className="py-3.5 px-5 font-mono font-bold text-[#F5F5F0]">
                    {emp.totalSales.toLocaleString()} {currencySymbol}
                  </td>

                  <td className="py-3.5 px-5 font-mono font-bold text-emerald-400">
                    {(emp.totalSales * 0.1).toLocaleString()} {currencySymbol}
                  </td>

                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-1 font-bold text-xs text-[#C5A059] bg-[#C5A059]/10 border border-[#C5A059]/30 px-2.5 py-1 rounded-lg w-fit">
                      <span className="material-symbols-outlined text-[15px] text-[#C5A059]">star</span>
                      <span>{emp.rating}</span>
                    </div>
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
