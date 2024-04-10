/*
  Warnings:

  - A unique constraint covering the columns `[investor_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `role` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "investor_id" INTEGER,
ALTER COLUMN "role" SET NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'user';

-- CreateTable
CREATE TABLE "InvestorProfile" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profile_image" TEXT,
    "banner_image" TEXT,
    "town_city" TEXT,
    "country" TEXT,
    "phone_number" TEXT,
    "mobile_number" TEXT,
    "linkedin_profile" TEXT,
    "twitter_profile" TEXT,
    "facebook_profile" TEXT,
    "website" TEXT,
    "skype" TEXT,
    "about_me" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "investor_id" INTEGER NOT NULL,

    CONSTRAINT "InvestorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestorCompanyProfile" (
    "id" SERIAL NOT NULL,
    "company" TEXT,
    "position" TEXT,
    "company_description" TEXT,
    "company_website" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "investor_id" INTEGER NOT NULL,

    CONSTRAINT "InvestorCompanyProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestorInterests" (
    "id" SERIAL NOT NULL,
    "investment_criteria" TEXT,
    "areas_of_expertise" TEXT,
    "value_addition" TEXT,
    "number_of_investments" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "investor_id" INTEGER NOT NULL,

    CONSTRAINT "InvestorInterests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investor" (
    "id" SERIAL NOT NULL,
    "investor_type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER,

    CONSTRAINT "Investor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestedLocation" (
    "id" SERIAL NOT NULL,
    "location_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "investor_id" INTEGER NOT NULL,

    CONSTRAINT "InvestedLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestedStage" (
    "id" SERIAL NOT NULL,
    "stage_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "investor_id" INTEGER NOT NULL,

    CONSTRAINT "InvestedStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestedIndustry" (
    "id" SERIAL NOT NULL,
    "industry_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "investor_id" INTEGER NOT NULL,

    CONSTRAINT "InvestedIndustry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestedCountry" (
    "id" SERIAL NOT NULL,
    "country_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "investor_id" INTEGER NOT NULL,

    CONSTRAINT "InvestedCountry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" SERIAL NOT NULL,
    "language_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "investor_id" INTEGER NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Keyword" (
    "id" SERIAL NOT NULL,
    "keyword_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "investor_id" INTEGER NOT NULL,

    CONSTRAINT "Keyword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestorCompany" (
    "id" SERIAL NOT NULL,
    "company_name" TEXT NOT NULL,
    "invested_amount" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "investor_id" INTEGER NOT NULL,
    "industry_id" INTEGER,
    "stage_id" INTEGER,

    CONSTRAINT "InvestorCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "startup_id" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Upvote" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "startup_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Upvote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MLRecommendation" (
    "id" SERIAL NOT NULL,
    "startup_id" INTEGER,
    "investor_id" INTEGER,
    "score" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MLRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InvestorProfile_email_key" ON "InvestorProfile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "InvestorProfile_investor_id_key" ON "InvestorProfile"("investor_id");

-- CreateIndex
CREATE UNIQUE INDEX "InvestorCompanyProfile_investor_id_key" ON "InvestorCompanyProfile"("investor_id");

-- CreateIndex
CREATE UNIQUE INDEX "InvestorInterests_investor_id_key" ON "InvestorInterests"("investor_id");

-- CreateIndex
CREATE UNIQUE INDEX "Investor_user_id_key" ON "Investor"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_investor_id_key" ON "User"("investor_id");

-- AddForeignKey
ALTER TABLE "InvestorProfile" ADD CONSTRAINT "InvestorProfile_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "Investor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestorCompanyProfile" ADD CONSTRAINT "InvestorCompanyProfile_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "Investor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestorInterests" ADD CONSTRAINT "InvestorInterests_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "Investor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investor" ADD CONSTRAINT "Investor_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestedLocation" ADD CONSTRAINT "InvestedLocation_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "Investor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestedStage" ADD CONSTRAINT "InvestedStage_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "Investor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestedIndustry" ADD CONSTRAINT "InvestedIndustry_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "Investor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestedCountry" ADD CONSTRAINT "InvestedCountry_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "Investor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Language" ADD CONSTRAINT "Language_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "Investor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Keyword" ADD CONSTRAINT "Keyword_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "Investor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestorCompany" ADD CONSTRAINT "InvestorCompany_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "Investor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestorCompany" ADD CONSTRAINT "InvestorCompany_industry_id_fkey" FOREIGN KEY ("industry_id") REFERENCES "Industry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestorCompany" ADD CONSTRAINT "InvestorCompany_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "Stage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "Startup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "Startup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MLRecommendation" ADD CONSTRAINT "MLRecommendation_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "Startup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MLRecommendation" ADD CONSTRAINT "MLRecommendation_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "Investor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
