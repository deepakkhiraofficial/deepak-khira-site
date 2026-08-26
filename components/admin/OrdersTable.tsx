"use client";

import Link from "next/link";
import OrderStatusSelector from "./OrderStatusSelector";

type OrderStatus =
  | "placed"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

interface OrderUser {
  name?: string | null;
  email?: string | null;
}

interface OrderPayment {
  method?: string | null;
  paid?: boolean | null;
}

interface OrderItem {
  _id?: string;
  product?: unknown;
  quantity?: number;
}

interface Order {
  _id: string;
  status?: OrderStatus | string | null;
  user?: OrderUser | null;
  items?: OrderItem[] | null;
  totalPrice?: number | null;
  payment?: OrderPayment | null;
  createdAt?: string | Date | null;
}

interface OrdersTableProps {
  orders: Order[];
  onReload: () => void | Promise<void>;
}

// ============================================================
// CURRENCY
// ============================================================

const formatCurrency = (value: number | null | undefined): string => {
  return `₹${Number(value ?? 0).toLocaleString("en-IN")}`;
};

// ============================================================
// DATE
// ============================================================

const formatDate = (value: string | Date | null | undefined): string => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ============================================================
// STATUS STYLES
// ============================================================

const statusStyles: Record<OrderStatus, string> = {
  placed: "bg-blue-50 text-blue-700 ring-blue-600/20",

  confirmed: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",

  packed: "bg-purple-50 text-purple-700 ring-purple-600/20",

  shipped: "bg-amber-50 text-amber-700 ring-amber-600/20",

  delivered: "bg-green-50 text-green-700 ring-green-600/20",

  cancelled: "bg-red-50 text-red-700 ring-red-600/20",

  returned: "bg-orange-50 text-orange-700 ring-orange-600/20",
};

// ============================================================
// NORMALIZE STATUS
// ============================================================

const normalizeStatus = (value: string | null | undefined): OrderStatus => {
  switch (value) {
    case "placed":
    case "confirmed":
    case "packed":
    case "shipped":
    case "delivered":
    case "cancelled":
    case "returned":
      return value;

    default:
      return "placed";
  }
};

// ============================================================
// COMPONENT
// ============================================================

export default function OrdersTable({ orders, onReload }: OrdersTableProps) {
  // ==========================================================
  // INVALID DATA
  // ==========================================================

  if (!Array.isArray(orders)) {
    return null;
  }

  // ==========================================================
  // EMPTY STATE
  // ==========================================================

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
        <h3 className="text-lg font-semibold text-gray-900">No orders found</h3>

        <p className="mt-1 text-sm text-gray-500">
          There are no orders matching your current filters.
        </p>
      </div>
    );
  }

  // ==========================================================
  // TABLE
  // ==========================================================

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* ======================================================
          DESKTOP TABLE
      ======================================================= */}

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[1050px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Order
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Customer
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Items
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Total
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Payment
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Status
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Date
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => {
              const status = normalizeStatus(order.status);

              const statusClass = statusStyles[status];

              const itemCount = Array.isArray(order.items)
                ? order.items.length
                : 0;

              return (
                <tr key={order._id} className="transition hover:bg-gray-50/80">
                  {/* ORDER */}

                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/orders/${order._id}`}
                      className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      #{String(order._id).slice(-8)}
                    </Link>

                    <p className="mt-1 max-w-[140px] truncate text-xs text-gray-400">
                      {order._id}
                    </p>
                  </td>

                  {/* CUSTOMER */}

                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-900">
                      {order.user?.name || "Guest"}
                    </div>

                    <div className="mt-1 text-xs text-gray-500">
                      {order.user?.email || "—"}
                    </div>
                  </td>

                  {/* ITEMS */}

                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-900">{itemCount}</div>

                    <div className="text-xs text-gray-500">
                      {itemCount === 1 ? "Product" : "Products"}
                    </div>
                  </td>

                  {/* TOTAL */}

                  <td className="px-5 py-4">
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(order.totalPrice)}
                    </div>
                  </td>

                  {/* PAYMENT */}

                  <td className="px-5 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {order.payment?.method || "COD"}
                    </div>

                    <span
                      className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        order.payment?.paid
                          ? "bg-green-50 text-green-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {order.payment?.paid ? "Paid" : "Pending"}
                    </span>
                  </td>

                  {/* STATUS */}

                  <td className="px-5 py-4">
                    <div className="mb-2">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${statusClass}`}
                      >
                        {status}
                      </span>
                    </div>

                    <OrderStatusSelector
                      orderId={order._id}
                      current={status}
                      onUpdated={onReload}
                    />
                  </td>

                  {/* DATE */}

                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                    {formatDate(order.createdAt)}
                  </td>

                  {/* ACTIONS */}

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                      >
                        View
                      </Link>

                      <a
                        href={`/api/admin/orders/${order._id}/invoice`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-green-200 px-3 py-2 text-sm font-medium text-green-700 transition hover:bg-green-50"
                      >
                        Invoice
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ======================================================
          MOBILE CARDS
      ======================================================= */}

      <div className="divide-y divide-gray-100 lg:hidden">
        {orders.map((order) => {
          const status = normalizeStatus(order.status);

          const statusClass = statusStyles[status];

          const itemCount = Array.isArray(order.items) ? order.items.length : 0;

          return (
            <div key={order._id} className="space-y-4 p-5">
              {/* HEADER */}

              <div className="flex items-start justify-between gap-4">
                <div>
                  <Link
                    href={`/admin/orders/${order._id}`}
                    className="font-semibold text-blue-600"
                  >
                    #{String(order._id).slice(-8)}
                  </Link>

                  <p className="mt-1 text-xs text-gray-400">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${statusClass}`}
                >
                  {status}
                </span>
              </div>

              {/* CUSTOMER */}

              <div>
                <p className="font-medium text-gray-900">
                  {order.user?.name || "Guest"}
                </p>

                <p className="text-sm text-gray-500">
                  {order.user?.email || "—"}
                </p>
              </div>

              {/* ORDER SUMMARY */}

              <div className="grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4">
                <div>
                  <p className="text-xs text-gray-500">Items</p>

                  <p className="mt-1 font-semibold">{itemCount}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Total</p>

                  <p className="mt-1 font-semibold">
                    {formatCurrency(order.totalPrice)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Payment</p>

                  <p className="mt-1 font-medium">
                    {order.payment?.paid ? "Paid" : "Pending"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Method</p>

                  <p className="mt-1 font-medium">
                    {order.payment?.method || "COD"}
                  </p>
                </div>
              </div>

              {/* STATUS SELECTOR */}

              <OrderStatusSelector
                orderId={order._id}
                current={status}
                onUpdated={onReload}
              />

              {/* ACTIONS */}

              <div className="flex gap-2">
                <Link
                  href={`/admin/orders/${order._id}`}
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  View Order
                </Link>

                <a
                  href={`/api/admin/orders/${order._id}/invoice`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-lg border border-green-200 px-3 py-2 text-center text-sm font-medium text-green-700 hover:bg-green-50"
                >
                  Invoice
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
