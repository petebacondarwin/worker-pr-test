import { execSync } from "child_process";
import { resolve } from "path";

const WORKER_PACKAGES = ["package-b"];

type PublishedPackage = { name: string; version: string };

console.log("Checking for Workers to deploy...");
const packages: PublishedPackage[] = JSON.parse(
  process.env.PUBLISHED_PACKAGES ?? "[]"
);

for (const pkg of packages) {
  if (WORKER_PACKAGES.includes(pkg.name)) {
    console.log("Deploying", pkg.name, "at", pkg.version);
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
}
