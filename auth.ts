import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                username: { label: "Username" },
                password: { label: "Password", type: "Password" },
            },
            async authorize(credentials) {
                if (credentials.username === "admin" && credentials.password === "1234") {
                    return { id: "1", name: "Admin" }
                }
                return null;
            }
        })
    ]
})