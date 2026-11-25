import Link from "next/link";

export const metadata = {
  title: "Page Not Found | i77pass.com",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="max-w-3xl mx-auto px-4 md:px-6 pb-16">
      <h1 className="text-display-lg-mobile md:text-display-lg text-on-surface pt-6">That page is not on I-77</h1>
      <p className="text-body-md text-secondary leading-relaxed mt-4">
        The page you asked for does not exist on i77pass.com. The corridor runs from the North Carolina line to Hillsville over Fancy Gap, and everything on this site is on it.
      </p>
      <div className="mt-6 space-y-2">
        <Link href="/" className="block font-semibold text-primary hover:underline">I-77 conditions, North Carolina line to Hillsville</Link>
        <Link href="/cameras" className="block font-semibold text-primary hover:underline">All I-77 cameras</Link>
        <Link href="/alerts" className="block font-semibold text-primary hover:underline">Alerts and closures</Link>
        <Link href="/site-map" className="block font-semibold text-primary hover:underline">Site map</Link>
      </div>
    </main>
  );
}
