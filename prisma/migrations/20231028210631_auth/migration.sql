/*
  Warnings:

  - Added the required column `password` to the `CareTaker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `CareTaker` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CareTaker" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "patientId" INTEGER,
    "sessionId" TEXT NOT NULL
);
INSERT INTO "new_CareTaker" ("id", "patientId", "sessionId") SELECT "id", "patientId", "sessionId" FROM "CareTaker";
DROP TABLE "CareTaker";
ALTER TABLE "new_CareTaker" RENAME TO "CareTaker";
CREATE UNIQUE INDEX "CareTaker_username_key" ON "CareTaker"("username");
CREATE UNIQUE INDEX "CareTaker_patientId_key" ON "CareTaker"("patientId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
