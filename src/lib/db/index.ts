import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/lib/db/schema";

const connectionString = process.env.DATABASE_URL!;
// Using direct connection
export const sqlClient = postgres(connectionString, { prepare: false });
export const db = drizzle(sqlClient, { schema });
