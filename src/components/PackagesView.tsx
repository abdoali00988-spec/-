import React, { useState } from 'react';
import { PackageItem } from '../types';

interface PackagesViewProps {
  packages: PackageItem[];
  onAddNewPackage: (type: 'standard' | 'groom') => void;
  onEditPackage: (pkg: PackageItem) => void;
  onDeletePackage: (pkgId: string) => void;
  onToggleActive: (pkgId: string) => void;
  currencySymbol?: string;
  defaultTab?: 'standard' | 'groom';
}

export const PackagesView: React.FC<PackagesViewProps> = ({
  packages,
  onAddNewPackage,
  onEditPackage,
  onDeletePackage,
  onToggleActive,
  currencySymbol = 'EGP',
  defaultTab = 'standard',
}) => {
  const [activeTab, setActiveTab] = useState<'standard' | 'groom'>(defaultTab);

  const filteredPackages = packages.filter((pkg) => pkg.type === activeTab);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#F5F5F0] tracking-tight">
            {activeTab === 'groom' ? 'باقات العرسان والمناسبات' : 'إدارة الباقات والعروض'}
          </h2>
          <p className="text-sm text-[#9A9A9A] mt-0.5">
            تعديل الباقات الحالية وإنشاء باقات جديدة للمناسبات والعرسان
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Tabs */}
          <div className="bg-[#161616] border border-[#2A2A2A] p-1 rounded-xl flex items-center gap-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab('standard')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'standard'
                  ? 'bg-[#262626] text-[#F5F5F0] shadow-sm'
                  : 'text-[#9A9A9A] hover:text-[#F5F5F0]'
              }`}
            >
              الباقات القياسية
            </button>
            <button
              onClick={() => setActiveTab('groom')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'groom'
                  ? 'bg-[#C5A059] text-black font-bold shadow-sm'
                  : 'text-[#C5A059] hover:bg-[#202020]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">dry_cleaning</span>
              باقات العرسان
            </button>
          </div>

          <button
            onClick={() => onAddNewPackage(activeTab)}
            className="bg-[#C5A059] text-black px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-[#D4AF37] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <span className="material-symbols-outlined text-[18px]">add_box</span>
            <span>إضافة باقة جديدة</span>
          </button>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((pkg) => (
          <div
            key={pkg.id}
            className={`glass-card rounded-2xl p-6 border flex flex-col justify-between transition-all hover:border-[#333333] relative overflow-hidden bg-[#121212] ${
              pkg.isPopular
                ? 'border-2 border-[#C5A059] shadow-lg shadow-[#C5A059]/5'
                : 'border-[#262626]'
            }`}
          >
            {/* Popular Badge */}
            {pkg.isPopular && (
              <div className="absolute top-0 left-0 bg-[#C5A059] text-black font-bold px-3 py-1 text-[11px] rounded-br-xl flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">star</span>
                الأكثر طلباً
              </div>
            )}

            <div>
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4 mt-1">
                <div>
                  <h3 className="text-lg font-bold text-[#F5F5F0]">{pkg.name}</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      onClick={() => onToggleActive(pkg.id)}
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold cursor-pointer transition-colors border ${
                        pkg.isActive
                          ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                          : 'bg-[#202020] text-[#9A9A9A] border-[#333333]'
                      }`}
                    >
                      {pkg.isActive ? 'نشطة' : 'غير نشطة'}
                    </span>
                  </div>
                </div>

                <div className="text-left">
                  <span className="font-mono text-2xl font-bold text-[#F5F5F0]">
                    {pkg.price}
                  </span>
                  <span className="text-xs text-[#C5A059] block font-sans">{currencySymbol}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-[#262626] my-4" />

              {/* Features List */}
              <div className="space-y-2.5 mb-6">
                <span className="text-xs font-bold text-[#9A9A9A] uppercase tracking-wider font-mono block">
                  الخدمات المشمولة في الباقة:
                </span>
                {pkg.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-[#D4CFC9]">
                    <span className="material-symbols-outlined text-[#C5A059] text-[18px] flex-shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions Bottom Bar */}
            <div className="flex items-center gap-2 pt-4 border-t border-[#262626] mt-auto">
              <button
                onClick={() => onEditPackage(pkg)}
                className="flex-1 bg-[#1E1E1E] hover:bg-[#282828] text-[#D4CFC9] hover:text-white py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer border border-[#2A2A2A]"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
                <span>تعديل الباقة</span>
              </button>
              <button
                onClick={() => {
                  if (confirm(`هل أنت متأكد من رغبتك في حذف ${pkg.name}؟`)) {
                    onDeletePackage(pkg.id);
                  }
                }}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer"
                title="حذف الباقة"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          </div>
        ))}

        {/* Add Package Placeholder Card */}
        <div
          onClick={() => onAddNewPackage(activeTab)}
          className="border-2 border-dashed border-[#2A2A2A] hover:border-[#C5A059] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-[#C5A059]/5 group min-h-[280px] bg-[#121212]/50"
        >
          <div className="w-14 h-14 rounded-full bg-[#1A1A1A] group-hover:bg-[#C5A059]/20 text-[#9A9A9A] group-hover:text-[#C5A059] flex items-center justify-center transition-colors mb-3 border border-[#2A2A2A]">
            <span className="material-symbols-outlined text-3xl">add</span>
          </div>
          <h3 className="font-bold text-[#F5F5F0] group-hover:text-[#C5A059] transition-colors">
            إضافة باقة جديدة
          </h3>
          <p className="text-xs text-[#9A9A9A] mt-1 max-w-[200px]">
            انقر لإنشاء حزمة خدمات مخصصة بسعر ترويجي مميز
          </p>
        </div>
      </div>
    </div>
  );
};
