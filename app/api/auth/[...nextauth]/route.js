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
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.id = token.id;
                session.user.role = token.role || 'customer';
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET || "secret",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };