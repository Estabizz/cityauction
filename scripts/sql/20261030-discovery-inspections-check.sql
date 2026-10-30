-- Read-only check for fields required by saved properties and inspections.
SELECT expected.table_name, expected.column_name,
       IF(actual.COLUMN_NAME IS NULL, 'MISSING', 'OK') AS schema_status
FROM (
  SELECT 'auctions' AS table_name, 'sourceListingId' AS column_name
  UNION ALL SELECT 'auctions', 'sourceVerifiedAt'
  UNION ALL SELECT 'enquiries', 'preferredDate'
) AS expected
LEFT JOIN information_schema.COLUMNS AS actual
  ON actual.TABLE_SCHEMA = DATABASE()
 AND actual.TABLE_NAME = expected.table_name
 AND actual.COLUMN_NAME = expected.column_name;
