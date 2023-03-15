-- CreateTable
CREATE TABLE "Company" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "inn" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "CompanyDetails" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "a" TEXT,
    "c" TEXT,
    "e" TEXT,
    "g" TEXT,
    "cnt" TEXT,
    "i" TEXT,
    "k" TEXT,
    "n" TEXT,
    "o" TEXT,
    "p" TEXT,
    "r" TEXT,
    "t" TEXT,
    "pg" TEXT,
    "tot" TEXT,
    "companyInn" TEXT NOT NULL,
    CONSTRAINT "CompanyDetails_companyInn_fkey" FOREIGN KEY ("companyInn") REFERENCES "Company" ("inn") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_inn_key" ON "Company"("inn");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyDetails_companyInn_key" ON "CompanyDetails"("companyInn");
