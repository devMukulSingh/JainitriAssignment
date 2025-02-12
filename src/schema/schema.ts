import { z } from "zod";


export const authSchema = z.object({
    name:z.string({required_error:"name is required"}).trim().min(1).max(40,{
        message:"Max 40 characters allowed"
    }),
    email: z.string({ required_error: "email is required" }).trim().min(1).max(100,{
        message:"Max 100 characters allowed"
    }),
    password: z.string({required_error:"password is required"}).trim().min(1).max(10),
})