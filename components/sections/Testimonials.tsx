export default function Testimonials() {
  const testimonials = [
    {
      name: "John Doe",
      role: "CEO, Company A",
      message:
        "Deepak Khira Enterprises delivered excellent services, highly recommend!",
    },
    {
      name: "Jane Smith",
      role: "Product Manager, Company B",
      message: "Professional team, fast delivery, and top-notch quality.",
    },
    {
      name: "Alice Johnson",
      role: "CTO, Startup C",
      message: "Their solutions helped scale our business efficiently.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Our Clients Say
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="border p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <p className="mb-4">"{t.message}"</p>
              <h3 className="font-semibold">{t.name}</h3>
              <p className="text-sm text-gray-500">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
