import { Hono } from "hono";
import { patientSchema } from "../schema/schema.js";
import { prisma } from "../constants/constants.js";
import { Prisma } from "@prisma/client";

const patientApp = new Hono();

patientApp.post('/post-patient', async (c) => {

    const body = await c.req.json();
    const parsedBody = patientSchema.safeParse(body);
    if (!parsedBody.success) {
        return c.json({
            error: parsedBody.error.errors.map(err => err.message),
        }, 400)
    }
    const { diseaseId, heartRate, name,phone, userId } = parsedBody.data;
    try {
        const newPatient = await prisma.patient.create({
            data: {
                phone,
                name,
                heartRateDetails: {
                    create: {
                        value: heartRate
                    },
                },
                disease: {
                    connect: {
                        id: diseaseId
                    }
                },
                userId
            }
        })
        return c.json({
            msg: "Patient added successfully",
            newPatient
        }, 201)
    }
    catch (e: any) {
        console.log(e.message);
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (e.code === 'P2003') {
                return c.json({
                    error: "User with particular userId doesnt exists"
                }, 400)
            }
        }
        return c.json({
            error: "Internal server error"
        }, 500)
    }
})



export default patientApp