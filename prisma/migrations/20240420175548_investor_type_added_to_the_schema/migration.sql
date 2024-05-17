-- AlterTable
ALTER TABLE "Investor" ADD COLUMN     "investorTypeId" INTEGER;

-- CreateTable
CREATE TABLE "InvestorType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "InvestorType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InvestorType_name_key" ON "InvestorType"("name");

-- AddForeignKey
ALTER TABLE "Investor" ADD CONSTRAINT "Investor_investorTypeId_fkey" FOREIGN KEY ("investorTypeId") REFERENCES "InvestorType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
