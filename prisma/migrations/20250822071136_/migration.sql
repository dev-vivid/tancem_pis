/*
  Warnings:

  - Added the required column `value` to the `annual_material_budget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `annual_material_budget` ADD COLUMN `value` DECIMAL(10, 2) NOT NULL;
