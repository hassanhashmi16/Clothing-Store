import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/app/lib/mongodb";

export const authOptions = {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "dummy_id",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy_secret",
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async session({ session, token }) {
            if (session?.user) {
                session.user.id = token.sub;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET || "secret",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };