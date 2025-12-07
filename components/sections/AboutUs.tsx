'use client';
export default function AboutUs() {
  return (
    <section className="w-full py-20 px-6 md:px-16 bg-gray-100 dark:bg-gray-800">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-700 dark:text-blue-400 mb-10">
        About Us
      </h2>

      <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
        <p>
          Deepak Khira Enterprises is a leading and trusted online selling brand
          based in Madhya Pradesh. We offer high-quality products at the best
          prices and ensure a smooth and safe shopping experience for all
          customers.
        </p>

        <p>
          Every product undergoes quality checking before dispatch. With fast
          delivery, secure packaging, and dedicated support, we aim to provide
          maximum value and reliability.
        </p>
      </div>
    </section>
  );
}
