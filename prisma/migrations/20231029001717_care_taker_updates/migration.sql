/*
  Warnings:

  - Added the required column `name` to the `CareTaker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `CareTaker` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CareTaker" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patientId" INTEGER,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL
);
INSERT INTO "new_CareTaker" ("id", "patientId") SELECT "id", "patientId" FROM "CareTaker";
DROP TABLE "CareTaker";
ALTER TABLE "new_CareTaker" RENAME TO "CareTaker";
CREATE UNIQUE INDEX "CareTaker_patientId_key" ON "CareTaker"("patientId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
