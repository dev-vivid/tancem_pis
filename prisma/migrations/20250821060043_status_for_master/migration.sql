-- AlterTable
ALTER TABLE `analysis` ADD COLUMN `status` ENUM('active', 'inActive') NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE `annual_material_budget` ADD COLUMN `status` ENUM('active', 'inActive') NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE `equipment` ADD COLUMN `status` ENUM('active', 'inActive') NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE `equipment_output_material_mapping` ADD COLUMN `status` ENUM('active', 'inActive') NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE `material_analysis` ADD COLUMN `status` ENUM('active', 'inActive') NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE `material_type` ADD COLUMN `status` ENUM('active', 'inActive') NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE `material_type_master` ADD COLUMN `status` ENUM('active', 'inActive') NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE `problem` ADD COLUMN `status` ENUM('active', 'inActive') NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE `problem_code` ADD COLUMN `status` ENUM('active', 'inActive') NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE `production_category` ADD COLUMN `status` ENUM('active', 'inActive') NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE `sub_equipment` ADD COLUMN `status` ENUM('active', 'inActive') NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE `transaction_type` ADD COLUMN `status` ENUM('active', 'inActive') NOT NULL DEFAULT 'active';
