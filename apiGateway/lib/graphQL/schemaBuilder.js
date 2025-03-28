import { buildSchema } from "graphql";
import fs from "fs";
import { promisify } from "util";
import path from "path";
import { fileURLToPath } from "url";

const readFileAsync = promisify(fs.readFile);

// Fix file path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.join(__dirname, "schema.gql");

console.log("Resolved schemaPath:", schemaPath);

export async function getSchema() {
  try {
    const schemaString = await readFileAsync(schemaPath, { encoding: "utf8" });

    if (!schemaString.trim()) {
      throw new Error("Schema file is empty!");
    }

    console.log("Schema loaded successfully!");
    return buildSchema(schemaString);
  } catch (error) {
    console.error("Error reading the schema file:", error);
    throw error;
  }
}
