import React from 'react';
import { TabType } from '../types';

interface SideNavBarProps {
  activeTab: TabType;
  onNavigate: (tab: TabType) => void;
  onOpenNewBooking: () => void;
}

export const SideNavBar: React.FC<SideNavBarProps> = ({
  activeTab,
  onNavigate,
  onOpenNewBooking,
}) => {
  const navItems: { id: TabType; label: string; icon: string }[] = [
    { id: 'overview', label: 'لوحة القيادة', icon: 'dashboard' },
    { id: 'appointments', label: 'المواعيد', icon: 'calendar_month' },
    { id: 'clients', label: 'العملاء', icon: 'group' },
    { id: 'services', label: 'الخدمات', icon: 'content_cut' },
    { id: 'addons', label: 'الإضافات', icon: 'add_box' },
    { id: 'packages', label: 'الباقات', icon: 'inventory_2' },
    { id: 'groom_packages', label: 'باقات التجهيز', icon: 'dry_cleaning' },
    { id: 'sales', label: 'المبيعات', icon: 'payments' },
    { id: 'staff', label: 'الموظفون', icon: 'badge' },
    { id: 'expenses', label: 'المصاريف', icon: 'account_balance_wallet' },
    { id: 'reports', label: 'التقارير', icon: 'analytics' },
    { id: 'settings', label: 'الإعدادات', icon: 'settings' },
  ];

  return (
    <aside className="w-[280px] h-screen fixed right-0 top-0 bg-[#0C0C0C] shadow-2xl border-l border-[#262626] flex flex-col z-50 select-none">
      {/* Salon Brand Header */}
      <div className="p-6 border-b border-[#262626]">
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-xl bg-[#C5A059] text-black flex items-center justify-center font-bold text-xl shadow-lg">
            ص
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#F5F5F0] leading-tight">صالون النخبة</h2>
            <p className="text-xs text-[#9A9A9A] mt-0.5">إدارة الفرع الرئيسي</p>
          </div>
        </div>

        {/* Quick New Booking Button */}
        <button
          onClick={onOpenNewBooking}
          className="w-full bg-[#C5A059] text-black py-3 px-4 rounded-xl font-bold text-sm hover:bg-[#D4AF37] transition-all active:scale-[0.98] shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>حجز جديد</span>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-right cursor-pointer ${
                isActive
                  ? 'text-[#C5A059] font-bold border-r-4 border-[#C5A059] bg-[#C5A059]/15'
                  : 'text-[#9A9A9A] hover:text-[#F5F5F0] hover:bg-[#161616]'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[20px] ${isActive ? 'text-[#C5A059]' : 'text-[#76777d]'}`}
                data-fill={isActive ? 'true' : 'false'}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer / Support */}
      <div className="p-3 border-t border-[#262626] mt-auto bg-[#080808]/60">
        <button
          onClick={() => alert('خدمة الدعم الفني لصالون النخبة متاحة 24/7 عبر الهاتف: 920000000 أو عبر الواتساب')}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-[#9A9A9A] hover:text-[#F5F5F0] hover:bg-[#161616] rounded-xl text-sm transition-colors text-right cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">support_agent</span>
          <span>الدعم الفني</span>
        </button>
      </div>
    </aside>
  );
};
