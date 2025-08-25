/*
  Warnings:

  - You are about to drop the column `file_name` on the `external_lab_testing_report` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `external_lab_testing_report` DROP COLUMN `file_name`,
    ADD COLUMN `lab_file_name` TEXT NULL;
