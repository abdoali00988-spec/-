import React, { useState, useEffect } from 'react';
import {
  TabType,
  Client,
  Employee,
  ServiceItem,
  PackageItem,
  Appointment,
  SaleInvoice,
  ExpenseItem,
  NotificationItem,
  EmployeePermissions,
} from './types';
import {
  INITIAL_CLIENTS,
  INITIAL_EMPLOYEES,
  INITIAL_SERVICES,
  INITIAL_PACKAGES,
  INITIAL_APPOINTMENTS,
  INITIAL_INVOICES,
  INITIAL_EXPENSES,
  INITIAL_NOTIFICATIONS,
} from './mockData';

// Components
import { TopNavBar } from './components/TopNavBar';
import { SideNavBar } from './components/SideNavBar';
import { DashboardView } from './components/DashboardView';
import { SalesPOSView } from './components/SalesPOSView';
import { ClientsView } from './components/ClientsView';
import { PackagesView } from './components/PackagesView';
import { StaffView } from './components/StaffView';
import { ReportsView } from './components/ReportsView';
import { AppointmentsView } from './components/AppointmentsView';
import { ServicesManagementView } from './components/ServicesManagementView';
import { ExpensesView } from './components/ExpensesView';
import { SettingsView } from './components/SettingsView';

// Modals
import { ReceiptModal } from './components/modals/ReceiptModal';
import { NewBookingModal } from './components/modals/NewBookingModal';
import { NewClientModal } from './components/modals/NewClientModal';
import { NewStaffModal } from './components/modals/NewStaffModal';
import { NewPackageModal } from './components/modals/NewPackageModal';

