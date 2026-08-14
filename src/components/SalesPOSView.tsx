import React, { useState } from 'react';
import { ServiceItem, PackageItem, Employee, Client, CartItem, SaleInvoice } from '../types';

interface SalesPOSViewProps {
  services: ServiceItem[];
  packages: PackageItem[];
  employees: Employee[];
  clients: Client[];
  onAddNewClient: () => void;
  onCompleteSale: (invoice: SaleInvoice) => void;
  currencySymbol?: string;
}

export const SalesPOSView: React.FC<SalesPOSViewProps> = ({
  services,
  packages,
  employees,
  clients,
  onAddNewClient,
  onCompleteSale,
  currencySymbol = 'SAR',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('الخدمات');
  const [cart, setCart] = useState<CartItem[]>([
    { id: 's-3', name: 'حلاقة شعر + ذقن VIP', price: 80, quantity: 1, duration: 50 },
    { id: 's-5', name: 'فوطة ساخنة / مساج رأس', price: 20, quantity: 1, duration: 15 },
  ]);
  const [selectedBarberId, setSelectedBarberId] = useState<string>('emp-1');
  const [selectedClientId, setSelectedClientId] = useState<string>('c-1');
  const [clientSearchQuery, setClientSearchQuery] = useState<string>('');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'wallet'>('cash');
  const [invoiceNumber] = useState<string>(() => 'INV-' + Math.floor(2000 + Math.random() * 8000));

  // Filter clients based on search query
  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
      c.phone.includes(clientSearchQuery)
  );

  const selectedClient = clients.find((c) => c.id === selectedClientId) || clients[0];
  const selectedBarber = employees.find((e) => e.id === selectedBarberId) || employees[0];

  // Combined catalog items based on category
  const getCatalogItems = () => {
    if (selectedCategory === 'الباقات') {
      return packages.filter((p) => p.type === 'standard').map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        duration: 60,
        category: 'الباقات',
        icon: 'inventory_2',
        borderAccent: '#79591d',
      }));
    }
    if (selectedCategory === 'باقات العريس') {
      return packages.filter((p) => p.type === 'groom').map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        duration: 90,
        category: 'باقات العريس',
        icon: 'dry_cleaning',
        borderAccent: '#79591d',
      }));
    }
    return services.filter((s) => s.category === selectedCategory);
  };

  const catalogItems = getCatalogItems();

  // Cart operations
  const handleToggleCartItem = (item: { id: string; name: string; price: number; duration?: number }) => {
    const existingIndex = cart.findIndex((c) => c.id === item.id);
    if (existingIndex > -1) {
      setCart(cart.filter((c) => c.id !== item.id));
    } else {
      setCart([...cart, { id: item.id, name: item.name, price: item.price, quantity: 1, duration: item.duration }]);
    }
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(cart.filter((c) => c.id !== id));
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = Math.min(subtotal, Math.max(0, discountValue));
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = taxableAmount * 0.15; // 15% VAT
  const total = taxableAmount + tax;

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('الرجاء إضافة خدمات أو منتجات إلى السلة أولاً');
      return;
    }
    if (!selectedBarberId) {
      alert('الرجاء تحديد الحلاق المسؤول');
      return;
    }

    const newInvoice: SaleInvoice = {
      id: 'inv-' + Date.now(),
      invoiceNumber: invoiceNumber,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' }) + ', ' + new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      clientName: selectedClient?.name || 'عميل نقدي',
      clientPhone: selectedClient?.phone || '0500000000',
      barberId: selectedBarber.id,
      barberName: selectedBarber.name,
      items: [...cart],
      subtotal,
      discount: discountAmount,
      tax,
      total,
      paymentMethod,
      status: 'مدفوع',
    };

    onCompleteSale(newInvoice);
    setCart([]);
  };

  const categories = ['الخدمات', 'الإضافات', 'الباقات', 'باقات العريس', 'منتجات العناية'];

  return (
    <div className="bg-[#0C0C0C] rounded-2xl shadow-2xl border border-[#262626] overflow-hidden flex flex-col min-h-[calc(100vh-6rem)] animate-in fade-in duration-200">
      {/* Top Bar: Customer Selection & Invoice Info */}
      <div className="bg-[#121212] border-b border-[#262626] p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Customer Select / Search */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <div className="relative flex-1">
            <span className="material-symbols-outlined text-[#76777d] absolute right-3 top-1/2 -translate-y-1/2 text-[20px]">
              person_search
            </span>
            <input
              type="text"
              value={clientSearchQuery}
              onChange={(e) => setClientSearchQuery(e.target.value)}
              placeholder="البحث عن عميل (رقم الجوال أو الاسم)..."
              className="w-full pl-4 pr-10 py-2.5 bg-[#161616] border border-[#2A2A2A] rounded-xl text-sm text-[#F5F5F0] placeholder:text-[#666666] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-colors"
            />
            {clientSearchQuery && (
              <div className="absolute top-full right-0 left-0 bg-[#161616] border border-[#2A2A2A] rounded-xl shadow-2xl mt-1 z-30 max-h-48 overflow-y-auto divide-y divide-[#222222]">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    onClick={() => {
                      setSelectedClientId(client.id);
                      setClientSearchQuery('');
                    }}
                    className="p-2.5 hover:bg-[#202020] cursor-pointer text-sm flex items-center justify-between"
                  >
                    <span className="font-bold text-[#F5F5F0]">{client.name}</span>
                    <span className="font-mono text-xs text-[#9A9A9A]">{client.phone}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onAddNewClient}
            className="bg-[#1E1E1E] text-[#D4CFC9] px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-[#282828] hover:text-white transition-colors border border-[#2A2A2A] flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-[#C5A059]">person_add</span>
            <span>عميل جديد</span>
          </button>
        </div>

        {/* Selected Customer Pill & Invoice Meta */}
        <div className="flex items-center gap-4 justify-between md:justify-end">
          {selectedClient && (
            <div className="bg-[#161616] border border-[#2A2A2A] px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-bold text-[#F5F5F0]">{selectedClient.name}</span>
              <span className="font-mono text-[#9A9A9A]">({selectedClient.phone})</span>
            </div>
          )}

          <div className="flex items-center gap-3 text-left">
            <div>
              <div className="font-mono text-[10px] text-[#9A9A9A] uppercase">رقم الفاتورة</div>
              <div className="font-mono text-sm font-bold text-[#F5F5F0]">#{invoiceNumber}</div>
            </div>
            <div className="h-8 w-px bg-[#262626]" />
            <div>
              <div className="font-mono text-[10px] text-[#9A9A9A] uppercase">التاريخ</div>
              <div className="font-mono text-xs font-semibold text-[#D4CFC9]">14 Nov, 10:45 AM</div>
            </div>
          </div>
        </div>
      </div>

      {/* Split Screen Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Catalog Panel (70%) */}
        <div className="flex-1 lg:w-[68%] flex flex-col bg-[#0E0E0E] border-l border-[#262626]">
          {/* Category Tabs */}
          <div className="bg-[#121212] px-6 pt-3 border-b border-[#262626] flex gap-4 sm:gap-6 overflow-x-auto">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`pb-3 font-bold text-sm whitespace-nowrap transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-b-2 border-[#C5A059] text-[#C5A059]'
                      : 'border-b-2 border-transparent text-[#9A9A9A] hover:text-[#F5F5F0]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Catalog Grid */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {catalogItems.map((item) => {
                const isSelected = cart.some((c) => c.id === item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleToggleCartItem(item)}
                    className={`bg-[#161616] rounded-xl p-4 border transition-all cursor-pointer flex flex-col justify-between group active:scale-[0.98] relative overflow-hidden ${
                      isSelected
                        ? 'border-[#C5A059] bg-[#C5A059]/10 shadow-lg ring-1 ring-[#C5A059]'
                        : 'border-[#262626] hover:border-[#C5A059]/50 hover:bg-[#1A1A1A]'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-0 right-0 w-7 h-7 bg-[#C5A059] flex items-center justify-center rounded-bl-lg">
                        <span className="material-symbols-outlined text-black font-bold text-[16px]">check</span>
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-3">
                      <div
                        className={`w-11 h-11 rounded-lg flex items-center justify-center border-r-4 transition-colors ${
                          isSelected
                            ? 'bg-[#1C1C1C] text-[#C5A059] border-[#C5A059]'
                            : 'bg-[#202020] text-[#C5A059] border-[#C5A059]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                      </div>
                      <span className="font-mono font-bold text-base text-[#F5F5F0] mt-1">
                        {item.price} <span className="text-xs font-sans text-[#C5A059]">{currencySymbol}</span>
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-[#F5F5F0] mb-1 leading-snug">{item.name}</h3>
                      <p className="text-xs text-[#9A9A9A] font-mono">{item.duration} دقيقة</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Cart & Checkout Panel (30%) */}
        <div className="lg:w-[32%] bg-[#121212] flex flex-col border-r border-[#262626] z-20">
          {/* Cart Header */}
          <div className="p-4 border-b border-[#262626] flex justify-between items-center bg-[#161616]">
            <h2 className="font-bold text-base text-[#F5F5F0]">سلة الطلبات</h2>
            <span className="bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30 px-3 py-0.5 rounded-full font-mono text-xs font-bold">
              {cart.length} عناصر
            </span>
          </div>

          {/* Barber Selection (Mandatory) */}
          <div className="p-4 border-b border-[#262626] bg-[#141414]">
            <label className="block font-mono text-xs text-[#9A9A9A] mb-1.5 font-medium">
              حلق مع... (إلزامي)*
            </label>
            <div className="relative">
              <select
                value={selectedBarberId}
                onChange={(e) => setSelectedBarberId(e.target.value)}
                className="w-full appearance-none pl-4 pr-10 py-2.5 bg-[#181818] border border-[#2A2A2A] rounded-xl font-bold text-sm text-[#F5F5F0] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id} className="bg-[#181818] text-[#F5F5F0]">
                    {emp.name} ({emp.role})
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined text-[#C5A059] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[20px]">
                expand_more
              </span>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[160px]">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-[#76777d] py-8">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-30">shopping_cart</span>
                <p className="text-sm text-[#9A9A9A]">السلة فارغة، اختر من القائمة على اليمين</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#161616] border border-[#262626] rounded-xl p-3 flex flex-col gap-2"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm text-[#F5F5F0]">{item.name}</h4>
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                      title="حذف"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>

                  <div className="flex justify-between items-center mt-1">
                    <div className="flex items-center gap-2 border border-[#2A2A2A] rounded-lg overflow-hidden bg-[#1E1E1E]">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        className="px-2 py-0.5 hover:bg-[#2A2A2A] text-[#F5F5F0] font-bold transition-colors cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-mono text-xs px-2 w-6 text-center font-bold text-[#F5F5F0]">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        className="px-2 py-0.5 hover:bg-[#2A2A2A] text-[#F5F5F0] font-bold transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-mono text-sm font-bold text-[#F5F5F0]">
                      {item.price * item.quantity} <span className="text-xs text-[#C5A059]">{currencySymbol}</span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary & Payment Section */}
          <div className="bg-[#161616] border-t border-[#262626] p-4 shadow-xl">
            {/* Breakdown */}
            <div className="flex flex-col gap-1.5 mb-3 text-xs sm:text-sm text-[#9A9A9A]">
              <div className="flex justify-between">
                <span>المجموع الفرعي</span>
                <span className="font-mono font-semibold text-[#D4CFC9]">{subtotal.toFixed(2)} {currencySymbol}</span>
              </div>

              {/* Discount */}
              <div className="flex items-center justify-between gap-2">
                <span>الخصم</span>
                <div className="relative w-28">
                  <input
                    type="number"
                    min="0"
                    value={discountValue || ''}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    placeholder="0.00"
                    className="w-full pl-6 pr-2 py-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg font-mono text-xs text-[#F5F5F0] text-left focus:outline-none focus:border-[#C5A059]"
                  />
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-[#76777d]">{currencySymbol}</span>
                </div>
              </div>

              <div className="flex justify-between">
                <span>الضريبة (15%)</span>
                <span className="font-mono font-semibold text-[#D4CFC9]">{tax.toFixed(2)} {currencySymbol}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center py-2.5 border-t border-[#262626] mb-3">
              <span className="font-bold text-[#F5F5F0] text-base">الإجمالي</span>
              <span className="font-mono text-xl font-bold text-[#C5A059]">
                {total.toFixed(2)} {currencySymbol}
              </span>
            </div>

            {/* Payment Methods */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { id: 'cash', label: 'كاش', icon: 'payments' },
                { id: 'card', label: 'فيزا / مدى', icon: 'credit_card' },
                { id: 'wallet', label: 'المحفظة', icon: 'account_balance_wallet' },
              ].map((m) => {
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`py-2 px-1 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? 'border-[#C5A059] bg-[#C5A059]/15 text-[#C5A059] font-bold'
                        : 'border-[#262626] bg-[#181818] text-[#9A9A9A] hover:bg-[#202020] hover:text-[#F5F5F0]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{m.icon}</span>
                    <span className="text-xs">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Submit / Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className={`w-full py-3.5 rounded-xl font-bold text-base transition-all flex justify-center items-center gap-2 shadow-lg cursor-pointer ${
                cart.length === 0
                  ? 'bg-[#222222] text-[#666666] border border-[#2A2A2A] cursor-not-allowed'
                  : 'bg-[#C5A059] text-black hover:bg-[#D4AF37] active:scale-[0.98]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
              <span>إتمام البيع وطباعة</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
