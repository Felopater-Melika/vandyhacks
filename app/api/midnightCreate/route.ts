import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const req_body = await request.json();
        const currentDate = dayjs().startOf('day'); // Set the time to the beginning of the day

        const patients = await prisma.patient.findMany();
        console.log("Patients:", patients)
        const checkins = [];

        for (let patient of patients) {
            const existingCheckin = await prisma.checkin.findFirst({
                where: {
                    patientId: patient.id,
                    date: currentDate.toDate(), // Convert dayjs to Date object
                },
            });

            console.log("Existing Checkin:", existingCheckin)
            if (req_body.type == "clear") {
                await prisma.checkin.delete({
                    where: {id: patient.id}
                });
            } else {
                const {hour, minute} = req_body
                const nextAttemptTime = currentDate.set('hour', hour).set('minute', minute).toDate(); // Set to 12 noon
                if (!existingCheckin) {
                    const newCheckin = await prisma.checkin.create({
                        data: {
                            patientId: patient.id,
                            date: currentDate.toDate(), // Convert dayjs to Date object
                            attemptCount: 0,
                            nextAttemptTime,
                        },
                    });

                    checkins.push(newCheckin);
                } else {
                    await prisma.checkin.update({
                        where: { id: existingCheckin.id },
                        data: {
                            patientId: patient.id,
                            date: currentDate.toDate(), // Convert dayjs to Date object
                            attemptCount: 0,
                            nextAttemptTime,
                        }
                      });
                    checkins.push(existingCheckin);
                }
            }
        }

        return NextResponse.json({ message: "successful", checkins }, { status: 200 });
    } catch (error: any) {
        console.error("Error creating check-ins:", error);
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
