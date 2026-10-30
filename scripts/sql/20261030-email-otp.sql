-- Additive schema change for review and application to the selected database.
-- This does not alter users or remove legacy mobile OTP records.
CREATE TABLE `email_otp_challenges` (
  `id` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `purpose` VARCHAR(191) NOT NULL,
  `codeHash` VARCHAR(191) NOT NULL,
  `attempts` INTEGER NOT NULL DEFAULT 0,
  `expiresAt` DATETIME(3) NOT NULL,
  `consumedAt` DATETIME(3) NULL,
  `ipAddress` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `email_otp_challenges_email_createdAt_idx` (`email`, `createdAt`),
  INDEX `email_otp_challenges_ipAddress_createdAt_idx` (`ipAddress`, `createdAt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
