"use client";

import Script from "next/script";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCart } from "@/components/cart/CartContext";

type PaymentMethod = "COD" | "ONLINE";

type FormData = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
};

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

type AuthResponse = {
  success: boolean;
  authenticated: boolean;
  user: AuthUser | null;
};

type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;

  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };

  notes?: Record<string, string>;

  theme?: {
    color?: string;
  };

  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    backdropclose?: boolean;
    confirm_close?: boolean;
  };

  handler: (response: RazorpaySuccessResponse) => void;
};

const initialForm: FormData = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
  region: "",
  postalCode: "",
  country: "India",
};

export default function CheckoutPage() {
  const router = useRouter();

  const { cartItems, removeFromCart, clearCart } = useCart();

  const [form, setForm] = useState<FormData>(initialForm);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");

  const [loading, setLoading] = useState(false);

  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const [errors, setErrors] = useState<Partial<FormData>>({});

  // ============================================================
  // CART CALCULATION
  // ============================================================

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum: number, item: any) => {
      const price = Number(item?.product?.price) || 0;

      const quantity = Number(item?.quantity) || 0;

      return sum + price * quantity;
    }, 0);
  }, [cartItems]);

  const shipping = subtotal > 0 ? 50 : 0;

  const estimatedTotal = subtotal + shipping;

  // ============================================================
  // FORM UPDATE
  // ============================================================

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  // ============================================================
  // VALIDATION
  // ============================================================

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    const fullName = form.fullName.trim();

    const phone = form.phone.replace(/\D/g, "");

    const address = form.address.trim();

    const city = form.city.trim();

    const region = form.region.trim();

    const postalCode = form.postalCode.trim();

    // NAME

    if (!fullName) {
      newErrors.fullName = "Full name is required.";
    } else if (fullName.length < 2) {
      newErrors.fullName = "Please enter a valid name.";
    } else if (!/^[a-zA-Z\s.'-]+$/.test(fullName)) {
      newErrors.fullName = "Name contains invalid characters.";
    }

    // PHONE

    if (!phone) {
      newErrors.phone = "Mobile number is required.";
    } else if (!/^[6-9]\d{9}$/.test(phone)) {
      newErrors.phone = "Enter a valid 10-digit Indian mobile number.";
    }

    // ADDRESS

    if (!address) {
      newErrors.address = "Delivery address is required.";
    } else if (address.length < 10) {
      newErrors.address = "Please enter a complete delivery address.";
    } else if (address.length > 250) {
      newErrors.address = "Address cannot exceed 250 characters.";
    }

    // CITY

    if (!city) {
      newErrors.city = "City is required.";
    } else if (city.length < 2) {
      newErrors.city = "Enter a valid city.";
    }

    // STATE

    if (!region) {
      newErrors.region = "State is required.";
    } else if (region.length < 2) {
      newErrors.region = "Enter a valid state.";
    }

    // PIN

    if (!postalCode) {
      newErrors.postalCode = "PIN code is required.";
    } else if (!/^\d{6}$/.test(postalCode)) {
      newErrors.postalCode = "Enter a valid 6-digit PIN code.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ============================================================
  // SAFE JSON RESPONSE
  // ============================================================

  const readJsonResponse = async (
    response: Response,
    fallbackMessage: string
  ) => {
    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      const text = await response.text();

      console.error("NON JSON RESPONSE:", text);

      throw new Error(fallbackMessage);
    }

    return response.json();
  };

  // ============================================================
  // PLACE ORDER
  // ============================================================

  const placeOrder = async () => {
    if (loading) {
      return;
    }

    // ----------------------------------------------------------
    // CART
    // ----------------------------------------------------------

    if (!cartItems.length) {
      toast.error("Your cart is empty.");

      router.push("/cart");

      return;
    }

    // ----------------------------------------------------------
    // CART VALIDATION
    // ----------------------------------------------------------

    for (const item of cartItems) {
      if (!item?.product?._id) {
        toast.error("Invalid product in cart.");

        return;
      }

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        toast.error("Invalid product quantity.");

        return;
      }
    }

    // ----------------------------------------------------------
    // FORM VALIDATION
    // ----------------------------------------------------------

    if (!validateForm()) {
      toast.error("Please correct the highlighted fields.");

      return;
    }

    // ----------------------------------------------------------
    // ONLINE PAYMENT GATEWAY CHECK
    // ----------------------------------------------------------

    if (paymentMethod === "ONLINE" && !razorpayLoaded) {
      toast.error("Payment gateway is loading. Please try again in a moment.");

      return;
    }

    try {
      setLoading(true);

      // ========================================================
      // ITEMS
      // ========================================================

      const items = cartItems.map((item: any) => ({
        productId: item.product._id,

        quantity: Number(item.quantity),
      }));

      // ========================================================
      // STEP 1
      // CREATE INTERNAL MONGODB ORDER
      // ========================================================

      const orderResponse = await fetch("/api/orders", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          items,

          shippingAddress: {
            fullName: form.fullName.trim(),

            address: form.address.trim(),

            city: form.city.trim(),

            region: form.region.trim(),

            postalCode: form.postalCode.trim(),

            country: "India",

            phone: form.phone.replace(/\D/g, ""),
          },

          paymentMethod,

          notes: "",
        }),
      });

      const orderData = await readJsonResponse(
        orderResponse,
        "Server returned an invalid order response."
      );

      if (!orderResponse.ok || !orderData?.success) {
        throw new Error(orderData?.message || "Unable to create order.");
      }

      const internalOrderId = orderData?.order?.id;

      if (!internalOrderId) {
        throw new Error("Order ID was not returned by server.");
      }

      // ========================================================
      // COD
      // ========================================================

      if (paymentMethod === "COD") {
        clearCart();

        toast.success("Order placed successfully!");

        router.replace(`/orders/${internalOrderId}`);

        return;
      }

      // ========================================================
      // ONLINE PAYMENT
      // ========================================================

      if (
        typeof window === "undefined" ||
        typeof window.Razorpay !== "function"
      ) {
        throw new Error(
          "Razorpay checkout is unavailable. Please refresh the page and try again."
        );
      }

      // ========================================================
      // STEP 2
      // CREATE RAZORPAY ORDER
      // ========================================================

      const paymentResponse = await fetch("/api/payment/create-order", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          orderId: internalOrderId,
        }),
      });

      const paymentData = await readJsonResponse(
        paymentResponse,
        "Payment server returned an invalid response."
      );

      if (!paymentResponse.ok || !paymentData?.success) {
        throw new Error(
          paymentData?.message || "Unable to initialize payment."
        );
      }

      const razorpayOrder = paymentData?.razorpayOrder;

      const razorpayKey = paymentData?.key;

      if (!razorpayKey || !razorpayOrder?.id) {
        throw new Error("Payment gateway configuration is incomplete.");
      }

      const amount = Number(razorpayOrder.amount);

      if (!Number.isInteger(amount) || amount < 100) {
        throw new Error("Invalid Razorpay payment amount.");
      }

      // ========================================================
      // STEP 3
      // RAZORPAY CHECKOUT OPTIONS
      // ========================================================

      const razorpayOptions: RazorpayOptions = {
        key: razorpayKey,

        amount,

        currency: razorpayOrder.currency || "INR",

        name: "Deepak Khira Enterprises",

        description: `Order #${internalOrderId}`,

        image: `${window.location.origin}/business_logo.png`,

        order_id: razorpayOrder.id,

        prefill: {
          name: form.fullName.trim(),

          contact: form.phone.replace(/\D/g, ""),
        },

        notes: {
          internal_order_id: internalOrderId,
        },

        theme: {
          color: "#4f46e5",
        },

        modal: {
          ondismiss: () => {
            setLoading(false);

            toast.info(
              "Payment cancelled. Your order is still pending. You can try payment again."
            );
          },

          escape: true,

          backdropclose: false,

          confirm_close: true,
        },

        // ======================================================
        // PAYMENT SUCCESS
        // ======================================================

        handler: async (response) => {
          try {
            setLoading(true);

            if (
              !response?.razorpay_payment_id ||
              !response?.razorpay_order_id ||
              !response?.razorpay_signature
            ) {
              throw new Error(
                "Incomplete payment response received from Razorpay."
              );
            }

            // ================================================
            // STEP 4
            // VERIFY PAYMENT
            // ================================================

            const verifyResponse = await fetch("/api/payment/verify-payment", {
              method: "POST",

              headers: {
                "Content-Type": "application/json",

                Accept: "application/json",
              },

              credentials: "include",

              body: JSON.stringify({
                orderId: internalOrderId,

                razorpay_payment_id: response.razorpay_payment_id,

                razorpay_order_id: response.razorpay_order_id,

                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await readJsonResponse(
              verifyResponse,
              "Payment verification server returned an invalid response."
            );

            if (!verifyResponse.ok || !verifyData?.success) {
              throw new Error(
                verifyData?.message || "Payment verification failed."
              );
            }

            // ================================================
            // ONLY AFTER SERVER VERIFICATION
            // ================================================

            clearCart();

            toast.success("Payment successful! Order confirmed.");

            router.replace(`/orders/${internalOrderId}`);
          } catch (error) {
            console.error("PAYMENT VERIFY ERROR:", error);

            toast.error(
              error instanceof Error
                ? error.message
                : "Payment verification failed."
            );
          } finally {
            setLoading(false);
          }
        },
      };

      // ========================================================
      // STEP 5
      // OPEN RAZORPAY
      // ========================================================

      const checkout = new window.Razorpay(razorpayOptions);

      checkout.open();
    } catch (error) {
      console.error("PLACE ORDER ERROR:", error);

      toast.error(
        error instanceof Error ? error.message : "Unable to place order."
      );

      setLoading(false);
    }
  };

  // ============================================================
  // EMPTY CART
  // ============================================================

  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white border rounded-2xl shadow-sm p-10 text-center max-w-md w-full">
          <div className="text-5xl mb-4">🛒</div>

          <h1 className="text-2xl font-bold text-slate-900">
            Your cart is empty
          </h1>

          <p className="text-slate-500 mt-2">
            Add some products before proceeding to checkout.
          </p>

          <button
            type="button"
            onClick={() => router.push("/products")}
            className="mt-6 w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <>
      {/* ========================================================
          RAZORPAY SCRIPT
      ========================================================= */}

      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => {
          setRazorpayLoaded(
            typeof window !== "undefined" &&
              typeof window.Razorpay === "function"
          );
        }}
        onError={() => {
          setRazorpayLoaded(false);

          console.error("RAZORPAY SCRIPT LOAD ERROR");
        }}
      />

      <div className="min-h-screen bg-slate-50 py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* ======================================================
              HEADER
          ====================================================== */}

          <div className="mb-8">
            <button
              type="button"
              onClick={() => router.push("/cart")}
              className="text-sm text-indigo-600 hover:underline mb-3"
            >
              ← Back to Cart
            </button>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Checkout
            </h1>

            <p className="mt-2 text-slate-500">
              Enter your delivery details and choose your payment method.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ====================================================
                LEFT
            ==================================================== */}

            <section className="lg:col-span-2 space-y-6">
              {/* ADDRESS */}

              <div className="bg-white rounded-2xl border shadow-sm p-5 md:p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-900">
                    Delivery Address
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Where should we deliver your order?
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* NAME */}

                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-semibold mb-2"
                    >
                      Full Name *
                    </label>

                    <input
                      id="fullName"
                      type="text"
                      value={form.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      placeholder="Enter your full name"
                      maxLength={80}
                      autoComplete="name"
                      disabled={loading}
                      className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                        errors.fullName
                          ? "border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      }`}
                    />

                    {errors.fullName && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* PHONE */}

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold mb-2"
                    >
                      Mobile Number *
                    </label>

                    <input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        updateField(
                          "phone",
                          e.target.value.replace(/\D/g, "").slice(0, 10)
                        )
                      }
                      placeholder="10-digit mobile number"
                      inputMode="numeric"
                      maxLength={10}
                      autoComplete="tel"
                      disabled={loading}
                      className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                        errors.phone
                          ? "border-red-500"
                          : "border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      }`}
                    />

                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* ADDRESS */}

                  <div className="md:col-span-2">
                    <label
                      htmlFor="address"
                      className="block text-sm font-semibold mb-2"
                    >
                      Complete Address *
                    </label>

                    <textarea
                      id="address"
                      value={form.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      placeholder="House No., Street, Area, Landmark..."
                      rows={4}
                      maxLength={250}
                      autoComplete="street-address"
                      disabled={loading}
                      className={`w-full rounded-xl border px-4 py-3 resize-none outline-none transition ${
                        errors.address
                          ? "border-red-500"
                          : "border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      }`}
                    />

                    <div className="flex justify-between mt-1">
                      {errors.address ? (
                        <p className="text-xs text-red-500">{errors.address}</p>
                      ) : (
                        <span />
                      )}

                      <span className="text-xs text-slate-400">
                        {form.address.length}/250
                      </span>
                    </div>
                  </div>

                  {/* CITY */}

                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-semibold mb-2"
                    >
                      City *
                    </label>

                    <input
                      id="city"
                      type="text"
                      value={form.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      placeholder="City"
                      autoComplete="address-level2"
                      disabled={loading}
                      className={`w-full rounded-xl border px-4 py-3 outline-none ${
                        errors.city
                          ? "border-red-500"
                          : "border-slate-300 focus:border-indigo-500"
                      }`}
                    />

                    {errors.city && (
                      <p className="mt-1 text-xs text-red-500">{errors.city}</p>
                    )}
                  </div>

                  {/* STATE */}

                  <div>
                    <label
                      htmlFor="region"
                      className="block text-sm font-semibold mb-2"
                    >
                      State *
                    </label>

                    <input
                      id="region"
                      type="text"
                      value={form.region}
                      onChange={(e) => updateField("region", e.target.value)}
                      placeholder="State"
                      autoComplete="address-level1"
                      disabled={loading}
                      className={`w-full rounded-xl border px-4 py-3 outline-none ${
                        errors.region
                          ? "border-red-500"
                          : "border-slate-300 focus:border-indigo-500"
                      }`}
                    />

                    {errors.region && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.region}
                      </p>
                    )}
                  </div>

                  {/* PIN */}

                  <div>
                    <label
                      htmlFor="postalCode"
                      className="block text-sm font-semibold mb-2"
                    >
                      PIN Code *
                    </label>

                    <input
                      id="postalCode"
                      type="text"
                      value={form.postalCode}
                      onChange={(e) =>
                        updateField(
                          "postalCode",
                          e.target.value.replace(/\D/g, "").slice(0, 6)
                        )
                      }
                      placeholder="6-digit PIN"
                      inputMode="numeric"
                      maxLength={6}
                      autoComplete="postal-code"
                      disabled={loading}
                      className={`w-full rounded-xl border px-4 py-3 outline-none ${
                        errors.postalCode
                          ? "border-red-500"
                          : "border-slate-300 focus:border-indigo-500"
                      }`}
                    />

                    {errors.postalCode && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.postalCode}
                      </p>
                    )}
                  </div>

                  {/* COUNTRY */}

                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-semibold mb-2"
                    >
                      Country
                    </label>

                    <input
                      id="country"
                      type="text"
                      value="India"
                      disabled
                      className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500"
                    />
                  </div>
                </div>
              </div>

              {/* ==================================================
                  PAYMENT
              ================================================== */}

              <div className="bg-white rounded-2xl border shadow-sm p-5 md:p-6">
                <h2 className="text-xl font-bold text-slate-900">
                  Payment Method
                </h2>

                <p className="text-sm text-slate-500 mt-1 mb-5">
                  Choose how you want to pay.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* COD */}

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("COD")}
                    disabled={loading}
                    className={`text-left rounded-2xl border-2 p-5 transition ${
                      paymentMethod === "COD"
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold">Cash on Delivery</p>

                        <p className="text-sm text-slate-500 mt-1">
                          Pay when your order arrives.
                        </p>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border-2 ${
                          paymentMethod === "COD"
                            ? "border-indigo-600 bg-indigo-600"
                            : "border-slate-300"
                        }`}
                      />
                    </div>
                  </button>

                  {/* ONLINE */}

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("ONLINE")}
                    disabled={loading}
                    className={`text-left rounded-2xl border-2 p-5 transition ${
                      paymentMethod === "ONLINE"
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold">Online Payment</p>

                        <p className="text-sm text-slate-500 mt-1">
                          UPI, Card & Net Banking.
                        </p>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border-2 ${
                          paymentMethod === "ONLINE"
                            ? "border-indigo-600 bg-indigo-600"
                            : "border-slate-300"
                        }`}
                      />
                    </div>
                  </button>
                </div>

                {paymentMethod === "ONLINE" && (
                  <div className="mt-4 rounded-xl bg-indigo-50 border border-indigo-200 p-4 text-sm text-indigo-800">
                    <p className="font-semibold">Secure Online Payment</p>

                    <p className="mt-1">
                      Pay securely using UPI, Debit/Credit Card or Net Banking
                      through Razorpay.
                    </p>

                    {!razorpayLoaded && (
                      <p className="mt-2 text-xs font-medium text-indigo-600">
                        Payment gateway loading...
                      </p>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* ====================================================
                RIGHT — SUMMARY
            ==================================================== */}

            <aside className="lg:sticky lg:top-24 h-fit">
              <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <div className="p-5 border-b">
                  <h2 className="text-xl font-bold">Order Summary</h2>

                  <p className="text-sm text-slate-500 mt-1">
                    {cartItems.length}{" "}
                    {cartItems.length === 1 ? "item" : "items"} in your cart
                  </p>
                </div>

                {/* ITEMS */}

                <div className="p-5 space-y-4 max-h-[420px] overflow-y-auto">
                  {cartItems.map((item: any) => (
                    <div key={item.product._id} className="flex gap-3">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                        <Image
                          src={item.product.images?.[0] || "/placeholder.png"}
                          alt={item.product.name || "Product"}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm line-clamp-2">
                          {item.product.name}
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          Qty: {item.quantity}
                        </p>

                        <p className="font-bold text-sm mt-1">
                          ₹
                          {(
                            Number(item.product.price) * Number(item.quantity)
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product._id)}
                        disabled={loading}
                        className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {/* TOTAL */}

                <div className="border-t p-5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>

                    <span className="font-medium">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Shipping</span>

                    <span className="font-medium">
                      ₹{shipping.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-bold">Estimated Total</span>

                    <span className="text-xl font-bold text-indigo-600">
                      ₹{estimatedTotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* PLACE ORDER */}

                  <button
                    type="button"
                    onClick={placeOrder}
                    disabled={
                      loading || (paymentMethod === "ONLINE" && !razorpayLoaded)
                    }
                    className="w-full mt-3 rounded-xl bg-indigo-600 px-5 py-3.5 font-bold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 transition"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />

                        {paymentMethod === "ONLINE"
                          ? "Opening Payment..."
                          : "Placing Order..."}
                      </span>
                    ) : paymentMethod === "COD" ? (
                      "Place Order • COD"
                    ) : (
                      "Continue to Payment"
                    )}
                  </button>

                  <p className="text-xs text-center text-slate-400 mt-3">
                    By placing this order, you agree to our terms and
                    conditions.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
