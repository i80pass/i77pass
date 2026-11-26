// Shared live verdict sentences, generated from the same corridor
// read the verdict blocks render (lib/feeds.js getCorridor). FAQ
// answers and hub intro lines lead with these sentences so a search
// engine or AI extractor reading the server HTML gets the current
// fact itself, not a pointer to a status widget. A status is always
// generated at render time from live data, never hardcoded here.
// The corridor is in the Eastern time zone year round, so stamps
// use America/New_York.

export function formatStamp(d = new Date()) {
  return d
    .toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "America/New_York",
      timeZoneName: "short",
    })
    .toUpperCase();
}

function joinNames(names) {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

// Dual stamps (prevention phase 3, Nov 25, 2026): fetchedAt is
// OUR verified time (when the data layer last confirmed the VDOT
// datasets); agencyAt is the AGENCY report time (the newest
// update_time among the in corridor VDOT events). When no dated
// event exists, the verified time stands alone with a checked
// label, never an agency update label.
function dualTail(verifiedDate, agencyDate, agencyName) {
  const verified = formatStamp(verifiedDate);
  if (agencyDate) {
    return ` (${agencyName} report updated ${formatStamp(new Date(agencyDate))}; verified here ${verified})`;
  }
  return ` (${agencyName} feed checked here ${verified})`;
}

// "Right now, ..." sentence for one segment read.
export function liveStatusSentence(seg) {
  const stamp = formatStamp(seg?.fetchedAt ? new Date(seg.fetchedAt) : new Date());
  const name = seg?.roadName || "Interstate 77";
  if (!seg || !seg.ok) {
    return `Right now, the live status for ${name} cannot be shown, because the state feed is not answering (page rendered ${stamp}). Check 511 Virginia before you drive.`;
  }
  const tail = dualTail(seg.fetchedAt ? new Date(seg.fetchedAt) : new Date(), seg.agencyAt, "VDOT");
  if (seg.closed) {
    return `Right now, ${name} is closed on the ${seg.name} segment${tail}.`;
  }
  if (seg.restricted) {
    const n = seg.majors.length;
    const detail = n ? `, with ${n} posted ${n === 1 ? "restriction or event" : "restrictions or events"}` : "";
    return `Right now, ${name} is open with restrictions or events posted on the ${seg.name} segment${detail}${tail}.`;
  }
  const advisories = seg.events.length;
  const detail = advisories ? " Minor events are listed on this page." : "";
  return `Right now, ${name} is open with no closures or restrictions posted on the ${seg.name} segment${tail}.${detail}`;
}

// Whole corridor sentence: the worst segment decides.
export function corridorStatusSentence(corridor, segmentsList) {
  const stamp = formatStamp(corridor?.fetchedAt ? new Date(corridor.fetchedAt) : new Date());
  if (!corridor || !corridor.ok) {
    return `Right now, the live status for Interstate 77 between the North Carolina line and Hillsville cannot be shown, because the state feed is not answering (page rendered ${stamp}). Check 511 Virginia before you drive.`;
  }
  const tail = dualTail(corridor.fetchedAt ? new Date(corridor.fetchedAt) : new Date(), corridor.agencyAt, "VDOT");
  const closed = segmentsList.filter((s) => s.closed);
  if (closed.length) {
    return `Right now, Interstate 77 is closed on the ${joinNames(closed.map((s) => s.name))} segment${closed.length > 1 ? "s" : ""} between the North Carolina line and Hillsville${tail}.`;
  }
  const restricted = segmentsList.filter((s) => s.restricted);
  if (restricted.length) {
    return `Right now, Interstate 77 is open between the North Carolina line and Hillsville with restrictions or events posted on the ${joinNames(restricted.map((s) => s.name))} segment${restricted.length > 1 ? "s" : ""}${tail}.`;
  }
  return `Right now, Interstate 77 is open between the North Carolina line and Hillsville with no closures or restrictions posted on any segment${tail}.`;
}
