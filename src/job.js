import { v4 as uuidv4 } from "uuid";

import pkg from "mssql";

import { writeLog, createNewLogFile} from "./logger.js";

const { ConnectionPool } = pkg;

const currentDate = new Date();
const formattedDate = currentDate.toISOString().split("T")[0];
const log = `log_${formattedDate}.txt`;

const config = {
  user: "user",
  password: "passwordt",
  server: "server",
  database: "database",
  options: {
    encrypt: false,
  },
};

function generateUUID() {
  return uuidv4();
}

function generateDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");
  const milliseconds = String(currentDate.getMilliseconds()).padStart(3, "0");

  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
  return formattedDate;
}

function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

const pool = new ConnectionPool(config);

async function getMenuEntities() {
  try {
    await pool.connect();
    const result = await pool.request().query("SELECT id, psid FROM Menu");
    return result.recordset.map((record) => record);
  } catch (error) {
    console.error("Error retrieving menu entities:", error);
  }
}

async function insertUsageEntities(menus) {
  try {
    await pool.connect();
    for (const menu of menus) {
      const uuid = generateUUID();
      const createdAt = generateDate();
      const date = getCurrentDate();
      const query = `INSERT INTO Usage (id, name, status, created_at, menu_id, count, date, psid) VALUES ('${uuid}', '${uuid}', 'true', '${createdAt}', '${menu?.id}', '0', '${date}',${menu?.psid})`;

      writeLog(log, query);

      await pool.request().query(query);
    }
    writeLog(log, "New usage entities created for all menu entities");

  } catch (error) {
    writeLog(log, `Error inserting usage entities:${error}` );

  } finally {
    pool.close();
  }
}

// Main function to retrieve menu entities and insert usage entities
export default async function main() {
  writeLog(log, "Job is starting");

  const menus = await getMenuEntities();
  if (menus && menus.length > 0) {
    await insertUsageEntities(menus);
  } else {
    writeLog(log, "No menu entities found");
  }

  writeLog(log, `Created total: ${menus.length}`);

  writeLog(log, "Job is ending");
}
