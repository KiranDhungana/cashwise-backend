/*
  Warnings:

  - Added the required column `frequencyLabel` to the `UserGoal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserGoal" DROP COLUMN "frequencyLabel",
ADD COLUMN     "frequencyLabel" INTEGER NOT NULL;
