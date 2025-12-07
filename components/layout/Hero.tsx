export default function Hero() {
  return (
    <section className="bg-gray-100 py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Innovation • Integrity • Impact
        </h1>
        <p className="text-lg md:text-xl mb-8">
          We provide world-class services and products to empower your business.
        </p>
        <a
          href="#services"
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
        >
          Our Services
        </a>
      </div>
    </section>
  );
}
