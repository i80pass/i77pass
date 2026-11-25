"use client";

// The official conditions checker form in the master's Road
// Conditions section: enter a highway number, and the search
// opens the official 511 Virginia conditions view, the Virginia
// Department of Transportation's own published conditions for
// every numbered highway in the state. Client side only because
// it opens the agency view in a new tab; the report cards under
// it are server rendered from the same VDOT read as the verdict.

export default function HighwayCheckForm() {
  const onSubmit = (e) => {
    e.preventDefault();
    window.open("https://511.vdot.virginia.gov/", "_blank", "noopener,noreferrer");
  };
  return (
    <form className="flex flex-col sm:flex-row gap-2 sm:items-center" onSubmit={onSubmit}>
      <label htmlFor="highway-number" className="text-sm text-secondary shrink-0">
        Enter Highway Number
      </label>
      <input
        id="highway-number"
        type="text"
        inputMode="numeric"
        placeholder="77"
        defaultValue="77"
        className="flex-1 min-w-0 px-4 py-2 rounded-xl border border-outline-variant/40 bg-surface text-on-surface text-sm outline-none focus:border-primary"
      />
      <button
        type="submit"
        className="px-5 py-2 rounded-xl bg-primary text-on-primary text-sm font-bold active:scale-95 transition-transform shrink-0"
      >
        Search
      </button>
    </form>
  );
}
