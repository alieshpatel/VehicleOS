// "use server" for backend code 
"use server"

// from drizzle setup
import { User, usersTable } from "@/db/schema"
import { db } from ".."

// function made for databse connection (signup)
export const signup = async (user: User) => {
    await db.insert(usersTable).values(user)
}