/*
  Warnings:

  - The primary key for the `Ingrediente` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Ingrediente` table. All the data in the column will be lost.
  - The primary key for the `IngredienteReceita` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idDoIngrediente` on the `IngredienteReceita` table. All the data in the column will be lost.
  - Added the required column `nomeDoIngrediente` to the `IngredienteReceita` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "IngredienteReceita" DROP CONSTRAINT "IngredienteReceita_idDoIngrediente_fkey";

-- DropIndex
DROP INDEX "Ingrediente_nome_key";

-- AlterTable
ALTER TABLE "Ingrediente" DROP CONSTRAINT "Ingrediente_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Ingrediente_pkey" PRIMARY KEY ("nome");

-- AlterTable
ALTER TABLE "IngredienteReceita" DROP CONSTRAINT "IngredienteReceita_pkey",
DROP COLUMN "idDoIngrediente",
ADD COLUMN     "nomeDoIngrediente" TEXT NOT NULL,
ADD CONSTRAINT "IngredienteReceita_pkey" PRIMARY KEY ("idDaReceita", "nomeDoIngrediente");

-- AddForeignKey
ALTER TABLE "IngredienteReceita" ADD CONSTRAINT "IngredienteReceita_nomeDoIngrediente_fkey" FOREIGN KEY ("nomeDoIngrediente") REFERENCES "Ingrediente"("nome") ON DELETE RESTRICT ON UPDATE CASCADE;
