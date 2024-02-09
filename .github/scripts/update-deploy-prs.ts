import { Octokit } from "@octokit/action";

(async () => {
  const octokit = new Octokit();
  const openPRs = await octokit.pulls.list({
    state: "open",
    owner: "petebacondarwin",
    repo: "worker-pr-test",
  });
  const deployWorkerPRs = openPRs.data.filter((pr) =>
    pr.head.ref?.startsWith("deploy-worker/")
  );
  console.log(deployWorkerPRs.map((pr) => pr.title));
})();
