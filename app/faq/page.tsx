"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  HelpCircle,
  Mail,
  MessageCircle,
  RefreshCw,
  Search,
} from "lucide-react";
import Link from "next/link";

interface FAQItem {
  _id: string;
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/faq", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Unable to load FAQs.");
      }

      const data = await res.json();

      /*
       * Supports:
       * [
       *   ...
       * ]
       *
       * or
       *
       * {
       *   faqs: [...]
       * }
       */

      const faqData = Array.isArray(data)
        ? data
        : Array.isArray(data?.faqs)
          ? data.faqs
          : [];

      setFaqs(faqData);
    } catch (error) {
      console.error("FAQ fetch error:", error);
      setError("Unable to load FAQs right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const filteredFAQs = faqs.filter((faq) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return (
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query)
    );
  });

  const toggleFAQ = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* =========================================================
          HERO
      ========================================================== */}

      <section className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mx-auto max-w-5xl px-5 py-14 text-center sm:px-8 sm:py-16">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
            <HelpCircle size={24} />
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-blue-600 dark:text-blue-400">
            Help Center
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl md:text-5xl dark:text-white">
            Frequently Asked Questions
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-400">
            Find answers to common questions about products, orders, delivery,
            payments and services at Deepak Khira Enterprises.
          </p>

          {/* Search */}

          <div className="mx-auto mt-8 max-w-xl">
            <div className="relative">
              <Search
                size={19}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setOpenIndex(null);
                }}
                placeholder="Search your question..."
                aria-label="Search frequently asked questions"
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  py-3.5
                  pl-11
                  pr-4
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-500/10
                  dark:border-slate-700
                  dark:bg-slate-900
                  dark:text-white
                  dark:focus:border-blue-500
                "
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FAQ CONTENT
      ========================================================== */}

      <section className="bg-white py-12 dark:bg-slate-950">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          {/* Loading */}

          {loading && (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-16 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900"
                />
              ))}
            </div>
          )}

          {/* Error */}

          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-950/20">
              <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchFAQs}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                <RefreshCw size={15} />
                Try Again
              </button>
            </div>
          )}

          {/* Empty */}

          {!loading && !error && filteredFAQs.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center dark:border-slate-800 dark:bg-slate-900/40">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <HelpCircle size={22} />
              </div>

              <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                {search ? "No matching questions found" : "No FAQs available"}
              </h2>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {search
                  ? "Try using different keywords."
                  : "Please check back later for frequently asked questions."}
              </p>

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-5 text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
                >
                  Clear search
                </button>
              )}
            </div>
          )}

          {/* FAQ List */}

          {!loading && !error && filteredFAQs.length > 0 && (
            <div className="space-y-3">
              {filteredFAQs.map((faq, index) => {
                const isOpen = openIndex === index;

                return (
                  <motion.article
                    key={faq._id}
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.2,
                      delay: Math.min(index * 0.03, 0.3),
                    }}
                    className={`
                        overflow-hidden
                        rounded-2xl
                        border
                        bg-white
                        transition
                        dark:bg-slate-900/40
                        ${
                          isOpen
                            ? "border-blue-200 shadow-sm dark:border-blue-900"
                            : "border-slate-200 dark:border-slate-800"
                        }
                      `}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFAQ(index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${faq._id}`}
                      className="flex w-full items-center justify-between gap-5 p-5 text-left sm:p-6"
                    >
                      <span className="flex items-start gap-4">
                        <span
                          className={`
                              mt-0.5
                              flex
                              h-8
                              w-8
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              text-xs
                              font-bold
                              ${
                                isOpen
                                  ? "bg-blue-600 text-white"
                                  : "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                              }
                            `}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className="text-sm font-semibold leading-6 text-slate-900 sm:text-base dark:text-white">
                          {faq.question}
                        </span>
                      </span>

                      <span
                        className={`
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            border
                            transition-transform
                            ${
                              isOpen
                                ? "rotate-180 border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-400"
                                : "border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400"
                            }
                          `}
                      >
                        <ChevronDown size={17} />
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-answer-${faq._id}`}
                          initial={{
                            height: 0,
                            opacity: 0,
                          }}
                          animate={{
                            height: "auto",
                            opacity: 1,
                          }}
                          exit={{
                            height: 0,
                            opacity: 0,
                          }}
                          transition={{
                            duration: 0.22,
                          }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-slate-100 px-5 pb-6 pt-5 sm:px-6 dark:border-slate-800">
                            <p className="pl-12 text-sm leading-7 text-slate-600 dark:text-slate-400">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.article>
                );
              })}
            </div>
          )}

          {/* Result count */}

          {!loading && !error && filteredFAQs.length > 0 && (
            <p className="mt-6 text-center text-xs text-slate-400">
              Showing {filteredFAQs.length}{" "}
              {filteredFAQs.length === 1 ? "question" : "questions"}
            </p>
          )}
        </div>
      </section>

      {/* =========================================================
          CONTACT CTA
      ========================================================== */}

      <section className="border-t border-slate-200 bg-slate-50 py-12 dark:border-slate-800 dark:bg-slate-900/30">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <div className="rounded-2xl bg-slate-950 px-6 py-9 text-center shadow-lg sm:px-10 dark:bg-slate-900">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-blue-400">
              <MessageCircle size={21} />
            </div>

            <h2 className="mt-4 text-xl font-bold text-white">
              Still have questions?
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-400">
              If you cannot find the answer you are looking for, our team is
              available to help.
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-blue-50"
              >
                Contact Us
              </Link>

              <a
                href="mailto:deepakkhushwah475110@gmail.com"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
              >
                <Mail size={16} />
                Email Support
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
