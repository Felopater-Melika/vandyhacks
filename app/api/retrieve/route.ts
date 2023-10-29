import {NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();


export async function POST(request: Request) {
    const { email } = await request.json();
    console.log("Email:", email);
    try {
        const careTaker = await prisma.careTaker.findUnique({
            where: {
                email: email
            }
        });
        if (!careTaker)
            console.log("CareTaker not found")
        console.log(careTaker);
        return NextResponse.json({ careTaker }, { status: 200 });

    } catch (error) {
        console.error("Error querying for careTaker:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}