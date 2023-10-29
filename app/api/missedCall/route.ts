import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const MAX_ATTEMPTS = 3;

        const { patientID } = await request.json();
        const parsedPatientID = parseInt(patientID, 10);

        // Find the patient's latest checkin
        const checkin = await prisma.checkin.findFirst({
            where: {
                patientId: parsedPatientID
            },
            orderBy: {
                date: 'desc'
            }
        });

        if (!checkin) {
            return NextResponse.json({ error: "Checkin not found" }, { status: 404 });
        }

        // Check if the checkin has already reached the maximum attempts
        if (checkin.attemptCount === MAX_ATTEMPTS) {
            const failedCheckin = await prisma.failCheckin.create({
                data: {
                    patientId: parsedPatientID,
                    date: new Date(),
                    reachedCareTaker: false, // Change this to a Boolean value.
                                             // You may later update it once the caretaker is reached.
                }
            });

            const patient = await prisma.patient.findUnique({
                where: {
                    id: parsedPatientID
                },
                include: {
                    careTaker: true
                }
            });

            return NextResponse.json({
                callCaretaker: true,
                caretakerNumber: patient?.careTaker?.phone || null,
                patientName: patient?.name || null
            }, { status: 200 });
        }

        // Increment the attempt count for the checkin
        await prisma.checkin.update({
            where: {
                id: checkin.id
            },
            data: {
                attemptCount: checkin.attemptCount + 1,
            },
        });

        return NextResponse.json({
            callCaretaker: false,
        }, { status: 200 });

    } catch (error) {
        console.error("Error updating checkin's attempt count:", error);
        return NextResponse.json({ message: "Error updating attempt count" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
