/*
  Warnings:

  - You are about to drop the column `export_quantity` on the `despatch` table. All the data in the column will be lost.
  - You are about to drop the column `inland_quantity` on the `despatch` table. All the data in the column will be lost.
  - You are about to drop the column `material_id` on the `despatch` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `despatch` table. All the data in the column will be lost.
  - You are about to drop the column `road_quantity` on the `despatch` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `despatch_material_id_idx` ON `despatch`;

-- AlterTable
ALTER TABLE `despatch` DROP COLUMN `export_quantity`,
    DROP COLUMN `inland_quantity`,
    DROP COLUMN `material_id`,
    DROP COLUMN `quantity`,
    DROP COLUMN `road_quantity`;

-- CreateTable
CREATE TABLE `despatch_details` (
    `id` VARCHAR(36) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `material_id` VARCHAR(36) NOT NULL,
    `despatch_id` VARCHAR(36) NOT NULL,
    `quantity` DECIMAL(10, 2) NOT NULL,
    `road_quantity` DECIMAL(10, 2) NOT NULL,
    `export_quantity` DECIMAL(10, 2) NOT NULL,
    `inland_quantity` DECIMAL(10, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `updated_by_id` VARCHAR(36) NULL,

    UNIQUE INDEX `despatch_details_id_key`(`id`),
    UNIQUE INDEX `despatch_details_code_key`(`code`),
    INDEX `despatch_details_code_idx`(`code`),
    INDEX `despatch_details_material_id_idx`(`material_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `despatch_details` ADD CONSTRAINT `despatch_details_despatch_id_fkey` FOREIGN KEY (`despatch_id`) REFERENCES `despatch`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
