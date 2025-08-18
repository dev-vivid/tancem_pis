-- CreateTable
CREATE TABLE `external_lab_testing_report` (
    `id` VARCHAR(36) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `transaction_date` DATE NOT NULL,
    `despatch_date` DATE NOT NULL,
    `report_received_date` DATE NOT NULL,
    `testing_type` VARCHAR(36) NOT NULL,
    `material_id` VARCHAR(36) NOT NULL,
    `third_party_vendor_name` VARCHAR(36) NOT NULL,
    `remarks` TEXT NOT NULL,
    `file_name` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `updated_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `external_lab_testing_report_id_key`(`id`),
    UNIQUE INDEX `external_lab_testing_report_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
