/*
  Warnings:

  - The primary key for the `analysis` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `analysis` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - You are about to alter the column `created_by_id` on the `analysis` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.

*/
-- AlterTable
ALTER TABLE `analysis` DROP PRIMARY KEY,
    ADD COLUMN `updated_by_id` VARCHAR(36) NULL,
    MODIFY `id` VARCHAR(36) NOT NULL,
    MODIFY `created_by_id` VARCHAR(36) NULL,
    ADD PRIMARY KEY (`id`);
