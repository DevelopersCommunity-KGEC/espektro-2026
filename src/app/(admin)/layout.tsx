import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    let userRole = session?.user?.role;

    // Fallback: Check environment variable if role isn't set in DB yet
    const adminEmails = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "").split(",").map(e => e.trim());
    if (session?.user?.email && adminEmails.includes(session.user.email)) {
        userRole = "super-admin";
    }

    // Only allow super-admin in the (admin) layout
    if (!session || userRole !== "super-admin") {
        return redirect("/login");
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}

