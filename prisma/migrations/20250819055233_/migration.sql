/*
  Warnings:

  - The primary key for the `annual_material_budget` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `annual_material_budget` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - The primary key for the `bags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `bags` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - The primary key for the `equipment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `equipment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - The primary key for the `equipment_output_material_mapping` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `equipment_output_material_mapping` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - The primary key for the `lab_quality` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `lab_quality` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - The primary key for the `material_analysis` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `material_analysis` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - The primary key for the `material_type` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `material_type` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - You are about to alter the column `material_id` on the `material_type` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(36)`.
  - The primary key for the `material_type_master` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `material_type_master` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - The primary key for the `power` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `power` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - The primary key for the `power_transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `power_transaction` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - The primary key for the `production_category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `production_category` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - The primary key for the `stoppage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `stoppage` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - The primary key for the `stoppage_problem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `stoppage_problem` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - The primary key for the `transaction_type` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `transaction_type` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - A unique constraint covering the columns `[id]` on the table `stoppage_problem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `stoppage_problem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `stoppage_problem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `lab_analysis` DROP FOREIGN KEY `lab_analysis_analysis_id_fkey`;

-- DropForeignKey
ALTER TABLE `material_analysis` DROP FOREIGN KEY `material_analysis_analysis_id_fkey`;

-- DropForeignKey
ALTER TABLE `material_type` DROP FOREIGN KEY `material_type_material_type_id_fkey`;

-- DropForeignKey
ALTER TABLE `power` DROP FOREIGN KEY `power_transaction_id_fkey`;

-- DropForeignKey
ALTER TABLE `stoppage_problem` DROP FOREIGN KEY `stoppage_problem_stoppage_maintenance_id_fkey`;

-- DropForeignKey
ALTER TABLE `sub_equipment` DROP FOREIGN KEY `sub_equipment_eq_id_fkey`;

-- AlterTable
ALTER TABLE `annual_material_budget` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `bags` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `equipment` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `equipment_output_material_mapping` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `lab_quality` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `material_analysis` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `material_type` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    MODIFY `material_id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `material_type_master` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `power` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `power_transaction` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `production_category` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `stoppage` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `stoppage_problem` 
    DROP PRIMARY KEY,
    ADD COLUMN `code` INT NOT NULL AUTO_INCREMENT UNIQUE,
    MODIFY `id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `transaction_type` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `stoppage_problem_id_key` ON `stoppage_problem`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `stoppage_problem_code_key` ON `stoppage_problem`(`code`);
