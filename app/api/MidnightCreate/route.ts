import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

export async function POST() {
    try {
        // Get the current date
        const currentDate = dayjs().startOf('day'); // Set the time to the beginning of the day

        // Get all patients
        const patients = await prisma.Patient.findMany();

        // Create a new check-in for each patient for the current day
        const checkins = await Promise.all(
            patients.map(async (patient: any) => {
                const existingCheckin = await prisma.Checkin.findFirst({
                    where: {
                        patientId: patient.id,
                        date: currentDate.toDate(), // Convert dayjs to Date object
                    },
                });

                // If a check-in for today already exists for the patient, skip creating a new one
                if (existingCheckin) {
                    return existingCheckin;
                }

                // Set the nextAttemptTime to 12 noon
                const nextAttemptTime = currentDate.set('hour', 12).toDate(); // Set to 12 noon

                // Create a new check-in for the patient
                return prisma.Checkin.create({
                    data: {
                        patientId: patient.id,
                        date: currentDate.toDate(), // Convert dayjs to Date object
                        attemptCount: 0,
                        nextAttemptTime,
                    },
                });
            })
        );

        return NextResponse.json({ message: "successful" }, { status: 200 });
    } catch (error) {
        console.error("Error creating check-ins:", error);
        return NextResponse.json({ message: "Error creating check-ins" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
