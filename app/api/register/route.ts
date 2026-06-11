import { NextResponse } from "next/server"
import { prisma } from "../../lib/prisma"
import bcrypt from "bcrypt"


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
        return NextResponse.json({ error: "invalid" }, { status: 400 })
    }
}