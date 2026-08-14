import React, { useState } from 'react';

interface SettingsViewProps {
  currencySymbol: string;
  onUpdateCurrency: (symbol: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currencySymbol,
  onUpdateCurrency,
}) => {
  const [salonName, setSalonName] = useState('صالون النخبة');
  const [branchName, setBranchName] = useState('الفرع الرئيسي');
  const [phone, setPhone] = useState('01012345678');
  const [address, setAddress] = useState('شارع التحرير، الدقي، الجيزة');
  const [taxRate, setTaxRate] = useState(15);
  const [printThermal, setPrintThermal] = useState(true);
  const [autoReceipt, setAutoReceipt] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-bold text-[#F5F5F0] tracking-tight">إعدادات النظام والفرع</h2>
        <p className="text-sm text-[#9A9A9A] mt-0.5">
          تخصيص بيانات الفاتورة المطبوعة، العملة الافتراضية، ومعدلات الضريبة
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Branch Details */}
        <div className="glass-card rounded-2xl p-6 border border-[#262626] bg-[#121212] space-y-4">
          <h3 className="font-bold text-base text-[#F5F5F0] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#C5A059] text-[20px]">store</span>
            <span>بيانات الصالون والفرع</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#9A9A9A] mb-1">اسم الصالون</label>
              <input
                type="text"
                value={salonName}
                onChange={(e) => setSalonName(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F0] rounded-xl text-sm focus:outline-none focus:border-[#C5A059]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#9A9A9A] mb-1">اسم الفرع</label>
              <input
                type="text"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F0] rounded-xl text-sm focus:outline-none focus:border-[#C5A059]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#9A9A9A] mb-1">رقم الهاتف للتواصل</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F0] rounded-xl text-sm font-mono focus:outline-none focus:border-[#C5A059]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#9A9A9A] mb-1">العنوان</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F0] rounded-xl text-sm focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>
        </div>

        {/* Currency & Tax */}
        <div className="glass-card rounded-2xl p-6 border border-[#262626] bg-[#121212] space-y-4">
          <h3 className="font-bold text-base text-[#F5F5F0] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#C5A059] text-[20px]">payments</span>
            <span>العملة والضريبة</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#9A9A9A] mb-1">العملة الافتراضية</label>
              <select
                value={currencySymbol}
                onChange={(e) => onUpdateCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F0] rounded-xl text-sm focus:outline-none focus:border-[#C5A059]"
              >
                <option value="EGP">جنيه مصري (EGP)</option>
                <option value="SAR">ريال سعودي (SAR)</option>
                <option value="AED">درهم إماراتي (AED)</option>
                <option value="KWD">دينار كويتي (KWD)</option>
                <option value="$">دولار أمريكي ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#9A9A9A] mb-1">نسبة ضريبة القيمة المضافة (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F0] rounded-xl text-sm font-mono focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>
        </div>

        {/* Printing Setup */}
        <div className="glass-card rounded-2xl p-6 border border-[#262626] bg-[#121212] space-y-4">
          <h3 className="font-bold text-base text-[#F5F5F0] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#C5A059] text-[20px]">print</span>
            <span>إعدادات الفواتير والطباعة</span>
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 bg-[#161616] border border-[#262626] rounded-xl cursor-pointer">
              <div>
                <div className="font-bold text-sm text-[#F5F5F0]">تنسيق الإيصال الحراري (Thermal 80mm)</div>
                <div className="text-xs text-[#9A9A9A]">تجهيز الفاتورة بحجم إيصالات طابعات الكاشير المباشرة</div>
              </div>
              <input
                type="checkbox"
                checked={printThermal}
                onChange={(e) => setPrintThermal(e.target.checked)}
                className="w-5 h-5 accent-[#C5A059] rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-[#161616] border border-[#262626] rounded-xl cursor-pointer">
              <div>
                <div className="font-bold text-sm text-[#F5F5F0]">فتح نافذة الطباعة تلقائياً عند البيع</div>
                <div className="text-xs text-[#9A9A9A]">إظهار معاينة الفاتورة للطباعة فور الضغط على إتمام البيع</div>
              </div>
              <input
                type="checkbox"
                checked={autoReceipt}
                onChange={(e) => setAutoReceipt(e.target.checked)}
                className="w-5 h-5 accent-[#C5A059] rounded"
              />
            </label>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="bg-[#C5A059] hover:bg-[#D4AF37] text-black px-6 py-3 rounded-xl font-bold text-sm transition-colors shadow-md cursor-pointer flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            <span>حفظ جميع الإعدادات</span>
          </button>

          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-2 rounded-lg">
              ✓ تم حفظ الإعدادات بنجاح
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
