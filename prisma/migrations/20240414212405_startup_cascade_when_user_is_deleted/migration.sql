-- DropForeignKey
ALTER TABLE "Startup" DROP CONSTRAINT "Startup_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Startup" ADD CONSTRAINT "Startup_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
