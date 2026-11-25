// The three I-77 segments on the Fancy Gap corridor, south to
// north: the North Carolina line to Hillsville, Virginia.
// Virginia numbers I-77 from the North Carolina line, so the
// climb starts at milepost 0 and the summit country around
// Fancy Gap sits near mileposts 7 to 9. Exits on this stretch:
// Exit 1 (Lambsburg), Exit 8 (Fancy Gap, US 52 and the Blue
// Ridge Parkway), Exit 14 (Hillsville and Galax, US 58 and
// US 221). Elevations: the road leaves the North Carolina line
// near 1,400 feet and tops out near 2,800 feet on the Blue
// Ridge plateau. Editorial copy is original to this site,
// written from the corridor research (the market gate audit of
// Nov 25, 2026, in the project research notes).

export const SEGMENTS = [
  {
    key: 1,
    slug: "state-line-to-lambsburg",
    name: "North Carolina Line to Lambsburg",
    shortName: "State Line to Lambsburg",
    roadName: "Interstate 77 from the North Carolina line to Lambsburg",
    state: "VA",
    mpFrom: 0,
    mpTo: 4.5,
    mpLabel: "Virginia mileposts 0 to 4.5",
    latMin: -Infinity,
    elevFromFt: 1400,
    elevToFt: 1900,
    elevFromLabel: "The North Carolina line, about 1,400 ft",
    elevToLabel: "Lambsburg, about 1,900 ft",
    towns: ["Cana, VA"],
    junctions: [
      { label: "North Carolina state line", mp: 0, note: "Milepost 0. Southbound, the road drops into North Carolina toward Mount Airy and I-74; northbound, the Fancy Gap climb begins here." },
      { label: "Lambsburg, VA 620", mp: 1, note: "Exit 1, the first Virginia exit and the last easy turn back before the grade steepens." },
    ],
    intro:
      "The foot of the Fancy Gap climb: the state line, Lambsburg, and the first miles of the grade where the mountain weather starts.",
    sections: [
      {
        h: "Where the climb begins",
        body: "Interstate 77 crosses from North Carolina into Virginia at the foot of the Blue Ridge escarpment and starts climbing almost at once. The first miles look gentle from the windshield, a wide interstate rolling through the Cana and Lambsburg farmland, but the grade is already working: the road gains roughly 1,400 feet between here and the top, at a near constant four percent, one of the longest steady climbs on any interstate in Virginia. Trucks that will be crawling at the summit are still at full speed here, and the speed difference that defines this mountain starts building on this segment.",
      },
      {
        h: "The last easy decision",
        body: "Exit 1 at Lambsburg is the last low cost place to change your mind. Beyond it there is no exit until Fancy Gap at Exit 8, and the road is committed to the escarpment wall. If the cameras on this page show the upper mountain white with fog while the state line looks clear, that is the normal Fancy Gap pattern, not a feed error: the fog lives at the top, and it can be waiting in sunshine at the bottom. Drivers who check the summit cameras from here, before the climb, are using this site the way it is meant to be used.",
      },
      {
        h: "Weather splits here",
        body: "This segment is the corridor's weather boundary. The Piedmont air that Mount Airy and Cana sit in is warmer and clearer than the plateau air a few miles north, and the change happens inside these first miles. Rain at the state line can be fog at milepost 5 and, in winter, ice or snow at the top. VDOT's variable speed limit signs on the climb exist because of this split: the posted speed can drop for the upper mountain while this segment runs at the normal limit, and the signs, not the sky at the state line, are the word.",
      },
    ],
    faqs: [
      {
        q: "How long is the Fancy Gap climb?",
        a: "About six miles of steady climbing at roughly four percent grade, from the North Carolina line to the top of the escarpment near Fancy Gap, gaining about 1,400 feet. The full corridor on this site runs 15 miles to Hillsville.",
      },
      {
        q: "What is the first exit in Virginia on I-77?",
        a: "Exit 1, Lambsburg. The next exit north is Exit 8 at Fancy Gap, so decisions about the climb are best made at or before Exit 1.",
      },
      {
        q: "Can the state line be clear while Fancy Gap is fogged in?",
        a: "Yes, and it is the common pattern. The fog forms on the upper mountain and the plateau edge. Check the summit cameras near mileposts 7 to 9, not the weather at the state line.",
      },
      {
        q: "Are there cameras on this segment?",
        a: "Yes. VDOT cameras stand at mileposts 0.1, 0.6, 1.9, 2.7, 3.3, 3.4, and 4.3 on this segment, published by VDOT through 511 Virginia and listed on this page, each with its own camera page.",
      },
    ],
  },
  {
    key: 2,
    slug: "lambsburg-to-fancy-gap",
    name: "Lambsburg to Fancy Gap",
    shortName: "Lambsburg to Fancy Gap",
    roadName: "Interstate 77 from Lambsburg to Fancy Gap",
    state: "VA",
    mpFrom: 4.5,
    mpTo: 9,
    mpLabel: "Virginia mileposts 4.5 to 9",
    latMin: 36.622,
    elevFromFt: 1900,
    elevToFt: 2800,
    elevFromLabel: "Lambsburg, about 1,900 ft",
    elevToLabel: "Fancy Gap, about 2,800 ft",
    towns: ["Fancy Gap, VA"],
    junctions: [
      { label: "Fancy Gap, US 52 and the Blue Ridge Parkway", mp: 8, note: "Exit 8. US 52, the old Fancy Gap Highway, and the Blue Ridge Parkway crossing near Parkway milepost 199.5. The summit exit and the corridor's main services stop." },
    ],
    intro:
      "The heart of the climb: the steepest miles, the fog bank, the variable speed signs, and the Fancy Gap exit at the top.",
    sections: [
      {
        h: "The fog mountain",
        body: "This is the segment Fancy Gap is famous for. By VDOT's account the mountain is fogged in roughly a third of the year, and this is where it happens: moist Piedmont air pushed up the escarpment cools into cloud right at road level, and visibility can fall to near zero inside a mile. VDOT spent about 7.5 million dollars on a variable speed limit system for this climb because a fixed speed limit cannot describe a road that changes this fast. The pileup record here is the worst on any corridor this network covers: about 56 vehicles in February 1997, 50 in September 2005, more than 70 in November 2010, and 96 vehicles in 18 crashes on March 31, 2013, with three deaths. Every one of those days started as an ordinary drive up this segment.",
      },
      {
        h: "Trucks, grades, and the speed split",
        body: "About a quarter of the traffic on this corridor is trucks, and the four percent grade sorts them out. Loaded trucks slow to a crawl on the climb and ride their brakes on the way down, while cars run at full interstate speed, so the closing speeds on this segment are the widest on the corridor. The runaway risk runs downhill: southbound drivers meet the steepest descent of the trip here, in the same miles where the fog sits. When VDOT posts a wind advisory for high profile vehicles, it is usually aimed at this segment and the one below it, where gusts cross the escarpment edge.",
      },
      {
        h: "Exit 8, the top of the world here",
        body: "Exit 8 puts you at Fancy Gap itself: US 52, the Blue Ridge Parkway crossing, fuel, food, and the antique and craft shops the community is known for. It is also the corridor's pressure valve. When the climb is fogged in or a crash closes lanes below, Exit 8 is where drivers can get off, wait, and let the mountain clear, and US 52 gives a slow surface route down to Cana or up to Hillsville. If the verdict at the top of this page shows this segment restricted, Exit 8 is the place to act on it from either direction.",
      },
    ],
    faqs: [
      {
        q: "Why is Fancy Gap so foggy?",
        a: "Moist air from the Piedmont below is forced up the Blue Ridge escarpment and cools into cloud at road level near the top. The mountain is fogged in roughly a third of the year by VDOT's account, often while towns at the foot of the climb are clear.",
      },
      {
        q: "What is the variable speed limit on the climb?",
        a: "VDOT operates a variable speed limit system on this segment that lowers the posted speed when fog or other conditions cut visibility. The signs on the road are the legal limit and the best single signal of what VDOT is seeing on the mountain.",
      },
      {
        q: "What happened at Fancy Gap in 2013?",
        a: "On March 31, 2013, fog on this segment produced 18 crashes involving 96 vehicles, with three deaths. It is the largest of several multi vehicle pileups in the corridor's history and the reason the fog warnings here are written the way they are.",
      },
      {
        q: "Are there cameras on the steepest part of the climb?",
        a: "Yes. VDOT cameras stand at mileposts 4.9, 5.3, 5.7, 6.2, 6.6, 7.5, and 8.7 on this segment, the densest coverage on the corridor, published by VDOT through 511 Virginia and listed on this page.",
      },
    ],
  },
  {
    key: 3,
    slug: "fancy-gap-to-hillsville",
    name: "Fancy Gap to Hillsville",
    shortName: "Fancy Gap to Hillsville",
    roadName: "Interstate 77 from Fancy Gap to Hillsville",
    state: "VA",
    mpFrom: 9,
    mpTo: 15,
    mpLabel: "Virginia mileposts 9 to 15",
    latMin: 36.68,
    elevFromFt: 2800,
    elevToFt: 2506,
    elevFromLabel: "Fancy Gap, about 2,800 ft",
    elevToLabel: "Hillsville, about 2,506 ft",
    towns: ["Fancy Gap, VA", "Hillsville, VA", "Galax, VA"],
    junctions: [
      { label: "Fancy Gap, US 52 and the Blue Ridge Parkway", mp: 8, note: "Exit 8, the south end of this segment." },
      { label: "Hillsville and Galax, US 58 and US 221", mp: 14, note: "Exit 14. Hillsville, the Carroll County seat, is just east; US 58 west runs to Galax. Full services, lodging, and the county hospital are here." },
    ],
    intro:
      "Across the top: the Blue Ridge plateau run from the summit to Hillsville, where plateau weather replaces escarpment weather.",
    sections: [
      {
        h: "On top of the Blue Ridge",
        body: "North of Exit 8 the interstate leaves the escarpment edge and runs across the Blue Ridge plateau, rolling farmland at about 2,500 to 2,800 feet. The driving is easier than the climb, but the weather is plateau weather now: colder than the Piedmont in every season, first to freeze in winter, and swept by wind that has nothing to slow it down. Fog still forms here, as plateau cloud rather than climb fog, and it tends to sit in the dips and along the creeks in the early morning. Drivers who clear the climb and relax completely are making a small mistake; this segment has its own mornings.",
      },
      {
        h: "Hillsville, the corridor's supply town",
        body: "Exit 14 serves Hillsville, the Carroll County seat and the corridor's full service stop: fuel, food, lodging, and a hospital, all within a few minutes of the interstate. For northbound drivers it is the first town of any size since Mount Airy; for southbound drivers it is the last stop before the descent, and the right place to check the summit cameras and the verdict one more time before committing to the climb down. US 58 west from Exit 14 runs to Galax, the corridor's other service town, about 15 minutes away.",
      },
      {
        h: "The winter segment",
        body: "When winter weather reaches this corridor, this segment and the summit take it first and keep it longest. Snow that is rain at the state line is common here, and the plateau's open stretches drift and ice in wind that the sheltered climb never feels. Virginia has no chain control system, so winter here runs on VDOT advisories, plow and treatment reports, and restrictions posted event by event; the restrictions page on this site explains how to read them. The standing rule for this segment is the network's rule everywhere: believe the stricter of the forecast and the cameras.",
      },
    ],
    faqs: [
      {
        q: "How far is Fancy Gap from Hillsville on I-77?",
        a: "About six miles by the exit numbers, from Exit 8 at Fancy Gap to Exit 14 at Hillsville. Roughly ten minutes in clear conditions.",
      },
      {
        q: "Where are full services on this corridor?",
        a: "Hillsville, at Exit 14: fuel, food, lodging, and a hospital. Fancy Gap at Exit 8 has fuel and food. Inside the climb between Exit 1 and Exit 8 there are no services on the interstate.",
      },
      {
        q: "Does it snow on the Fancy Gap to Hillsville segment?",
        a: "Yes. At about 2,500 to 2,800 feet this plateau segment takes snow and ice in winter storms that are only rain at the foot of the climb, and it is usually the first part of the corridor to freeze.",
      },
      {
        q: "Are there cameras between Fancy Gap and Hillsville?",
        a: "Yes. VDOT cameras stand at mileposts 9.7, 10.2, 11.1, 12.0, 12.6, 13.2, 13.7, and 15.0 on this segment, published by VDOT through 511 Virginia and listed on this page.",
      },
    ],
  },
];

// Segment assignment for feed events and cameras, by latitude.
// The corridor runs south to north, so latitude is the honest
// axis: the state line is near 36.56 and Hillsville near 36.76.
// Segments are listed south to north with rising latMin bounds;
// an event belongs to the first segment whose latMin it sits
// south of (below), checked from the north end down.
export function segmentForLat(lat) {
  if (lat == null) return null;
  for (let i = SEGMENTS.length - 1; i >= 0; i--) {
    if (lat >= SEGMENTS[i].latMin) return SEGMENTS[i];
  }
  return SEGMENTS[0];
}

// Segment assignment by Virginia milepost, the axis VDOT's own
// event postings use (the mrm field on 511 Virginia records).
export function segmentForMilepost(mp) {
  if (mp == null || !Number.isFinite(mp)) return null;
  for (const s of SEGMENTS) {
    if (mp >= s.mpFrom && mp < s.mpTo) return s;
  }
  return mp >= SEGMENTS[SEGMENTS.length - 1].mpTo ? SEGMENTS[SEGMENTS.length - 1] : SEGMENTS[0];
}

export function getSegment(slug) {
  return SEGMENTS.find((s) => s.slug === slug) || null;
}
