require('dotenv').config({ path: '.env.local' });

export const DOWNLOAD_DIR = process.env.DOWNLOAD_DIR || "";
export const LOG_DIR = process.env.LOG_DIR || "";
export const DADATA_API_KEY = process.env.DADATA_API_KEY || "";