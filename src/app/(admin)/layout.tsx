import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin-sidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    // Check for admin, ticket-issuer, or security roles
    const allowedRoles = ["admin", "ticket-issuer", "security"];
    const userRole = session?.user?.role;

    if (!session || !userRole || !allowedRoles.includes(userRole)) {
        redirect("/login");
    }

    // Role-based redirection
    // If security tries to access anything other than /scan, redirect to /scan
    // Note: We need to check the current path, but this is a layout, so we can't easily get the path here server-side without headers or middleware.
    // However, we can just restrict access to the sidebar links and let the page access be controlled.
    // But the user asked for redirection.
    // Since this is a layout, it wraps all pages in (admin).
    // If I am on /dashboard, this layout runs.
    // If I am on /scan, this layout runs.

    // We can use headers to get the pathname if needed, but it's a bit hacky.
    // Alternatively, we can just check if the user is allowed to be here.
    // But wait, if I am security and I go to /dashboard, I should be redirected to /scan.

    // Let's use a client component wrapper or just check headers.
    const headersList = await headers();
    const pathname = headersList.get("x-invoke-path") || "";

    // Actually, x-invoke-path might not be reliable.
    // Let's just rely on the fact that if they are here, they are authorized for the GROUP.
    // But we want to prevent them from seeing the dashboard if they are security.

    // Let's try to be simple. If user is security, they should ONLY be on /scan.
    // If user is ticket-issuer, they should ONLY be on /dashboard/manual-tickets.

    // But wait, /scan is inside (admin).
    // So if I redirect security to /scan from here, and they are already on /scan, it will loop.

    // I need to know the current path.
    // In Next.js 15/16, we can't easily get pathname in server layout.
    // However, we can do this check in the page.tsx of dashboard.

    // But there are many pages.

    // Let's use middleware? No, user didn't ask for middleware.

    // Let's use a client component to handle redirect?
    // Or just let them access it but show nothing? No, user said "redirect them".

    // Let's try to use the `headers()` trick or just assume if they are security, they shouldn't be on /dashboard.
    // But /scan is also under this layout.

    // Let's look at the file structure again.
    // (admin)/layout.tsx wraps:
    // (admin)/dashboard/page.tsx
    // (admin)/scan/page.tsx
    // ...

    // If I put the redirect logic in `(admin)/dashboard/layout.tsx`, it would only affect dashboard pages!
    // Does `(admin)/dashboard` have a layout?
    // Yes: `src/app/(admin)/dashboard/layout.tsx` (Wait, let me check if it exists).
    // The file list showed `src/app/(admin)/layout.tsx` and `src/app/(admin)/dashboard/page.tsx`.
    // It did NOT explicitly show `src/app/(admin)/dashboard/layout.tsx`.
    // Let me check if `src/app/(admin)/dashboard/layout.tsx` exists.

    // If it exists, I can put the check there for security -> redirect to scan.
    // And for ticket-issuer -> redirect to manual-tickets (if they are on dashboard root).

    // But `ticket-issuer` needs access to `/dashboard/manual-tickets`.
    // So `(admin)/dashboard/layout.tsx` would wrap `manual-tickets` too.

    // So:
    // 1. `src/app/(admin)/layout.tsx`: Allow all roles.
    // 2. `src/app/(admin)/dashboard/page.tsx`: Redirect `security` -> `/scan`, `ticket-issuer` -> `/dashboard/manual-tickets`.
    // 3. `src/app/(admin)/scan/page.tsx`: Allow `security`, `admin`, `editor`. (Ticket issuer?)

    // This seems safer.

    // Let's check if `src/app/(admin)/dashboard/page.tsx` exists and read it.

    // Also, I need to update `src/components/admin-sidebar.tsx` to hide links.

    // Let's first update `src/app/(admin)/layout.tsx` to just allow the roles.

    // Then I will handle redirection in the specific pages.

    // Wait, if `security` goes to `/dashboard/users`, they shouldn't be allowed.
    // So I should probably have a check in `(admin)/layout.tsx` but I need the path.

    // Let's try to use a client component for the redirect logic if server side is hard.
    // Or just use `middleware.ts` if it exists? It doesn't seem to exist in the file list.

    // Let's stick to updating `(admin)/layout.tsx` to allow roles, and then `(admin)/dashboard/page.tsx` to redirect.
    // And maybe `(admin)/dashboard/layout.tsx` if it exists to protect all dashboard routes.

    // Let's check for `src/app/(admin)/dashboard/layout.tsx`.


    return (
        <div className="flex min-h-screen w-full flex-col md:flex-row bg-muted/40">
            <AdminSidebar userRole={userRole} />
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
