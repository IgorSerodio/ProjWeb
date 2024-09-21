-- CreateEnum
CREATE TYPE "TipoDeMedida" AS ENUM ('UNIDADES', 'GRAMAS', 'MILILITROS');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "hashSenha" TEXT NOT NULL,
    "apelido" TEXT,
    "adm" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Receita" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "idDoUsuario" INTEGER NOT NULL,

    CONSTRAINT "Receita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingrediente" (
    "nome" TEXT NOT NULL,
    "tipoDeMedida" "TipoDeMedida" NOT NULL,

    CONSTRAINT "Ingrediente_pkey" PRIMARY KEY ("nome")
);

-- CreateTable
CREATE TABLE "IngredienteReceita" (
    "idDaReceita" INTEGER NOT NULL,
    "nomeDoIngrediente" TEXT NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "IngredienteReceita_pkey" PRIMARY KEY ("idDaReceita","nomeDoIngrediente")
);

-- CreateTable
CREATE TABLE "Avaliacao" (
    "idDoUsuario" INTEGER NOT NULL,
    "idDaReceita" INTEGER NOT NULL,
    "nota" DOUBLE PRECISION NOT NULL,
    "comentario" TEXT,

    CONSTRAINT "Avaliacao_pkey" PRIMARY KEY ("idDoUsuario","idDaReceita")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Receita" ADD CONSTRAINT "Receita_idDoUsuario_fkey" FOREIGN KEY ("idDoUsuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredienteReceita" ADD CONSTRAINT "IngredienteReceita_idDaReceita_fkey" FOREIGN KEY ("idDaReceita") REFERENCES "Receita"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredienteReceita" ADD CONSTRAINT "IngredienteReceita_nomeDoIngrediente_fkey" FOREIGN KEY ("nomeDoIngrediente") REFERENCES "Ingrediente"("nome") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_idDoUsuario_fkey" FOREIGN KEY ("idDoUsuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_idDaReceita_fkey" FOREIGN KEY ("idDaReceita") REFERENCES "Receita"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
