# i77pass.com Build Log

Site: i77pass.com, Interstate 77, the North Carolina line to Hillsville, Virginia, over Fancy Gap.
Built: November 25, 2026 (overnight launch wave). Market gate: PASSED November 25, 2026 at about 25 percent of i80pass (report at ~/workspace/research_notes/new-market-gate-2026-11-25.md). Domain registered in Tracy's Cloudflare account, confirmed November 25, 2026, expires November 25, 2027. Logo approved by Tracy November 25, 2026 as the final mark, no swaps (staged set at ~/workspace/i77pass.com/assets-logo/, canonical copies in ~/workspace/your_files/logo-vault/).

## Approach

The i80pass master is a Sanity and region app that does not run standalone for a new corridor; per the network's accepted pattern (thruwaypass precedent), this site was built from the slim clone base (the i40pass repo, the closest sibling: keyless feeds, a restrictions page in the chain slot, amber hot linked cameras) and adapted end to end. Every master pattern surface is carried: verdict bar, corridor navigation, camera strips under the network count rule, segment pages, town weather pages, widget pages, status history, storm alerts, footer network mesh, and the LLC footer line exactly as specified.

## Corridor

Three segments, south to north, assigned by latitude bands in lib/segments.js and by milepost everywhere else:

1. North Carolina Line to Lambsburg, mileposts 0 to 4.5, elevation 1,400 to 1,900 feet.
2. Lambsburg to Fancy Gap, mileposts 4.5 to 9, elevation 1,900 to 2,800 feet (the climb proper).
3. Fancy Gap to Hillsville, mileposts 9 to 15, elevation 2,800 to 2,506 feet.

Towns: Mount Airy, Cana, Fancy Gap, Hillsville, Galax (NWS forecasts via the Blacksburg office gridpoints). Route page: Mount Airy to Hillsville. Flagship page: Fancy Gap. All corridor writing is original, written for this mountain: the fog story (the summit is fogged in roughly a third of the year), the near constant four percent grade, the truck share, the variable speed limit system, the wind advisories, and the pileup record (1997, 2005, 2010, and the 96 vehicle pileup of March 31, 2013).

## Data layer

VDOT has no developer API. The site reads the keyless datasets VDOT's own 511 Virginia platform publishes (full research in the project FEED-NOTES at ~/workspace/i77pass/data/FEED-NOTES.md): the incidents and work zones dataset plus the minor incidents GeoJSON for verdicts, the message sign layer for the home page sign board, and the camera layer for the registry snapshot. The adapter in lib/feeds.js keeps the family exports and return shape, and fails closed: if both event datasets stop answering, every segment reads STATUS UNAVAILABLE.

Named exceptions to the master pattern, all ruled or inherent:

- Chain slot: Virginia has no chain control, so the chains page slot is the restrictions and winter traction page at /restrictions, and no chain signature exists in the data layer or the status logger.
- Cameras: 22 in the live registry for this corridor on build day, against the gate's count of 23. The site ships the registry's own count; every camera carries a VDOT still hot linked with credit, never rehosted.
- No ski area page: this corridor has none (the base's ski page was deleted, thruwaypass precedent).

## Verification at build time

- npm run build: clean, 58 routes, including all 22 camera pages, 3 segment pages, 3 segment camera pages, and 5 town weather pages.
- Local production crawl: every sitemap route returned 200; a bogus path returned the styled 404; /api/conditions returned the live corridor verdict (OPEN on all three segments at crawl time, from the real VDOT datasets); /api/subscribe rejected an invalid email with the proper error.
- scripts/log-status.mjs ran against the live datasets and recorded the baseline entry; scripts/build-cameras.mjs round tripped the snapshot at 22 cameras.
- Dash scan: zero em dash or en dash characters (and zero dash entities) anywhere in the repo, including metadata and alt text.
- ads.txt at the root carries exactly the one required line. IndexNow key file ships in public/; the local key copy is mode 600 outside the repo.

## Launch state (as of the overnight build, Nov 25, 2026)

- Local build complete and verified (above). The repo is one push
  away from live: 86 files, manifest at
  ~/workspace/i77pass/push-manifest.txt, push script at
  ~/workspace/i77pass/push_all.py.
- GitHub repo: NOT yet created. The banked fine-grained token
  cannot create repos (POST /user/repos returned 403 "Resource
  not accessible by personal access token", tried Nov 25, 2026),
  and the GitHub connector has the same limit. Creation is Step 1
  of the console handoff at
  ~/workspace/i77pass/HANDOFF-CONSOLE-STEPS.md.
- Amplify app: not yet created (needs the repo, then the console
  GitHub connection). AWS CLI verified working (scout-deploy,
  eu-north-1); the sibling apps are all in eu-north-1, i40pass is
  app d1wo8pi6cztles, WEB_COMPUTE, branch main, PRODUCTION.
- Cloudflare zone: i77pass.com exists, zone id
  c344648a5932d0a03bf6f1e5b7fced14, zero DNS records. DNS records
  land after the Amplify domain step produces its values.
- Search Console and GA4: not yet created (console steps in the
  handoff). Measurement gate: OPEN for both.
- IndexNow: key file ships in public/ and the submit script is at
  ~/workspace/i77pass/submit-indexnow.py; submission runs after
  the domain verifies live.
- Storm alerts: subscribe route ships in the family pattern
  (Resend, General segment fallback); the live test signup runs
  after deploy, once RESEND_API_KEY is on the app.

## Gold Standard parity pass, Nov 25, 2026

Against the deviation audit at ~/workspace/i77pass/gold-standard-audit-2026-11-25.md
(all 14 items; results appended to that file):

- The two named exceptions from the launch build are RETIRED.
  /chains now exists in the master's page pattern, carrying
  Virginia's honest position (no chain control program; live
  restrictions and advisories instead), and the top nav and
  bottom bar fourth item read "Chain Control" at /chains,
  exactly as the master. /restrictions remains as the guide
  page behind it.
- The verdict read is hardened: feed reads retry with backoff
  (3 attempts, 20 second timeout) and failed reads are cached
  for only 30 seconds, so a transient upstream failure can no
  longer bake STATUS UNAVAILABLE into rendered pages.
- Per segment cameras pages are retired; SEE ALL WEBCAMS points
  to /cameras everywhere, and /cameras is rebuilt to the master
  layout (one grid, guidance block, no FAQ).
