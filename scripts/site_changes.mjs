// Writes lib/site-changes.json from the git history, for the admin change log.
// On a machine without git (e.g. a build server), it keeps the existing file.
import { execSync } from "node:child_process";
import fs from "node:fs";

try {
  const out = execSync('git log -60 --date=short --pretty=format:"%ad%x09%s"', { encoding: "utf8" });
  const changes = out
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [date, ...rest] = line.split("\t");
      return { date, title: rest.join("\t") };
    });
  fs.writeFileSync("lib/site-changes.json", JSON.stringify(changes, null, 1));
  console.log(`site changes: ${changes.length}`);
} catch {
  console.log("site changes: git not available, keeping the existing list");
}
