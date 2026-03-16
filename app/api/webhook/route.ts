import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

type ClerkEvent = {
  type: string;
  data: {
    id: string;
    email_addresses?: Array<{ email_address: string }>;
    first_name?: string | null;
    last_name?: string | null;
  };
};

function getName(firstName?: string | null, lastName?: string | null) {
  const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim();
  return fullName || "User";
}

export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const heads = headers();
  const svixId = heads.get("svix-id");
  const svixTimestamp = heads.get("svix-timestamp");
  const svixSignature = heads.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing Svix headers" }, { status: 400 });
  }

  const payload = await req.text();

  let event: ClerkEvent;
  try {
    const webhook = new Webhook(webhookSecret);
    event = webhook.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature
    }) as ClerkEvent;
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  await connectToDatabase();

  if (event.type === "user.created" || event.type === "user.updated") {
    const email = event.data.email_addresses?.[0]?.email_address;
    if (!email) {
      return NextResponse.json({ error: "Email not found on Clerk event" }, { status: 400 });
    }

    await User.findOneAndUpdate(
      { clerkId: event.data.id },
      {
        clerkId: event.data.id,
        email,
        name: getName(event.data.first_name, event.data.last_name)
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  if (event.type === "user.deleted") {
    await User.findOneAndDelete({ clerkId: event.data.id });
  }

  return NextResponse.json({ success: true });
}
