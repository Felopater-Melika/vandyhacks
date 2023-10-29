/*
  Warnings:

  - Added the required column `email` to the `CareTaker` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CareTaker" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patientId" INTEGER,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL
);
INSERT INTO "new_CareTaker" ("id", "name", "patientId", "phone") SELECT "id", "name", "patientId", "phone" FROM "CareTaker";
DROP TABLE "CareTaker";
ALTER TABLE "new_CareTaker" RENAME TO "CareTaker";
CREATE UNIQUE INDEX "CareTaker_patientId_key" ON "CareTaker"("patientId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
