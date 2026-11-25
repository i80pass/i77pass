// Server startup prewarm, following the i80pass master's
// instrumentation pattern: warm the corridor read at server start
// so the first visitor does not pay the agency latency. If the
// VDOT datasets are not answering, the read resolves to the honest
// unavailable shape and the pages render that state.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  try {
    const { getCorridor } = await import("./lib/feeds");
    await getCorridor();
  } catch {
    // Prewarm is an optimization only; a failure here must never
    // stop the server from starting.
  }
}
