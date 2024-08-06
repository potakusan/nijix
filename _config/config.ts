export const db_setting = {
  host: process.env.DB_HOST,
  user: process.env.DB_ADMIN,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dateStrings: true,
  stringifyObjects: true,
  decimalNumbers: true,
};

export const GLOBAL_ITEM_NUMBERS_PER_PAGE = 24;
export const GLOBAL_TAGS_NUMBERS_PER_PAGE = 20;
