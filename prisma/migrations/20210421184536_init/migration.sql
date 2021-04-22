-- CreateTable
CREATE TABLE "Security" (
    "id" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Security.ticker_unique" ON "Security"("ticker");
