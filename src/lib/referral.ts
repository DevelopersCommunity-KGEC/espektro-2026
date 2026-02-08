import dbConnect from "@/lib/db";
import User from "@/models/User";
import { createHash } from "crypto";

// Deterministic encoder: Email -> Base36 String
function encodeEmail(email: string, salt: string = ""): string {
  const hash = createHash("sha256")
    .update(email.toLowerCase().trim() + salt)
    .digest("hex");
  // Convert hex to BigInt then Base36 for higher density (0-9, A-Z)
  // Take first 8 characters
  return BigInt("0x" + hash)
    .toString(36)
    .substring(0, 8)
    .toUpperCase();
}

// Generate code with collision check
export async function generateUniqueReferralCode(
  email: string,
): Promise<string> {
  // 1. Try pure deterministic code
  let code = encodeEmail(email);
  const existing = await User.findOne({ referralCode: code });

  // If free, or taken by THIS user (idempotent), return it
  if (!existing || existing.email === email) return code;

  // 2. Collision fallback (extremely rare with Base36)
  let attempt = 1;
  while (attempt < 10) {
    code = encodeEmail(email, `-${attempt}`);
    const check = await User.findOne({ referralCode: code });
    if (!check) return code;
    attempt++;
  }

  // 3. Last resort random fallback (fault tolerance)
  return encodeEmail(email, Date.now().toString());
}

export async function ensureUserReferralCode(userId: string) {
  await dbConnect();
  const user = await User.findById(userId);
  if (!user) return null;

  if (user.referralCode) return user.referralCode;

  const newCode = await generateUniqueReferralCode(user.email);
  user.referralCode = newCode;
  await user.save();

  return newCode;
}

export async function validateUserReferral(
  code: string,
  currentUserId?: string,
) {
  if (!code) return null;

  await dbConnect();
  const referrer = await User.findOne({ referralCode: code });

  if (!referrer) return null;

  // Prevent self-referral
  if (currentUserId && referrer._id.toString() === currentUserId) {
    return null;
  }

  return referrer;
}
