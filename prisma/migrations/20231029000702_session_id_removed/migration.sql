/*
  Warnings:

  - You are about to drop the column `password` on the `CareTaker` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `CareTaker` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `CareTaker` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CareTaker" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patientId" INTEGER
);
INSERT INTO "new_CareTaker" ("id", "patientId") SELECT "id", "patientId" FROM "CareTaker";
DROP TABLE "CareTaker";
ALTER TABLE "new_CareTaker" RENAME TO "CareTaker";
CREATE UNIQUE INDEX "CareTaker_patientId_key" ON "CareTaker"("patientId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
