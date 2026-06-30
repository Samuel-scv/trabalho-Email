/*
  Warnings:

  - Added the required column `senha` to the `Clientes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `clientes` ADD COLUMN `codigoRecuperacao` VARCHAR(4) NULL,
    ADD COLUMN `senha` VARCHAR(191) NOT NULL,
    ADD COLUMN `tipo` ENUM('CLIENTE', 'ADMIN') NOT NULL DEFAULT 'CLIENTE';

-- AlterTable
ALTER TABLE `logs` MODIFY `clienteId` INTEGER NULL;
