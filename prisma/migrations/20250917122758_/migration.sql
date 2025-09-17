-- DropForeignKey
ALTER TABLE `receipt_consumption` DROP FOREIGN KEY `receipt_consumption_material_type_fkey`;

-- AddForeignKey
ALTER TABLE `receipt_consumption` ADD CONSTRAINT `receipt_consumption_material_type_fkey` FOREIGN KEY (`material_type`) REFERENCES `material_type_master`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
