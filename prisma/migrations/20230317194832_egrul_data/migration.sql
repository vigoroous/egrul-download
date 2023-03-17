/*
  Warnings:

  - You are about to drop the `CompanyDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `status` on the `Company` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "CompanyDetails_companyInn_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CompanyDetails";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "EgrulData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "address" TEXT,
    "short_name" TEXT,
    "full_name" TEXT,
    "manager" TEXT,
    "company_type" TEXT,
    "registration_date" TEXT,
    "liquidation_date" TEXT,
    "count" TEXT,
    "inn" TEXT,
    "ogrn" TEXT,
    "kpp" TEXT,
    "token" TEXT,
    "page" TEXT,
    "total" TEXT,
    "isDownloaded" BOOLEAN NOT NULL DEFAULT false,
    "companyInn" TEXT NOT NULL,
    CONSTRAINT "EgrulData_companyInn_fkey" FOREIGN KEY ("companyInn") REFERENCES "Company" ("inn") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DadataData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "suggestion" TEXT NOT NULL,
    "companyInn" TEXT NOT NULL,
    CONSTRAINT "DadataData_companyInn_fkey" FOREIGN KEY ("companyInn") REFERENCES "Company" ("inn") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Company" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "inn" TEXT NOT NULL,
    "isRejected" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Company" ("id", "inn") SELECT "id", "inn" FROM "Company";
DROP TABLE "Company";
ALTER TABLE "new_Company" RENAME TO "Company";
CREATE UNIQUE INDEX "Company_inn_key" ON "Company"("inn");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
