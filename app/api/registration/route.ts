import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { patientName, patientNumber, careTakerName, careTakerNumber } = await request.json();
        const patient = await prisma.patient.create({
            data: {
                name: patientName,
                phone: patientNumber,
            },
        })

        const careTaker = await prisma.careTaker.create({
            data: {
                name: careTakerName,
                phone: careTakerNumber,
                patientId: patient.id
            },
        })


        return NextResponse.json({ careTaker, patient }, { status: 200 });

    } catch (error) {
        console.error("Error saving to the database:", error);
        return NextResponse.json({ message: "Error processing the registration" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
