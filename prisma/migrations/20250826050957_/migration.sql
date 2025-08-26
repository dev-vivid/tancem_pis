/*
  Warnings:

  - You are about to drop the column `product_category_code` on the `production_category` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `production_category_product_category_code_idx` ON `production_category`;

-- AlterTable
ALTER TABLE `production_category` DROP COLUMN `product_category_code`;
