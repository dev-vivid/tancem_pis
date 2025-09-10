-- AddForeignKey
ALTER TABLE `receipt_consumption` ADD CONSTRAINT `receipt_consumption_transaction_type_fkey` FOREIGN KEY (`transaction_type`) REFERENCES `transaction_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
