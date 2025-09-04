-- CreateTable
CREATE TABLE `analysis` (
    `id` VARCHAR(36) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(50) NOT NULL,
    `description` VARCHAR(200) NULL,
    `wf_request_id` VARCHAR(36) NULL,
    `material_id` VARCHAR(36) NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('active', 'inActive') NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `updated_by_id` VARCHAR(36) NULL,

    UNIQUE INDEX `analysis_id_key`(`id`),
    UNIQUE INDEX `analysis_code_key`(`code`),
    INDEX `analysis_type_idx`(`type`),
    INDEX `analysis_material_id_idx`(`material_id`),
    INDEX `analysis_material_id_type_idx`(`material_id`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `problem` (
    `id` VARCHAR(36) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NULL,
    `description` VARCHAR(200) NULL,
    `department_id` VARCHAR(36) NOT NULL,
    `problem` VARCHAR(36) NOT NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('active', 'inActive') NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_by_id` VARCHAR(36) NULL,
    `created_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `problem_id_key`(`id`),
    UNIQUE INDEX `problem_code_key`(`code`),
    INDEX `problem_department_id_idx`(`department_id`),
    INDEX `problem_code_idx`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `problem_code` (
    `id` VARCHAR(36) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `problem_id` VARCHAR(36) NULL,
    `equipment_id` VARCHAR(36) NULL,
    `department_id` VARCHAR(36) NULL,
    `status` ENUM('active', 'inActive') NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `updated_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `problem_code` INTEGER NOT NULL,

    UNIQUE INDEX `problem_code_id_key`(`id`),
    UNIQUE INDEX `problem_code_code_key`(`code`),
    INDEX `problem_code_code_idx`(`code`),
    INDEX `problem_code_problem_id_idx`(`problem_id`),
    INDEX `problem_code_department_id_idx`(`department_id`),
    INDEX `problem_code_code_problem_id_department_id_idx`(`code`, `problem_id`, `department_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaction_type` (
    `id` VARCHAR(36) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `status` ENUM('active', 'inActive') NOT NULL DEFAULT 'active',
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
    `id` VARCHAR(36) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `status` ENUM('active', 'inActive') NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `updated_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `production_category_id_key`(`id`),
    UNIQUE INDEX `production_category_code_key`(`code`),
    INDEX `production_category_code_idx`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `material_type` (
    `id` VARCHAR(36) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `material_id` VARCHAR(36) NOT NULL,
    `material_type_id` VARCHAR(36) NOT NULL,
    `status` ENUM('active', 'inActive') NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `updated_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `material_type_id_key`(`id`),
    UNIQUE INDEX `material_type_code_key`(`code`),
    INDEX `material_type_code_idx`(`code`),
    INDEX `material_type_material_type_id_fkey`(`material_type_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `material_type_master` (
    `id` VARCHAR(36) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `material_type_code` VARCHAR(191) NOT NULL,
    `status` ENUM('active', 'inActive') NOT NULL DEFAULT 'active',
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
    `id` VARCHAR(36) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `material_id` VARCHAR(50) NOT NULL,
    `analysis_id` VARCHAR(50) NOT NULL,
    `status` ENUM('active', 'inActive') NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `updated_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `material_analysis_id_key`(`id`),
    UNIQUE INDEX `material_analysis_code_key`(`code`),
    INDEX `material_analysis_code_idx`(`code`),
    INDEX `material_analysis_analysis_id_fkey`(`analysis_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `equipment_output_material_mapping` (
    `id` VARCHAR(36) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `equipment_id` VARCHAR(36) NOT NULL,
    `material_id` VARCHAR(36) NOT NULL,
    `status` ENUM('active', 'inActive') NOT NULL DEFAULT 'active',
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
    `id` VARCHAR(36) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `financial_year` VARCHAR(9) NOT NULL,
    `month` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `material_id` VARCHAR(36) NOT NULL,
    `value` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('active', 'inActive') NOT NULL DEFAULT 'active',
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

-- CreateTable
CREATE TABLE `bags` (
    `id` VARCHAR(36) NOT NULL,
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
    `id` VARCHAR(36) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `transaction_date` DATE NOT NULL,
    `department_id` VARCHAR(36) NOT NULL,
    `equipment_main_id` VARCHAR(36) NOT NULL,
    `equipment_sub_group_id` VARCHAR(36) NOT NULL,
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
    INDEX `stoppage_department_id_idx`(`department_id`),
    INDEX `stoppage_code_idx`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stoppage_problem` (
    `id` VARCHAR(36) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
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

    UNIQUE INDEX `stoppage_problem_id_key`(`id`),
    UNIQUE INDEX `stoppage_problem_code_key`(`code`),
    INDEX `stoppage_problem_stoppage_maintenance_id_idx`(`stoppage_maintenance_id`),
    INDEX `stoppage_problem_problem_id_idx`(`problem_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `adjustment` (
    `id` VARCHAR(36) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `to_source_id` VARCHAR(36) NULL,
    `quantity` DECIMAL(10, 2) NOT NULL,
    `remarks` TEXT NULL,
    `transaction_date` DATE NOT NULL,
    `material_id` VARCHAR(36) NULL,
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
    `id` VARCHAR(36) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `equipment_id` VARCHAR(36) NOT NULL,
    `equipment_description` VARCHAR(36) NOT NULL,
    `strength` VARCHAR(36) NOT NULL,
    `quality` VARCHAR(36) NOT NULL,
    `power` VARCHAR(36) NOT NULL,
    `power_group` VARCHAR(36) NOT NULL,
    `storage` VARCHAR(36) NOT NULL,
    `order_of_appearance` VARCHAR(36) NOT NULL,
    `status` ENUM('active', 'inActive') NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `updated_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `analysis` VARCHAR(36) NULL,

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
    `status` ENUM('active', 'inActive') NOT NULL DEFAULT 'active',
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
    `id` VARCHAR(36) NOT NULL,
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
    `id` VARCHAR(36) NOT NULL,
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

-- CreateTable
CREATE TABLE `lab_quality` (
    `id` VARCHAR(36) NOT NULL,
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
    `wf_request_id` VARCHAR(36) NOT NULL,
    `approval_status` ENUM('Active', 'Inprogress', 'Forwarded', 'Approved', 'Rejected') NULL,
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

-- CreateTable
CREATE TABLE `lab_analysis_types` (
    `id` VARCHAR(36) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `analysis_lab_id` VARCHAR(36) NOT NULL,
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
    `lab_file_name` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `updated_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `external_lab_testing_report_id_key`(`id`),
    UNIQUE INDEX `external_lab_testing_report_code_key`(`code`),
    INDEX `external_lab_testing_report_code_idx`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
CREATE TABLE `budget` (
    `id` VARCHAR(36) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `financial_year` VARCHAR(36) NOT NULL,
    `transaction_date` DATE NOT NULL,
    `material_id` VARCHAR(36) NOT NULL,
    `budget_code` VARCHAR(36) NULL,
    `budget_value` DECIMAL(10, 2) NOT NULL,
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
    `status` ENUM('active', 'inActive') NOT NULL DEFAULT 'active',
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `material_mapping_master_id_key`(`id`),
    UNIQUE INDEX `material_mapping_master_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `material` (
    `id` VARCHAR(36) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `material_type` VARCHAR(36) NOT NULL,
    `material_description` VARCHAR(200) NOT NULL,
    `strength` ENUM('Yes', 'No') NOT NULL,
    `analysis` ENUM('Yes', 'No') NOT NULL,
    `quality` ENUM('Yes', 'No') NOT NULL,
    `gl_code` VARCHAR(50) NOT NULL,
    `order_of_appearance` VARCHAR(191) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `status` ENUM('active', 'inActive') NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `updated_by_id` VARCHAR(36) NULL,

    UNIQUE INDEX `material_id_key`(`id`),
    UNIQUE INDEX `material_code_key`(`code`),
    INDEX `material_code_idx`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `problem_code` ADD CONSTRAINT `problem_code_problem_id_fkey` FOREIGN KEY (`problem_id`) REFERENCES `problem`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `material_type` ADD CONSTRAINT `material_type_material_type_id_fkey` FOREIGN KEY (`material_type_id`) REFERENCES `material_type_master`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `material_analysis` ADD CONSTRAINT `material_analysis_analysis_id_fkey` FOREIGN KEY (`analysis_id`) REFERENCES `analysis`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stoppage_problem` ADD CONSTRAINT `stoppage_problem_problem_id_fkey` FOREIGN KEY (`problem_id`) REFERENCES `problem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stoppage_problem` ADD CONSTRAINT `stoppage_problem_stoppage_maintenance_id_fkey` FOREIGN KEY (`stoppage_maintenance_id`) REFERENCES `stoppage`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sub_equipment` ADD CONSTRAINT `sub_equipment_eq_id_fkey` FOREIGN KEY (`eq_id`) REFERENCES `equipment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `power` ADD CONSTRAINT `power_transaction_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `power_transaction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lab_analysis_types` ADD CONSTRAINT `lab_analysis_types_analysis_id_fkey` FOREIGN KEY (`analysis_id`) REFERENCES `analysis`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lab_analysis_types` ADD CONSTRAINT `lab_analysis_types_analysis_lab_id_fkey` FOREIGN KEY (`analysis_lab_id`) REFERENCES `lab_analysis`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `material_mapping_master` ADD CONSTRAINT `material_mapping_master_material_id_fkey` FOREIGN KEY (`material_id`) REFERENCES `material`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
