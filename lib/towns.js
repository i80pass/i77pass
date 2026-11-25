// Town weather points on the I-77 Fancy Gap corridor. Coordinates
// are the town locations used for the National Weather Service
// forecast lookup. The local paragraph on each town page is
// original writing for this site, never templated from another
// town on this site or any sister site. Elevations are the
// published town elevations.

export const TOWNS = [
  {
    slug: "mount-airy",
    name: "Mount Airy, NC",
    lat: 36.4995,
    lon: -80.6073,
    elevationFt: 1111,
    elevationLabel: "about 1,111 ft",
    segmentSlug: "state-line-to-lambsburg",
    exitLabel: "South of the state line via I-74 and US 52",
    local:
      "Mount Airy is the North Carolina supply town for the Fancy Gap drive, a Surry County city in the Piedmont foothills about ten minutes south of the state line. Northbound drivers pass through its orbit on I-74 and US 52 before I-77 commits to Virginia and the climb. Its weather is Piedmont weather, warmer and clearer than the mountain above it, which is exactly why it misleads: a mild morning in Mount Airy says nothing about the fog bank that can be sitting on the escarpment. Treat Mount Airy as the last full stop to check the summit cameras, not as a forecast for them.",
    faqs: [
      { q: "How far is Mount Airy from Fancy Gap?", a: "About 15 miles: I-77 north from the Mount Airy exits crosses the state line and climbs to Exit 8 at Fancy Gap. Roughly 20 minutes in clear conditions, much longer in fog or a closure." },
      { q: "What is the elevation difference between Mount Airy and Fancy Gap?", a: "About 1,700 feet. Mount Airy sits near 1,111 feet and the Fancy Gap summit country near 2,800 feet, which is why their weather so often disagrees." },
      { q: "Should I trust Mount Airy weather for the climb?", a: "No. Use it for Mount Airy. The climb has its own weather; the cameras near mileposts 7 to 9 and the verdict on this site carry the mountain's answer." },
    ],
  },
  {
    slug: "cana",
    name: "Cana, VA",
    lat: 36.5833,
    lon: -80.6681,
    elevationFt: 1440,
    elevationLabel: "about 1,440 ft",
    segmentSlug: "state-line-to-lambsburg",
    exitLabel: "At the foot of the climb, off Exit 1 and US 52",
    local:
      "Cana is the small Carroll County community at the very foot of the Fancy Gap climb, strung along US 52 just inside Virginia. It is famous locally for produce stands and for being the place where the mountain starts: drivers on US 52 and I-77 alike pass Cana in the last flat minutes before the grade. Its weather is the climb's before picture, valley air at about 1,440 feet. When fog is reported on the mountain, Cana is often in sunshine, and that contrast is the corridor's signature. If you are waiting out a fog closure, Cana and Lambsburg are the south side's waiting rooms.",
    faqs: [
      { q: "Where is Cana, Virginia?", a: "In Carroll County at the foot of the Fancy Gap climb, along US 52 just north of the North Carolina line, served by I-77 Exit 1." },
      { q: "What is Cana known for?", a: "Produce stands along US 52 and its spot at the base of the mountain, where the Fancy Gap climb begins." },
      { q: "Is Cana a good place to wait out fog on the mountain?", a: "It is the closest community to the foot of the climb on the Virginia side, with Mount Airy's full services about ten minutes south. Check the summit cameras here before starting up." },
    ],
  },
  {
    slug: "fancy-gap",
    name: "Fancy Gap, VA",
    lat: 36.6681,
    lon: -80.7017,
    elevationFt: 2900,
    elevationLabel: "about 2,900 ft",
    segmentSlug: "lambsburg-to-fancy-gap",
    exitLabel: "Exit 8, US 52 and the Blue Ridge Parkway",
    local:
      "Fancy Gap is the mountain community at the top of the climb, where I-77, US 52, and the Blue Ridge Parkway all cross the Blue Ridge crest in the same mile. It is an unincorporated community of farms, churches, antique and craft shops, and produce stands along the ridge, at about 2,900 feet. Its name is known far beyond Carroll County because the interstate climb carries it: every driver between Ohio and Florida learns what Fancy Gap means the first time the fog closes in at milepost 6. The community lives with that fame calmly, and its weather station view, plateau air and escarpment cloud at once, is the corridor's most useful forecast point.",
    faqs: [
      { q: "What is the elevation of Fancy Gap?", a: "About 2,900 feet for the community on the ridge. The interstate tops out a little lower, near 2,800 feet, close to Exit 8." },
      { q: "What crosses at Fancy Gap?", a: "Interstate 77 at Exit 8, US 52 (the old Fancy Gap Highway), and the Blue Ridge Parkway near its milepost 199.5. It is one of the few places the Parkway and an interstate meet on the crest." },
      { q: "Why is Fancy Gap foggy so often?", a: "Moist Piedmont air rising up the escarpment cools into cloud right at the crest, where the community and the interstate sit. By VDOT's account the mountain is fogged in roughly a third of the year." },
    ],
  },
  {
    slug: "hillsville",
    name: "Hillsville, VA",
    lat: 36.7622,
    lon: -80.7345,
    elevationFt: 2506,
    elevationLabel: "about 2,506 ft",
    segmentSlug: "fancy-gap-to-hillsville",
    exitLabel: "Exit 14, US 58 and US 221",
    local:
      "Hillsville is the Carroll County seat and the corridor's full service town, a plateau community at about 2,506 feet just east of I-77 Exit 14. It has the fuel, food, lodging, and hospital the climb itself lacks, and it anchors the north end of this site's corridor the way Mount Airy anchors the south. Southbound drivers should treat Hillsville as the decision stop: fuel up, check the verdict and the summit cameras, and only then start down. Its weather is honest plateau weather, colder and windier than the valley towns, and a fair preview of the summit six miles south.",
    faqs: [
      { q: "What services are in Hillsville?", a: "Full services: fuel, food, lodging, and a hospital, within a few minutes of Exit 14. It is the main supply town on the corridor." },
      { q: "How far is Hillsville from Fancy Gap?", a: "About six miles on I-77, Exit 14 to Exit 8, roughly ten minutes in clear conditions." },
      { q: "What is the elevation of Hillsville?", a: "About 2,506 feet, the published town elevation, on the Blue Ridge plateau." },
    ],
  },
  {
    slug: "galax",
    name: "Galax, VA",
    lat: 36.6613,
    lon: -80.9200,
    elevationFt: 2366,
    elevationLabel: "about 2,366 ft",
    segmentSlug: "fancy-gap-to-hillsville",
    exitLabel: "West of Exit 14 via US 58, about 15 minutes",
    local:
      "Galax is an independent city west of the corridor, reached from Exit 14 by US 58, and the region's other service center. It is known nationally for old time and bluegrass music, and locally as the town that shares the plateau's weather with Hillsville and Fancy Gap. For corridor drivers it matters as the alternate stop: when Hillsville is crowded on a closure day, Galax has lodging and food a short drive west, and its forecast is a second plateau reading to compare against the summit. Trips that pair the climb with a Galax music night should build the same fog margin into the evening drive back.",
    faqs: [
      { q: "How do I reach Galax from I-77?", a: "Take Exit 14 and follow US 58 west about 11 miles. The drive takes roughly 15 minutes in clear conditions." },
      { q: "What is Galax known for?", a: "Old time and bluegrass music, including one of the oldest fiddlers conventions in the country, and its role as a service center for the plateau counties." },
      { q: "Is Galax weather a guide to Fancy Gap?", a: "Closer than the valley towns: Galax sits on the same plateau at about 2,366 feet. The summit cameras still carry the final word on fog at the crest." },
    ],
  },
];

export function getTown(slug) {
  return TOWNS.find((t) => t.slug === slug) || null;
}
