import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./app/lib/prisma";
import bcrypt from "bcrypt"
import { TransactionGroup } from "@prisma/client"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                username: { label: "Username" },
                password: { label: "Password", type: "Password" },
            },
            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where: { username: credentials.username as string },
                    include: {
                        transactionGroup: true
                    }
                })

                if (!user) return null;

                const passwordMatch = await bcrypt.compare(
                    credentials.password as string, user.password
                )

                if (!passwordMatch) return null;

                const selectedGroup = user.transactionGroup.length > 0 ? user.transactionGroup.at(-1)?.id : 0;
                return { id: String(user.id), name: user.name, transactionGroup: user.transactionGroup, selectedGroup: selectedGroup }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.transactionGroup = user.transactionGroup
            }
            return token
        },
        async session({ session, token }) {
            session.user.transactionGroup = token.transactionGroup as TransactionGroup[]
            return session
        }
    }
})