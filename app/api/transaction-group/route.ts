import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {

    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorize" }, { status: 401 });

    const group = await prisma.transactionGroup.findMany({
        where: { userId: Number(session.user.id) },
        orderBy: { updatedAt: "desc" }
    })

    return NextResponse.json(group);
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorize" }, { status: 401 });

    const body = await req.json();
    const group = await prisma.transactionGroup.create({
        data: {
            name: body.name,
            description: body.description,
            userId: Number(session.user.id)
        }
    })

    return NextResponse.json(group);
}