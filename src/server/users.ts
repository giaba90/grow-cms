"use server";
import { auth } from "@/auth"

const signIn = async () => {
    await auth.api.signInEmail({
        body: {
            email: "user@email.com",
            password: "password",
        }
    })
}