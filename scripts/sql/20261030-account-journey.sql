-- Apply once to the older production schema inspected on 2026-10-30.
-- Adds missing account fields and tables; existing records are preserved.
-- email_otp_challenges was installed separately.
ALTER TABLE `users`
  ADD COLUMN `mobile` VARCHAR(191) NULL,
  ADD COLUMN `buyerCategory` ENUM('INDIVIDUAL_BUYER','BUSINESS_BUYER','INVESTOR','BROKER','OTHER_PROFESSIONAL') NULL,
  ADD COLUMN `sessionVersion` INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN `onboardedAt` DATETIME(3) NULL,
  ADD COLUMN `marketingEmail` BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN `marketingSms` BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN `marketingWhatsapp` BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN `attribution` JSON NULL,
  ADD UNIQUE INDEX `users_mobile_key` (`mobile`);

CREATE TABLE IF NOT EXISTS `consent_events` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `kind` VARCHAR(191) NOT NULL,
    `channel` VARCHAR(191) NULL,
    `granted` BOOLEAN NOT NULL,
    `policyVersion` VARCHAR(191) NULL,
    `source` VARCHAR(191) NOT NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `consent_events_userId_idx`(`userId`),
    CONSTRAINT `consent_events_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `buyer_requirements` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `assetClasses` JSON NOT NULL,
    `cities` JSON NOT NULL,
    `budgetRange` VARCHAR(191) NULL,
    `minBudget` DECIMAL(15, 2) NULL,
    `maxBudget` DECIMAL(15, 2) NULL,
    `objective` VARCHAR(191) NULL,
    `locality` VARCHAR(200) NULL,
    `minSize` DECIMAL(12, 2) NULL,
    `maxSize` DECIMAL(12, 2) NULL,
    `sizeUnit` VARCHAR(191) NULL,
    `timeline` VARCHAR(191) NULL,
    `funding` VARCHAR(191) NULL,
    `alertsEnabled` BOOLEAN NOT NULL DEFAULT true,
    `alertChannels` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `buyer_requirements_userId_idx`(`userId`),
    CONSTRAINT `buyer_requirements_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

