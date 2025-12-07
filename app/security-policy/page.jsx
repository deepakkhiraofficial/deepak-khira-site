export const metadata = {
    title: "Security Policy | Deepak Khira Enterprises",
    description:
        "Our security commitment and guidelines for responsible vulnerability disclosure.",
};

export default function SecurityPolicy() {
    return (
        <div className="max-w-4xl mx-auto py-16 px-4">
            <h1 className="text-4xl font-bold mb-6">Security Policy</h1>

            <p className="mb-4">
                At Deepak Khira Enterprises, we take security seriously. This policy
                outlines how to report vulnerabilities safely and responsibly.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Reporting Issues</h2>
            <p>
                If you discover a security issue, report it immediately at:
                <strong>deepakkhushwah475110@gmail.com</strong>
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
                2. Our Responsibilities
            </h2>
            <ul className="list-disc ml-6 space-y-2">
                <li>We respond within 48 hours.</li>
                <li>We fix verified vulnerabilities quickly.</li>
                <li>Your responsible disclosure is appreciated and respected.</li>
            </ul>
        </div>
    );
}
  