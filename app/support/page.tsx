"use client";

import { FormEvent, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type SupportFormData = {
  name: string;
  email: string;
  orderId: string;
  message: string;
};

const INITIAL_FORM: SupportFormData = {
  name: "",
  email: "",
  orderId: "",
  message: "",
};

const SUPPORT_EMAIL = "deepakkhiraenterprises@gmail.com";
const SUPPORT_PHONE = "+919109001109";
const WHATSAPP_NUMBER = "919109001109";

export default function SupportPage() {
  const [formData, setFormData] = useState<SupportFormData>(INITIAL_FORM);

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const orderId = formData.orderId.trim();
    const message = formData.message.trim();

    if (!name) {
      toast.error("Please enter your name.");
      return;
    }

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!message) {
      toast.error("Please describe your issue or enquiry.");
      return;
    }

    if (message.length < 10) {
      toast.error("Please provide a little more information about your issue.");
      return;
    }

    if (message.length > 2000) {
      toast.error("Your message cannot exceed 2000 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          orderId,
          message,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message ||
            result?.error ||
            "Unable to submit your support request."
        );
      }

      toast.success(
        result?.message ||
          "Your support request has been submitted successfully."
      );

      setFormData(INITIAL_FORM);
    } catch (error) {
      console.error("Support form error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

      {/* =========================================================
          HERO
      ========================================================== */}

      <section className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20 lg:px-12 lg:py-24">
          <div className="max-w-4xl">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-blue-600 dark:bg-blue-400" />

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
                Customer Support
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl md:text-6xl dark:text-white">
              We&apos;re here to help.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 dark:text-slate-400">
              Need help with an order, product, payment, delivery, or service?
              Send us your request and our team will review it carefully.
            </p>

            <div className="mt-8 flex flex-wrap gap-5">
              <a
                href="#support-request"
                className="group inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                Create support request
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>

              <a
                href={`tel:${SUPPORT_PHONE}`}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-800 dark:hover:text-blue-400"
              >
                <Phone size={16} />
                +91 91090 01109
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          TRUST FEATURES
      ========================================================== */}

      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                <ShieldCheck size={19} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Secure Support
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Your support information is used to respond to your enquiry.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                <Clock3 size={19} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Support Hours
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Monday to Sunday · 9:00 AM – 9:00 PM
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                <MessageCircle size={19} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Multiple Channels
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Contact us through form, email, phone or WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          MAIN SUPPORT AREA
      ========================================================== */}

      <section id="support-request" className="bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20 lg:px-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
            {/* ===================================================
                FORM
            ==================================================== */}

            <div className="lg:col-span-7">
              <div className="mb-7">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
                  Submit a Request
                </p>

                <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
                  Tell us what you need help with
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base dark:text-slate-400">
                  Please provide accurate information so our team can understand
                  and handle your request efficiently.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                noValidate
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900/40"
              >
                <div className="space-y-6">
                  {/* Name + Email */}

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="support-name"
                        className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200"
                      >
                        Full Name
                        <span className="ml-1 text-blue-600">*</span>
                      </label>

                      <input
                        id="support-name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        autoComplete="name"
                        disabled={loading}
                        required
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="support-email"
                        className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200"
                      >
                        Email Address
                        <span className="ml-1 text-blue-600">*</span>
                      </label>

                      <input
                        id="support-email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        autoComplete="email"
                        disabled={loading}
                        required
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Order ID */}

                  <div>
                    <label
                      htmlFor="support-order-id"
                      className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200"
                    >
                      Order ID
                      <span className="text-xs font-normal text-slate-400">
                        Optional
                      </span>
                    </label>

                    <input
                      id="support-order-id"
                      name="orderId"
                      type="text"
                      value={formData.orderId}
                      onChange={handleChange}
                      placeholder="Example: 6a8e702b0e9073da3aad079f"
                      autoComplete="off"
                      disabled={loading}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />

                    <p className="mt-2 text-xs text-slate-400">
                      Adding your order ID helps us locate the relevant order
                      faster.
                    </p>
                  </div>

                  {/* Message */}

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="support-message"
                        className="text-sm font-semibold text-slate-800 dark:text-slate-200"
                      >
                        How Can We Help?
                        <span className="ml-1 text-blue-600">*</span>
                      </label>

                      <span className="text-xs text-slate-400">
                        {formData.message.length}/2000
                      </span>
                    </div>

                    <textarea
                      id="support-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Describe your issue or enquiry..."
                      rows={7}
                      maxLength={2000}
                      required
                      disabled={loading}
                      className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Security notice */}

                  <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
                    <ShieldCheck
                      size={18}
                      className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
                    />

                    <p className="text-xs leading-5 text-amber-800/80 dark:text-amber-300/70">
                      Never share your password, OTP, card number, UPI PIN, CVV,
                      banking credentials, or other sensitive payment
                      information in this form.
                    </p>
                  </div>

                  {/* Submit */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-slate-900/30 dark:border-t-slate-900" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Support Request
                        <ArrowRight
                          size={16}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-slate-400">
                    We will use the information provided to respond to your
                    support request.
                  </p>
                </div>
              </form>
            </div>

            {/* ===================================================
                CONTACT DETAILS
            ==================================================== */}

            <aside className="lg:col-span-5">
              <div className="lg:sticky lg:top-24">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
                  Contact Options
                </p>

                <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
                  Contact our team
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Choose the contact method that works best for you.
                </p>

                <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                  {/* Phone */}

                  <a
                    href={`tel:${SUPPORT_PHONE}`}
                    className="group flex items-start gap-4 py-6"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600 transition group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-slate-900 dark:text-slate-400 dark:group-hover:bg-blue-950/30 dark:group-hover:text-blue-400">
                      <Phone size={18} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Phone
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                        +91 91090 01109
                      </p>
                    </div>
                  </a>

                  {/* Email */}

                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="group flex items-start gap-4 py-6"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600 transition group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-slate-900 dark:text-slate-400 dark:group-hover:bg-blue-950/30 dark:group-hover:text-blue-400">
                      <Mail size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Email
                      </p>

                      <p className="mt-1 break-all text-sm font-semibold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                        {SUPPORT_EMAIL}
                      </p>
                    </div>
                  </a>

                  {/* Location */}

                  <div className="flex items-start gap-4 py-6">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-400">
                      <MapPin size={18} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Location
                      </p>

                      <p className="mt-1 text-sm font-semibold leading-6 text-slate-900 dark:text-white">
                        Dabra, Gwalior
                        <br />
                        Madhya Pradesh, India — 475110
                      </p>
                    </div>
                  </div>

                  {/* Hours */}

                  <div className="flex items-start gap-4 py-6">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-400">
                      <Clock3 size={18} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Support Hours
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                        Monday – Sunday
                      </p>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        9:00 AM – 9:00 PM
                      </p>
                    </div>
                  </div>
                </div>

                {/* WhatsApp */}

                <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/40">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      <MessageCircle size={19} />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Prefer WhatsApp?
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                        For general enquiries, you can contact us directly on
                        WhatsApp.
                      </p>

                      <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400"
                      >
                        Start WhatsApp Chat
                        <ArrowRight
                          size={15}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* =========================================================
          FAQ
      ========================================================== */}

      <section className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20 lg:px-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400">
                <HelpCircle size={21} />
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
                Quick Help
              </p>

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
                Common questions
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Here are some common questions that may help you before
                submitting a support request.
              </p>
            </div>

            <div className="lg:col-span-8">
              <div className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                <details className="group py-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-sm font-bold text-slate-900 dark:text-white">
                    How can I get help with my order?
                    <span className="text-xl font-normal text-slate-400 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">
                    Submit the support form above and provide your order ID
                    along with a clear description of the issue.
                  </p>
                </details>

                <details className="group py-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-sm font-bold text-slate-900 dark:text-white">
                    What information should I provide?
                    <span className="text-xl font-normal text-slate-400 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">
                    Please provide your name, email address, order ID if
                    applicable, and a detailed description of your enquiry.
                  </p>
                </details>

                <details className="group py-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-sm font-bold text-slate-900 dark:text-white">
                    Can I contact you directly?
                    <span className="text-xl font-normal text-slate-400 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">
                    Yes. You can contact us through phone, email or WhatsApp
                    using the contact details provided above.
                  </p>
                </details>

                <details className="group py-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-sm font-bold text-slate-900 dark:text-white">
                    What information should I never share?
                    <span className="text-xl font-normal text-slate-400 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">
                    Never share passwords, OTPs, UPI PINs, CVVs, card numbers,
                    banking credentials or other sensitive payment information
                    through support.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================== */}

      <section className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Still need assistance?
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Our team is available to help with your enquiry.
              </p>
            </div>

            <div className="flex flex-wrap gap-5">
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Email Support
                <ArrowRight size={15} />
              </a>

              <a
                href={`tel:${SUPPORT_PHONE}`}
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
              >
                Call Us
                <Phone size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
