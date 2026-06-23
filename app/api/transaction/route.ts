import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";
import { TransactionType } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorize" }, { status: 401 });

    const body = await req.json();
    const transaction = await prisma.transaction.create({
        data: {
            transactionGroupId: Number.parseInt(body.transactionGroupId),
            type: body.amount < 0 ? TransactionType.expense : TransactionType.income,
            name: body.name,
            amount: Number.parseFloat(body.amount),
            note: body.note,
        }
    })

    return NextResponse.json(transaction)
} 