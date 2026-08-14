import React, { useState } from 'react';
import { Client, Employee } from '../../types';

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  onSaveClient: (client: Client) => void;
  editingClient?: Client | null;
}

export const NewClientModal: React.FC<NewClientModalProps> = ({
  isOpen,
  onClose,
  employees,
  onSaveClient,
  editingClient,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(editingClient?.name || '');
  const [phone, setPhone] = useState(editingClient?.phone || '');
  const [isVip, setIsVip] = useState(editingClient?.isVip || false);
  const [barberId, setBarberId] = useState(editingClient?.preferredBarberId || employees[0]?.id || 'emp-1');

  const selectedBarber = employees.find((e) => e.id === barberId) || employees[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const words = name.trim().split(' ');
    const initials = words.length >= 2 ? words[0][0] + ' ' + words[1][0] : words[0][0] || 'ع';

    const clientData: Client = {
      id: editingClient ? editingClient.id : 'c-' + Date.now(),
      name,
      phone,
      initials,
      registeredDate: editingClient ? editingClient.registeredDate : new Date().toISOString().split('T')[0],
      lastVisit: editingClient ? editingClient.lastVisit : new Date().toISOString().split('T')[0],
      status: editingClient ? editingClient.status : 'نشط',
      isVip,
      totalSpent: editingClient ? editingClient.totalSpent : 0,
      visitsCount: editingClient ? editingClient.visitsCount : 0,
      preferredBarberId: selectedBarber.id,
      preferredBarberName: selectedBarber.name,
      preferredBarberRole: selectedBarber.role,
      preferredBarberImage: selectedBarber.avatarUrl,
      visitHistory: editingClient ? editingClient.visitHistory : [],
    };

    onSaveClient(clientData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#141414] rounded-2xl p-6 w-full max-w-md border border-[#2A2A2A] shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center mb-5 border-b border-[#262626] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#C5A059] text-[24px]">person_add</span>
            <h3 className="text-lg font-bold text-[#F5F5F0]">
              {editingClient ? 'تعديل بيانات العميل' : 'إضافة عميل جديد'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#222222] rounded-lg text-[#9A9A9A] hover:text-[#F5F5F0] transition-colors cursor-pointer">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#9A9A9A] mb-1">اسم العميل*</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: حسام علي"
              className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F0] rounded-xl text-sm focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#9A9A9A] mb-1">رقم الهاتف*</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0501234567"
              className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F0] rounded-xl text-sm font-mono focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#9A9A9A] mb-1">الحلاق المفضل</label>
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

          <div className="p-3.5 bg-[#181818] border border-[#262626] rounded-xl flex items-center justify-between">
            <div>
              <span className="font-bold text-xs text-[#F5F5F0] block">عميل مميز (VIP)</span>
              <span className="text-[11px] text-[#9A9A9A]">منح العميل شارة VIP ومعاملة استثنائية</span>
            </div>
            <input
              type="checkbox"
              checked={isVip}
              onChange={(e) => setIsVip(e.target.checked)}
              className="w-5 h-5 accent-[#C5A059] rounded"
            />
          </div>

          <div className="flex gap-2 pt-3 border-t border-[#262626]">
            <button
              type="submit"
              className="flex-1 bg-[#C5A059] hover:bg-[#D4AF37] text-black py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer shadow-md"
            >
              {editingClient ? 'حفظ التعديلات' : 'إضافة العميل'}
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
