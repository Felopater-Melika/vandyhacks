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
                patient: patient,
                startTime: parseISO(startTime), // Parse ISO date strings to DateTime
                endTime: parseISO(endTime),
            },
        });

        // Create Complaints associated with the Call
        if (complaints && complaints.length > 0) {
            const complaintsData = complaints.map((complaint: string) => {
                return {
                    description: complaint,
                    patientId: patientId,
                    callId: call.id,
                };
            });

            const createdComplaints = await prisma.Complaint.createMany({
                data: complaintsData,
            });

            call.complaints = createdComplaints;
        }

        return NextResponse.json({ call }, { status: 200 });
    } catch (error) {
        console.error('Error creating call and complaints:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
