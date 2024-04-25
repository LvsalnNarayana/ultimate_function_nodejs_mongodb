import { fileURLToPath } from "url";
import dotenv from "dotenv";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

export const config = {
  cookieExpiration: process?.env?.JWT_EXPIRATION,
  environment: process?.env?.NODE_ENV,
  jwtSecret: process?.env?.JWT_SECRET,
  port: process?.env?.PORT || 3000,
  dbUrl: process?.env?.MONGODB_URI,
};
