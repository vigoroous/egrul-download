/*
  Warnings:

  - The primary key for the `Egrul` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Egrul` table. All the data in the column will be lost.
  - Made the column `inn` on table `Egrul` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ogrn` on table `Egrul` required. This step will fail if there are existing NULL values in that column.

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
    "companyInn" TEXT NOT NULL,

    PRIMARY KEY ("inn", "ogrn"),
    CONSTRAINT "Egrul_companyInn_fkey" FOREIGN KEY ("companyInn") REFERENCES "Company" ("inn") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Egrul" ("address", "companyInn", "company_type", "count", "full_name", "inn", "isDownloaded", "kpp", "liquidation_date", "manager", "ogrn", "page", "registration_date", "short_name", "token", "total") SELECT "address", "companyInn", "company_type", "count", "full_name", "inn", "isDownloaded", "kpp", "liquidation_date", "manager", "ogrn", "page", "registration_date", "short_name", "token", "total" FROM "Egrul";
DROP TABLE "Egrul";
ALTER TABLE "new_Egrul" RENAME TO "Egrul";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
