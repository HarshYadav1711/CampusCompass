require("dotenv").config();

const isTest = process.env.NODE_ENV === "test";

function required(name) {
  const value = process.env[name];
  if (value === undefined || value === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

module.exports = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  db: {
    host: isTest ? process.env.DB_HOST || "127.0.0.1" : required("DB_HOST"),
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: isTest ? process.env.DB_USER || "root" : required("DB_USER"),
    password: process.env.DB_PASSWORD || "",
    database: isTest ? process.env.DB_NAME || "campuscompass" : required("DB_NAME"),
  },
};
