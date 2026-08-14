import React, { useState } from 'react';
import { Client } from '../types';

interface ClientsViewProps {
  clients: Client[];
  onAddNewClient: () => void;
  onBookAppointmentForClient: (client: Client) => void;
  onEditClient: (client: Client) => void;
  currencySymbol?: string;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  onAddNewClient,
  onBookAppointmentForClient,
  onEditClient,
  currencySymbol = 'EGP',
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'vip' | 'new'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string>(() => clients[0]?.id || 'c-1');

  const filteredClients = clients.filter((client) => {
    // Search match
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery);

    if (!matchesSearch) return false;

    if (filterTab === 'vip') return client.isVip;
    if (filterTab === 'new') {
      const reg = new Date(client.registeredDate);
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return reg >= sixMonthsAgo;
    }
    return true;
  });

  const selectedClient = clients.find((c) => c.id === selectedClientId) || clients[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#F5F5F0] tracking-tight">إدارة العملاء</h2>
          <p className="text-sm text-[#9A9A9A] mt-0.5">عرض وتعديل بيانات العملاء وسجل الزيارات والمصروفات</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Tabs */}
          <div className="bg-[#161616] border border-[#2A2A2A] p-1 rounded-xl flex items-center gap-1 text-xs font-bold">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterTab === 'all' ? 'bg-[#262626] text-[#F5F5F0] shadow-sm' : 'text-[#9A9A9A] hover:text-[#F5F5F0]'
              }`}
            >
              الكل ({clients.length})
            </button>
            <button
              onClick={() => setFilterTab('vip')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                filterTab === 'vip' ? 'bg-[#C5A059] text-black font-bold shadow-sm' : 'text-[#C5A059] hover:bg-[#202020]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">star</span>
              VIP ({clients.filter((c) => c.isVip).length})
            </button>
            <button
              onClick={() => setFilterTab('new')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterTab === 'new' ? 'bg-[#262626] text-[#F5F5F0] shadow-sm' : 'text-[#9A9A9A] hover:text-[#F5F5F0]'
              }`}
            >
              الجدد
            </button>
          </div>

          <button
            onClick={onAddNewClient}
            className="bg-[#C5A059] text-black px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#D4AF37] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>إضافة عميل جديد</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Clients Table (7 or 8 columns) */}
        <div className="lg:col-span-7 xl:col-span-8 glass-card rounded-2xl border border-[#262626] overflow-hidden bg-[#121212]">
          {/* Search bar above table */}
          <div className="p-4 border-b border-[#262626] bg-[#161616] flex items-center">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#76777d] text-[20px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="البحث باسم العميل أو رقم الهاتف..."
                className="w-full pl-4 pr-10 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-sm text-[#F5F5F0] placeholder:text-[#666666] focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-[#161616] text-xs font-mono text-[#9A9A9A] border-b border-[#262626]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">العميل</th>
                  <th className="py-3.5 px-4 font-semibold">رقم الهاتف</th>
                  <th className="py-3.5 px-4 font-semibold hidden sm:table-cell">تاريخ التسجيل</th>
                  <th className="py-3.5 px-4 font-semibold hidden md:table-cell">آخر زيارة</th>
                  <th className="py-3.5 px-4 font-semibold">الحالة</th>
                  <th className="py-3.5 px-4 font-semibold text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222] bg-[#121212]">
                {filteredClients.map((client) => {
                  const isSelected = client.id === selectedClientId;
                  return (
                    <tr
                      key={client.id}
                      onClick={() => setSelectedClientId(client.id)}
                      className={`hover:bg-[#181818] transition-colors cursor-pointer ${
                        isSelected ? 'bg-[#C5A059]/10' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                              client.isVip
                                ? 'bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40'
                                : 'bg-[#1E1E1E] text-[#D4CFC9]'
                            }`}
                          >
                            {client.initials}
                          </div>
                          <div>
                            <div className="font-bold text-[#F5F5F0] flex items-center gap-1.5">
                              <span>{client.name}</span>
                              {client.isVip && (
                                <span className="text-[#C5A059] material-symbols-outlined text-[15px]" title="VIP">
                                  star
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-xs text-[#9A9A9A]">{client.phone}</td>

                      <td className="py-3 px-4 font-mono text-xs text-[#76777d] hidden sm:table-cell">
                        {client.registeredDate}
                      </td>

                      <td className="py-3 px-4 font-mono text-xs text-[#76777d] hidden md:table-cell">
                        {client.lastVisit}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold inline-block border ${
                            client.status === 'نشط'
                              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                              : client.status === 'في موعد'
                              ? 'bg-amber-950/40 text-amber-400 border-amber-800/40'
                              : 'bg-[#202020] text-[#9A9A9A] border-[#333333]'
                          }`}
                        >
                          {client.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditClient(client);
                            }}
                            className="p-1 hover:bg-[#202020] rounded text-[#9A9A9A] hover:text-[#F5F5F0] transition-colors"
                            title="تعديل بيانات العميل"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onBookAppointmentForClient(client);
                            }}
                            className="p-1 hover:bg-[#202020] rounded text-[#C5A059] transition-colors"
                            title="حجز موعد"
                          >
                            <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
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

        {/* Right: Client Details Card (4 or 5 columns) */}
        {selectedClient && (
          <div className="lg:col-span-5 xl:col-span-4 glass-card rounded-2xl p-6 border border-[#262626] bg-[#121212] sticky top-20 shadow-sm space-y-6">
            {/* Header & VIP Banner */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center font-bold text-xl border-2 border-[#C5A059]/30">
                  {selectedClient.initials}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#F5F5F0]">{selectedClient.name}</h3>
                  <p className="text-xs text-[#9A9A9A]">عضو منذ {selectedClient.registeredDate}</p>
                </div>
              </div>

              {selectedClient.isVip ? (
                <span className="bg-[#C5A059]/15 text-[#C5A059] px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1 border border-[#C5A059]/30">
                  <span className="material-symbols-outlined text-[15px]">star</span>
                  VIP
                </span>
              ) : (
                <span className="bg-[#1C1C1C] text-[#9A9A9A] px-3 py-1 rounded-full font-bold text-xs border border-[#2A2A2A]">
                  عميل عادي
                </span>
              )}
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-[#161616] rounded-xl border border-[#262626]">
              <div>
                <span className="text-xs text-[#9A9A9A] block mb-1">إجمالي الإنفاق</span>
                <span className="font-mono text-lg font-bold text-[#F5F5F0]">
                  {selectedClient.totalSpent.toLocaleString()} <span className="text-xs font-sans text-[#C5A059]">{currencySymbol}</span>
                </span>
              </div>
              <div className="border-r border-[#262626] pr-3">
                <span className="text-xs text-[#9A9A9A] block mb-1">عدد الزيارات</span>
                <span className="font-mono text-lg font-bold text-[#F5F5F0]">{selectedClient.visitsCount} زيارة</span>
              </div>
            </div>

            {/* Preferred Barber */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-[#9A9A9A] uppercase tracking-wider font-mono">
                الحلاق المفضل
              </h4>
              <div className="flex items-center gap-3 p-3 bg-[#161616] rounded-xl border border-[#262626]">
                <div className="w-11 h-11 rounded-full overflow-hidden border border-[#2A2A2A] flex-shrink-0 bg-[#222222]">
                  <img
                    src={selectedClient.preferredBarberImage}
                    alt={selectedClient.preferredBarberName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-[#F5F5F0] truncate">
                    {selectedClient.preferredBarberName}
                  </div>
                  <div className="text-xs text-[#9A9A9A] truncate">
                    {selectedClient.preferredBarberRole}
                  </div>
                </div>
                <div className="flex items-center text-xs font-bold text-[#C5A059] bg-[#C5A059]/15 border border-[#C5A059]/30 px-2 py-1 rounded-lg">
                  <span className="material-symbols-outlined text-[14px] text-[#C5A059] ml-1">star</span>
                  4.9
                </div>
              </div>
            </div>

            {/* Visit History */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-xs text-[#9A9A9A] uppercase tracking-wider font-mono">
                  سجل الزيارات الأخيرة
                </h4>
                <span className="text-xs text-[#76777d] font-mono">{selectedClient.visitHistory.length} زيارات</span>
              </div>

              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {selectedClient.visitHistory.map((hist) => (
                  <div
                    key={hist.id}
                    className="p-2.5 rounded-xl border border-[#262626] bg-[#161616] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-[#F5F5F0]">{hist.serviceName}</div>
                      <div className="text-[#9A9A9A] text-[11px] font-mono mt-0.5">
                        {hist.date} • مع {hist.barberName}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-[#F5F5F0]">
                      {hist.price} <span className="text-[10px] font-sans text-[#C5A059]">{currencySymbol}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2 border-t border-[#262626]">
              <button
                onClick={() => onBookAppointmentForClient(selectedClient)}
                className="flex-1 bg-[#C5A059] text-black py-2.5 rounded-xl font-bold text-xs hover:bg-[#D4AF37] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                <span>حجز موعد</span>
              </button>
              <button
                onClick={() => onEditClient(selectedClient)}
                className="px-4 bg-[#1E1E1E] border border-[#2A2A2A] text-[#D4CFC9] py-2.5 rounded-xl font-bold text-xs hover:bg-[#282828] hover:text-white transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
                <span>تعديل</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
