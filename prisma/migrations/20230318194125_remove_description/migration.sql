/*
  Warnings:

  - You are about to drop the column `status_description` on the `Dadata` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Dadata" (
    "name" TEXT NOT NULL,
    "inn" TEXT NOT NULL,
    "ogrn" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "registration_date" DATETIME NOT NULL,
    "liquidation_date" DATETIME,

    PRIMARY KEY ("inn", "ogrn"),
    CONSTRAINT "Dadata_inn_fkey" FOREIGN KEY ("inn") REFERENCES "Company" ("inn") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Dadata" ("inn", "liquidation_date", "name", "ogrn", "registration_date", "status") SELECT "inn", "liquidation_date", "name", "ogrn", "registration_date", "status" FROM "Dadata";
DROP TABLE "Dadata";
ALTER TABLE "new_Dadata" RENAME TO "Dadata";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
