import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const MAX_ATTEMPTS = 3; // Define the maximum number of attempts
        const currentDateTime = dayjs(); // Get the current date and time using dayjs

        const patients = await prisma.patient.findMany({
            where: {
                nextCallDate: {
                    // Filter patients whose nextCallDate is less than the current time
                    lt: currentDateTime.toDate(),
                },
                attemptCount: {
                    // Filter patients whose attemptCount is less than MAX_ATTEMPTS
                    lt: MAX_ATTEMPTS,
                },
            },
            select: {
                id: true, // Select the patient id
                phone: true, // Select the phone number
            },
        });

        return NextResponse.json({ patients }, { status: 200 });

    } catch (error) {
        console.error("Error fetching data from the database:", error);
        return NextResponse.json({ message: "Error fetching data" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
