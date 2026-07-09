"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-32 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground mt-2">
        We encountered an unexpected error. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-8 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Try Again
      </button>
    </div>
  );
}
