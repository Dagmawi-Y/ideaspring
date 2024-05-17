-- AlterTable
ALTER TABLE "User" ADD COLUMN     "pwResetToken" TEXT,
ADD COLUMN     "pwResetTokenExpiry" TIMESTAMP(3);
