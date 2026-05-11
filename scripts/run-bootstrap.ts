import { ensureDbSchema } from "../src/lib/db/bootstrap";

async function main() {
  console.log("Running DB bootstrap...");
  try {
    await ensureDbSchema();
    console.log("DB bootstrap complete!");
  } catch (error) {
    console.error("DB bootstrap failed:", error);
    process.exit(1);
  }
  process.exit(0);
}

main();
