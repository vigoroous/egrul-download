/*
  Warnings:

  - You are about to drop the column `companyInn` on the `Egrul` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Egrul" (
    "address" TEXT,
    "short_name" TEXT,
    "full_name" TEXT,
    "manager" TEXT,
    "company_type" TEXT,
    "registration_date" TEXT,
    "liquidation_date" TEXT,
    "count" TEXT,
    "inn" TEXT NOT NULL,
    "ogrn" TEXT NOT NULL,
    "kpp" TEXT,
    "token" TEXT,
    "page" TEXT,
    "total" TEXT,
    "isDownloaded" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("inn", "ogrn"),
    CONSTRAINT "Egrul_inn_fkey" FOREIGN KEY ("inn") REFERENCES "Company" ("inn") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Egrul" ("address", "company_type", "count", "full_name", "inn", "isDownloaded", "kpp", "liquidation_date", "manager", "ogrn", "page", "registration_date", "short_name", "token", "total") SELECT "address", "company_type", "count", "full_name", "inn", "isDownloaded", "kpp", "liquidation_date", "manager", "ogrn", "page", "registration_date", "short_name", "token", "total" FROM "Egrul";
DROP TABLE "Egrul";
ALTER TABLE "new_Egrul" RENAME TO "Egrul";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
