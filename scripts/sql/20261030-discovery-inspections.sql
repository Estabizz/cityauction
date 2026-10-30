-- Add missing discovery and inspection fields without rewriting listing data.
-- Safe to repeat: existing columns and the index are left unchanged.
-- Source fields remain NULL until staff verify the actual auction notice.

SET @cityauction_sql = IF(EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'auctions' AND COLUMN_NAME = 'sourceListingId'),
  'SELECT 1',
  'ALTER TABLE `auctions` ADD COLUMN `sourceListingId` VARCHAR(191) NULL');
PREPARE cityauction_statement FROM @cityauction_sql;
EXECUTE cityauction_statement;
DEALLOCATE PREPARE cityauction_statement;

SET @cityauction_sql = IF(EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'auctions' AND COLUMN_NAME = 'sourceVerifiedAt'),
  'SELECT 1',
  'ALTER TABLE `auctions` ADD COLUMN `sourceVerifiedAt` DATETIME(3) NULL');
PREPARE cityauction_statement FROM @cityauction_sql;
EXECUTE cityauction_statement;
DEALLOCATE PREPARE cityauction_statement;

SET @cityauction_sql = IF(EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'enquiries' AND COLUMN_NAME = 'preferredDate'),
  'SELECT 1',
  'ALTER TABLE `enquiries` ADD COLUMN `preferredDate` DATETIME(3) NULL');
PREPARE cityauction_statement FROM @cityauction_sql;
EXECUTE cityauction_statement;
DEALLOCATE PREPARE cityauction_statement;

SET @cityauction_sql = IF(EXISTS (SELECT 1 FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'enquiries' AND COLUMN_NAME = 'userId' AND SEQ_IN_INDEX = 1),
  'SELECT 1',
  'CREATE INDEX `enquiries_userId_idx` ON `enquiries` (`userId`)');
PREPARE cityauction_statement FROM @cityauction_sql;
EXECUTE cityauction_statement;
DEALLOCATE PREPARE cityauction_statement;
