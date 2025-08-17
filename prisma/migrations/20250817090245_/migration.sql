-- CreateTable
CREATE TABLE `lab_quality` (
    `id` VARCHAR(191) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `transaction_date` DATE NOT NULL,
    `equipment_id` VARCHAR(36) NOT NULL,
    `material_id` VARCHAR(36) NOT NULL,
    `initial_setting_time` VARCHAR(36) NOT NULL,
    `final_setting_time` VARCHAR(36) NOT NULL,
    `blaine` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `updated_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `lab_quality_id_key`(`id`),
    UNIQUE INDEX `lab_quality_code_key`(`code`),
    INDEX `lab_quality_equipment_id_idx`(`equipment_id`),
    INDEX `lab_quality_material_id_idx`(`material_id`),
    INDEX `lab_quality_code_idx`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lab_analysis` (
    `id` VARCHAR(36) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `transaction_date` DATE NOT NULL,
    `material_id` VARCHAR(36) NOT NULL,
    `analysis_id` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `updated_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `lab_analysis_id_key`(`id`),
    UNIQUE INDEX `lab_analysis_code_key`(`code`),
    INDEX `lab_analysis_material_id_idx`(`material_id`),
    INDEX `lab_analysis_code_idx`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `lab_analysis` ADD CONSTRAINT `lab_analysis_analysis_id_fkey` FOREIGN KEY (`analysis_id`) REFERENCES `analysis`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
