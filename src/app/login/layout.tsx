import { Suspense } from "react";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center">Loading...</div>}>{children}</Suspense>;
}
