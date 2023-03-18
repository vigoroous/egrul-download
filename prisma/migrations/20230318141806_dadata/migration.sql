/*
  Warnings:

  - The primary key for the `Dadata` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Dadata` table. All the data in the column will be lost.
  - Added the required column `ogrn` to the `Dadata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registration_date` to the `Dadata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `short_name` to the `Dadata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Dadata` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Dadata" (
    "short_name" TEXT NOT NULL,
    "inn" TEXT NOT NULL,
    "ogrn" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "registration_date" DATETIME NOT NULL,
    "liquidation_date" DATETIME,
    "suggestion" TEXT NOT NULL,

    PRIMARY KEY ("inn", "ogrn"),
    CONSTRAINT "Dadata_inn_fkey" FOREIGN KEY ("inn") REFERENCES "Company" ("inn") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Dadata" ("inn", "suggestion") SELECT "inn", "suggestion" FROM "Dadata";
DROP TABLE "Dadata";
ALTER TABLE "new_Dadata" RENAME TO "Dadata";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
