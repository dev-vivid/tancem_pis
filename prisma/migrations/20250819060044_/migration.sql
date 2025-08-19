-- CreateIndex
CREATE INDEX `external_lab_testing_report_code_idx` ON `external_lab_testing_report`(`code`);

-- AddForeignKey
ALTER TABLE `material_type` ADD CONSTRAINT `material_type_material_type_id_fkey` FOREIGN KEY (`material_type_id`) REFERENCES `material_type_master`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `material_analysis` ADD CONSTRAINT `material_analysis_analysis_id_fkey` FOREIGN KEY (`analysis_id`) REFERENCES `analysis`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stoppage_problem` ADD CONSTRAINT `stoppage_problem_stoppage_maintenance_id_fkey` FOREIGN KEY (`stoppage_maintenance_id`) REFERENCES `stoppage`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sub_equipment` ADD CONSTRAINT `sub_equipment_eq_id_fkey` FOREIGN KEY (`eq_id`) REFERENCES `equipment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `power` ADD CONSTRAINT `power_transaction_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `power_transaction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lab_analysis` ADD CONSTRAINT `lab_analysis_analysis_id_fkey` FOREIGN KEY (`analysis_id`) REFERENCES `analysis`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
