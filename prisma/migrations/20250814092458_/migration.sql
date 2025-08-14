/*
  Warnings:

  - You are about to drop the column `transaction_type` on the `adjustment` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_type_id` on the `adjustment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `adjustment` DROP COLUMN `transaction_type`,
    DROP COLUMN `transaction_type_id`;

-- AlterTable
ALTER TABLE `equipment` ADD COLUMN `analysis` VARCHAR(36) NULL;
