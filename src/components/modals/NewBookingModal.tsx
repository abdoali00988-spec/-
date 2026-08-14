import React, { useState } from 'react';
import { Client, Employee, ServiceItem, Appointment } from '../../types';

interface NewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  employees: Employee[];
  services: ServiceItem[];
  preselectedClient?: Client | null;
  onSaveAppointment: (apt: Appointment) => void;
}

export const NewBookingModal: React.FC<NewBookingModalProps> = ({
  isOpen,
  onClose,
  clients,
  employees,
  services,
  preselectedClient,
  onSaveAppointment,
}) => {
  if (!isOpen) return null;

  const [clientName, setClientName] = useState(preselectedClient?.name || (clients[0]?.name || ''));
  const [clientPhone, setClientPhone] = useState(preselectedClient?.phone || (clients[0]?.phone || ''));
  const [barberId, setBarberId] = useState(employees[0]?.id || 'emp-1');
  const [serviceName, setServiceName] = useState(services[0]?.name || 'حلاقة شعر + ذقن');
  const [time, setTime] = useState('11:00');
  const [period, setPeriod] = useState<'ص' | 'م' | 'AM' | 'PM'>('ص');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  const selectedBarber = employees.find((e) => e.id === barberId) || employees[0];
  const selectedService = services.find((s) => s.name === serviceName) || services[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    const newApt: Appointment = {
      id: 'apt-' + Date.now(),
      clientName,
      clientPhone,
      barberId: selectedBarber.id,
      barberName: selectedBarber.name,
      serviceName: selectedService ? selectedService.name : serviceName,
      time,
      period,
      date,
      status: 'مؤكد',
      price: selectedService ? selectedService.price : 80,
      icon: selectedService?.icon || 'content_cut',
    };

    onSaveAppointment(newApt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#141414] rounded-2xl p-6 w-full max-w-lg border border-[#2A2A2A] shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center mb-5 border-b border-[#262626] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#C5A059] text-[24px]">calendar_add_on</span>
            <h3 className="text-lg font-bold text-[#F5F5F0]">حجز موعد جديد</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#222222] rounded-lg text-[#9A9A9A] hover:text-[#F5F5F0] transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Client selector or manual input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#9A9A9A] mb-1">اسم العميل*</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="اسم العميل..."
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F0] rounded-xl text-sm focus:outline-none focus:border-[#C5A059]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#9A9A9A] mb-1">رقم الهاتف</label>
              <input
                type="text"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="0500000000"
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F0] rounded-xl text-sm font-mono focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          {/* Barber Selection */}
          <div>
            <label className="block text-xs font-bold text-[#9A9A9A] mb-1">الحلاق المطلوب*</label>
            <select
              value={barberId}
              onChange={(e) => setBarberId(e.target.value)}
              className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F0] rounded-xl text-sm focus:outline-none focus:border-[#C5A059]"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id} className="bg-[#141414] text-[#F5F5F0]">
                  {emp.name} ({emp.role})
                </option>
              ))}
            </select>
          </div>

          {/* Service Selection */}
          <div>
            <label className="block text-xs font-bold text-[#9A9A9A] mb-1">الخدمة المطلوبة*</label>
            <select
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F0] rounded-xl text-sm focus:outline-none focus:border-[#C5A059]"
            >
              {services.map((srv) => (
                <option key={srv.id} value={srv.name} className="bg-[#141414] text-[#F5F5F0]">
                  {srv.name} - ({srv.price} ج.م/SAR)
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#9A9A9A] mb-1">التاريخ*</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F0] rounded-xl text-sm focus:outline-none focus:border-[#C5A059]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#9A9A9A] mb-1">الوقت*</label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F0] rounded-xl text-sm font-mono focus:outline-none focus:border-[#C5A059]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#9A9A9A] mb-1">الفترة</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F0] rounded-xl text-sm focus:outline-none focus:border-[#C5A059]"
              >
                <option value="ص" className="bg-[#141414] text-[#F5F5F0]">صباحاً (ص)</option>
                <option value="م" className="bg-[#141414] text-[#F5F5F0]">مساءً (م)</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-3 border-t border-[#262626]">
            <button
              type="submit"
              className="flex-1 bg-[#C5A059] hover:bg-[#D4AF37] text-black py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer shadow-md"
            >
              تأكيد وحفظ الموعد
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 bg-[#1E1E1E] text-[#D4CFC9] hover:text-white py-2.5 rounded-xl font-bold text-sm hover:bg-[#282828] transition-colors border border-[#2A2A2A] cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
