import "dotenv/config";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from "postgres";

import * as schema from "../db/schema";

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(client, {schema});

const main = async () => {
    
    try{
        console.log("Resetting the database...")

        await db.delete(schema.courses);
        await db.delete(schema.userProgress);
        await db.delete(schema.units);
        await db.delete(schema.lessons);
        await db.delete(schema.challenges);
        await db.delete(schema.challengeOptions);
        await db.delete(schema.challengeProgress);
        await db.delete(schema.userSubscription);

        

        console.log("Resetting database... done");

    } catch (err) {
        console.error(err);
        throw new Error("Failed to reset database");
    } finally {
        await client.end();
    }
};

main().catch((err)=> {
    console.error(err);
    process.exit(1);
});