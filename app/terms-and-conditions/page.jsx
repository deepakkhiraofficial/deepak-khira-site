export const metadata = {
    title: "Terms & Conditions | Deepak Khira Enterprises",
    description:
        "Read the Terms & Conditions of Deepak Khira Enterprises, including website usage, payments, intellectual property, liability, and service terms.",
};

const sections = [
    {
        title: "1. Use of Website",
        content:
            "You agree to use this website lawfully and responsibly. Any illegal activity, unauthorized access, hacking attempt, fraudulent activity, misuse, or activity that may harm the website, its users, or its services is strictly prohibited.",
    },
    {
        title: "2. Products and Services",
        content:
            "Product information, pricing, availability, images, descriptions, and other details may be updated from time to time. We reserve the right to correct errors, update information, or modify product availability without prior notice.",
    },
    {
        title: "3. Orders and Acceptance",
        content:
            "Placing an order does not necessarily mean that the order has been accepted. We reserve the right to accept, cancel, or decline an order where necessary, including cases involving incorrect pricing, product availability, suspected fraud, or other operational reasons.",
    },
    {
        title: "4. Payments",
        content:
            "Customers are responsible for providing accurate payment and billing information. Any billing or payment-related issue should be reported to us as soon as possible so that it can be reviewed and resolved.",
    },
    {
        title: "5. Intellectual Property",
        content:
            "All website content, including logos, trademarks, graphics, images, text, design elements, and source code, is owned by or licensed to Deepak Khira Enterprises unless otherwise stated. Such content may not be reproduced, copied, modified, or distributed without prior permission.",
    },
    {
        title: "6. Limitation of Liability",
        content:
            "To the extent permitted by applicable law, Deepak Khira Enterprises will not be responsible for losses, damages, interruptions, delays, or issues caused by third-party services, external circumstances, network failures, unauthorized access, or misuse of the website.",
    },
    {
        title: "7. Third-Party Services",
        content:
            "Our website may use third-party services such as payment providers, delivery partners, analytics services, communication platforms, or other external providers. Their services may be subject to their own terms and policies.",
    },
    {
        title: "8. Privacy",
        content:
            "Your use of our website is also subject to our Privacy Policy. We may collect and process information required to provide products, services, order processing, customer support, and other legitimate business functions.",
    },
    {
        title: "9. Changes to Terms",
        content:
            "We may update these Terms & Conditions from time to time. Updated terms will be published on this page. Continued use of the website after an update indicates acceptance of the revised terms.",
    },
    {
        title: "10. Contact Us",
        content:
            "If you have questions regarding these Terms & Conditions, please contact Deepak Khira Enterprises through the contact details provided on our website.",
    },
];

export default function Terms() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                <div className="mx-auto max-w-5xl px-6 py-14 sm:px-8 lg:px-10">
                    <div className="mb-4 inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                        Legal Information
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                        Terms & Conditions
                    </h1>

                    <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
                        Please read these Terms & Conditions carefully before using the
                        Deepak Khira Enterprises website, purchasing products, or using our
                        services.
                    </p>

                    <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                        Last updated: August 2026
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="px-6 py-12 sm:px-8 lg:px-10">
                <div className="mx-auto max-w-5xl">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="divide-y divide-slate-200 dark:divide-slate-800">
                            {sections.map((section) => (
                                <article
                                    key={section.title}
                                    className="p-6 sm:p-8"
                                >
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                                        {section.title}
                                    </h2>

                                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                                        {section.content}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>

                    {/* Contact CTA */}
                    <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6 dark:border-blue-900/40 dark:bg-blue-950/20 sm:p-8">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            Questions about these terms?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                            If you need clarification regarding our Terms & Conditions,
                            please contact Deepak Khira Enterprises.
                        </p>

                        <a
                            href="mailto:deepakkhushwah475110@gmail.com"
                            className="mt-4 inline-flex font-semibold text-blue-700 hover:underline dark:text-blue-400"
                        >
                            deepakkhushwah475110@gmail.com
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
  }