import React, { useState } from 'react';
import { ExpenseItem } from '../types';

interface ExpensesViewProps {
  expenses: ExpenseItem[];
  onAddExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  onDeleteExpense: (expenseId: string) => void;
  currencySymbol?: string;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  expenses,
  onAddExpense,
  onDeleteExpense,
  currencySymbol = 'EGP',
}) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number>(100);
  const [category, setCategory] = useState('مستلزمات');
  const [notes, setNotes] = useState('');

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amount <= 0) return;

    onAddExpense({
      title,
      amount,
      category,
      date: new Date().toISOString().split('T')[0],
      notes,
    });

    setTitle('');
    setAmount(100);
    setNotes('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#F5F5F0] tracking-tight">إدارة المصاريف والنثريات</h2>
          <p className="text-sm text-[#9A9A9A] mt-0.5">
            تسجيل وتوثيق المصروفات التشغيلية، الفواتير، ومشتريات الصالون
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-[#C5A059] text-black px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-[#D4AF37] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <span className="material-symbols-outlined text-[18px]">add_card</span>
          <span>تسجيل مصروف جديد</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-[#262626] bg-[#121212]">
          <span className="text-xs font-mono text-[#9A9A9A] block mb-1">إجمالي المصروفات المسجلة</span>
          <span className="font-mono text-3xl font-bold text-[#F5F5F0]">
            {totalAmount.toLocaleString()} <span className="text-sm font-sans text-[#C5A059]">{currencySymbol}</span>
          </span>
        </div>
        <div className="glass-card rounded-2xl p-6 border border-[#262626] bg-[#121212]">
          <span className="text-xs font-mono text-[#9A9A9A] block mb-1">عدد البنود</span>
          <span className="font-mono text-3xl font-bold text-[#F5F5F0]">{expenses.length} عملية</span>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="glass-card rounded-2xl border border-[#262626] overflow-hidden bg-[#121212]">
        <div className="p-4 border-b border-[#262626] bg-[#161616] flex items-center justify-between">
          <h3 className="font-bold text-sm text-[#F5F5F0]">سجل المصروفات</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-[#161616] text-xs font-mono text-[#9A9A9A] border-b border-[#262626]">
              <tr>
                <th className="py-3.5 px-5 font-semibold">بيان المصروف</th>
                <th className="py-3.5 px-5 font-semibold">التصنيف</th>
                <th className="py-3.5 px-5 font-semibold">التاريخ</th>
                <th className="py-3.5 px-5 font-semibold">المبلغ</th>
                <th className="py-3.5 px-5 font-semibold">ملاحظات</th>
                <th className="py-3.5 px-5 font-semibold text-center">حذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222] bg-[#121212]">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-[#181818] transition-colors">
                  <td className="py-3.5 px-5 font-bold text-[#F5F5F0]">{exp.title}</td>
                  <td className="py-3.5 px-5">
                    <span className="bg-[#1C1C1C] border border-[#2A2A2A] text-[#D4CFC9] px-2 py-0.5 rounded text-xs font-semibold">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 font-mono text-xs text-[#9A9A9A]">{exp.date}</td>
                  <td className="py-3.5 px-5 font-mono font-bold text-[#F5F5F0]">
                    {exp.amount} {currencySymbol}
                  </td>
                  <td className="py-3.5 px-5 text-xs text-[#9A9A9A]">{exp.notes || '-'}</td>
                  <td className="py-3.5 px-5 text-center">
                    <button
                      onClick={() => onDeleteExpense(exp.id)}
                      className="p-1 text-red-400 hover:text-red-300 rounded-lg hover:bg-red-950/30 transition-colors"
                      title="حذف"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#141414] rounded-2xl p-6 w-full max-w-md border border-[#2A2A2A] shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-[#F5F5F0] mb-4">تسجيل مصروف جديد</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#9A9A9A] mb-1">بيان المصروف*</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: فاتورة كهرباء، شراء مناشف، صيانة..."
                  className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F0] rounded-xl text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#9A9A9A] mb-1">المبلغ ({currencySymbol})*</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F0] rounded-xl text-sm font-mono focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#9A9A9A] mb-1">التصنيف</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F0] rounded-xl text-sm focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="مستلزمات">مستلزمات</option>
                    <option value="صيانة">صيانة</option>
                    <option value="فواتير">فواتير</option>
                    <option value="رواتب">رواتب</option>
                    <option value="ضيافة">ضيافة</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#9A9A9A] mb-1">ملاحظات إضافية</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F0] rounded-xl text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#C5A059] text-black py-2.5 rounded-xl font-bold text-sm hover:bg-[#D4AF37] transition-colors cursor-pointer"
                >
                  حفظ المصروف
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 bg-[#1E1E1E] text-[#D4CFC9] hover:text-white py-2.5 rounded-xl font-bold text-sm hover:bg-[#282828] transition-colors border border-[#2A2A2A] cursor-pointer"
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
