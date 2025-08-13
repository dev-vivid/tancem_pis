-- CreateTable
CREATE TABLE `bags` (
    `id` VARCHAR(191) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `transaction_date` DATE NOT NULL,
    `material_id` VARCHAR(36) NOT NULL,
    `opc_bags` INTEGER NOT NULL,
    `ppc_bags` INTEGER NOT NULL,
    `src_bags` INTEGER NOT NULL,
    `burst_opc_bags` INTEGER NOT NULL,
    `burst_ppc_bags` INTEGER NOT NULL,
    `burst_src_bags` INTEGER NOT NULL,
    `export_bags` INTEGER NOT NULL,
    `deport_bags` INTEGER NOT NULL,
    `transfer_to_other_plants` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `updated_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `bags_id_key`(`id`),
    UNIQUE INDEX `bags_code_key`(`code`),
    INDEX `bags_material_id_idx`(`material_id`),
    INDEX `bags_code_idx`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stoppage` (
    `id` VARCHAR(191) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `transaction_date` DATE NOT NULL,
    `department_id` VARCHAR(36) NOT NULL,
    `equipment_id` VARCHAR(36) NOT NULL,
    `equipment_main_id` VARCHAR(36) NOT NULL,
    `equipment_sub_group_id` VARCHAR(36) NOT NULL,
    `equipment_sub_Sub_group_id` VARCHAR(36) NOT NULL,
    `running_hours` VARCHAR(5) NULL,
    `stoppage_hours` VARCHAR(5) NULL,
    `total_hours` VARCHAR(5) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `updated_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `stoppage_id_key`(`id`),
    UNIQUE INDEX `stoppage_code_key`(`code`),
    INDEX `stoppage_equipment_id_idx`(`equipment_id`),
    INDEX `stoppage_department_id_idx`(`department_id`),
    INDEX `stoppage_code_idx`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stoppage_problem` (
    `id` VARCHAR(191) NOT NULL,
    `stoppage_maintenance_id` VARCHAR(36) NOT NULL,
    `problem_id` VARCHAR(36) NOT NULL,
    `problem_hours` VARCHAR(5) NULL,
    `no_of_stoppages` INTEGER NULL,
    `remarks` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `updated_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    INDEX `stoppage_problem_stoppage_maintenance_id_idx`(`stoppage_maintenance_id`),
    INDEX `stoppage_problem_problem_id_idx`(`problem_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `adjustment` (
    `id` VARCHAR(36) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `transaction_type` ENUM('Receipts', 'Despatch', 'consume') NOT NULL,
    `to_source_id` VARCHAR(36) NULL,
    `quantity` DECIMAL(10, 2) NOT NULL,
    `remarks` TEXT NULL,
    `transaction_date` DATE NOT NULL,
    `material_id` VARCHAR(36) NULL,
    `transaction_type_id` VARCHAR(36) NOT NULL,
    `type` ENUM('Receipts', 'Despatch', 'consume') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `updated_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `adjustment_id_key`(`id`),
    UNIQUE INDEX `adjustment_code_key`(`code`),
    INDEX `adjustment_material_id_idx`(`material_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `equipment` (
    `id` VARCHAR(191) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `equipment_id` VARCHAR(36) NOT NULL,
    `equipment_description` VARCHAR(36) NOT NULL,
    `strength` VARCHAR(36) NOT NULL,
    `quality` VARCHAR(36) NOT NULL,
    `power` VARCHAR(36) NOT NULL,
    `power_group` VARCHAR(36) NOT NULL,
    `storage` VARCHAR(36) NOT NULL,
    `order_of_appearance` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `updated_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `equipment_id_key`(`id`),
    UNIQUE INDEX `equipment_code_key`(`code`),
    INDEX `equipment_code_idx`(`code`),
    INDEX `equipment_equipment_id_idx`(`equipment_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sub_equipment` (
    `id` VARCHAR(36) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `sub_equipment_id` VARCHAR(36) NOT NULL,
    `sub_equipment_description` VARCHAR(36) NOT NULL,
    `equipment_sub_group_id` VARCHAR(36) NOT NULL,
    `eq_id` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `updated_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `sub_equipment_id_key`(`id`),
    UNIQUE INDEX `sub_equipment_code_key`(`code`),
    INDEX `sub_equipment_code_idx`(`code`),
    INDEX `sub_equipment_equipment_sub_group_id_idx`(`equipment_sub_group_id`),
    INDEX `sub_equipment_eq_id_idx`(`eq_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `power_transaction` (
    `id` VARCHAR(191) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `transaction_date` DATE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `updated_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `power_transaction_id_key`(`id`),
    UNIQUE INDEX `power_transaction_code_key`(`code`),
    INDEX `power_transaction_code_idx`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `power` (
    `id` VARCHAR(191) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `transaction_id` VARCHAR(36) NOT NULL,
    `equipment_id` VARCHAR(36) NOT NULL,
    `units` DECIMAL(7, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `updated_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `power_id_key`(`id`),
    UNIQUE INDEX `power_code_key`(`code`),
    INDEX `power_transaction_id_idx`(`transaction_id`),
    INDEX `power_equipment_id_idx`(`equipment_id`),
    INDEX `power_code_idx`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `material_analysis` ADD CONSTRAINT `material_analysis_analysis_id_fkey` FOREIGN KEY (`analysis_id`) REFERENCES `analysis`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stoppage_problem` ADD CONSTRAINT `stoppage_problem_stoppage_maintenance_id_fkey` FOREIGN KEY (`stoppage_maintenance_id`) REFERENCES `stoppage`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stoppage_problem` ADD CONSTRAINT `stoppage_problem_problem_id_fkey` FOREIGN KEY (`problem_id`) REFERENCES `problem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sub_equipment` ADD CONSTRAINT `sub_equipment_eq_id_fkey` FOREIGN KEY (`eq_id`) REFERENCES `equipment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `power` ADD CONSTRAINT `power_transaction_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `power_transaction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
