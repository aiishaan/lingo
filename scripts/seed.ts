import "dotenv/config";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from "postgres";

import * as schema from "../db/schema";

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(client, {schema});

const main = async () => {
    
    try{
        console.log("Seeding database...")

        await db.delete(schema.courses);
        await db.delete(schema.userProgress);
        await db.delete(schema.units);
        await db.delete(schema.lessons);
        await db.delete(schema.challenges);
        await db.delete(schema.challengeOptions);
        await db.delete(schema.challengeProgress);

        await db.insert(schema.courses).values([
            {
                id : 1,
                title : "Spanish",
                imageSrc : "/es.svg"
            },
            {
                id : 2,
                title : "Italian",
                imageSrc : "/it.svg"
            },
            {
                id : 3,
                title : "French",
                imageSrc : "/fr.svg"
            },
            {
                id : 4,
                title : "Croatian",
                imageSrc : "/hr.svg"
            },
        ])

        await db.insert(schema.units).values([
            {
                id:1,
                courseId : 1, //spanish
                title : "Unit 1",
                description : "Learn the basics of Spanish",
                order : 1,
            }
        ]);

        await db.insert(schema.lessons).values([
            {
                id: 1,
                unitId : 1, //unit1 (learn the basics)
                order :1,
                title: "Nouns",
            },
            {
                id: 2,
                unitId : 1, //unit1 (learn the basics)
                order :2,
                title: "Verbs",
            },
        ]);

        await db.insert(schema.challenges).values([
            {
                id: 1,
                lessonId :1, //Nouns
                type : "SELECT",
                order : 1,
                question : 'Which one of these is "the man"?',
            },
            
        ]);


        await db.insert(schema.challengeOptions).values([
            {
                id: 1,
                challengeId : 1, //which one of these is the man
                imageSrc : "/man.svg",
                correct : true,
                text: "el hombre",
                audioSrc : "/es_man.mp3",
            },
            {
                id: 2,
                challengeId : 1,
                imageSrc : "/woman.svg",
                correct : false,
                text: "la mujer",
                audioSrc : "/es_woman.mp3",
            },
            {
                id: 3,
                challengeId : 1,
                imageSrc : "/robot.svg",
                correct : false,
                text: "el robot",
                audioSrc : "/es_robot.mp3",
            },
        ])

        console.log("Seeding database... done");

    } catch (err) {
        console.error(err);
        throw new Error("Failed to seed database");
    } finally {
        await client.end();
    }
};

main().catch((err)=> {
    console.error(err);
    process.exit(1);
});