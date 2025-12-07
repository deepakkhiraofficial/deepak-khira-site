'use client';
export default function WhyChooseUs() {
  const items = [
    "100% Genuine Quality Products",
    "Fast & Reliable Delivery Across India",
    "Affordable Prices & Great Value",
    "Secure and Safe Packaging",
    "Best Customer Support (24x7)",
    "Trusted Online Seller for Years",
  ];

  return (
    <section className="w-full py-20 px-6 md:px-16 bg-white dark:bg-gray-800">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-700 dark:text-blue-400 mb-12">
        Why Choose Us?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {items.map((item, i) => (
          <div
            key={i}
            className="bg-gray-100 dark:bg-gray-700 p-8 rounded-2xl shadow hover:shadow-lg transition-all text-center text-lg font-medium text-gray-700 dark:text-gray-300"
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
