/*
  Warnings:

  - A unique constraint covering the columns `[nome]` on the table `Ingrediente` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Ingrediente_nome_key" ON "Ingrediente"("nome");
