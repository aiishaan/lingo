import { auth } from "@clerk/nextjs/server"

const adminIds = [
    "user_2jW5OuqeFEKYgedBJYIT2nRrj2O"
]

export const isAdmin = () => {
    const {userId} = auth();

    if(!userId){
        return false
    }

    return adminIds.indexOf(userId) !== -1
}