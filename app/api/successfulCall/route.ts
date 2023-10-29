import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { parseISO } from 'date-fns'; // You can use 'date-fns' for parsing dates

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { patientId, startTime, endTime, complaints } = await request.json();

        // Find the patient by patientId
        const patient = await prisma.Patient.findUnique({
            where: {
                id: patientId,
            },
        });

        if (!patient) {
            return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
        }

        // Create a new Call and associate it with the patient
        const call = await prisma.Call.create({
            data: {
                patientId: patientId,
                startTime: parseISO(startTime), // Parse ISO date strings to DateTime
                endTime: parseISO(endTime),
            },
        });

        // Create Messages associated with the Call
        if (complaints && complaints.length > 0) {
            const messages = await Promise.all(
                complaints.map((complaint:any) => {
                    return prisma.Message.create({
                        data: {
                            speaker: 'Patient', // Assuming the speaker is the patient
                            message: complaint,
                            callId: call.id,
                        },
                    });
                })
            );
            call.messages = messages;
        }

        return NextResponse.json({ call }, { status: 200 });
    } catch (error) {
        console.error('Error creating call and messages:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
