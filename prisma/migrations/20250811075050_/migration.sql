-- CreateTable
CREATE TABLE `transaction_type` (
    `id` VARCHAR(191) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `updated_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `transaction_type_id_key`(`id`),
    UNIQUE INDEX `transaction_type_code_key`(`code`),
    INDEX `transaction_type_code_idx`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `production_category` (
    `id` VARCHAR(191) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `product_category_code` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `updated_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `production_category_id_key`(`id`),
    UNIQUE INDEX `production_category_code_key`(`code`),
    INDEX `production_category_code_idx`(`code`),
    INDEX `production_category_product_category_code_idx`(`product_category_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `material_type` (
    `id` VARCHAR(191) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `material_id` VARCHAR(50) NOT NULL,
    `material_type_id` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `updated_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `material_type_id_key`(`id`),
    UNIQUE INDEX `material_type_code_key`(`code`),
    INDEX `material_type_code_idx`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `material_type_master` (
    `id` VARCHAR(191) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `material_type_code` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `updated_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `material_type_master_id_key`(`id`),
    UNIQUE INDEX `material_type_master_code_key`(`code`),
    INDEX `material_type_master_code_idx`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `material_analysis` (
    `id` VARCHAR(191) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `material_id` VARCHAR(50) NOT NULL,
    `analysis_id` VARCHAR(50) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `updated_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `material_analysis_id_key`(`id`),
    UNIQUE INDEX `material_analysis_code_key`(`code`),
    INDEX `material_analysis_code_idx`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `equipment_output_material_mapping` (
    `id` VARCHAR(191) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `equipment_id` VARCHAR(36) NOT NULL,
    `material_id` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `updated_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `equipment_output_material_mapping_id_key`(`id`),
    UNIQUE INDEX `equipment_output_material_mapping_code_key`(`code`),
    INDEX `equipment_output_material_mapping_code_idx`(`code`),
    INDEX `equipment_output_material_mapping_equipment_id_idx`(`equipment_id`),
    INDEX `equipment_output_material_mapping_material_id_idx`(`material_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_material_budget` (
    `id` VARCHAR(191) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `financial_year` VARCHAR(9) NOT NULL,
    `month` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `material_id` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `updated_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `annual_material_budget_id_key`(`id`),
    UNIQUE INDEX `annual_material_budget_code_key`(`code`),
    INDEX `annual_material_budget_financial_year_idx`(`financial_year`),
    INDEX `annual_material_budget_material_id_idx`(`material_id`),
    INDEX `annual_material_budget_code_idx`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `problem_code_idx` ON `problem`(`code`);

-- AddForeignKey
ALTER TABLE `material_type` ADD CONSTRAINT `material_type_material_type_id_fkey` FOREIGN KEY (`material_type_id`) REFERENCES `material_type_master`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
