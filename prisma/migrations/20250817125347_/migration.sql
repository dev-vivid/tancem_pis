/*
  Warnings:

  - The primary key for the `stoppage_problem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `code` on the `stoppage_problem` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `stoppage_problem_code_key` ON `stoppage_problem`;

-- DropIndex
DROP INDEX `stoppage_problem_id_key` ON `stoppage_problem`;

-- AlterTable
ALTER TABLE `stoppage_problem` DROP PRIMARY KEY,
    DROP COLUMN `code`,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);
