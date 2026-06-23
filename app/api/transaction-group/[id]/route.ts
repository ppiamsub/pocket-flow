import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: number } }) {

    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorize" }, { status: 401 });

    const body = await req.json();
    const group = await prisma.transactionGroup.update({
        where: { id: Number(params.id) },
        data: {
            name: body.name,
            description: body.description
        }
    });

    return NextResponse.json(group);
}

export async function DELETE(_req: Request, { params }: { params: { id: number } }) {

    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorize" }, { status: 401 });

    await prisma.transactionGroup.delete({
        where: { id: Number(params.id) }
    })

    return NextResponse.json({ success: true })
}