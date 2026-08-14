import React from 'react';
import { SaleInvoice } from '../../types';

interface ReceiptModalProps {
  invoice: SaleInvoice | null;
  onClose: () => void;
  currencySymbol?: string;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  invoice,
  onClose,
  currencySymbol = 'EGP',
}) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#141414] rounded-2xl w-full max-w-md border border-[#2A2A2A] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        {/* Modal Actions Header */}
        <div className="p-4 border-b border-[#262626] flex items-center justify-between bg-[#181818] no-print">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#C5A059] text-[22px]">receipt_long</span>
            <span className="font-bold text-sm text-[#F5F5F0]">فاتورة ضريبية مبسطة</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-[#C5A059] hover:bg-[#D4AF37] text-black px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>طباعة الفاتورة</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#9A9A9A] hover:text-[#F5F5F0] rounded-lg hover:bg-[#222222] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="p-6 overflow-y-auto font-mono text-xs flex-1 bg-[#1A1A1A] text-[#D4CFC9] print:bg-white print:text-black" id="printable-receipt">
          {/* Brand Header */}
          <div className="text-center pb-4 border-b border-dashed border-[#333333] print:border-neutral-300">
            <div className="w-12 h-12 rounded-xl bg-[#C5A059] text-black flex items-center justify-center font-bold text-2xl mx-auto mb-2 font-sans shadow-md">
              ص
            </div>
            <h2 className="text-base font-bold text-[#F5F5F0] print:text-black font-sans">صالون النخبة للحلاقة الرجالية</h2>
            <p className="text-[11px] text-[#9A9A9A] print:text-neutral-500 font-sans mt-0.5">الفرع الرئيسي • الرقم الضريبي: 300928172600003</p>
            <p className="text-[10px] text-[#707070] print:text-neutral-400 font-sans">هاتف: 01012345678</p>
          </div>

          {/* Invoice Meta */}
          <div className="py-3 border-b border-dashed border-[#333333] print:border-neutral-300 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-[#9A9A9A] print:text-neutral-500">رقم الفاتورة:</span>
              <span className="font-bold text-[#F5F5F0] print:text-black">#{invoice.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9A9A9A] print:text-neutral-500">التاريخ والوقت:</span>
              <span className="text-[#F5F5F0] print:text-black">{invoice.timestamp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9A9A9A] print:text-neutral-500">اسم العميل:</span>
              <span className="font-bold text-[#F5F5F0] print:text-black font-sans">{invoice.clientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9A9A9A] print:text-neutral-500">الحلاق المسؤول:</span>
              <span className="font-bold text-[#F5F5F0] print:text-black font-sans">{invoice.barberName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9A9A9A] print:text-neutral-500">طريقة الدفع:</span>
              <span className="font-bold text-[#F5F5F0] print:text-black font-sans">
                {invoice.paymentMethod === 'cash' ? 'كاش (نقدي)' : invoice.paymentMethod === 'card' ? 'فيزا / مدى' : 'المحفظة'}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div className="py-3 border-b border-dashed border-[#333333] print:border-neutral-300">
            <div className="flex justify-between text-[10px] text-[#9A9A9A] print:text-neutral-400 mb-2 font-sans font-bold">
              <span>البيان والخدمة</span>
              <span>الكمية × السعر</span>
              <span>الإجمالي</span>
            </div>
            <div className="space-y-2">
              {invoice.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <div className="flex-1 font-sans font-bold text-[#F5F5F0] print:text-black">
                    {item.name}
                  </div>
                  <div className="w-20 text-center text-[#9A9A9A] print:text-neutral-500 text-[11px]">
                    {item.quantity} × {item.price}
                  </div>
                  <div className="font-bold text-[#C5A059] print:text-black">
                    {item.price * item.quantity} {currencySymbol}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Breakdown */}
          <div className="py-3 border-b border-dashed border-[#333333] print:border-neutral-300 space-y-1.5 text-xs">
            <div className="flex justify-between text-[#9A9A9A] print:text-neutral-600">
              <span className="font-sans">المجموع الفرعي (غير شامل):</span>
              <span>{invoice.subtotal.toFixed(2)} {currencySymbol}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between text-red-400 print:text-red-600 font-bold">
                <span className="font-sans">الخصم الممنوح:</span>
                <span>-{invoice.discount.toFixed(2)} {currencySymbol}</span>
              </div>
            )}
            <div className="flex justify-between text-[#9A9A9A] print:text-neutral-600">
              <span className="font-sans">ضريبة القيمة المضافة (15%):</span>
              <span>{invoice.tax.toFixed(2)} {currencySymbol}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-[#F5F5F0] print:text-black pt-1 border-t border-[#2A2A2A] print:border-neutral-200">
              <span className="font-sans">المبلغ الإجمالي المستحق:</span>
              <span className="font-mono text-base text-[#C5A059] print:text-black">{invoice.total.toFixed(2)} {currencySymbol}</span>
            </div>
          </div>

          {/* QR Code & Barcode Placeholder */}
          <div className="pt-4 text-center space-y-2">
            <div className="w-24 h-24 mx-auto border-2 border-[#C5A059] print:border-black p-1 rounded bg-[#111111] print:bg-white flex items-center justify-center">
              <div className="w-full h-full grid grid-cols-4 gap-0.5 p-1 bg-[#111111] print:bg-black">
                <div className="bg-[#C5A059] print:bg-white rounded-xs" />
                <div className="bg-[#111111] print:bg-black" />
                <div className="bg-[#C5A059] print:bg-white rounded-xs" />
                <div className="bg-[#C5A059] print:bg-white rounded-xs" />
                <div className="bg-[#111111] print:bg-black" />
                <div className="bg-[#C5A059] print:bg-white rounded-xs" />
                <div className="bg-[#111111] print:bg-black" />
                <div className="bg-[#C5A059] print:bg-white rounded-xs" />
                <div className="bg-[#C5A059] print:bg-white rounded-xs" />
                <div className="bg-[#111111] print:bg-black" />
                <div className="bg-[#C5A059] print:bg-white rounded-xs" />
                <div className="bg-[#111111] print:bg-black" />
                <div className="bg-[#C5A059] print:bg-white rounded-xs" />
                <div className="bg-[#C5A059] print:bg-white rounded-xs" />
                <div className="bg-[#111111] print:bg-black" />
                <div className="bg-[#C5A059] print:bg-white rounded-xs" />
              </div>
            </div>
            <p className="text-[10px] text-[#9A9A9A] print:text-neutral-500 font-sans">
              شكراً لزيارتكم صالون النخبة • يسعدنا تقييمكم دائماً
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
