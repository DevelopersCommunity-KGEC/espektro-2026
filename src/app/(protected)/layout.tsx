import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        // Read the current path from the x-next-url header set by Next.js
        const headersList = await headers();
        const currentPath = headersList.get("x-next-url") || headersList.get("referer") || "/my-tickets";
        redirect(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
    }

    return (
        <>
            {children}
        </>
    );
}
