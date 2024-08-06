"use server"

import db from "@/db/drizzle";
import { getCourseById, getUserProgress } from "@/db/queries";
import { challengeProgress, challenges, userProgress } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server"
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const upsertUserProgress = async (courseId : number) => {
    const {userId} = await auth();
    const user = await currentUser()

    if(!userId || !user) {
        throw new Error("Unauthorized")
    }

    const course = await getCourseById(courseId);
    if(!course){
        throw new Error("Course not found")
    }


    //Todo: enable when units and lessons are added
    // if(!course.units.lenght || !course.units[0].lessons.length){
    //     throw new Error("Course has no units or lessons")
    // }

    const existingUserProgress = await  getUserProgress();

    if(existingUserProgress){
        await db.update(userProgress).set({
            activeCourseId : courseId,
            userName : user.firstName || "User",
            userImageSrc : user.imageUrl || "/mascot.svg",
        })

        revalidatePath("/coures");
        revalidatePath("/learn");
        redirect("/learn");
    }

    await db.insert(userProgress).values([{
        userId,
        activeCourseId : courseId,
        userName : user.firstName || "User",
        userImageSrc : user.imageUrl || "/mascot.svg",
    }
    ])

    revalidatePath("/coures");
    revalidatePath("/learn");
    redirect("/learn");


    }


    export const reduceHearts = async(challengeId : number)=> {
        const{userId} = await auth()

        if(!userId) {
            throw new Error("Unauthorised");
        }

        const currentUserProgress = await getUserProgress();

        //todo get user subs

        const challenge = await db.query.challenges.findFirst({
            where: eq(challenges.id, challengeId)
        });

        if(!challenge){
            throw new Error("Challenge not found")
        }

        const lessonId = challenge.lessonId;


        const existingChallengeProgress = await db.query.challengeProgress.findFirst({
            where :and(
                eq(challengeProgress.userId, userId),
                eq(challengeProgress.challengeId, challengeId),
            )
        });

        const isPractice = !! existingChallengeProgress;

        if(isPractice){
            return {error: "practice"};
        }

        if(!currentUserProgress){
            throw new Error("User progress not found");
        }

        //todo handle subs

        if(currentUserProgress.hearts === 0){
            return {error :"hearts"};
        }

        await db.update(userProgress).set({
            hearts: Math.max(currentUserProgress.hearts-1, 0),
        }).where(eq(userProgress.userId, userId));


        revalidatePath("/shop")
        revalidatePath("/learn")
        revalidatePath("/quests")
        revalidatePath("/leaderboard")
        revalidatePath(`/lesson/${lessonId}`)
    }
    