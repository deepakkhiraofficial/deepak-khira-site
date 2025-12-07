export const metadata = {
    title: "Shipping Policy | Deepak Khira Enterprises",
    description:
        "Read our shipping policy for product deliveries across India.",
};

export default function ShippingPolicy() {
    return (
        <div className="max-w-4xl mx-auto py-16 px-4">
            <h1 className="text-4xl font-bold mb-6">Shipping Policy</h1>

            <p className="mb-4">
                We offer safe and fast delivery across India. Below are our shipping
                terms.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Delivery Time</h2>
            <p>Products are delivered within 3–7 business days.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Shipping Charges</h2>
            <p>Shipping charges depend on location and product weight.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
                Order Tracking
            </h2>
            <p>You will receive tracking updates by SMS or email.</p>
        </div>
    );
}
  