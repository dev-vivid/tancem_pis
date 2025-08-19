/*
  Warnings:

  - You are about to drop the column `equipment_id` on the `stoppage` table. All the data in the column will be lost.
  - You are about to drop the column `equipment_sub_Sub_group_id` on the `stoppage` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `stoppage_equipment_id_idx` ON `stoppage`;

-- AlterTable
ALTER TABLE `stoppage` DROP COLUMN `equipment_id`,
    DROP COLUMN `equipment_sub_Sub_group_id`;
