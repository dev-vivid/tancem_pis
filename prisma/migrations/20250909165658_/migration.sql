-- AddForeignKey
ALTER TABLE `strength_samples` ADD CONSTRAINT `strength_samples_transaction_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `strength_transactions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
