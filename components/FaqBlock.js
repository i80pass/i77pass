// FAQ block: the visible half of the FAQPage schema pair. Every
// page that emits faqSchema renders this block with the same
// questions and answers.

export default function FaqBlock({ faqs, heading = "Questions drivers ask" }) {
  if (!faqs?.length) return null;
  return (
    <section aria-label={heading} className="mt-12">
      <h2 className="text-headline-sm text-on-surface mb-4">{heading}</h2>
      <div className="space-y-4">
        {faqs.map((f) => (
          <div key={f.q} className="rounded-2xl border border-outline-variant/40 bg-white p-5">
            <h3 className="font-bold text-on-surface">{f.q}</h3>
            <p className="text-body-md text-secondary leading-relaxed mt-1.5">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
