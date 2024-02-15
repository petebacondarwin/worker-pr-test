import { Octokit } from "@octokit/action";
import {} from "octokit";
import { execSync } from "child_process";

(async () => {
  const octokit = new Octokit();

  const deployBranches = await getDeployBranches();
  console.log("Found the following worker deploy branches", deployBranches);
  const deployWorkerPRs = await getDeployPRs(octokit, deployBranches);
  console.log(deployWorkerPRs.map((pr) => pr.title));
})();

async function getDeployPRs(octokit: Octokit, deployBranches: Map<string>) {
  const openPRs = await octokit.pulls.list({
    state: "open",
    owner: "petebacondarwin",
    repo: "worker-pr-test",
  });
  const deployWorkerPRs = openPRs.data.filter((pr) =>
    pr.head.ref?.startsWith("deploy-worker/")
  );
  return deployWorkerPRs;
}

async function getDeployBranches() {
  const branches = execSync("git branch --list -r", {
    encoding: "utf8",
  });
  return new Map(
    branches
      .split("\n")
      .map((branch) => branch.replace(/origin\/(.*)\s*/g, "$1").trim())
      .filter((branch) => branch.startsWith("deploy-worker/"))
      .map((branch) => [branch, null])
  );
}
