-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "weddingId" TEXT;

-- CreateIndex
CREATE INDEX "Media_weddingId_idx" ON "Media"("weddingId");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE SET NULL ON UPDATE CASCADE;
