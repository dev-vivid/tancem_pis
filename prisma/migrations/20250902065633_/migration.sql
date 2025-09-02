/*
  Warnings:

  - Added the required column `analysis_lab_id` to the `lab_analysis_types` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `lab_analysis_types` ADD COLUMN `analysis_lab_id` VARCHAR(36) NOT NULL;

-- AddForeignKey
ALTER TABLE `lab_analysis_types` ADD CONSTRAINT `lab_analysis_types_analysis_lab_id_fkey` FOREIGN KEY (`analysis_lab_id`) REFERENCES `lab_analysis`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
