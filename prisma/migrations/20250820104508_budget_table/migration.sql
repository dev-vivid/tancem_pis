-- AlterTable
ALTER TABLE `budget` MODIFY `budget_code` VARCHAR(36) NULL,
    MODIFY `budget_value` DECIMAL(10, 2) NOT NULL;
