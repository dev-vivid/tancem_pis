-- AlterTable
ALTER TABLE `budget` ADD COLUMN `production_category_id` VARCHAR(36) NULL;

-- AlterTable
ALTER TABLE `production_category` ADD COLUMN `product_category_code` VARCHAR(50) NULL;

-- AddForeignKey
ALTER TABLE `budget` ADD CONSTRAINT `budget_production_category_id_fkey` FOREIGN KEY (`production_category_id`) REFERENCES `production_category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
