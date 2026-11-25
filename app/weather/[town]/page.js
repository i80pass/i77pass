// Town weather page: National Weather Service forecast for the
// town, an hourly strip, a 7 day list, the nearest segment's live
// status banner, and a genuinely local paragraph written for that
// town (lib/towns.js). dynamicParams is false: an unknown town is
// a real 404. When the NWS read fails, the page renders its honest
// unavailable block and keeps the local content.

import Link from "next/link";
import { notFound } from "next/navigation";
import VerdictBar from "@/components/VerdictBar";
import FaqBlock from "@/components/FaqBlock";
import JsonLd from "@/components/JsonLd";
import { getCorridor } from "@/lib/feeds";
import { getTownWeather } from "@/lib/weather";
import { TOWNS, getTown } from "@/lib/towns";
import { getSegment } from "@/lib/segments";
import { webPageSchema, faqSchema, breadcrumbSchema, placeSchema } from "@/lib/schema";
import { siteUrl } from "@/lib/site-config";

export const revalidate = 120;
export const dynamicParams = false;

export function generateStaticParams() {
  return TOWNS.map((t) => ({ town: t.slug }));
}

export async function generateMetadata({ params }) {
  const { town: slug } = await params;
  const town = getTown(slug);
  if (!town) return {};
  const title = `${town.name} Weather and I-77 Conditions | i77pass.com`;
  const description = `National Weather Service forecast for ${town.name}: current conditions, hourly forecast, and 7 day outlook, with the live I-77 status for the ${getSegment(town.segmentSlug)?.name} segment.`;
  return {
    title,
    description,
    alternates: { canonical: siteUrl(`/weather/${town.slug}`) },
    openGraph: { title, description, images: ["/og-image.png"] },
  };
}

function hourLabel(iso) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { hour: "numeric", timeZone: "America/New_York" });
}

function dayLabel(name) {
  return name || "";
}

