import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const MAX_ATTEMPTS = 3; // Define the maximum number of attempts

        const { patientID } = await request.json(); // Get the patientID from the request body

        // Find the patient by patientID
        const patient = await prisma.Patient.findUnique({
            where: {
                id: patientID,
            },
        });

        if (!patient) {
            return NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }

        // Check if the patient has already reached the maximum attempts
        if (patient.attemptCount >= MAX_ATTEMPTS) {
            // Log a failed check-in
            const failedCheckin = await prisma.FailCheckin.create({

                //need to get rest of the data*******

                data: {

                    patientId: patientID,
                    date: new Date(),
                    reachedCareTaker: null, // Set reachedCareTaker to null

                },
            });

            return NextResponse.json({
                callCaretaker: true, // Indicate to call the caretaker
                caretakerNumber: patient.careTaker?.phone || null, // Provide the caretaker's number
                
            }, { status: 200 });
        }

        // Increment the attempt count for the patient
        await prisma.Patient.update({
            where: {
                id: patientID,
            },
            data: {
                attemptCount: patient.attemptCount + 1,
            },
        });

        return NextResponse.json({
            callCaretaker: false, // Indicate not to call the caretaker
            caretakerNumber: null, // No need to provide the caretaker's number
        }, { status: 200 });

    } catch (error) {
        console.error("Error updating patient's attempt count:", error);
        return NextResponse.json({ message: "Error updating attempt count" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
