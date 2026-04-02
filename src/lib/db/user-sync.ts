import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

interface SyncUserInput {
  id: string;
  primaryEmail?: string | null;
}

export async function ensureUserRecord(input: SyncUserInput) {

  const safeEmail = input.primaryEmail ?? `${input.id}@indexfast.local`;

  const [user] = await db
    .insert(users)
    .values({
      id: input.id,
      email: safeEmail,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        email: safeEmail,
        updatedAt: new Date(),
      },
    })
    .returning();

  return user;
}
