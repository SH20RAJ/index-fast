import postgres from "postgres";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const connectionString = process.env.DATABASE_URL!;
console.log("Connecting to database...");

const sql = postgres(connectionString, { prepare: false });

async function main() {
  try {
    console.log("Running migration queries...");
    
    // Add columns to websites table
    await sql`ALTER TABLE websites ADD COLUMN IF NOT EXISTS site_health jsonb;`;
    console.log("Added site_health column");
    
    await sql`ALTER TABLE websites ADD COLUMN IF NOT EXISTS yandex_token text;`;
    console.log("Added yandex_token column");
    
    await sql`ALTER TABLE websites ADD COLUMN IF NOT EXISTS baidu_token text;`;
    console.log("Added baidu_token column");
    
    await sql`ALTER TABLE websites ADD COLUMN IF NOT EXISTS naver_token text;`;
    console.log("Added naver_token column");
    
    // Add unique constraint to users if not exists
    try {
      await sql`ALTER TABLE users ADD CONSTRAINT users_api_key_unique UNIQUE (api_key);`;
      console.log("Added users_api_key_unique unique constraint");
    } catch (e: any) {
      console.log("Unique constraint might already exist or failed:", e.message);
    }

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await sql.end();
  }
}

main();
