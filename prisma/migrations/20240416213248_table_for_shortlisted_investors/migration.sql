-- CreateTable
CREATE TABLE "ShortlistedInvestor" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "investor_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShortlistedInvestor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShortlistedInvestor_user_id_investor_id_key" ON "ShortlistedInvestor"("user_id", "investor_id");

-- AddForeignKey
ALTER TABLE "ShortlistedInvestor" ADD CONSTRAINT "ShortlistedInvestor_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShortlistedInvestor" ADD CONSTRAINT "ShortlistedInvestor_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "Investor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
