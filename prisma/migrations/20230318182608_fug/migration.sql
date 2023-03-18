/*
  Warnings:

  - You are about to drop the column `short_name` on the `Dadata` table. All the data in the column will be lost.
  - Added the required column `name` to the `Dadata` table without a default value. This is not possible if the table is not empty.

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
INSERT INTO "new_Dadata" ("inn", "liquidation_date", "ogrn", "registration_date", "status") SELECT "inn", "liquidation_date", "ogrn", "registration_date", "status" FROM "Dadata";
DROP TABLE "Dadata";
ALTER TABLE "new_Dadata" RENAME TO "Dadata";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
