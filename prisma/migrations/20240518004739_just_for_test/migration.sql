-- DropForeignKey
ALTER TABLE "Investor" DROP CONSTRAINT "Investor_user_id_fkey";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "Investor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
