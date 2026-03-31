import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/sites";

const connectionString = process.env.DATABASE_URL!;

// Disable prefetch for environments like Cloudflare/Vercel (serverless)
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
