export const metadata = {
    title: "Refund & Cancellation Policy | Deepak Khira Enterprises",
    description:
        "Read our refund and cancellation policy for products and services.",
};

export default function RefundPolicy() {
    return (
        <div className="max-w-4xl mx-auto py-16 px-4">
            <h1 className="text-4xl font-bold mb-6">
                Refund & Cancellation Policy
            </h1>

            <p className="mb-4">
                We aim to provide the best products and services. Please review our
                refund and cancellation terms below.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Refund Policy</h2>
            <ul className="list-disc ml-6 space-y-2">
                <li>No refunds after product download or service delivery.</li>
                <li>Refunds may be approved only in case of duplicate payments.</li>
                <li>Digital services are non-refundable.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
                2. Cancellation Policy
            </h2>
            <ul className="list-disc ml-6 space-y-2">
                <li>Orders cannot be cancelled once processed.</li>
                <li>Custom service orders may involve a cancellation fee.</li>
            </ul>
        </div>
    );
}
  