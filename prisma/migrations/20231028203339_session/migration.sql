/*
  Warnings:

  - You are about to drop the column `sessionId` on the `Patient` table. All the data in the column will be lost.
  - Added the required column `sessionId` to the `CareTaker` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CareTaker" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patientId" INTEGER,
    "sessionId" TEXT NOT NULL
);
INSERT INTO "new_CareTaker" ("id", "patientId") SELECT "id", "patientId" FROM "CareTaker";
DROP TABLE "CareTaker";
ALTER TABLE "new_CareTaker" RENAME TO "CareTaker";
CREATE UNIQUE INDEX "CareTaker_patientId_key" ON "CareTaker"("patientId");
CREATE TABLE "new_Patient" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "careTakerId" INTEGER,
    CONSTRAINT "Patient_careTakerId_fkey" FOREIGN KEY ("careTakerId") REFERENCES "CareTaker" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Patient" ("careTakerId", "id", "name", "phone") SELECT "careTakerId", "id", "name", "phone" FROM "Patient";
DROP TABLE "Patient";
ALTER TABLE "new_Patient" RENAME TO "Patient";
CREATE UNIQUE INDEX "Patient_careTakerId_key" ON "Patient"("careTakerId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
