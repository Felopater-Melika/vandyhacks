import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const MAX_ATTEMPTS = 3;
        const currentDateTime = dayjs();

        const checkins = await prisma.checkin.findMany({
            where: {
                nextAttemptTime: {
                    lt: currentDateTime.toDate(),
                },
                attemptCount: {
                    lt: MAX_ATTEMPTS,
                },
            },
            select: {
                patient: {
                    select: {
                        id: true,
                        phone: true,
                    }
                }
            },
        });

        // Extract patient data from checkins
        const patients = checkins.map(checkin => checkin.patient);

        return NextResponse.json({ patients }, { status: 200 });

    } catch (error) {
        console.error("Error fetching data from the database:", error);
        return NextResponse.json({ message: "Error fetching data" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
