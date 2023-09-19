-- CreateTable
CREATE TABLE "rss" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "rss_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rss_detail" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "quote" TEXT,
    "rss_id" INTEGER,

    CONSTRAINT "rss_detail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "rss_detail" ADD CONSTRAINT "rss_detail_rss_id_fkey" FOREIGN KEY ("rss_id") REFERENCES "rss"("id") ON DELETE SET NULL ON UPDATE CASCADE;
