/*
  Warnings:

  - You are about to drop the column `banner_image` on the `InvestorProfile` table. All the data in the column will be lost.
  - You are about to drop the column `profile_image` on the `InvestorProfile` table. All the data in the column will be lost.
  - You are about to drop the column `banner_image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profile_image` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InvestorProfile" DROP COLUMN "banner_image",
DROP COLUMN "profile_image",
ADD COLUMN     "banner_image_url" TEXT,
ADD COLUMN     "profile_image_url" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "banner_image",
DROP COLUMN "profile_image",
ADD COLUMN     "banner_image_url" TEXT,
ADD COLUMN     "profile_image_url" TEXT;
