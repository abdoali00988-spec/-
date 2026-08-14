import React, { useState } from 'react';
import { ServiceItem } from '../types';

interface ServicesManagementViewProps {
  services: ServiceItem[];
  categoryFilter?: 'الخدمات' | 'الإضافات' | 'منتجات العناية';
  onAddService: (service: Omit<ServiceItem, 'id'>) => void;
  onEditService: (service: ServiceItem) => void;
  onDeleteService: (serviceId: string) => void;
  currencySymbol?: string;
}

export const ServicesManagementView: React.FC<ServicesManagementViewProps> = ({
  services,
  categoryFilter = 'الخدمات',
  onAddService,
  onEditService,
  onDeleteService,
  currencySymbol = 'EGP',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFilter);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);

  const [name, setName] = useState('');
  const [price, setPrice] = useState(50);
  const [duration, setDuration] = useState(30);
  const [icon, setIcon] = useState('content_cut');
  const [description, setDescription] = useState('');

  const filteredServices = services.filter((s) => s.category === selectedCategory);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setName('');
    setPrice(50);
    setDuration(30);
    setIcon(selectedCategory === 'منتجات العناية' ? 'sanitizer' : 'content_cut');
    setDescription('');
    setShowModal(true);
  };

  const handleOpenEdit = (item: ServiceItem) => {
    setEditingItem(item);
    setName(item.name);
    setPrice(item.price);
    setDuration(item.duration);
    setIcon(item.icon);
    setDescription(item.description || '');
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingItem) {
      onEditService({
        ...editingItem,
        name,
        price,
        duration,
        icon,
        description,
        category: selectedCategory as any,
      });
    } else {
      onAddService({
        name,
        price,
        duration,
        category: selectedCategory as any,
        icon,
        description,
        borderAccent: '#79591d',
      });
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black tracking-tight">إدارة الخدمات والمنتجات</h2>
          <p className="text-sm text-[#45464c] mt-0.5">
            تخصيص قائمة الأسعار والخدمات المقدمة والإضافات ومنتجات العناية
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#edeeef] p-1 rounded-xl flex items-center gap-1 text-xs font-bold">
            {['الخدمات', 'الإضافات', 'منتجات العناية'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#79591d] text-white shadow-xs'
                    : 'text-[#45464c] hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={handleOpenAdd}
            className="bg-black text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>إضافة بند جديد</span>
          </button>
        </div>
      </div>

      {/* Grid of Services */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="glass-card rounded-2xl p-5 border border-[#e1e3e4] bg-white flex flex-col justify-between hover:shadow-md transition-all relative group"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="w-12 h-12 rounded-xl bg-[#fdd089]/20 text-[#79591d] flex items-center justify-center border-r-4 border-[#79591d]">
                  <span className="material-symbols-outlined text-[24px]">{service.icon}</span>
                </div>
                <div className="text-left">
                  <span className="font-mono text-xl font-bold text-black">{service.price}</span>
                  <span className="text-xs text-[#76777d] block font-sans">{currencySymbol}</span>
                </div>
              </div>

              <h3 className="font-bold text-base text-black mb-1">{service.name}</h3>
              {service.description && (
                <p className="text-xs text-[#45464c] line-clamp-2 mb-3">{service.description}</p>
              )}
              {service.duration > 0 && (
                <span className="font-mono text-xs text-[#76777d] bg-[#f8f9fa] px-2 py-1 rounded-md inline-block">
                  ⏱ {service.duration} دقيقة
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-[#e1e3e4] mt-4">
              <button
                onClick={() => handleOpenEdit(service)}
                className="flex-1 bg-[#edeeef] hover:bg-[#e1e3e4] text-black py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">edit</span>
                <span>تعديل</span>
              </button>
              <button
                onClick={() => {
                  if (confirm(`هل أنت متأكد من رغبتك في حذف "${service.name}"؟`)) {
                    onDeleteService(service.id);
                  }
                }}
                className="p-1.5 text-[#ba1a1a]/70 hover:text-[#ba1a1a] hover:bg-[#ffdad6]/20 rounded-lg transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-[#e1e3e4] shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-black mb-4">
              {editingItem ? 'تعديل الخدمة / البند' : 'إضافة خدمة أو منتج جديد'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#45464c] mb-1">اسم الخدمة / المنتج*</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: حلاقة شعر VIP، زيت لحية..."
                  className="w-full px-3 py-2 border border-[#c6c6cd] rounded-lg text-sm focus:outline-none focus:border-[#79591d]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#45464c] mb-1">السعر ({currencySymbol})*</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#c6c6cd] rounded-lg text-sm font-mono focus:outline-none focus:border-[#79591d]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#45464c] mb-1">المدة (بالدقائق)</label>
                  <input
                    type="number"
                    min="0"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#c6c6cd] rounded-lg text-sm font-mono focus:outline-none focus:border-[#79591d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#45464c] mb-1">الوصف</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="تفاصيل الخدمة أو محتويات المنتج..."
                  className="w-full px-3 py-2 border border-[#c6c6cd] rounded-lg text-sm focus:outline-none focus:border-[#79591d]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#79591d] text-white py-2.5 rounded-lg font-bold text-sm hover:bg-[#5f4105] transition-colors"
                >
                  حفظ البيانات
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 bg-[#edeeef] text-black py-2.5 rounded-lg font-bold text-sm hover:bg-[#e1e3e4] transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
