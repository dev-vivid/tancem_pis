/*
  Warnings:

  - The primary key for the `stoppage_problem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `stoppage_problem` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - A unique constraint covering the columns `[id]` on the table `stoppage_problem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `stoppage_problem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `stoppage_problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `stoppage_problem` 
    DROP PRIMARY KEY,
    ADD COLUMN `code` INTEGER NOT NULL,
    MODIFY `id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `stoppage_problem_id_key` ON `stoppage_problem`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `stoppage_problem_code_key` ON `stoppage_problem`(`code`);
