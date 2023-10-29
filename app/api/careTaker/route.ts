import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const {patientId} = await request.json();
        console.log("Patient ID:", patientId)
        if (!patientId) {
            return NextResponse.json({ message: "Patient ID is required" }, { status: 400 });
        }

        const complaints = await prisma.complaint.findMany({
            where: {
                patientId: parseInt(patientId, 10)
            },
            select: {
                description: true,
            }
        });

        const successfulCheckIns = await prisma.checkin.findMany({ // Adjusted "checkIn" to "checkin" based on your schema
            where: {
                patientId: parseInt(patientId, 10),
            },
            select: {
                date: true,
                attemptCount: true
            }
        });

        const failedCheckIns = await prisma.failCheckin.findMany({ // Changed to "failCheckin" to match your schema
            where: {
                patientId: parseInt(patientId, 10),
            },
            select: {
                date: true,
                reachedCareTaker: true
            }
        });

        console.log("Complaints:", complaints);
        console.log("Successful CheckIns:", successfulCheckIns);
        console.log("Failed CheckIns:", failedCheckIns);
        return NextResponse.json({ complaints, successfulCheckIns, failedCheckIns }, { status: 200 });

    } catch (error) {
        console.error("Error fetching data from the database:", error);
        return NextResponse.json({ message: "Error fetching data" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
