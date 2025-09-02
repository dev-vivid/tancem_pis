/*
  Warnings:

  - You are about to drop the column `analysisLabId` on the `lab_analysis_types` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `lab_analysis_types` DROP FOREIGN KEY `lab_analysis_types_analysisLabId_fkey`;

-- AlterTable
ALTER TABLE `lab_analysis_types` DROP COLUMN `analysisLabId`;
