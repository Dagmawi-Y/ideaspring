/*
  Warnings:

  - The primary key for the `Startup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `description` on the `Startup` table. All the data in the column will be lost.
  - You are about to drop the column `founders` on the `Startup` table. All the data in the column will be lost.
  - You are about to drop the column `industry` on the `Startup` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Startup` table. All the data in the column will be lost.
  - You are about to drop the column `owner_id` on the `Startup` table. All the data in the column will be lost.
  - You are about to drop the column `pitch_decks` on the `Startup` table. All the data in the column will be lost.
  - You are about to drop the column `startups` on the `Startup` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `account_type` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profile_info` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `users` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `ActivityLogs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DiscussionThreads` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Engager` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Faq` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Feature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Investment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Investor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlatformAdmin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Resource` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StartupCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StartupMetric` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StartupTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `pitch_title` to the `Startup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Startup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ActivityLogs" DROP CONSTRAINT "ActivityLogs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "DiscussionThreads" DROP CONSTRAINT "DiscussionThreads_startup_id_fkey";

-- DropForeignKey
ALTER TABLE "Investment" DROP CONSTRAINT "Investment_investor_id_fkey";

-- DropForeignKey
ALTER TABLE "Investment" DROP CONSTRAINT "Investment_startup_id_fkey";

-- DropForeignKey
ALTER TABLE "Investor" DROP CONSTRAINT "Investor_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_receiver_id_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_user_id_fkey";

-- DropForeignKey
ALTER TABLE "PlatformAdmin" DROP CONSTRAINT "PlatformAdmin_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Startup" DROP CONSTRAINT "Startup_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "StartupCategory" DROP CONSTRAINT "StartupCategory_category_id_fkey";

-- DropForeignKey
ALTER TABLE "StartupCategory" DROP CONSTRAINT "StartupCategory_startup_id_fkey";

-- DropForeignKey
ALTER TABLE "StartupMetric" DROP CONSTRAINT "StartupMetric_startup_id_fkey";

-- DropForeignKey
ALTER TABLE "StartupTag" DROP CONSTRAINT "StartupTag_startup_id_fkey";

-- DropForeignKey
ALTER TABLE "StartupTag" DROP CONSTRAINT "StartupTag_tag_id_fkey";

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "Startup" DROP CONSTRAINT "Startup_pkey",
DROP COLUMN "description",
DROP COLUMN "founders",
DROP COLUMN "industry",
DROP COLUMN "name",
DROP COLUMN "owner_id",
DROP COLUMN "pitch_decks",
DROP COLUMN "startups",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "ideal_investor_role_id" INTEGER,
ADD COLUMN     "impression_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "industry_1_id" INTEGER,
ADD COLUMN     "industry_2_id" INTEGER,
ADD COLUMN     "minimum_investment" DOUBLE PRECISION,
ADD COLUMN     "mobile_number" TEXT,
ADD COLUMN     "pitch_title" TEXT NOT NULL,
ADD COLUMN     "previous_round_amount" DOUBLE PRECISION,
ADD COLUMN     "raised_amount" DOUBLE PRECISION,
ADD COLUMN     "stage_id" INTEGER,
ADD COLUMN     "tax_relief_id" INTEGER,
ADD COLUMN     "total_raising_amount" DOUBLE PRECISION,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD COLUMN     "website" TEXT,
ALTER COLUMN "location" SET DATA TYPE TEXT,
ADD CONSTRAINT "Startup_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "account_type",
DROP COLUMN "createdAt",
DROP COLUMN "profile_info",
DROP COLUMN "updatedAt",
DROP COLUMN "username",
DROP COLUMN "users",
ADD COLUMN     "banner_image" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "mobile_number" TEXT,
ADD COLUMN     "phone_number" TEXT,
ADD COLUMN     "profile_image" TEXT,
ADD COLUMN     "role" TEXT NOT NULL,
ADD COLUMN     "town_city" TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT,
ALTER COLUMN "password" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "ActivityLogs";

-- DropTable
DROP TABLE "Categories";

-- DropTable
DROP TABLE "DiscussionThreads";

-- DropTable
DROP TABLE "Engager";

-- DropTable
DROP TABLE "Faq";

-- DropTable
DROP TABLE "Feature";

-- DropTable
DROP TABLE "Investment";

-- DropTable
DROP TABLE "Investor";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "Notification";

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "PlatformAdmin";

-- DropTable
DROP TABLE "Resource";

-- DropTable
DROP TABLE "StartupCategory";

-- DropTable
DROP TABLE "StartupMetric";

-- DropTable
DROP TABLE "StartupTag";

-- DropTable
DROP TABLE "Tag";

-- CreateTable
CREATE TABLE "PitchDeal" (
    "startup_id" INTEGER NOT NULL,
    "short_summary" TEXT,
    "business_description" TEXT,
    "market_description" TEXT,
    "progress_proof" TEXT,
    "objectives_future" TEXT,
    "highlights" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PitchDeal_pkey" PRIMARY KEY ("startup_id")
);

-- CreateTable
CREATE TABLE "DealDetails" (
    "startup_id" INTEGER NOT NULL,
    "deal_type" TEXT,
    "deal_description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DealDetails_pkey" PRIMARY KEY ("startup_id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "startup_id" INTEGER NOT NULL,
    "team_member_name" TEXT,
    "linkedin_profile" TEXT,
    "position" TEXT,
    "bio" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImagesVideos" (
    "id" SERIAL NOT NULL,
    "startup_id" INTEGER NOT NULL,
    "image_path" TEXT,
    "video_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImagesVideos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "startup_id" INTEGER NOT NULL,
    "document_type" TEXT,
    "document_path" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Industry" (
    "id" SERIAL NOT NULL,
    "industry_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Industry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stage" (
    "id" SERIAL NOT NULL,
    "stage_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Stage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestorRole" (
    "id" SERIAL NOT NULL,
    "role_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvestorRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxRelief" (
    "id" SERIAL NOT NULL,
    "relief_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaxRelief_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Startup" ADD CONSTRAINT "Startup_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Startup" ADD CONSTRAINT "Startup_industry_1_id_fkey" FOREIGN KEY ("industry_1_id") REFERENCES "Industry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Startup" ADD CONSTRAINT "Startup_industry_2_id_fkey" FOREIGN KEY ("industry_2_id") REFERENCES "Industry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Startup" ADD CONSTRAINT "Startup_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "Stage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Startup" ADD CONSTRAINT "Startup_ideal_investor_role_id_fkey" FOREIGN KEY ("ideal_investor_role_id") REFERENCES "InvestorRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Startup" ADD CONSTRAINT "Startup_tax_relief_id_fkey" FOREIGN KEY ("tax_relief_id") REFERENCES "TaxRelief"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PitchDeal" ADD CONSTRAINT "PitchDeal_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "Startup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealDetails" ADD CONSTRAINT "DealDetails_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "Startup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "Startup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImagesVideos" ADD CONSTRAINT "ImagesVideos_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "Startup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "Startup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
