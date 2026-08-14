import React, { useState } from 'react';
import { Employee, EmployeePermissions } from '../types';

interface StaffViewProps {
  employees: Employee[];
  onAddNewStaff: () => void;
  onUpdateEmployeePermissions: (empId: string, permissions: EmployeePermissions) => void;
  onEditStaff: (emp: Employee) => void;
}

export const StaffView: React.FC<StaffViewProps> = ({
  employees,
  onAddNewStaff,
  onUpdateEmployeePermissions,
  onEditStaff,
}) => {
  const [selectedEmpId, setSelectedEmpId] = useState<string>(() => employees[0]?.id || 'emp-1');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const selectedEmployee = employees.find((e) => e.id === selectedEmpId) || employees[0];
  const [currentPerms, setCurrentPerms] = useState<EmployeePermissions>(selectedEmployee.permissions);

  // Sync state when selected employee changes
  const handleSelectEmployee = (emp: Employee) => {
    setSelectedEmpId(emp.id);
    setCurrentPerms(emp.permissions);
    setSaveSuccess(false);
  };

  const handleToggleCategory = (cat: 'customers' | 'sales' | 'staff') => {
    setCurrentPerms({
      ...currentPerms,
      [cat]: {
        ...currentPerms[cat],
        enabled: !currentPerms[cat].enabled,
      },
    });
  };

  const handleToggleSubPerm = (
    cat: 'customers' | 'sales' | 'staff',
    key: string
  ) => {
    setCurrentPerms({
      ...currentPerms,
      [cat]: {
        ...currentPerms[cat],
        [key]: !(currentPerms[cat] as any)[key],
      },
    });
  };

  const handleSave = () => {
    onUpdateEmployeePermissions(selectedEmpId, currentPerms);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#F5F5F0] tracking-tight">إدارة الموظفين والصلاحيات</h2>
          <p className="text-sm text-[#9A9A9A] mt-0.5">
            التحكم في بيانات فريق العمل وتحديد الصلاحيات الدقيقة لكل دور وظيفي
          </p>
        </div>

        <button
          onClick={onAddNewStaff}
          className="bg-[#C5A059] text-black px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-[#D4AF37] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>إضافة موظف جديد</span>
        </button>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Employees Table (7 cols) */}
        <div className="lg:col-span-7 glass-card rounded-2xl border border-[#262626] overflow-hidden bg-[#121212]">
          <div className="p-4 border-b border-[#262626] bg-[#161616] flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#F5F5F0]">قائمة الموظفين ({employees.length})</h3>
            <span className="text-xs text-[#9A9A9A]">انقر على موظف لضبط الصلاحيات</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-[#161616] text-xs font-mono text-[#9A9A9A] border-b border-[#262626]">
                <tr>
                  <th className="py-3 px-4 font-semibold">الموظف</th>
                  <th className="py-3 px-4 font-semibold">الدور</th>
                  <th className="py-3 px-4 font-semibold hidden sm:table-cell">الهاتف</th>
                  <th className="py-3 px-4 font-semibold">الحالة</th>
                  <th className="py-3 px-4 font-semibold text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222] bg-[#121212]">
                {employees.map((emp) => {
                  const isSelected = emp.id === selectedEmpId;
                  return (
                    <tr
                      key={emp.id}
                      onClick={() => handleSelectEmployee(emp)}
                      className={`hover:bg-[#181818] transition-colors cursor-pointer ${
                        isSelected ? 'bg-[#C5A059]/10' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full overflow-hidden border border-[#2A2A2A] bg-[#1A1A1A] flex-shrink-0">
                            <img src={emp.avatarUrl} alt={emp.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="font-bold text-[#F5F5F0]">{emp.name}</div>
                            <div className="text-[11px] text-[#9A9A9A] flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px] text-[#C5A059]">star</span>
                              <span>{emp.rating}</span>
                              <span>• {emp.clientsCount} عميل</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono text-xs text-[#D4CFC9] bg-[#1C1C1C] border border-[#2A2A2A] px-2 py-0.5 rounded font-semibold">
                          {emp.role}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-xs text-[#76777d] hidden sm:table-cell">
                        {emp.phone}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold inline-block border ${
                            emp.status === 'نشط'
                              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                              : 'bg-amber-950/40 text-amber-400 border-amber-800/40'
                          }`}
                        >
                          {emp.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectEmployee(emp);
                            }}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isSelected ? 'bg-[#C5A059] text-black font-bold' : 'hover:bg-[#202020] text-[#9A9A9A] hover:text-[#F5F5F0]'
                            }`}
                            title="تعديل الصلاحيات"
                          >
                            <span className="material-symbols-outlined text-[18px]">key</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditStaff(emp);
                            }}
                            className="p-1.5 hover:bg-[#202020] rounded-lg text-[#9A9A9A] hover:text-[#F5F5F0] transition-colors"
                            title="تعديل بيانات الموظف"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Permissions Panel (5 cols) */}
        {selectedEmployee && (
          <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-[#262626] bg-[#121212] sticky top-20 shadow-sm space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#262626] pb-4">
              <div>
                <h3 className="font-bold text-base text-[#F5F5F0]">
                  صلاحيات: {selectedEmployee.name}
                </h3>
                <p className="text-xs text-[#9A9A9A] font-mono mt-0.5">الدور: {selectedEmployee.role}</p>
              </div>

              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#2A2A2A]">
                <img
                  src={selectedEmployee.avatarUrl}
                  alt={selectedEmployee.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Permission Sections */}
            <div className="space-y-5">
              {/* Customers Section */}
              <div className="border border-[#262626] rounded-xl p-4 bg-[#161616]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#C5A059] text-[20px]">group</span>
                    <span className="font-bold text-sm text-[#F5F5F0]">العملاء</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentPerms.customers.enabled}
                      onChange={() => handleToggleCategory('customers')}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-[#2A2A2A] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#121212] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#D4CFC9] after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C5A059]"></div>
                  </label>
                </div>

                <div
                  className={`grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#262626] text-[#D4CFC9] ${
                    !currentPerms.customers.enabled ? 'opacity-40 pointer-events-none' : ''
                  }`}
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentPerms.customers.view}
                      onChange={() => handleToggleSubPerm('customers', 'view')}
                      className="rounded accent-[#C5A059]"
                    />
                    <span>عرض العملاء</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentPerms.customers.add}
                      onChange={() => handleToggleSubPerm('customers', 'add')}
                      className="rounded accent-[#C5A059]"
                    />
                    <span>إضافة عميل</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentPerms.customers.edit}
                      onChange={() => handleToggleSubPerm('customers', 'edit')}
                      className="rounded accent-[#C5A059]"
                    />
                    <span>تعديل البيانات</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentPerms.customers.delete}
                      onChange={() => handleToggleSubPerm('customers', 'delete')}
                      className="rounded accent-[#C5A059]"
                    />
                    <span>حذف عميل</span>
                  </label>
                </div>
              </div>

              {/* Sales Section */}
              <div className="border border-[#262626] rounded-xl p-4 bg-[#161616]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#C5A059] text-[20px]">payments</span>
                    <span className="font-bold text-sm text-[#F5F5F0]">المبيعات والفواتير</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentPerms.sales.enabled}
                      onChange={() => handleToggleCategory('sales')}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-[#2A2A2A] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#121212] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#D4CFC9] after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C5A059]"></div>
                  </label>
                </div>

                <div
                  className={`grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#262626] text-[#D4CFC9] ${
                    !currentPerms.sales.enabled ? 'opacity-40 pointer-events-none' : ''
                  }`}
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentPerms.sales.view}
                      onChange={() => handleToggleSubPerm('sales', 'view')}
                      className="rounded accent-[#C5A059]"
                    />
                    <span>عرض المبيعات</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentPerms.sales.add}
                      onChange={() => handleToggleSubPerm('sales', 'add')}
                      className="rounded accent-[#C5A059]"
                    />
                    <span>إنشاء فاتورة</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentPerms.sales.edit}
                      onChange={() => handleToggleSubPerm('sales', 'edit')}
                      className="rounded accent-[#C5A059]"
                    />
                    <span>تعديل السعر/خصم</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentPerms.sales.cancelInvoice}
                      onChange={() => handleToggleSubPerm('sales', 'cancelInvoice')}
                      className="rounded accent-[#C5A059]"
                    />
                    <span>إلغاء فاتورة</span>
                  </label>
                </div>
              </div>

              {/* Staff & Payroll Section */}
              <div className="border border-[#262626] rounded-xl p-4 bg-[#161616]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#C5A059] text-[20px]">badge</span>
                    <span className="font-bold text-sm text-[#F5F5F0]">الموظفون والرواتب</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentPerms.staff.enabled}
                      onChange={() => handleToggleCategory('staff')}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-[#2A2A2A] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#121212] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#D4CFC9] after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C5A059]"></div>
                  </label>
                </div>

                <div
                  className={`grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#262626] text-[#D4CFC9] ${
                    !currentPerms.staff.enabled ? 'opacity-40 pointer-events-none' : ''
                  }`}
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentPerms.staff.view}
                      onChange={() => handleToggleSubPerm('staff', 'view')}
                      className="rounded accent-[#C5A059]"
                    />
                    <span>عرض قائمة الفريق</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentPerms.staff.manage}
                      onChange={() => handleToggleSubPerm('staff', 'manage')}
                      className="rounded accent-[#C5A059]"
                    />
                    <span>إدارة الرواتب والصلاحيات</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                onClick={handleSave}
                className="w-full bg-[#C5A059] hover:bg-[#D4AF37] text-black py-3 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                <span>حفظ التعديلات</span>
              </button>

              {saveSuccess && (
                <div className="mt-2 text-center text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 py-1.5 rounded-lg">
                  ✓ تم تحديث صلاحيات الموظف بنجاح
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
