import { setTimeout as delay } from "node:timers/promises";
const { SITE_URL: site, GITHUB_SHA: sha } = process.env;
if (!site?.startsWith("https://") || !/^[a-f0-9]{40}$/.test(sha || "")) throw Error("INVALID_DEPLOY_VERIFICATION_CONFIG");
let ready = false;
for (let attempt = 0; attempt < 30; attempt++) {
  try {
    const response = await fetch(`${site}/api/health?commit=${sha}`, { signal: AbortSignal.timeout(10000), cache: "no-store" });
    const body = await response.json();
    if (response.ok && body.status === "ok" && body.commit === sha) { ready = true; break; }
  } catch { /* Rollout may still be propagating. */ }
  await delay(5000);
}
if (!ready) throw Error("DEPLOYED_COMMIT_NOT_VERIFIED");
console.log(`Verified deployed commit ${sha}`);
