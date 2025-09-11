/*
  Warnings:

  - Added the required column `transaction_type_id` to the `adjustment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `adjustment` ADD COLUMN `transaction_type_id` VARCHAR(36) NOT NULL,
    MODIFY `type` ENUM('Receipts', 'Despatch', 'consume') NULL;

-- AlterTable
ALTER TABLE `budget` MODIFY `material_id` VARCHAR(36) NULL;

-- AddForeignKey
ALTER TABLE `adjustment` ADD CONSTRAINT `adjustment_transaction_type_id_fkey` FOREIGN KEY (`transaction_type_id`) REFERENCES `transaction_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `receipt_consumption` ADD CONSTRAINT `receipt_consumption_material_type_fkey` FOREIGN KEY (`material_type`) REFERENCES `material_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
