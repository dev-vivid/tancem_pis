/*
  Warnings:

  - Added the required column `wf_request_id` to the `adjustment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wf_request_id` to the `despatch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wf_request_id` to the `lab_quality` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wf_request_id` to the `power_transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wf_request_id` to the `production` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wf_request_id` to the `receipt_consumption` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `adjustment` ADD COLUMN `approval_status` ENUM('Active', 'Inprogress', 'Forwarded', 'Approved', 'Rejected') NULL,
    ADD COLUMN `wf_request_id` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `despatch` ADD COLUMN `approval_status` ENUM('Active', 'Inprogress', 'Forwarded', 'Approved', 'Rejected') NULL,
    ADD COLUMN `wf_request_id` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `lab_quality` ADD COLUMN `approval_status` ENUM('Active', 'Inprogress', 'Forwarded', 'Approved', 'Rejected') NULL,
    ADD COLUMN `wf_request_id` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `power_transaction` ADD COLUMN `approval_status` ENUM('Active', 'Inprogress', 'Forwarded', 'Approved', 'Rejected') NULL,
    ADD COLUMN `wf_request_id` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `production` ADD COLUMN `approval_status` ENUM('Active', 'Inprogress', 'Forwarded', 'Approved', 'Rejected') NULL,
    ADD COLUMN `wf_request_id` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `receipt_consumption` ADD COLUMN `approval_status` ENUM('Active', 'Inprogress', 'Forwarded', 'Approved', 'Rejected') NULL,
    ADD COLUMN `wf_request_id` VARCHAR(36) NOT NULL;
