/*
  Warnings:

  - You are about to drop the column `document_path` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `image_path` on the `ImagesVideos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "document_path",
ADD COLUMN     "document_url" TEXT;

-- AlterTable
ALTER TABLE "ImagesVideos" DROP COLUMN "image_path",
ADD COLUMN     "image_url" TEXT;

-- CreateTable
CREATE TABLE "ShortlistedStartup" (
    "id" SERIAL NOT NULL,
    "investor_id" INTEGER NOT NULL,
    "startup_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShortlistedStartup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShortlistedStartup_investor_id_startup_id_key" ON "ShortlistedStartup"("investor_id", "startup_id");

-- AddForeignKey
ALTER TABLE "ShortlistedStartup" ADD CONSTRAINT "ShortlistedStartup_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "Investor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShortlistedStartup" ADD CONSTRAINT "ShortlistedStartup_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "Startup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
