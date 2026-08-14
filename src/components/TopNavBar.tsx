import React, { useState } from 'react';
import { TabType, NotificationItem } from '../types';

interface TopNavBarProps {
  activeTab: TabType;
  onNavigate: (tab: TabType) => void;
  onOpenNewSale: () => void;
  notifications: NotificationItem[];
  onMarkNotificationsRead: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  activeTab,
  onNavigate,
  onOpenNewSale,
  notifications,
  onMarkNotificationsRead,
  searchQuery,
  onSearchChange,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <nav className="h-16 w-full fixed top-0 z-40 bg-[#0C0C0C]/95 backdrop-blur-md border-b border-[#262626] flex justify-between items-center px-4 md:px-6 md:pr-[296px]">
      {/* Title / Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <h1 
          onClick={() => onNavigate('overview')}
          className="text-lg md:text-xl font-bold text-[#F5F5F0] tracking-tight cursor-pointer hover:text-[#C5A059] transition-colors whitespace-nowrap"
        >
          نظام إدارة الحلاقة
        </h1>

        <div className="hidden sm:flex relative flex-1 max-w-sm">
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#76777d] text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="البحث برقم الهاتف أو الاسم أو الخدمة..."
            className="w-full pl-3 pr-10 py-1.5 bg-[#141414] border border-[#2A2A2A] rounded-lg text-sm text-[#F5F5F0] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-colors placeholder:text-[#666666]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[#76777d] hover:text-[#F5F5F0]"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Mobile Search button */}
        <div className="sm:hidden relative">
          <button 
            onClick={() => {
              const q = prompt('ابحث في النظام:');
              if (q !== null) onSearchChange(q);
            }}
            className="p-2 text-[#9A9A9A] hover:text-[#F5F5F0] hover:bg-[#1A1A1A] rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) onMarkNotificationsRead();
            }}
            className="p-2 text-[#9A9A9A] hover:text-[#F5F5F0] hover:bg-[#1A1A1A] rounded-full transition-colors relative"
            title="الإشعارات"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C5A059] rounded-full ring-2 ring-[#0C0C0C]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute left-0 mt-2 w-80 bg-[#121212] rounded-xl shadow-2xl border border-[#2A2A2A] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-[#262626] flex items-center justify-between">
                <span className="font-bold text-sm text-[#F5F5F0]">الإشعارات والتنبيهات</span>
                <span className="text-xs text-[#C5A059] bg-[#C5A059]/15 border border-[#C5A059]/30 px-2 py-0.5 rounded-full font-mono">
                  {notifications.length} جديد
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-[#222222]">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-3 hover:bg-[#181818] transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs text-[#F5F5F0]">{notif.title}</span>
                      <span className="text-[10px] text-[#76777d]">{notif.time}</span>
                    </div>
                    <p className="text-xs text-[#9A9A9A]">{notif.description}</p>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-[#262626] text-center">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-[#C5A059] font-bold hover:underline"
                >
                  إغلاق
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick sale button */}
        <button
          onClick={onOpenNewSale}
          className="bg-[#C5A059] text-black px-3.5 md:px-5 py-2 rounded-lg font-bold text-sm hover:bg-[#D4AF37] transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">payments</span>
          <span>بيع جديد</span>
        </button>

        {/* Profile Avatar */}
        <div 
          onClick={() => onNavigate('staff')}
          className="w-9 h-9 rounded-full overflow-hidden border border-[#2A2A2A] bg-[#1A1A1A] cursor-pointer hover:ring-2 hover:ring-[#C5A059] transition-all flex-shrink-0"
          title="الملف الشخصي / الموظفون"
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSRSiwvuW9KoyQfxo4F-yRHWdAPy_gGA1dK-UjUFRD5lL1o5vXwAsP-vj2HJcrAVzVF7qW72O6s-F41GJRaM2P5PRK4c6yeAfLcFSSs7F1HhU7md74ALn4l6XNJSgExjh8rnFRLukIiYstF-ICo80ABx0l7X5ABnVJPbrKqP-kqtpf_L3sUw_ZvB9lTJoyY4qqseDf8ZFvo3OjgMBI3-CCeCBXNoreL47NKrH0YcnbDnihWos0FfpBnA"
            alt="Admin Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </nav>
  );
};
