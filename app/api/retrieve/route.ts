import {NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();


export async function POST(request: Request) {
    const { email } = await request.json();
    console.log("Email:", email);
    const careTaker = await prisma.careTaker.findUnique({
        where: {
            email
        }
    })
    // Check if careTaker is found
    if (!careTaker) {
        return NextResponse.json({
            error: "CareTaker not found with provided email"
        }, { status: 404 });
    }

    return NextResponse.json({ careTaker }, { status: 200 });
}