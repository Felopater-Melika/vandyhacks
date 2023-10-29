import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const requestBody = await request.json();
        const { startTime, endTime, complaints } = requestBody;
        const patientId = parseInt(requestBody.patientId, 10);

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
            console.log('Processing complaints...');
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
        console.log('Disconnecting Prisma client...');
        await prisma.$disconnect();
        console.log('Prisma client disconnected.');
    }
}
