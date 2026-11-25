// The Fancy Gap page: the flagship place page for the mountain
// itself, owning the "Fancy Gap road conditions" and "Fancy Gap
// fog" query cluster. Verdict first, built from the two climb
// segments, cameras directly under the verdict, the mountain's
// own editorial in six sections (original writing for this
// corridor), events, weather, storm alerts, and FAQs.

import Link from "next/link";
import VerdictBar from "@/components/VerdictBar";
import SegmentRow from "@/components/SegmentRow";
import EventsList from "@/components/EventsList";
import CameraStrip from "@/components/CameraStrip";
import WeatherStrip from "@/components/WeatherStrip";
import FaqBlock from "@/components/FaqBlock";
import StormAlerts from "@/components/StormAlerts";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import { getCorridor } from "@/lib/feeds";
import { getPointWeather } from "@/lib/weather";
import { SEGMENTS } from "@/lib/segments";
import { camerasForSegment } from "@/lib/cameras";
import { liveStatusSentence } from "@/lib/verdict";
import { webPageSchema, faqSchema, roadConditionSchema, cameraListSchema, breadcrumbSchema, placeSchema } from "@/lib/schema";
import { SITE, siteUrl } from "@/lib/site-config";

export const revalidate = 60;

export const metadata = {
  title: "Fancy Gap Road Conditions: I-77 Fog, Closures, and Cameras | i77pass.com",
  description:
    "Fancy Gap, Virginia on I-77: live fog status, closures, restrictions, and all the climb cameras from the North Carolina line to the summit, updated from VDOT via 511 Virginia.",
  alternates: { canonical: siteUrl("/fancy-gap") },
  openGraph: { title: "Fancy Gap Road Conditions | i77pass.com", description: "Live I-77 fog status, closures, and cameras at Fancy Gap, Virginia, from VDOT via 511 Virginia.", images: ["/og-image.png"] },
};

const WEATHER_POINTS = [
  { name: "Cana", slug: "cana", lat: 36.5833, lon: -80.6681 },
  { name: "Fancy Gap", slug: "fancy-gap", lat: 36.6681, lon: -80.7017 },
  { name: "Hillsville", slug: "hillsville", lat: 36.7622, lon: -80.7345 },
];

function mountainRead(corridor) {
  const foot = corridor.segments[1];
  const climb = corridor.segments[2];
  if (!foot.ok || !climb.ok) {
    const bad = !climb.ok ? climb : foot;
    return { ...bad, name: "Fancy Gap" };
  }
  const worst = climb.rank >= foot.rank ? climb : foot;
  return {
    ...worst,
    name: "Fancy Gap",
    roadName: "Interstate 77 over Fancy Gap",
    statusLine:
      worst.rank === 3
        ? "I-77 is closed over Fancy Gap."
        : worst.rank === 2
          ? "Restrictions or events are posted on the Fancy Gap climb. Drive with care, and read the cameras for fog."
          : "I-77 is open over Fancy Gap with no closures or restrictions posted. Read the summit cameras for fog before you climb.",
    events: [...foot.events, ...climb.events],
  };
}

