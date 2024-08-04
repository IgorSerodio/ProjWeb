/*
  Warnings:

  - You are about to alter the column `quantidade` on the `IngredienteReceita` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "IngredienteReceita" ALTER COLUMN "quantidade" SET DATA TYPE DOUBLE PRECISION;
