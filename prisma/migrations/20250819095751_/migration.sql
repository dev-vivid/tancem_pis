-- CreateTable
CREATE TABLE `despatch` (
    `id` VARCHAR(36) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `transaction_date` DATE NOT NULL,
    `material_id` VARCHAR(36) NOT NULL,
    `quantity` DECIMAL(10, 2) NOT NULL,
    `road_quantity` DECIMAL(10, 2) NOT NULL,
    `export_quantity` DECIMAL(10, 2) NOT NULL,
    `inland_quantity` DECIMAL(10, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `updated_by_id` VARCHAR(36) NULL,

    UNIQUE INDEX `despatch_id_key`(`id`),
    UNIQUE INDEX `despatch_code_key`(`code`),
    INDEX `despatch_code_idx`(`code`),
    INDEX `despatch_material_id_idx`(`material_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `receipt_consumption` (
    `id` VARCHAR(36) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `transaction_date` DATE NOT NULL,
    `material_type` VARCHAR(36) NOT NULL,
    `material_id` VARCHAR(36) NOT NULL,
    `transaction_type` VARCHAR(36) NOT NULL,
    `quantity` DECIMAL(10, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `updated_by_id` VARCHAR(36) NULL,

    UNIQUE INDEX `receipt_consumption_id_key`(`id`),
    UNIQUE INDEX `receipt_consumption_code_key`(`code`),
    INDEX `receipt_consumption_material_type_idx`(`material_type`),
    INDEX `receipt_consumption_material_id_idx`(`material_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `production` (
    `id` VARCHAR(36) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `transaction_date` DATE NOT NULL,
    `material_type` VARCHAR(36) NOT NULL,
    `material_id` VARCHAR(36) NOT NULL,
    `running_hours` VARCHAR(5) NULL,
    `quantity` DECIMAL(10, 2) NOT NULL,
    `fuelConsumption` DECIMAL(10, 2) NOT NULL,
    `remarks` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `updated_by_id` VARCHAR(36) NULL,

    UNIQUE INDEX `production_id_key`(`id`),
    UNIQUE INDEX `production_code_key`(`code`),
    INDEX `production_material_type_idx`(`material_type`),
    INDEX `production_material_id_idx`(`material_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `material_mapping_master` (
    `id` VARCHAR(36) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `material_id` VARCHAR(36) NOT NULL,
    `source_id` VARCHAR(36) NOT NULL,
    `created_by_id` VARCHAR(36) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_by_id` VARCHAR(36) NULL,
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `material_mapping_master_id_key`(`id`),
    UNIQUE INDEX `material_mapping_master_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `budget` (
    `id` VARCHAR(36) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `financial_year` VARCHAR(36) NOT NULL,
    `transaction_date` DATE NOT NULL,
    `material_id` VARCHAR(36) NOT NULL,
    `budget_code` VARCHAR(36) NOT NULL,
    `budget_value` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `updated_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `budget_id_key`(`id`),
    UNIQUE INDEX `budget_code_key`(`code`),
    INDEX `budget_code_idx`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
