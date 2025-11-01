/*
  Warnings:

  - A unique constraint covering the columns `[crp]` on the table `Psychologist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `crp` to the `Psychologist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Psychologist" ADD COLUMN     "crp" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Psychologist_crp_key" ON "Psychologist"("crp");
