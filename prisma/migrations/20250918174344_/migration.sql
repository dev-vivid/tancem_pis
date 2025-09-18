-- AlterTable
ALTER TABLE `external_lab_testing_report` ADD COLUMN `quantity_sent` DECIMAL(10, 4) NULL;

-- CreateTable
CREATE TABLE `strength` (
    `id` VARCHAR(36) NOT NULL,
    `transaction_date` DATE NOT NULL,
    `material_id` VARCHAR(36) NOT NULL,
    `sample_date1` DATE NULL,
    `sample_date3` DATE NULL,
    `sample_date7` DATE NULL,
    `sample_date28` DATE NULL,
    `day1` DECIMAL(10, 4) NULL,
    `day3` DECIMAL(10, 4) NULL,
    `day7` DECIMAL(10, 4) NULL,
    `day28` DECIMAL(10, 4) NULL,
    `strength_expansion` DECIMAL(10, 4) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `updated_by_id` VARCHAR(36) NULL,

    UNIQUE INDEX `strength_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
