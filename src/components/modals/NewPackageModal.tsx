import React, { useState } from 'react';
import { PackageItem } from '../../types';

interface NewPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePackage: (pkg: PackageItem) => void;
  packageType: 'standard' | 'groom';
  editingPackage?: PackageItem | null;
  currencySymbol?: string;
}

export const NewPackageModal: React.FC<NewPackageModalProps> = ({
  isOpen,
  onClose,
  onSavePackage,
  packageType,
  editingPackage,
  currencySymbol = 'EGP',
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(editingPackage?.name || '');
  const [price, setPrice] = useState<number>(editingPackage?.price || 300);
  const [type, setType] = useState<'standard' | 'groom'>(editingPackage?.type || packageType);
  const [isPopular, setIsPopular] = useState(editingPackage?.isPopular || false);
  const [featuresText, setFeaturesText] = useState(
    editingPackage ? editingPackage.features.join('\n') : 'حلاقة شعر كلاسيكية\nتشذيب لحية بالبخار\nتنظيف بشرة وماسك ترطيب\nمساج رأس'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || price <= 0) return;

    const features = featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const pkgData: PackageItem = {
      id: editingPackage ? editingPackage.id : 'pkg-' + Date.now(),
      name,
      price,
      type,
      isPopular,
      isActive: true,
      features,
    };

    onSavePackage(pkgData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#141414] rounded-2xl p-6 w-full max-w-lg border border-[#2A2A2A] shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center mb-5 border-b border-[#262626] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#C5A059] text-[24px]">inventory_2</span>
            <h3 className="text-lg font-bold text-[#F5F5F0]">
              {editingPackage ? 'تعديل الباقة' : 'إنشاء باقة خدمات جديدة'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#222222] rounded-lg text-[#9A9A9A] hover:text-[#F5F5F0] transition-colors cursor-pointer">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#9A9A9A] mb-1">اسم الباقة*</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: باقة العريس الفاخرة، باقة النخبة..."
              className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F0] rounded-xl text-sm focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#9A9A9A] mb-1">سعر الباقة ({currencySymbol})*</label>
              <input
                type="number"
                min="1"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F0] rounded-xl text-sm font-mono focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#9A9A9A] mb-1">نوع الباقة</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F0] rounded-xl text-sm focus:outline-none focus:border-[#C5A059]"
              >
                <option value="standard" className="bg-[#141414] text-[#F5F5F0]">باقة قياسية</option>
                <option value="groom" className="bg-[#141414] text-[#F5F5F0]">باقة عريس / مناسبات</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#9A9A9A] mb-1">
              الخدمات المشمولة (كل خدمة في سطر منفصل)*
            </label>
            <textarea
              required
              rows={4}
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F0] rounded-xl text-sm font-mono focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div className="p-3.5 bg-[#181818] border border-[#262626] rounded-xl flex items-center justify-between">
            <div>
              <span className="font-bold text-xs text-[#F5F5F0] block">تمييز كباقة الأكثر طلباً</span>
              <span className="text-[11px] text-[#9A9A9A]">إضافة شارة ذهبية وإبراز الباقة للعملاء</span>
            </div>
            <input
              type="checkbox"
              checked={isPopular}
              onChange={(e) => setIsPopular(e.target.checked)}
              className="w-5 h-5 accent-[#C5A059] rounded"
            />
          </div>

          <div className="flex gap-2 pt-3 border-t border-[#262626]">
            <button
              type="submit"
              className="flex-1 bg-[#C5A059] hover:bg-[#D4AF37] text-black py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer shadow-md"
            >
              {editingPackage ? 'حفظ التعديلات' : 'إنشاء الباقة'}
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
