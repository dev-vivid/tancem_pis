-- CreateTable
CREATE TABLE `analysis` (
    `id` VARCHAR(191) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `analysis_code` VARCHAR(10) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `description` VARCHAR(200) NULL,
    `wf_request_id` VARCHAR(36) NULL,
    `material_id` VARCHAR(36) NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(191) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `analysis_id_key`(`id`),
    UNIQUE INDEX `analysis_code_key`(`code`),
    INDEX `analysis_type_idx`(`type`),
    INDEX `analysis_material_id_idx`(`material_id`),
    INDEX `analysis_material_id_type_idx`(`material_id`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
