/*
  Warnings:

  - Added the required column `problem_code` to the `problem_code` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `problem_code` ADD COLUMN `problem_code` INTEGER NOT NULL;
