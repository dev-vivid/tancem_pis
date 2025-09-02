-- AlterTable
ALTER TABLE `lab_analysis_types` ADD COLUMN `analysisLabId` VARCHAR(36) NULL;

-- AddForeignKey
ALTER TABLE `lab_analysis_types` ADD CONSTRAINT `lab_analysis_types_analysisLabId_fkey` FOREIGN KEY (`analysisLabId`) REFERENCES `lab_analysis`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
