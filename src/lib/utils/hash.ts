import { createHash } from "crypto";

export function getUrlHash(url: string): string {
  return createHash("md5").update(url).digest("hex");
}
