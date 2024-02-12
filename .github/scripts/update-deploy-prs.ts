import { Octokit } from "@octokit/action";
import { execSync } from "child_process";

(async () => {
  const octokit = new Octokit();

  const deployWorkerPRs = await getDeployPRs(octokit);
  console.log(deployWorkerPRs.map((pr) => pr.title));

  const deployBranches = await getDeployBranches();
  console.log(deployBranches);
})();

async function getDeployPRs(octokit: Octokit) {
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
  return branches
    .split("\n")
    .map((branch) => branch.replace(/origin\/(.*)\s*/g, "$1").trim());
}
