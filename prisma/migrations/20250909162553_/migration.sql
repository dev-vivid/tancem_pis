-- CreateTable
CREATE TABLE `strength_transactions` (
    `id` VARCHAR(36) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `transaction_date` DATE NOT NULL,
    `material_id` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `updated_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `strength_transactions_id_key`(`id`),
    UNIQUE INDEX `strength_transactions_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `strength_samples` (
    `id` VARCHAR(36) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `transaction_id` VARCHAR(36) NOT NULL,
    `sample_date` DATE NOT NULL,
    `day1_strenght` DECIMAL(10, 2) NOT NULL,
    `day3_strenght` DECIMAL(10, 2) NOT NULL,
    `day7_strenght` DECIMAL(10, 2) NOT NULL,
    `day28_strenght` DECIMAL(10, 2) NOT NULL,
    `expansion` DECIMAL(10, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `updated_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `strength_samples_id_key`(`id`),
    UNIQUE INDEX `strength_samples_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
