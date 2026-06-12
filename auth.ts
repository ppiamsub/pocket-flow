import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./app/lib/prisma";
import bcrypt from "bcrypt"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                username: { label: "Username" },
                password: { label: "Password", type: "Password" },
            },
            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where: { username: credentials.username as string }
                })

                if (!user) return null;

                const passwordMatch = await bcrypt.compare(
                    credentials.password as string, user.password
                )

                if(!passwordMatch) return null;

                return {id: String(user.id), name: user.name}
                return null;
            }
        })
    ]
})