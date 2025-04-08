import { Db, MongoClient } from "mongodb";

const MONGODB_URI = process.env.DATABASE_URL || "mongodb://localhost:27017";
const client = new MongoClient(MONGODB_URI);

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function getMongoClient() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  await client.connect();
  cachedClient = client;
  cachedDb = client.db(); // Varsayılan DB
  return { client: cachedClient, db: cachedDb };
}
