import React, { useState } from 'react';
import { Employee } from '../../types';

interface NewStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveStaff: (employee: Employee) => void;
  editingStaff?: Employee | null;
}

export const NewStaffModal: React.FC<NewStaffModalProps> = ({
  isOpen,
  onClose,
  onSaveStaff,
  editingStaff,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(editingStaff?.name || '');
  const [role, setRole] = useState<Employee['role']>(editingStaff?.role || 'Barber');
  const [phone, setPhone] = useState(editingStaff?.phone || '');
  const [rating, setRating] = useState<number>(editingStaff?.rating || 4.8);
  const [status, setStatus] = useState<Employee['status']>(editingStaff?.status || 'نشط');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const defaultAvatar =
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBaOr8lAXw0GVRrxi6Kv5iC1vSSHkdoIuz0eyxXGd1YxNrP-C3u0gdPSJSl6VH1mfS8EWuiDRkA2HJjUjA4saCb0ZllpJ0nto4YOtM5uGYQ_rmFNWhiStRBBIwrwL3ZF6EAARIJKlDXHDoXtlGur8K--nPpzv2KAwAkHTqgNTDes8bZ5slfGIlupMYPqS9cBAwt3ltdfpRgVds-nq8tUCbWUawkaCYovwx1HLIqJ825rEijd3_pmTYP3g';

    const empData: Employee = {
      id: editingStaff ? editingStaff.id : 'emp-' + Date.now(),
      name,
      role,
      phone,
      status,
      rating,
      clientsCount: editingStaff ? editingStaff.clientsCount : 0,
      servicesCount: editingStaff ? editingStaff.servicesCount : 0,
      totalSales: editingStaff ? editingStaff.totalSales : 0,
      avatarUrl: editingStaff ? editingStaff.avatarUrl : defaultAvatar,
      permissions: editingStaff
        ? editingStaff.permissions
        : {
            customers: { enabled: true, view: true, add: true, edit: false, delete: false },
            sales: { enabled: true, view: true, add: true, edit: false, cancelInvoice: false },
            staff: { enabled: false, view: false, manage: false },
          },
    };

    onSaveStaff(empData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#141414] rounded-2xl p-6 w-full max-w-md border border-[#2A2A2A] shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center mb-5 border-b border-[#262626] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#C5A059] text-[24px]">badge</span>
            <h3 className="text-lg font-bold text-[#F5F5F0]">
              {editingStaff ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#222222] rounded-lg text-[#9A9A9A] hover:text-[#F5F5F0] transition-colors cursor-pointer">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#9A9A9A] mb-1">الاسم الكامل*</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: رامي عبد العزيز"
              className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F0] rounded-xl text-sm focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#9A9A9A] mb-1">الدور الوظيفي*</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F0] rounded-xl text-sm focus:outline-none focus:border-[#C5A059]"
              >
                <option value="Barber" className="bg-[#141414] text-[#F5F5F0]">حلاق (Barber)</option>
                <option value="Manager" className="bg-[#141414] text-[#F5F5F0]">مدير (Manager)</option>
                <option value="Cashier" className="bg-[#141414] text-[#F5F5F0]">كاشير (Cashier)</option>
                <option value="أخصائي شعر ولحية" className="bg-[#141414] text-[#F5F5F0]">أخصائي شعر ولحية</option>
                <option value="أخصائي عناية" className="bg-[#141414] text-[#F5F5F0]">أخصائي عناية</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#9A9A9A] mb-1">الحالة</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F0] rounded-xl text-sm focus:outline-none focus:border-[#C5A059]"
              >
                <option value="نشط" className="bg-[#141414] text-[#F5F5F0]">نشط</option>
                <option value="إجازة" className="bg-[#141414] text-[#F5F5F0]">إجازة</option>
                <option value="غير نشط" className="bg-[#141414] text-[#F5F5F0]">غير نشط</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#9A9A9A] mb-1">رقم الهاتف</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0500000000"
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F0] rounded-xl text-sm font-mono focus:outline-none focus:border-[#C5A059]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#9A9A9A] mb-1">التقييم الأولي (من 5)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F0] rounded-xl text-sm font-mono focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-3 border-t border-[#262626]">
            <button
              type="submit"
              className="flex-1 bg-[#C5A059] hover:bg-[#D4AF37] text-black py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer shadow-md"
            >
              {editingStaff ? 'حفظ التعديلات' : 'إضافة الموظف'}
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