export default async function FancyGapPage() {
  const [corridor, weather] = await Promise.all([getCorridor(), getPointWeather(WEATHER_POINTS)]);
  const mountain = mountainRead(corridor);
  const climbSegments = SEGMENTS.filter((s) => s.key === 1 || s.key === 2).map((s) => corridor.segments[s.key]);
  const climbCameras = [...camerasForSegment(1), ...camerasForSegment(2)];
  const sentence = liveStatusSentence({ ...mountain, name: "Fancy Gap" });

  const faqs = [
    {
      q: "Is I-77 open over Fancy Gap today?",
      a: `${sentence} Open is only half the question on this mountain. The other half is whether you can see: check the summit cameras near mileposts 7 to 9 for fog before you start the climb.`,
    },
    {
      q: "How do I know if Fancy Gap is foggy right now?",
      a: "Look at the cameras, not the forecast. The cameras at mileposts 7.5 and 8.7 sit in the fog bank's home territory. If those frames are white or grey, the top of the climb is in cloud whatever the valley forecast says. VDOT's variable speed signs on the climb are the second signal: a lowered posted speed means VDOT is seeing conditions you have not reached yet.",
    },
    {
      q: "What should I do if the climb is fogged in?",
      a: "You have three honest options. Wait at the bottom (Lambsburg and Cana on the south side, Hillsville on the north) until the cameras clear; the fog often lifts within an hour or two of sunrise. Take US 52, the old Fancy Gap Highway, slowly, knowing it is a two lane mountain road that fogs too. Or reroute entirely via I-81 and I-26 or I-40, which adds hours. What the pileup record argues against is climbing into a white bank at full speed and hoping.",
    },
    {
      q: "What is the detour if Fancy Gap closes?",
      a: "There is no short detour. The interstate level reroute runs I-81 to I-26 (or I-40) far to the west and south, adding hours, which is why closures here strand so much traffic in Hillsville and Mount Airy. For a short closure, waiting at Exit 8 or Exit 14 is usually the better play. Follow VDOT's posted detour rather than improvising on mountain roads in the weather that closed the interstate.",
    },
    {
      q: "Are there chain requirements at Fancy Gap?",
      a: "No. Virginia has no chain control system and no chain law for this road. In winter, VDOT posts advisories, treats and plows the climb, lowers speeds, and restricts or closes the road when conditions require it. The restrictions page on this site explains the postings in plain language.",
    },
  ];

  const sections = [
    {
      h: "A climb up the face of the Blue Ridge",
      paras: [
        "Fancy Gap is where Interstate 77 climbs the Blue Ridge escarpment, the long wall where the Carolina Piedmont ends and the Appalachian plateau begins. South of the state line the land sits near 1,100 to 1,400 feet. Six miles later the road tops out near 2,800 feet, at a steady four percent grade, and the community of Fancy Gap sits on the crest where the interstate, US 52, and the Blue Ridge Parkway all cross.",
        "That wall of rock and air is the whole story. Everything this corridor is known for, the fog, the truck crawls, the brake smoke on the descent, the pileups, comes from putting a high speed, high volume interstate straight up the face of a mountain range instead of through a gap in it. Fancy Gap is called a gap, but the interstate does not thread a notch; it climbs the wall beside one.",
        "The traffic climbing it is national, not local. I-77 is the Midwest's road to the Southeast, carrying about 40,000 vehicles a day past this point, roughly a quarter of them trucks: Cleveland and Columbus to Charlotte and Columbia, Michigan to Florida, freight and snowbirds on the same six miles of grade. When this mountain stops, a route used by half the eastern seaboard stops with it.",
      ],
    },
    {
      h: "The fog, and why it owns this mountain",
      paras: [
        "By VDOT's account, repeated in the corridor's own travel press, Fancy Gap is fogged in roughly a third of the year. The mechanism is simple and relentless: moist air from the Piedmont is pushed against the escarpment, rises, cools, and condenses into cloud at exactly the elevation of the upper climb. The road does not pass through weather here; it climbs into a cloud that is being manufactured against the mountainside.",
        "The fog is hyper local, which is what makes it dangerous. Wytheville can be clear, Mount Airy can be in sunshine, Hillsville can be merely grey, and milepost 7 can be white. A forecast for any town on either side will lie to you about the summit on the days that matter most. The only honest instruments are the cameras bolted to the climb itself and the variable speed signs VDOT lowers when its own sensors and operators see the bank form.",
        "VDOT spent about 7.5 million dollars on that variable speed limit system for this one climb, an extraordinary investment for six miles of road, and it exists because the state's engineers concluded that no fixed speed limit and no warning sign could keep up with visibility that can fall from a mile to a car length inside one curve.",
      ],
    },
    {
      h: "The pileup record",
      paras: [
        "Fancy Gap's crash history in fog is the worst on any corridor this network covers, and it is not close. In February 1997, about 56 vehicles piled up in fog on the climb. In September 2005, about 50. In November 2010, more than 70 vehicles crashed and two people died. On March 31, 2013, the worst morning of all: 18 separate crashes involving 96 vehicles, three deaths, in a fog bank on the mountain.",
        "Read those numbers the way the drivers in them would want you to. These were not storms anyone could see coming from the valley. They were ordinary trips that met a white wall at interstate speed, in traffic where a quarter of the vehicles are trucks that cannot stop or swerve like cars. The pattern in every investigation is the same: speed for the visibility, following too close, and nowhere to go.",
        "This page is written the way it is because of that record. The verdict leads, the cameras sit directly under it, and the fog guidance does not hedge. If the summit cameras are white, the correct speed for the climb is the one on VDOT's variable signs, and the correct decision may be not to climb yet at all.",
      ],
    },
    {
      h: "Trucks on the grade",
      paras: [
        "A quarter of the traffic on this climb is commercial, and the grade treats trucks and cars as different species. Northbound, loaded trucks slow to a crawl on the four percent, sometimes half the speed of the cars coming up behind them, which manufactures the closing speed that fills the crash reports. Southbound, the same trucks ride the descent on their brakes, and the runaway scenario is the one every driver on this road has imagined.",
        "Wind is the second truck story. When VDOT posts a high profile vehicle advisory for this corridor, as it did for mile markers 0 to 10 in December 2022 and again in the week this site launched, it is aimed at empty and light trailers crossing the exposed upper climb, where gusts come over the crest with nothing to break them. If you are towing or driving anything tall and light, that advisory is written for you specifically.",
        "For car drivers, the practical rules are old ones: expect the truck ahead to be much slower than it looks on the climb, expect brake lights and heat shimmer on the descent, and never sit beside a truck in fog. The speed split on this mountain is a condition of the road, as real as the weather.",
      ],
    },
    {
      h: "Getting off the mountain: Exits 1, 8, and 14",
      paras: [
        "The climb has exactly three doors. Exit 1 at Lambsburg is the last easy turn back at the foot. Exit 8 at Fancy Gap is the summit door: US 52, the Blue Ridge Parkway, fuel, food, and a community that has been hosting mountain travelers since long before the interstate. Exit 14 at Hillsville is the plateau door, with full services and the county seat. Between Exit 1 and Exit 8 there is nothing: no exit, no services, no shoulder worth the name in places.",
        "Those three exits are the corridor's decision points, and this site is organized around them. Southbound, Hillsville is where you check the summit cameras before starting down. Northbound, Lambsburg is where you check them before starting up. Exit 8 is the pressure valve in the middle, the place to get off and wait when the bank is sitting on the climb, with US 52 as a slow surface alternative in either direction.",
        "Waiting works here more often than drivers expect. The worst fog is a morning phenomenon, formed overnight and burned off or blown off within a few hours. A closure for a crash is measured in hours, not days. The towns at the three exits have absorbed waiting drivers for decades; joining them is a strategy, not a defeat.",
      ],
    },
    {
      h: "The seasons on Fancy Gap",
      paras: [
        "Winter is the second season here: plateau snow and ice that arrive hours before the valley sees anything, wind that drifts the top segment, and the standing pattern of rain at the state line turning to snow by Exit 8. Virginia answers with plows, treatment, advisories, and restrictions rather than chain controls, and the restrictions page explains how to read each posting.",
        "Summer is the volume season: vacation traffic to and from Florida, Blue Ridge Parkway travelers crossing at Exit 8, and afternoon storms that can drop visibility on the climb almost as fast as fog. Fall brings the Parkway's leaf traffic and the first fog heavy months. Spring brings the snowbird return north and, as March 2013 proved, some of the worst fog mornings of the year.",
        "There is no off season on this mountain, which is the honest summary of the corridor. The check before you climb habit is a twelve month habit, and it takes about thirty seconds: verdict, cameras, then go.",
      ],
    },
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-6 pb-16">
      <JsonLd
        data={[
          webPageSchema({ path: "/fancy-gap", title: metadata.title, description: metadata.description, dateModified: corridor.fetchedAt.toISOString() }),
          roadConditionSchema({ path: "/fancy-gap", name: "Fancy Gap Road Conditions, Interstate 77", seg: mountain, dateModified: corridor.fetchedAt.toISOString() }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Fancy Gap", path: "/fancy-gap" },
          ]),
          placeSchema({ name: "Fancy Gap, Virginia", lat: 36.6681, lon: -80.7017, elevationFt: 2900, description: "Fancy Gap, Virginia, where Interstate 77 climbs the Blue Ridge escarpment in Carroll County." }),
          ...(climbCameras.length ? [cameraListSchema(climbCameras.slice(0, 3), "I-77 Webcams, the Fancy Gap Climb")] : []),
          faqSchema(faqs),
        ]}
      />
      <h1 className="text-xl md:text-2xl font-black text-on-surface mb-4 tracking-wide uppercase">
        Fancy Gap Road Conditions
      </h1>
      <VerdictBar seg={mountain} fetchedAt={corridor.fetchedAt} label="Fancy Gap current status" />

      <CameraStrip
        cameras={climbCameras}
        priorityFirst
        heading="Fancy Gap webcams, the climb"
        sub="VDOT cameras from the state line to the summit, in driving order. The frames at mileposts 7.5 and 8.7 are the fog report. Still images from 511 Virginia, credited to VDOT."
        seeAllHref="/cameras"
        emptyText="No cameras are listed for the climb yet. The verdict above comes from the VDOT event feed and does not depend on the cameras."
      />

      <AdSlot slot="belowCameras" />

      <p className="answer-first text-lg md:text-xl font-semibold leading-snug mt-10">{sentence}</p>

      <section aria-label="Climb segments" className="mt-10">
        <h2 className="text-headline-sm text-on-surface mb-3">The climb, segment by segment</h2>
        <div className="space-y-3">
          {climbSegments.map((seg) => (
            <SegmentRow key={seg.key} seg={seg} />
          ))}
        </div>
      </section>

      <section aria-label="Events on the climb" className="mt-10">
        <h2 className="text-headline-sm text-on-surface mb-3">Closures, restrictions, and events on the climb</h2>
        <EventsList
          events={mountain.events}
          emptyText={
            corridor.ok
              ? "VDOT posts no events on the climb right now. Fog can still form faster than any posting; read the cameras."
              : "No VDOT events can be shown right now, because the live feed is not answering."
          }
        />
      </section>

      <WeatherStrip points={weather} />

      <section aria-label="About Fancy Gap" className="mt-10 space-y-8">
        {sections.map((s) => (
          <div key={s.h}>
            <h2 className="text-headline-sm text-on-surface mb-2">{s.h}</h2>
            {s.paras.map((p, i) => (
              <p key={i} className="text-body-md text-secondary leading-relaxed mb-3">{p}</p>
            ))}
          </div>
        ))}
      </section>

      <div className="mt-10">
        <StormAlerts />
      </div>

      <FaqBlock faqs={faqs} />

      <AdSlot slot="lowerPage" />

      <p className="text-xs text-secondary mt-10">
        {SITE.dataCredit} Driving the whole corridor? See the{" "}
        <Link href="/mount-airy-to-hillsville" className="text-primary font-semibold hover:underline">Mount Airy to Hillsville route page</Link>.
      </p>
    </main>
  );
}
