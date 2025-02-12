import { z } from "zod";


export const authSchema = z.object({
    name:z.string({required_error:"name is required"}).trim().min(1,{
        message: "name is required"
    }).max(40,{
        message:"Max 40 characters allowed"
    }),
    email: z.string({ required_error: "email is required" }).trim().min(1, {
        message: "email is required"
    }).max(100,{
        message:"Max 100 characters allowed"
    }),
    password: z.string({required_error:"password is required"}).trim().min(1,{
        message: "password is required"
    }).max(10),
})

export const patientSchema = z.object({
    name: z.string({ required_error: "patient name is required" }).trim().min(1, {
        message: "patient name is required"
    }).max(40, {
        message: "Max 40 characters allowed"
    }),
    phone: z.string({ required_error: "phone no is required" }).trim().min(1, {
        message: "phone no  is required"
    }).max(40, {
        message: "Max 40 characters allowed"
    }),
    heartRate: z.coerce.number({ required_error: "heartRate is required" }),
    diseaseId: z.coerce.number({ required_error: "diseaseId is required" }),
    userId: z.coerce.number({ required_error: "userId is required" }),
})