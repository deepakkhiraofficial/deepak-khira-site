// app/terms/page.tsx
"use client";

import Head from "next/head";

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Terms & Conditions | Deepak Khira Enterprises</title>
        <meta
          name="description"
          content="Read the Terms and Conditions for using Deepak Khira Enterprises' website, services, and products."
        />
      </Head>

      <main className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-6 md:px-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Terms & Conditions
        </h1>

        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 p-8 rounded shadow-md space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h2 className="text-2xl font-semibold mb-2">1. Introduction</h2>
            <p>
              Welcome to Deepak Khira Enterprises. By accessing our website or
              services, you agree to comply with and be bound by these terms and
              conditions. Please read them carefully.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">2. Use of Website</h2>
            <p>
              You agree to use our website for lawful purposes only. Any misuse,
              including but not limited to hacking, spamming, or unauthorized
              access, is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">
              3. Orders & Payments
            </h2>
            <p>
              All orders placed through our website are subject to acceptance.
              Payments must be made through authorized payment gateways. Prices
              and availability are subject to change without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">
              4. Returns & Refunds
            </h2>
            <p>
              Our return and refund policies apply as outlined on our Returns &
              Refunds page. Ensure items are returned in original condition and
              within the specified time frame.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">
              5. Intellectual Property
            </h2>
            <p>
              All content, logos, images, and materials on this website are the
              property of Deepak Khira Enterprises and protected by intellectual
              property laws. Unauthorized use is prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">
              6. Limitation of Liability
            </h2>
            <p>
              We shall not be liable for any direct, indirect, incidental, or
              consequential damages arising from the use of our website or
              services. Use at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">7. Changes to Terms</h2>
            <p>
              We reserve the right to update or modify these terms at any time.
              Continued use of the website constitutes acceptance of the updated
              terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">8. Contact Us</h2>
            <p>
              For any questions regarding these terms, please contact us at{" "}
              <a
                href="mailto:deepakkhushwah475110@gmail.com"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                deepakkhushwah475110@gmail.com
              </a>{" "}
              or call +91 9109001109.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
