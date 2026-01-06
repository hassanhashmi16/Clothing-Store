import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AdminNav from "./components/AdminNav";

export default async function AdminLayout({ children }) {
    const session = await getServerSession(authOptions);

    // Minimalist security check
    if (!session || session.user.role !== 'admin') {
        redirect('/');
    }

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
            <div className="flex-grow flex flex-col pt-12 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <AdminNav />
                <main className="flex-grow">
                    {children}
                </main>
            </div>
        </div>
    );
}
