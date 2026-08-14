export type TabType = 
  | 'overview'
  | 'appointments'
  | 'clients'
  | 'services'
  | 'addons'
  | 'packages'
  | 'groom_packages'
  | 'sales'
  | 'staff'
  | 'expenses'
  | 'reports'
  | 'settings';

export interface Client {
  id: string;
  name: string;
  phone: string;
  initials: string;
  registeredDate: string;
  lastVisit: string;
  status: 'نشط' | 'في موعد' | 'غير نشط';
  isVip: boolean;
  totalSpent: number;
  visitsCount: number;
  preferredBarberId: string;
  preferredBarberName: string;
  preferredBarberRole: string;
  preferredBarberImage: string;
  visitHistory: {
    id: string;
    serviceName: string;
    date: string;
    barberName: string;
    price: number;
  }[];
}

export interface EmployeePermissions {
  customers: {
    enabled: boolean;
    view: boolean;
    add: boolean;
    edit: boolean;
    delete: boolean;
  };
  sales: {
    enabled: boolean;
    view: boolean;
    add: boolean;
    edit: boolean;
    cancelInvoice: boolean;
  };
  staff: {
    enabled: boolean;
    view: boolean;
    manage: boolean;
  };
}

export interface Employee {
  id: string;
  name: string;
  role: 'Barber' | 'Manager' | 'Cashier' | 'أخصائي شعر ولحية' | 'أخصائي عناية';
  phone: string;
  status: 'نشط' | 'إجازة' | 'غير نشط';
  rating: number;
  clientsCount: number;
  servicesCount: number;
  totalSales: number;
  avatarUrl: string;
  permissions: EmployeePermissions;
}

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
  category: 'الخدمات' | 'الإضافات' | 'الباقات' | 'باقات العريس' | 'منتجات العناية';
  icon: string;
  borderAccent?: string;
  description?: string;
}

export interface PackageItem {
  id: string;
  name: string;
  price: number;
  type: 'standard' | 'groom';
  isPopular?: boolean;
  isActive: boolean;
  features: string[];
}

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  barberId: string;
  barberName: string;
  serviceName: string;
  time: string;
  period: 'ص' | 'م' | 'AM' | 'PM';
  date: string;
  status: 'جاري الآن' | 'قادم' | 'مكتمل' | 'مؤكد' | 'قيد الانتظار' | 'ملغي';
  price: number;
  icon?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  duration?: number;
}

export interface SaleInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  timestamp: string;
  clientName: string;
  clientPhone?: string;
  barberId: string;
  barberName: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'wallet';
  status: 'مدفوع' | 'آجل' | 'ملغي';
}

export interface ExpenseItem {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  type: 'appointment' | 'sale' | 'system';
}
