/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `CareTaker` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CareTaker_email_key" ON "CareTaker"("email");
