import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/lib/db/schema";

const connectionString = process.env.DATABASE_URL!;
// Using transaction mode pooler (port 6543)
export const sqlClient = postgres(connectionString, { prepare: false });
export const db = drizzle(sqlClient, { schema });
