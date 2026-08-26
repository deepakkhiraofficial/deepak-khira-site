import { Suspense } from "react";
import ThankYouClient from "./ThankYouClient";

function ThankYouLoading() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-20 dark:bg-slate-950">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm dark:bg-slate-900">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-3xl dark:bg-slate-800">
          ...
        </div>

        <h1 className="mt-6 text-3xl font-bold">Loading...</h1>

        <p className="mt-3 text-gray-500">Please wait...</p>
      </div>
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<ThankYouLoading />}>
      <ThankYouClient />
    </Suspense>
  );
}
