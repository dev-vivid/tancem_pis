-- AlterTable
ALTER TABLE `material_mapping_master` ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `status` ENUM('active', 'inActive') NOT NULL DEFAULT 'active';

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
ALTER TABLE `material_mapping_master` ADD CONSTRAINT `material_mapping_master_material_id_fkey` FOREIGN KEY (`material_id`) REFERENCES `material`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
