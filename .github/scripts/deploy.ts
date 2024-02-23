import { execSync } from "child_process";
import { resolve } from "path";

// This list tells us which packages to deploy as a Worker
// We could maybe automate this by looking for wrangler.toml files...
const WORKER_PACKAGES = ["package-b"];

type PublishedPackage = { name: string; version: string };
const packages: PublishedPackage[] = JSON.parse(
  process.env.PUBLISHED_PACKAGES ?? "[]"
);

console.log("Checking for Workers to deploy...");
for (const pkg of packages) {
  let deployedWorkerCount = 0;
  if (WORKER_PACKAGES.includes(pkg.name)) {
    console.log("Deploying", pkg.name, "at", pkg.version);
    deployedWorkerCount++;
    execSync(`pnpm wrangler deploy`, {
      cwd: resolve(pkg.name),
      env: {
        ...process.env,
        CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN,
      },
      stdio: "inherit",
    });
  } else {
    console.log("Skipping", pkg.name, "at", pkg.version);
  }
  if (deployedWorkerCount === 0) {
    console.log("No Workers to deploy.");
  } else {
    console.log("Deployed", deployedWorkerCount, "workers");
  }
}
