import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { patientId, startTime, endTime, complaints } = await request.json();

        const patient = await prisma.patient.findUnique({
            where: {
                id: patientId,
            },
        });

        if (!patient) {
            return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
        }

        const call = await prisma.call.create({
            data: {
                patientId: patientId,
                startTime: dayjs(startTime).toDate(),
                endTime: dayjs(endTime).toDate(),
            },
        });

        if (complaints && complaints.length > 0) {
            const complaintsData = complaints.map((complaint: string) => {
                return {
                    description: complaint,
                    patientId: patientId,
                    callId: call.id,
                };
            });

            for (let complaintData of complaintsData) {
                await prisma.complaint.create({
                    data: complaintData,
                });
            }
        }

        return NextResponse.json({ call }, { status: 200 });
    } catch (error) {
        console.error('Error creating call and complaints:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
