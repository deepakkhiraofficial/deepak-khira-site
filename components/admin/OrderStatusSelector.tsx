"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const STATUS_ORDER = [
  "placed",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
];

const STATUS_LABELS = {
  placed: "Placed",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

export default function OrderStatusSelector({ orderId, current, onUpdated }) {
  const [status, setStatus] = useState(current || "placed");

  const [updating, setUpdating] = useState(false);

  // Keep selector synchronized when
  // parent/table data changes.
  useEffect(() => {
    setStatus(current || "placed");
  }, [current]);

  const updateStatus = async (newStatus) => {
    // Don't send duplicate request
    if (updating || newStatus === status) {
      return;
    }

    const previousStatus = status;

    try {
      setUpdating(true);

      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        cache: "no-store",

        body: JSON.stringify({
          status: newStatus,
        }),
      });

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid server response.");
      }

      // ====================================================
      // AUTH ERROR
      // ====================================================

      if (response.status === 401) {
        throw new Error("Admin session expired. Please login again.");
      }

      // ====================================================
      // API ERROR
      // ====================================================

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update order status.");
      }

      // ====================================================
      // SUCCESS
      // ====================================================

      setStatus(data.order?.status || newStatus);

      toast.success(
        `Order status updated to ${STATUS_LABELS[newStatus] || newStatus}`
      );

      // Refresh parent table
      if (onUpdated) {
        await onUpdated();
      }
    } catch (error) {
      console.error("ORDER STATUS UPDATE ERROR:", error);

      // Restore previous value
      setStatus(previousStatus);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update order status."
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="relative">
      <select
        value={status}
        disabled={updating}
        onChange={(event) => updateStatus(event.target.value)}
        className={`min-w-[140px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium capitalize text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
          updating
            ? "cursor-wait opacity-60"
            : "cursor-pointer hover:border-gray-300"
        }`}
      >
        {STATUS_ORDER.map((item) => (
          <option key={item} value={item}>
            {STATUS_LABELS[item] || item}
          </option>
        ))}
      </select>

      {updating && (
        <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
        </div>
      )}
    </div>
  );
}
