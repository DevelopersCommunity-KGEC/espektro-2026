"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function useAuthorization(allowedRoles: string[]) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/");
      return;
    }

    // Access role safely
    const userRole = (session.user as any).role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      router.replace("/");
    }
  }, [session, isPending, router, allowedRoles]);

  return {
    isAuthorized:
      !!session && allowedRoles.includes((session?.user as any)?.role),
    isLoading: isPending,
    session,
  };
}
