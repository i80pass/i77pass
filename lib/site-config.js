// SITE CONFIG: the single source of truth for every brand string on
// this site. i77pass.com, the Interstate 77 site in the Bright Red
// Design pass network, covering I-77 over Fancy Gap, Virginia, from
// the North Carolina line to Hillsville. Every page, component, and
// schema block reads from here.

export const SITE = {
  name: "i77pass",
  domain: "i77pass.com",
  get baseUrl() {
    return `https://www.${this.domain}`;
  },
  get contactEmail() {
    return `contact@${this.domain}`;
  },
  // GA4 measurement id, set through the NEXT_PUBLIC_GA_ID env var
  // (this site gets its OWN property, never a sister's). Null means
  // no tag ships.
  gaId: process.env.NEXT_PUBLIC_GA_ID || null,
  // AdSense publisher id, set through the NEXT_PUBLIC_ADSENSE_ID env
  // var at build time (the full ca-pub-... value). Null means no ad
  // loader ships and no ad slots render. The master AdSlot plumbing
  // reads the same variable directly, as on i80pass.
  adsenseId: process.env.NEXT_PUBLIC_ADSENSE_ID || null,
  logoPath: "/i77pass-logo.png",
  dataCredit:
    "Road conditions, events, and camera data: the Virginia Department of Transportation (VDOT) via 511 Virginia. Weather forecasts: the National Weather Service.",
  dataCreditShort: "Data: VDOT via 511 Virginia",
  officialSourceName: "511 Virginia",
  officialSourceUrl: "https://511.vdot.virginia.gov/",
  lawPath: "/restrictions",
  lawLabel: "Restrictions and winter traction on I-77",
  parentName: "Bright Red Design",
  regionLabel: "Interstate 77, North Carolina line to Hillsville, Virginia",
  tagline:
    "Live I-77 road conditions, fog status, restrictions, and webcams over Fancy Gap, Virginia, from the North Carolina line to Hillsville, from VDOT via 511 Virginia.",
};

export function siteUrl(pathname) {
  if (!pathname || pathname === "/") return SITE.baseUrl;
  return `${SITE.baseUrl}${pathname}`;
}

// The network footer list, in network order. Every network site
// carries the same list at the very bottom of its footer as plain
// text links; a site never links to itself, so i77pass.com is not
// in this list. The list carries every network site live at this
// build, including whitepasslive.com and rogerspasslive.com, which
// launched in the same wave.
export const NETWORK_SITES = [
  "i80pass.com",
  "i90live.com",
  "i5pass.com",
  "idahopass.com",
  "us2pass.com",
  "wasatchpasses.com",
  "grapevinepass.com",
  "i15pass.com",
  "bigbearroads.com",
  "395live.com",
  "mammothpass.com",
  "coquihallalive.com",
  "i17pass.com",
  "i70pass.com",
  "thruwaypass.com",
  "i40pass.com",
  "whitepasslive.com",
  "rogerspasslive.com",
];