export function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currencySymbol, setCurrencySymbol] = useState<string>('ج.م');

  // Core Data States with LocalStorage fallback
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('salon_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('salon_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('salon_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [packages, setPackages] = useState<PackageItem[]>(() => {
    const saved = localStorage.getItem('salon_packages');
    return saved ? JSON.parse(saved) : INITIAL_PACKAGES;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('salon_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [invoices, setInvoices] = useState<SaleInvoice[]>(() => {
    const saved = localStorage.getItem('salon_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    const saved = localStorage.getItem('salon_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('salon_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('salon_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('salon_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('salon_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('salon_packages', JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem('salon_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('salon_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('salon_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('salon_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Modal States
  const [receiptInvoice, setReceiptInvoice] = useState<SaleInvoice | null>(null);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [bookingPreselectedClient, setBookingPreselectedClient] = useState<Client | null>(null);
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isNewStaffOpen, setIsNewStaffOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Employee | null>(null);
  const [isNewPackageOpen, setIsNewPackageOpen] = useState(false);
  const [packageType, setPackageType] = useState<'standard' | 'groom'>('standard');
  const [editingPackage, setEditingPackage] = useState<PackageItem | null>(null);

  // Notifications
  const handleMarkNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const addNotification = (title: string, description: string, type: 'appointment' | 'sale' | 'system') => {
    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title,
      description,
      time: 'الآن',
      isRead: false,
      type,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Handlers for Sales / POS
  const handleCompleteSale = (newInvoice: SaleInvoice) => {
    setInvoices((prev) => [newInvoice, ...prev]);
    // update employee total sales
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === newInvoice.barberId
          ? {
              ...emp,
              totalSales: emp.totalSales + newInvoice.total,
              servicesCount: emp.servicesCount + newInvoice.items.length,
            }
          : emp
      )
    );
    // update client visits and total spent
    setClients((prev) =>
      prev.map((cl) =>
        cl.name === newInvoice.clientName
          ? {
              ...cl,
              totalSpent: cl.totalSpent + newInvoice.total,
              visitsCount: cl.visitsCount + 1,
              lastVisit: newInvoice.date,
              visitHistory: [
                {
                  id: 'vh-' + Date.now(),
                  serviceName: newInvoice.items.map((i) => i.name).join(' + '),
                  date: newInvoice.date,
                  barberName: newInvoice.barberName,
                  price: newInvoice.total,
                },
                ...cl.visitHistory,
              ],
            }
          : cl
      )
    );

    addNotification(
      `عملية بيع جديدة #${newInvoice.invoiceNumber}`,
      `تم إصدار فاتورة بقيمة ${newInvoice.total} ${currencySymbol} للعميل ${newInvoice.clientName}`,
      'sale'
    );

    // Open receipt modal for printing
    setReceiptInvoice(newInvoice);
  };

  // Handlers for Appointments
  const handleSaveAppointment = (newApt: Appointment) => {
    setAppointments((prev) => [newApt, ...prev]);
    addNotification(
      'موعد جديد تم تأكيده',
      `تم حجز موعد للعميل ${newApt.clientName} مع الحلاق ${newApt.barberName} الساعة ${newApt.time}`,
      'appointment'
    );
  };

  const handleUpdateAppointmentStatus = (aptId: string, newStatus: Appointment['status']) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === aptId ? { ...a, status: newStatus } : a))
    );
  };

  const handleConvertAppointmentToSale = (apt: Appointment) => {
    // Open POS and mark appointment as completed
    handleUpdateAppointmentStatus(apt.id, 'مكتمل');
    setActiveTab('sales');
  };

  // Handlers for Clients
  const handleSaveClient = (clientData: Client) => {
    if (editingClient) {
      setClients((prev) => prev.map((c) => (c.id === clientData.id ? clientData : c)));
    } else {
      setClients((prev) => [clientData, ...prev]);
      addNotification('عميل جديد مسجل', `تم تسجيل ملف العميل ${clientData.name} بنجاح`, 'system');
    }
  };

  // Handlers for Staff
  const handleSaveStaff = (staffData: Employee) => {
    if (editingStaff) {
      setEmployees((prev) => prev.map((e) => (e.id === staffData.id ? staffData : e)));
    } else {
      setEmployees((prev) => [...prev, staffData]);
    }
  };

  const handleUpdateEmployeePermissions = (empId: string, permissions: EmployeePermissions) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === empId ? { ...e, permissions } : e))
    );
  };

  // Handlers for Packages
  const handleSavePackage = (pkgData: PackageItem) => {
    if (editingPackage) {
      setPackages((prev) => prev.map((p) => (p.id === pkgData.id ? pkgData : p)));
    } else {
      setPackages((prev) => [...prev, pkgData]);
    }
  };

  const handleDeletePackage = (pkgId: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== pkgId));
  };

  const handleTogglePackageActive = (pkgId: string) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === pkgId ? { ...p, isActive: !p.isActive } : p))
    );
  };

  // Handlers for Services
  const handleAddService = (serviceData: Omit<ServiceItem, 'id'>) => {
    const newService: ServiceItem = {
      ...serviceData,
      id: 's-' + Date.now(),
    };
    setServices((prev) => [...prev, newService]);
  };

  const handleEditService = (serviceData: ServiceItem) => {
    setServices((prev) => prev.map((s) => (s.id === serviceData.id ? serviceData : s)));
  };

  const handleDeleteService = (serviceId: string) => {
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
  };

  // Handlers for Expenses
  const handleAddExpense = (expenseData: Omit<ExpenseItem, 'id'>) => {
    const newExp: ExpenseItem = {
      ...expenseData,
      id: 'exp-' + Date.now(),
    };
    setExpenses((prev) => [newExp, ...prev]);
  };

  const handleDeleteExpense = (expenseId: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#D4CFC9] flex antialiased selection:bg-[#C5A059]/30 selection:text-[#C5A059]" dir="rtl">
      {/* Top Header */}
      <TopNavBar
        activeTab={activeTab}
        onNavigate={setActiveTab}
        onOpenNewSale={() => setActiveTab('sales')}
        notifications={notifications}
        onMarkNotificationsRead={handleMarkNotificationsRead}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Side Navigation (Fixed Right) */}
      <SideNavBar
        activeTab={activeTab}
        onNavigate={setActiveTab}
        onOpenNewBooking={() => {
          setBookingPreselectedClient(null);
          setIsNewBookingOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 mr-0 md:mr-[280px] mt-16 p-4 sm:p-6 lg:p-8 min-w-0 max-w-[1700px] pb-24">
        {activeTab === 'overview' && (
          <DashboardView
            appointments={appointments}
            invoices={invoices}
            clientsCount={clients.length}
            servicesCount={services.length + packages.length}
            onNavigate={setActiveTab}
            onSelectInvoice={(inv) => setReceiptInvoice(inv)}
            currencySymbol={currencySymbol}
          />
        )}

        {activeTab === 'sales' && (
          <SalesPOSView
            services={services}
            packages={packages}
            employees={employees}
            clients={clients}
            onAddNewClient={() => {
              setEditingClient(null);
              setIsNewClientOpen(true);
            }}
            onCompleteSale={handleCompleteSale}
            currencySymbol={currencySymbol}
          />
        )}

        {activeTab === 'clients' && (
          <ClientsView
            clients={clients}
            onAddNewClient={() => {
              setEditingClient(null);
              setIsNewClientOpen(true);
            }}
            onBookAppointmentForClient={(client) => {
              setBookingPreselectedClient(client);
              setIsNewBookingOpen(true);
            }}
            onEditClient={(client) => {
              setEditingClient(client);
              setIsNewClientOpen(true);
            }}
            currencySymbol={currencySymbol}
          />
        )}

        {(activeTab === 'packages' || activeTab === 'groom_packages') && (
          <PackagesView
            packages={packages}
            defaultTab={activeTab === 'groom_packages' ? 'groom' : 'standard'}
            onAddNewPackage={(type) => {
              setEditingPackage(null);
              setPackageType(type);
              setIsNewPackageOpen(true);
            }}
            onEditPackage={(pkg) => {
              setEditingPackage(pkg);
              setPackageType(pkg.type);
              setIsNewPackageOpen(true);
            }}
            onDeletePackage={handleDeletePackage}
            onToggleActive={handleTogglePackageActive}
            currencySymbol={currencySymbol}
          />
        )}

        {activeTab === 'staff' && (
          <StaffView
            employees={employees}
            onAddNewStaff={() => {
              setEditingStaff(null);
              setIsNewStaffOpen(true);
            }}
            onUpdateEmployeePermissions={handleUpdateEmployeePermissions}
            onEditStaff={(emp) => {
              setEditingStaff(emp);
              setIsNewStaffOpen(true);
            }}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            employees={employees}
            invoices={invoices}
            currencySymbol={currencySymbol}
          />
        )}

        {activeTab === 'appointments' && (
          <AppointmentsView
            appointments={appointments}
            employees={employees}
            onOpenNewBooking={() => {
              setBookingPreselectedClient(null);
              setIsNewBookingOpen(true);
            }}
            onUpdateStatus={handleUpdateAppointmentStatus}
            onConvertToSale={handleConvertAppointmentToSale}
            currencySymbol={currencySymbol}
          />
        )}

        {(activeTab === 'services' || activeTab === 'addons') && (
          <ServicesManagementView
            services={services}
            categoryFilter={activeTab === 'addons' ? 'الإضافات' : 'الخدمات'}
            onAddService={handleAddService}
            onEditService={handleEditService}
            onDeleteService={handleDeleteService}
            currencySymbol={currencySymbol}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpensesView
            expenses={expenses}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
            currencySymbol={currencySymbol}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            currencySymbol={currencySymbol}
            onUpdateCurrency={setCurrencySymbol}
          />
        )}
      </main>

      {/* Modals */}
      <ReceiptModal
        invoice={receiptInvoice}
        onClose={() => setReceiptInvoice(null)}
        currencySymbol={currencySymbol}
      />

      <NewBookingModal
        isOpen={isNewBookingOpen}
        onClose={() => setIsNewBookingOpen(false)}
        clients={clients}
        employees={employees}
        services={services}
        preselectedClient={bookingPreselectedClient}
        onSaveAppointment={handleSaveAppointment}
      />

      <NewClientModal
        isOpen={isNewClientOpen}
        onClose={() => setIsNewClientOpen(false)}
        employees={employees}
        onSaveClient={handleSaveClient}
        editingClient={editingClient}
      />

      <NewStaffModal
        isOpen={isNewStaffOpen}
        onClose={() => setIsNewStaffOpen(false)}
        onSaveStaff={handleSaveStaff}
        editingStaff={editingStaff}
      />

      <NewPackageModal
        isOpen={isNewPackageOpen}
        onClose={() => setIsNewPackageOpen(false)}
        packageType={packageType}
        onSavePackage={handleSavePackage}
        editingPackage={editingPackage}
        currencySymbol={currencySymbol}
      />
    </div>
  );
}

export default App;
