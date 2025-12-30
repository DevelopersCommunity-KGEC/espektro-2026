import { createAuthClient } from "better-auth/react";
import { auth } from "@/lib/auth";

// @ts-expect-error - specific better-auth type mismatch workaround
export const authClient = createAuthClient<typeof auth>({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
});
