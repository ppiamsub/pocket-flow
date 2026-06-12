import { NextResponse } from "next/server"
import { prisma } from "../../lib/prisma"
import bcrypt from "bcrypt"
import { Prisma } from "@prisma/client"


export async function POST(req: Request) {
    try {
        const formData = await req.json()
        await prisma.user.create({
            data: {
                name: formData.name,
                username: formData.username,
                password: await bcrypt.hash(formData.password, 10),
                target: formData.target
            }
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return NextResponse.json({ error: "username นี้มีคนใช้แล้ว" }, { status: 400 })
        }
        return NextResponse.json({ error: "invalid" }, { status: 400 })
    }
}