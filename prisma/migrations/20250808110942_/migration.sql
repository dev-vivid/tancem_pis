-- CreateTable
CREATE TABLE `problem` (
    `id` VARCHAR(36) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `description` VARCHAR(200) NULL,
    `department_id` VARCHAR(36) NOT NULL,
    `problem` VARCHAR(36) NOT NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_by_id` VARCHAR(36) NULL,
    `created_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `problem_id_key`(`id`),
    UNIQUE INDEX `problem_code_key`(`code`),
    INDEX `problem_department_id_idx`(`department_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `problem_code` (
    `id` VARCHAR(36) NOT NULL,
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `problem_id` VARCHAR(36) NULL,
    `equipment_id` VARCHAR(36) NULL,
    `department_id` VARCHAR(36) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by_id` VARCHAR(36) NULL,
    `updated_by_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `problem_code_id_key`(`id`),
    UNIQUE INDEX `problem_code_code_key`(`code`),
    INDEX `problem_code_code_idx`(`code`),
    INDEX `problem_code_problem_id_idx`(`problem_id`),
    INDEX `problem_code_department_id_idx`(`department_id`),
    INDEX `problem_code_code_problem_id_department_id_idx`(`code`, `problem_id`, `department_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `problem_code` ADD CONSTRAINT `problem_code_problem_id_fkey` FOREIGN KEY (`problem_id`) REFERENCES `problem`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
