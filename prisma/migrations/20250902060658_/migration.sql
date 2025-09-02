/*
  Warnings:

  - You are about to drop the column `analysis_id` on the `lab_analysis` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `lab_analysis` DROP FOREIGN KEY `lab_analysis_analysis_id_fkey`;

-- AlterTable
ALTER TABLE `lab_analysis` DROP COLUMN `analysis_id`;

-- CreateTable
CREATE TABLE `lab_analysis_types` (
    `id` VARCHAR(36) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `analysis_id` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `updated_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `lab_analysis_types_id_key`(`id`),
    UNIQUE INDEX `lab_analysis_types_code_key`(`code`),
    INDEX `lab_analysis_types_code_idx`(`code`),
    INDEX `lab_analysis_types_analysis_id_idx`(`analysis_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `lab_analysis_types` ADD CONSTRAINT `lab_analysis_types_analysis_id_fkey` FOREIGN KEY (`analysis_id`) REFERENCES `analysis`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