export default async function TownWeatherPage({ params }) {
  const { town: slug } = await params;
  const town = getTown(slug);
  if (!town) notFound();
  const segMeta = getSegment(town.segmentSlug);
  const [corridor, weather] = await Promise.all([getCorridor(), getTownWeather(town)]);
  const seg = corridor.segments[segMeta.key];
  const others = TOWNS.filter((t) => t.slug !== town.slug);

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-6 pb-16">
      <JsonLd
        data={[
          webPageSchema({ path: `/weather/${town.slug}`, title: `${town.name} Weather and I-77 Conditions | i77pass.com`, description: town.local }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: `${town.name} Weather`, path: `/weather/${town.slug}` },
          ]),
          placeSchema({ name: town.name, lat: town.lat, lon: town.lon, elevationFt: town.elevationFt, description: town.local }),
          faqSchema(town.faqs),
        ]}
      />
      <h1 className="text-display-lg-mobile md:text-display-lg text-on-surface pt-6">
        {town.name} Weather
      </h1>
      <p className="text-sm text-secondary mt-2">
        On I-77: {town.exitLabel} · Elevation {town.elevationLabel}
      </p>

      <div className="mt-4">
        <VerdictBar seg={seg} fetchedAt={corridor.fetchedAt} label={`${segMeta.name} current status`} />
      </div>
      <p className="answer-first text-lg md:text-xl font-semibold leading-snug mt-5">
        {weather?.current
          ? `Right now in ${town.name} it is ${Math.round(weather.current.tempF)}°F and ${weather.current.shortForecast.toLowerCase()}, with the live I-77 status for the ${segMeta.name} segment in the banner above.`
          : `The National Weather Service forecast for ${town.name} is unavailable right now. The live I-77 status for the ${segMeta.name} segment is in the banner above.`}
      </p>

      {weather ? (
        <>
          <section aria-label="Current conditions" className="mt-8">
            <div className="rounded-2xl border border-outline-variant/40 bg-white p-5 flex items-center gap-5">
              <span className="material-symbols-outlined text-primary text-[44px]">{weather.current?.icon || "cloud"}</span>
              <div>
                <p className="text-4xl font-black text-on-surface">
                  {weather.current ? `${Math.round(weather.current.tempF)}°F` : "Unavailable"}
                </p>
                <p className="text-sm text-secondary mt-0.5">
                  {weather.current?.shortForecast || "Conditions unavailable"}
                  {weather.current?.windSpeed ? ` · Wind ${weather.current.windSpeed}` : ""}
                </p>
                {(weather.days[0]?.highF != null || weather.days[0]?.lowF != null) && (
                  <p className="text-sm text-secondary">
                    Today: high {weather.days[0]?.highF != null ? `${Math.round(weather.days[0].highF)}°` : "n/a"}, low {weather.days[0]?.lowF != null ? `${Math.round(weather.days[0].lowF)}°` : "n/a"}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section aria-label="Hourly forecast" className="mt-8">
            <h2 className="text-headline-sm text-on-surface mb-3">Next 24 hours in {town.name}</h2>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              {weather.hourly.map((h, i) => (
                <div key={i} className="shrink-0 w-[76px] rounded-2xl border border-outline-variant/40 bg-white p-3 text-center">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-secondary">{hourLabel(h.time)}</p>
                  <span className="material-symbols-outlined text-primary text-[22px] block mt-1">{h.icon}</span>
                  <p className="font-black text-on-surface mt-1">{h.tempF != null ? `${Math.round(h.tempF)}°` : "n/a"}</p>
                  <p className="text-[11px] text-secondary mt-0.5 leading-tight">{h.shortForecast}</p>
                  {h.precipChance != null && <p className="text-[11px] font-semibold text-primary mt-0.5">{h.precipChance}% precip</p>}
                </div>
              ))}
            </div>
          </section>

          <section aria-label="7 day forecast" className="mt-8">
            <h2 className="text-headline-sm text-on-surface mb-3">7 day forecast for {town.name}</h2>
            <div className="space-y-2">
              {weather.days.map((d, i) => (
                <div key={i} className="rounded-2xl border border-outline-variant/40 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-[22px]">{d.icon}</span>
                    <span className="font-bold text-on-surface">{dayLabel(d.name)}</span>
                    <span className="ml-auto text-sm font-semibold text-on-surface">
                      {d.highF != null ? `${Math.round(d.highF)}°` : "n/a"} <span className="text-secondary font-normal">/ {d.lowF != null ? `${Math.round(d.lowF)}°` : "n/a"}</span>
                    </span>
                  </div>
                  <p className="text-sm text-secondary leading-relaxed mt-1.5">{d.detailedForecast}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <section aria-label="Forecast unavailable" className="mt-8">
          <p className="text-body-md text-secondary leading-relaxed rounded-2xl border border-outline-variant/40 bg-white p-5">
            The National Weather Service forecast for {town.name} did not answer on this read. No forecast is
            shown rather than a stale or invented one. The segment status above is live, and the forecast block
            returns on the next refresh.
          </p>
        </section>
      )}

      <section aria-label={`About ${town.name}`} className="mt-10">
        <h2 className="text-headline-sm text-on-surface mb-2">{town.name} and I-77</h2>
        <p className="text-body-md text-secondary leading-relaxed">{town.local}</p>
        <p className="text-body-md text-secondary leading-relaxed mt-3">
          {town.name} rides the{" "}
          <Link href={`/segments/${segMeta.slug}`} className="text-primary font-semibold hover:underline">
            {segMeta.name}
          </Link>{" "}
          segment of Interstate 40, mileposts {segMeta.mpTo} to {segMeta.mpFrom} in driving order.
        </p>
      </section>

      <section aria-label="Other corridor towns" className="mt-10">
        <h2 className="text-headline-sm text-on-surface mb-3">Weather along the corridor</h2>
        <div className="flex flex-wrap gap-2">
          {others.map((t) => (
            <Link
              key={t.slug}
              href={`/weather/${t.slug}`}
              className="px-3.5 py-1.5 rounded-full text-label-md font-bold border border-outline-variant/50 text-secondary hover:text-primary hover:border-primary transition-colors"
            >
              {t.name}
            </Link>
          ))}
        </div>
      </section>

      <FaqBlock faqs={town.faqs} />

      <p className="text-xs text-secondary mt-10">Forecasts: National Weather Service. Road status: VDOT via 511 Virginia.</p>
    </main>
  );
}
