import { auth, currentUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function getCurrentDbUser() {
  let clerkId: string | null | undefined;

  try {
    ({ userId: clerkId } = await auth());
  } catch {
    return null;
  }

  if (!clerkId) return null;

  await connectToDatabase();

  // Try to find existing user
  let dbUser = await User.findOne({ clerkId });

  // Auto-create if not exists (fallback when webhook hasn't fired)
  if (!dbUser) {
    try {
      const clerkUser = await currentUser();
      if (!clerkUser) return null;

      const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
      const firstName = clerkUser.firstName ?? "";
      const lastName = clerkUser.lastName ?? "";
      const name = `${firstName} ${lastName}`.trim() || "User";

      dbUser = await User.findOneAndUpdate(
        { clerkId },
        { clerkId, email, name },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } catch {
      return null;
    }
  }

  return dbUser;
}
