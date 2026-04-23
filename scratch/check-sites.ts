import { db } from "../src/lib/db";
import { users, websites } from "../src/lib/db/schema";
import { eq } from "drizzle-orm";

async function checkUser() {
  const email = "thatmovieexplainer@gmail.com";
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    console.log("User not found");
    return;
  }

  console.log("User ID:", user.id);
  const userWebsites = await db.query.websites.findMany({
    where: eq(websites.userId, user.id),
  });

  console.log("Websites count:", userWebsites.length);
  userWebsites.forEach(w => console.log("- ", w.url));
}

checkUser().catch(console.error);
