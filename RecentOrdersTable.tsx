'use client';

import clsx from 'clsx';
import { formatDate } from '@/lib/utils';

type OrderRow = {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
};

const statusStyles: Record<string, string> = {
  NEW: 'bg-blue-50 text-blue-700',
  PROCESSING: 'bg-amber-50 text-amber-700',
  SHIPPED: 'bg-purple-50 text-purple-700',
  DELIVERED: 'bg-green-50 text-green-700',
  CANCELLED: 'bg-red-50 text-red-500',
};

const paymentStyles: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700',
  CONFIRMED: 'bg-green-50 text-green-700',
};

type Props = {
  orders: OrderRow[];
  locale: string;
};

export function RecentOrdersTable({ orders, locale }: Props) {
  const isAr = locale === 'ar';

  if (orders.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <p className="text-sm text-brand-charcoal/40">
          {isAr ? 'لا توجد طلبات بعد' : 'No orders yet'}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-brand-charcoal/8">
            <th className="text-left rtl:text-right px-6 py-3 text-[11px] font-medium tracking-wider uppercase text-brand-charcoal/40">
              {isAr ? 'رقم الطلب' : 'Order'}
            </th>
            <th className="text-left rtl:text-right px-6 py-3 text-[11px] font-medium tracking-wider uppercase text-brand-charcoal/40">
              {isAr ? 'العميل' : 'Customer'}
            </th>
            <th className="text-left rtl:text-right px-6 py-3 text-[11px] font-medium tracking-wider uppercase text-brand-charcoal/40">
              {isAr ? 'المجموع' : 'Total'}
            </th>
            <th className="text-left rtl:text-right px-6 py-3 text-[11px] font-medium tracking-wider uppercase text-brand-charcoal/40">
              {isAr ? 'الحالة' : 'Status'}
            </th>
            <th className="text-left rtl:text-right px-6 py-3 text-[11px] font-medium tracking-wider uppercase text-brand-charcoal/40">
              {isAr ? 'الدفع' : 'Payment'}
            </th>
            <th className="text-left rtl:text-right px-6 py-3 text-[11px] font-medium tracking-wider uppercase text-brand-charcoal/40">
              {isAr ? 'التاريخ' : 'Date'}
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b border-brand-charcoal/5 hover:bg-brand-cream/50 transition-colors"
            >
              <td className="px-6 py-4">
                <span className="text-sm font-medium text-brand-charcoal">
                  {order.orderNumber}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-brand-charcoal/70">
                  {order.customerName}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm font-medium text-brand-charcoal">
                  {order.total.toFixed(2)} {isAr ? 'د.أ' : 'JOD'}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={clsx(
                  'inline-block px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase rounded-full',
                  statusStyles[order.orderStatus] || 'bg-gray-100 text-gray-600'
                )}>
                  {order.orderStatus.replace('_', ' ')}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={clsx(
                  'inline-block px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase rounded-full',
                  paymentStyles[order.paymentStatus] || 'bg-gray-100 text-gray-600'
                )}>
                  {order.paymentStatus}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-xs text-brand-charcoal/40">
                  {formatDate(order.createdAt, locale)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
