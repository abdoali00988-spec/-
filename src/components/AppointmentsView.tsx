import React, { useState } from 'react';
import { Appointment, Employee } from '../types';

interface AppointmentsViewProps {
  appointments: Appointment[];
  employees: Employee[];
  onOpenNewBooking: () => void;
  onUpdateStatus: (aptId: string, newStatus: Appointment['status']) => void;
  onConvertToSale: (apt: Appointment) => void;
  currencySymbol?: string;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments,
  employees,
  onOpenNewBooking,
  onUpdateStatus,
  onConvertToSale,
  currencySymbol = 'SAR',
}) => {
  const [selectedBarberId, setSelectedBarberId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDay, setSelectedDay] = useState<number>(24);

  const filteredAppointments = appointments.filter((apt) => {
    if (selectedBarberId !== 'all' && apt.barberId !== selectedBarberId) return false;
    if (statusFilter !== 'all' && apt.status !== statusFilter) return false;
    return true;
  });

  const confirmedCount = appointments.filter((a) => a.status === 'مؤكد' || a.status === 'جاري الآن').length;
  const pendingCount = appointments.filter((a) => a.status === 'قيد الانتظار' || a.status === 'قادم').length;
  const completedCount = appointments.filter((a) => a.status === 'مكتمل').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#F5F5F0] tracking-tight">إدارة المواعيد والجدولة</h2>
          <p className="text-sm text-[#9A9A9A] mt-0.5">
            عرض وجدولة المواعيد اليومية والقادمة ومتابعة إشغال كراسي الحلاقة
          </p>
        </div>

        <button
          onClick={onOpenNewBooking}
          className="bg-[#C5A059] hover:bg-[#D4AF37] text-black px-4 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>حجز موعد جديد</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="glass-card rounded-2xl p-4 border border-[#262626] bg-[#121212] flex flex-wrap items-center justify-between gap-4">
        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-[#161616] border border-[#2A2A2A] px-3 py-1.5 rounded-xl text-sm">
          <button
            onClick={() => setSelectedDay(Math.max(1, selectedDay - 1))}
            className="p-1 hover:bg-[#222222] rounded text-[#D4CFC9]"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
          <span className="font-bold text-[#F5F5F0] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#C5A059] text-[18px]">calendar_today</span>
            <span>الثلاثاء، {selectedDay} أكتوبر ٢٠٢٣</span>
          </span>
          <button
            onClick={() => setSelectedDay(Math.min(31, selectedDay + 1))}
            className="p-1 hover:bg-[#222222] rounded text-[#D4CFC9]"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
        </div>

        {/* Barber filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#9A9A9A]">الحلاق:</span>
          <select
            value={selectedBarberId}
            onChange={(e) => setSelectedBarberId(e.target.value)}
            className="bg-[#161616] border border-[#2A2A2A] rounded-xl px-3 py-1.5 text-xs font-bold text-[#F5F5F0] focus:outline-none focus:border-[#C5A059]"
          >
            <option value="all" className="bg-[#161616] text-[#F5F5F0]">جميع الحلاقين</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id} className="bg-[#161616] text-[#F5F5F0]">
                {e.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status filter tabs */}
        <div className="bg-[#161616] border border-[#2A2A2A] p-1 rounded-xl flex items-center gap-1 text-xs font-bold">
          {['all', 'مؤكد', 'قيد الانتظار', 'مكتمل'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                statusFilter === st ? 'bg-[#262626] text-[#F5F5F0] shadow-sm' : 'text-[#9A9A9A] hover:text-[#F5F5F0]'
              }`}
            >
              {st === 'all' ? 'الكل' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Appointments Cards List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center text-[#9A9A9A] bg-[#121212] border border-[#262626]">
              <span className="material-symbols-outlined text-5xl mb-2 opacity-30 text-[#C5A059]">
                event_busy
              </span>
              <p className="text-base font-bold text-[#F5F5F0]">لا توجد مواعيد تطابق الفلتر المحدد</p>
              <p className="text-xs text-[#9A9A9A] mt-1">انقر على "حجز موعد جديد" لإضافة حجز لهذا اليوم</p>
            </div>
          ) : (
            filteredAppointments.map((apt) => {
              const isConfirmed = apt.status === 'مؤكد' || apt.status === 'جاري الآن';
              const isPending = apt.status === 'قيد الانتظار' || apt.status === 'قادم';
              const isCompleted = apt.status === 'مكتمل';

              return (
                <div
                  key={apt.id}
                  className={`glass-card rounded-2xl p-5 border transition-all hover:border-[#333333] bg-[#121212] relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isConfirmed
                      ? 'border-r-6 border-r-[#C5A059] border-[#262626]'
                      : isPending
                      ? 'border-r-6 border-r-amber-500 border-[#262626]'
                      : 'border-r-6 border-r-emerald-500 border-[#262626] opacity-90'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Time Box */}
                    <div className="bg-[#161616] border border-[#262626] rounded-xl p-3 text-center min-w-[75px]">
                      <span className="font-mono text-base font-bold text-[#F5F5F0] block">{apt.time}</span>
                      <span className="text-[11px] font-bold text-[#9A9A9A] font-mono">{apt.period}</span>
                    </div>

                    {/* Details */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-base text-[#F5F5F0]">{apt.clientName}</h4>
                        <span
                          className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${
                            isConfirmed
                              ? 'bg-[#C5A059]/15 text-[#C5A059] border-[#C5A059]/30'
                              : isPending
                              ? 'bg-amber-950/40 text-amber-400 border-amber-800/40'
                              : 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>

                      <div className="text-xs text-[#9A9A9A] flex flex-wrap items-center gap-2">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px] text-[#C5A059]">
                            {apt.icon || 'content_cut'}
                          </span>
                          <span className="text-[#D4CFC9]">{apt.serviceName}</span>
                        </span>
                        <span className="text-[#333333]">•</span>
                        <span>مع: {apt.barberName}</span>
                        <span className="text-[#333333]">•</span>
                        <span className="font-mono text-[#9A9A9A]">{apt.clientPhone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#222222]">
                    <div className="text-right sm:text-left">
                      <span className="font-mono font-bold text-base text-[#F5F5F0]">
                        {apt.price} <span className="text-xs font-sans text-[#C5A059]">{currencySymbol}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {!isCompleted && (
                        <button
                          onClick={() => onConvertToSale(apt)}
                          className="bg-[#C5A059] text-black px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#D4AF37] transition-colors flex items-center gap-1 cursor-pointer"
                          title="تحويل إلى فاتورة بيع"
                        >
                          <span className="material-symbols-outlined text-[15px]">payments</span>
                          <span>إتمام وبيع</span>
                        </button>
                      )}

                      {isPending && (
                        <button
                          onClick={() => onUpdateStatus(apt.id, 'مؤكد')}
                          className="bg-emerald-600 text-white p-1.5 rounded-lg hover:bg-emerald-500 transition-colors cursor-pointer"
                          title="تأكيد الموعد"
                        >
                          <span className="material-symbols-outlined text-[18px]">check</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          const action = confirm('هل تريد إلغاء هذا الحجز؟');
                          if (action) onUpdateStatus(apt.id, 'ملغي');
                        }}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                        title="إلغاء الموعد"
                      >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Mini Calendar & Stats (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Calendar Widget */}
          <div className="glass-card rounded-2xl p-5 border border-[#262626] bg-[#121212] shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm text-[#F5F5F0]">أكتوبر ٢٠٢٣</h3>
              <div className="flex items-center gap-1 text-[#9A9A9A]">
                <button className="p-1 hover:bg-[#1E1E1E] rounded text-[#D4CFC9]">
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
                <button className="p-1 hover:bg-[#1E1E1E] rounded text-[#D4CFC9]">
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
              </div>
            </div>

            {/* Days header */}
            <div className="grid grid-cols-7 text-center font-mono text-[11px] text-[#9A9A9A] mb-2 font-bold">
              <span>ح</span>
              <span>ن</span>
              <span>ث</span>
              <span>ر</span>
              <span>خ</span>
              <span>ج</span>
              <span>س</span>
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs">
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
                const isCurrent = d === selectedDay;
                const hasApt = d === 24 || d === 25 || d === 26 || d === 6;
                return (
                  <button
                    key={d}
                    onClick={() => setSelectedDay(d)}
                    className={`py-1.5 rounded-lg transition-colors relative cursor-pointer ${
                      isCurrent
                        ? 'bg-[#C5A059] text-black font-bold'
                        : 'hover:bg-[#1E1E1E] text-[#D4CFC9]'
                    }`}
                  >
                    {d}
                    {hasApt && !isCurrent && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#C5A059] rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Daily Summary Stats */}
          <div className="glass-card rounded-2xl p-5 border border-[#262626] bg-[#121212] space-y-4 shadow-sm">
            <h3 className="font-bold text-sm text-[#F5F5F0]">ملخص مواعيد اليوم</h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center p-2.5 bg-[#161616] border border-[#262626] rounded-xl">
                <span className="text-[#9A9A9A]">إجمالي المواعيد</span>
                <span className="font-mono font-bold text-[#F5F5F0] text-sm">{appointments.length}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] rounded-xl">
                <span>مؤكد / جاري</span>
                <span className="font-mono font-bold text-sm">{confirmedCount}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-amber-950/30 border border-amber-800/40 text-amber-400 rounded-xl">
                <span>قيد الانتظار</span>
                <span className="font-mono font-bold text-sm">{pendingCount}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-emerald-950/30 border border-emerald-800/40 text-emerald-400 rounded-xl">
                <span>مكتمل</span>
                <span className="font-mono font-bold text-sm">{completedCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
